import mongoose, { Document, Schema } from 'mongoose';

/** A customer review shown in the home page "Traveller stories" section; managed in admin. */
export interface ITestimonial extends Document {
  name: string;
  location: string;
  /** Tour or trip the customer took, e.g. "Kerala Backwaters & Hills". */
  trip: string;
  rating: number;
  text: string;
  photo: string;
  published: boolean;
  /** Lower numbers show first. */
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    trip: { type: String, default: '', trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
