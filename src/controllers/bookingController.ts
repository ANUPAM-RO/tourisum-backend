import { Request, Response } from 'express';
import crypto from 'crypto';
import Booking, { BookingStatus } from '../models/Booking';
import Tour from '../models/Tour';
import { IUser } from '../models/User';
import { adjustSeats } from './tourController';

interface AuthRequest extends Request {
  user?: IUser;
}

// e.g. "TR-K3F9Q2" — short, unambiguous (no 0/O/1/I) reference to quote over phone or WhatsApp.
const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newReference = () =>
  'TR-' + Array.from(crypto.randomBytes(6), (b) => REF_CHARS[b % REF_CHARS.length]).join('');

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { tourId, departureId, name, email, phone, adults, children = 0, message = '' } = req.body;
    const travellers = Number(adults) + Number(children);

    const tour = await Tour.findOne({ _id: tourId, published: true }).lean();
    const departure = tour?.departures.find((d) => String(d._id) === String(departureId));
    if (!tour || !departure) {
      res.status(404).json({ success: false, message: 'This tour or departure date is no longer available.' });
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(departure.startDate) < today) {
      res.status(400).json({ success: false, message: 'This departure date has already passed.' });
      return;
    }

    if (!(await adjustSeats(tour._id, departure._id, travellers))) {
      const left = Math.max(0, departure.seatsTotal - departure.seatsBooked);
      res.status(409).json({
        success: false,
        message: left > 0 ? `Only ${left} seat${left === 1 ? '' : 's'} left on this date.` : 'This departure is sold out.',
      });
      return;
    }

    try {
      const booking = await Booking.create({
        reference: newReference(),
        tour: tour._id,
        tourTitle: tour.title,
        departure: departure._id,
        departureDate: departure.startDate,
        user: req.user?._id,
        name,
        email,
        phone,
        adults: Number(adults),
        children: Number(children),
        message,
        pricePerPerson: tour.price,
        totalPrice: tour.price * travellers,
      });
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      await adjustSeats(tour._id, departure._id, -travellers); // give the seats back
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ user: req.user!._id })
      .populate('tour', 'slug coverImage')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin ──────────────────────────────────────────────────────────────────

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const rx = { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
      query.$or = [{ name: rx }, { email: rx }, { phone: rx }, { reference: rx }, { tourTitle: rx }];
    }
    const bookings = await Booking.find(query).populate('tour', 'slug').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const travellersOf = (b: { adults: number; children: number }) => b.adults + b.children;

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    const nextStatus: BookingStatus | undefined = req.body.status;
    if (nextStatus && nextStatus !== booking.status) {
      // Cancelling frees the seats; re-activating a cancelled booking has to reserve them again.
      if (nextStatus === 'cancelled') {
        await adjustSeats(booking.tour, booking.departure, -travellersOf(booking));
      } else if (booking.status === 'cancelled') {
        if (!(await adjustSeats(booking.tour, booking.departure, travellersOf(booking)))) {
          res.status(409).json({ success: false, message: 'Not enough seats left on this departure to restore the booking.' });
          return;
        }
      }
      booking.status = nextStatus;
    }
    if (typeof req.body.adminNote === 'string') booking.adminNote = req.body.adminNote;
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    if (booking.status !== 'cancelled') await adjustSeats(booking.tour, booking.departure, -travellersOf(booking));
    res.json({ success: true, message: 'Booking deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
