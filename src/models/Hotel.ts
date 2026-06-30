import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  slug: string;
  description: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapLink: string;
  phone: string;
  website: string;
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  distance: string;
  category: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    googleMapLink: { type: String },
    phone: { type: String },
    website: { type: String },
    starRating: { type: Number, min: 1, max: 5 },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String, enum: ['Free WiFi', 'Parking', 'Breakfast', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Room Service', 'Laundry', 'Airport Shuttle'] }],
    images: [{ type: String }],
    distance: { type: String },
    category: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IHotel>('Hotel', hotelSchema);
