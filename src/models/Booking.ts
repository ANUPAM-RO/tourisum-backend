import mongoose, { Document, Schema } from 'mongoose';
import type { RoomPlan } from '../utils/roomPricing';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IBooking extends Document {
  reference: string;
  tour: mongoose.Types.ObjectId;
  tourTitle: string;
  departure: mongoose.Types.ObjectId;
  departureDate: Date;
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  message: string;
  /** Rooms booked by size (2, 3 or 4 per room). */
  rooms: RoomPlan;
  /** Per person, 2 in a room, at booking time. */
  pricePerPerson: number;
  /** Per person, 3–4 in a room, at booking time. */
  priceQuad?: number | null;
  totalPrice: number;
  status: BookingStatus;
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    reference: { type: String, required: true, unique: true },
    tour: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    // Snapshots so the booking still reads correctly if the tour is edited or deleted later.
    tourTitle: { type: String, required: true },
    departure: { type: Schema.Types.ObjectId, required: true },
    departureDate: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    message: { type: String, default: '' },
    rooms: {
      double: { type: Number, default: 0, min: 0 },
      triple: { type: Number, default: 0, min: 0 },
      quad: { type: Number, default: 0, min: 0 },
    },
    pricePerPerson: { type: Number, required: true },
    priceQuad: { type: Number, default: null },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
