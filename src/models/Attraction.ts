import mongoose, { Document, Schema } from 'mongoose';

export interface IAttraction extends Document {
  name: string;
  slug: string;
  description: string;
  place: mongoose.Types.ObjectId;
  distance: string;
  travelTime: string;
  images: string[];
  entryFee: string;
  category: string;
  openingTime: string;
  closingTime: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const attractionSchema = new Schema<IAttraction>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    distance: { type: String },
    travelTime: { type: String },
    images: [{ type: String }],
    entryFee: { type: String },
    category: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAttraction>('Attraction', attractionSchema);
