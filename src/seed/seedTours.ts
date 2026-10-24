import crypto from 'crypto';
import Place from '../models/Place';
import Tour, { type ITour } from '../models/Tour';
import Booking from '../models/Booking';
import { bookingsData, toursData } from './data/tours';

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const reference = () => 'TR-' + Array.from(crypto.randomBytes(6), (b) => REF_CHARS[b % REF_CHARS.length]).join('');

/**
 * Replaces all tours and bookings with the sample data. Places must already exist:
 * tours link to them by slug and use their photos.
 */
export async function seedTours() {
  await Promise.all([Tour.deleteMany({}), Booking.deleteMany({})]);

  const slugs = [...new Set(toursData.flatMap((t) => t.placeSlugs))];
  const places = await Place.find({ slug: { $in: slugs } }).select('slug images').lean();
  const bySlug = new Map(places.map((p) => [p.slug, p]));
  const missing = slugs.filter((s) => !bySlug.has(s));
  if (missing.length) throw new Error(`Tours reference places that don't exist: ${missing.join(', ')}`);

  // Seats each sample booking takes, so seatsBooked matches the bookings we create below.
  const reserved = new Map<string, number>();
  for (const b of bookingsData) {
    if (b.status === 'cancelled') continue;
    const key = `${b.tourSlug}|${b.departure}`;
    reserved.set(key, (reserved.get(key) ?? 0) + b.adults + b.children);
  }

  const tours = await Tour.insertMany(
    toursData.map(({ placeSlugs, departures, itinerary, ...t }) => {
      const linked = placeSlugs.map((s) => bySlug.get(s)!);
      return {
        ...t,
        places: linked.map((p) => p._id),
        coverImage: linked[0].images[0],
        gallery: linked.map((p) => p.images[0]).filter(Boolean),
        itinerary: itinerary.map((d, i) => ({ day: i + 1, ...d })),
        departures: departures.map((date) => ({
          startDate: new Date(`${date}T00:00:00.000Z`),
          seatsTotal: t.groupSize,
          seatsBooked: reserved.get(`${t.slug}|${date}`) ?? 0,
        })),
      };
    })
  );

  const tourBySlug = new Map(tours.map((t) => [t.slug, t]));
  const bookings = await Booking.insertMany(
    bookingsData.map((b) => {
      const tour = tourBySlug.get(b.tourSlug)!;
      const departure = (tour.departures as ITour['departures']).find((d) => d.startDate.toISOString().startsWith(b.departure))!;
      return {
        reference: reference(),
        tour: tour._id,
        tourTitle: tour.title,
        departure: departure._id,
        departureDate: departure.startDate,
        name: b.name,
        email: b.email,
        phone: b.phone,
        adults: b.adults,
        children: b.children,
        message: b.message,
        status: b.status,
        pricePerPerson: tour.price,
        totalPrice: tour.price * (b.adults + b.children),
      };
    })
  );

  return { tours: tours.length, bookings: bookings.length };
}
