import mongoose, { Document, Schema } from 'mongoose';

export interface ITourDeparture {
  _id: mongoose.Types.ObjectId;
  startDate: Date;
  seatsTotal: number;
  seatsBooked: number;
}

export interface ITourDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  stay: string;
}

export interface ITourHotel {
  name: string;
  image: string;
  location: string;
  googleMapLink: string;
  starRating: number;
  pricePerNight: number;
}

export interface ITour extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  places: mongoose.Types.ObjectId[];
  startCity: string;
  endCity: string;
  durationDays: number;
  durationNights: number;
  /** Per person, 2 in a room (twin sharing). */
  price: number;
  /** Per person, 3–4 in a room. Not offered when empty. */
  priceQuad?: number | null;
  originalPrice?: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: number;
  tags: string[];
  departures: ITourDeparture[];
  highlights: string[];
  itinerary: ITourDay[];
  hotels: ITourHotel[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const departureSchema = new Schema<ITourDeparture>({
  startDate: { type: Date, required: true },
  seatsTotal: { type: Number, required: true, min: 1 },
  seatsBooked: { type: Number, default: 0, min: 0 },
});

const daySchema = new Schema<ITourDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    meals: [{ type: String }],
    stay: { type: String, default: '' },
  },
  { _id: false }
);

const hotelSchema = new Schema<ITourHotel>(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    location: { type: String, default: '' },
    googleMapLink: { type: String, default: '' },
    starRating: { type: Number, min: 0, max: 5, default: 0 },
    pricePerNight: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    gallery: [{ type: String }],
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    startCity: { type: String, default: '' },
    endCity: { type: String, default: '' },
    durationDays: { type: Number, required: true, min: 1 },
    durationNights: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    priceQuad: { type: Number, min: 0, default: null },
    originalPrice: { type: Number, min: 0 },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging'], default: 'Easy' },
    groupSize: { type: Number, default: 15 },
    tags: [{ type: String }],
    departures: [departureSchema],
    highlights: [{ type: String }],
    itinerary: [daySchema],
    hotels: [hotelSchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    thingsToCarry: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITour>('Tour', tourSchema);
