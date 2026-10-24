import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Tour, { ITour } from '../models/Tour';

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Public view of a tour: only future departures, sorted, with seats left and the next departure. */
function publicTour(tour: any) {
  const today = startOfToday();
  const departures = (tour.departures ?? [])
    .filter((d: any) => new Date(d.startDate) >= today)
    .sort((a: any, b: any) => +new Date(a.startDate) - +new Date(b.startDate))
    .map((d: any) => ({ ...d, seatsLeft: Math.max(0, d.seatsTotal - d.seatsBooked) }));
  return {
    ...tour,
    departures,
    nextDeparture: departures.find((d: any) => d.seatsLeft > 0) ?? null,
  };
}

export const getTours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured, limit } = req.query;
    const query: any = { published: true };
    if (featured === 'true') query.featured = true;

    const tours = await Tour.find(query)
      .select('-itinerary -hotels -thingsToCarry -exclusions')
      .populate('places', 'name slug')
      .lean();

    // Tours with an upcoming departure first, soonest first; tours without dates go last.
    const sorted = tours
      .map(publicTour)
      .sort((a, b) => {
        const da = a.nextDeparture ? +new Date(a.nextDeparture.startDate) : Infinity;
        const db = b.nextDeparture ? +new Date(b.nextDeparture.startDate) : Infinity;
        return da - db;
      });

    res.json({ success: true, data: limit ? sorted.slice(0, Number(limit)) : sorted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTourBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, published: true })
      .populate({ path: 'places', select: 'name slug images rating category state', populate: { path: 'state', select: 'name slug' } })
      .lean();
    if (!tour) {
      res.status(404).json({ success: false, message: 'Tour not found' });
      return;
    }
    res.json({ success: true, data: publicTour(tour) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin ──────────────────────────────────────────────────────────────────

export const getAllToursAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const tours = await Tour.find().populate('places', 'name slug').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: tours });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function uniqueSlug(base: string, excludeId?: string) {
  const root = slugify(base) || 'tour';
  let slug = root;
  for (let i = 2; await Tour.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }); i++) {
    slug = `${root}-${i}`;
  }
  return slug;
}

/** Normalises departures from the admin form; booked seats always come from the database. */
function mergeDepartures(incoming: any[] = [], existing: ITour['departures'] = []) {
  return incoming.map((d) => {
    const prev = d._id && mongoose.isValidObjectId(d._id) ? existing.find((e) => String(e._id) === String(d._id)) : undefined;
    return {
      ...(prev ? { _id: prev._id } : {}),
      startDate: new Date(d.startDate),
      seatsTotal: Math.max(Number(d.seatsTotal) || 1, prev?.seatsBooked ?? 0),
      seatsBooked: prev?.seatsBooked ?? 0,
    };
  });
}

const EDITABLE = [
  'title', 'tagline', 'description', 'coverImage', 'gallery', 'places', 'startCity', 'endCity',
  'durationDays', 'durationNights', 'price', 'priceQuad', 'originalPrice', 'difficulty', 'groupSize', 'tags',
  'highlights', 'itinerary', 'hotels', 'inclusions', 'exclusions', 'thingsToCarry', 'featured', 'published',
] as const;

const pickEditable = (body: any) =>
  Object.fromEntries(EDITABLE.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

export const createTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = pickEditable(req.body);
    const tour = await Tour.create({
      ...data,
      slug: await uniqueSlug(req.body.slug || req.body.title),
      departures: mergeDepartures(req.body.departures),
    });
    res.status(201).json({ success: true, data: tour });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      res.status(404).json({ success: false, message: 'Tour not found' });
      return;
    }
    tour.set(pickEditable(req.body));
    if (req.body.slug && slugify(req.body.slug) !== tour.slug) tour.slug = await uniqueSlug(req.body.slug, String(tour._id));
    if (req.body.departures) tour.set('departures', mergeDepartures(req.body.departures, tour.departures));
    await tour.save();
    res.json({ success: true, data: tour });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTour = async (req: Request, res: Response): Promise<void> => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      res.status(404).json({ success: false, message: 'Tour not found' });
      return;
    }
    res.json({ success: true, message: 'Tour deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Atomically changes booked seats on one departure. Uses the current booked count as an
 * optimistic lock so two simultaneous bookings can't oversell the last seats.
 * Returns false if there aren't enough seats (or the departure no longer exists).
 */
export async function adjustSeats(tourId: mongoose.Types.ObjectId | string, departureId: mongoose.Types.ObjectId | string, delta: number): Promise<boolean> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const tour = await Tour.findById(tourId).select('departures').lean();
    const dep = tour?.departures.find((d) => String(d._id) === String(departureId));
    if (!dep) return false;
    const next = dep.seatsBooked + delta;
    if (delta > 0 && next > dep.seatsTotal) return false;
    const result = await Tour.updateOne(
      { _id: tourId, departures: { $elemMatch: { _id: dep._id, seatsBooked: dep.seatsBooked } } },
      { $set: { 'departures.$.seatsBooked': Math.max(0, next) } }
    );
    if (result.modifiedCount === 1) return true;
  }
  return false;
}
