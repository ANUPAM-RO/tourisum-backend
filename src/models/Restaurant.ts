import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  slug: string;
  description: string;
  cuisine: string[];
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  googleMapLink: string;
  phone: string;
  averageCost: number;
  openingTime: string;
  closingTime: string;
  images: string[];
  vegNonVeg: 'veg' | 'non-veg' | 'both';
  rating: number;
  distance: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    cuisine: [{ type: String }],
    address: { type: String, required: true },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    googleMapLink: { type: String },
    phone: { type: String },
    averageCost: { type: Number },
    openingTime: { type: String },
    closingTime: { type: String },
    images: [{ type: String }],
    vegNonVeg: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'both' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    distance: { type: String },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
