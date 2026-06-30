import mongoose, { Document, Schema } from 'mongoose';

export interface ITravelPackage extends Document {
  title: string;
  slug: string;
  description: string;
  places: mongoose.Types.ObjectId[];
  duration: number;
  price: {
    budget: number;
    standard: number;
    luxury: number;
  };
  inclusions: string[];
  exclusions: string[];
  itinerary: string;
  images: string[];
  rating: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const travelPackageSchema = new Schema<ITravelPackage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    places: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    duration: { type: Number, required: true },
    price: {
      budget: { type: Number },
      standard: { type: Number },
      luxury: { type: Number },
    },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: { type: String },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITravelPackage>('TravelPackage', travelPackageSchema);
