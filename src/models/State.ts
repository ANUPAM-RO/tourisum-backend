import mongoose, { Document, Schema } from 'mongoose';

export interface IState extends Document {
  name: string;
  slug: string;
  description: string;
  capital: string;
  image: string;
  gallery: string[];
  popularCities: mongoose.Types.ObjectId[];
  popularPlaces: mongoose.Types.ObjectId[];
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  bestTimeToVisit: string;
  localLanguage: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const stateSchema = new Schema<IState>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    capital: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    popularCities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
    popularPlaces: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    weather: {
      summer: { type: String },
      winter: { type: String },
      monsoon: { type: String },
    },
    bestTimeToVisit: { type: String },
    localLanguage: { type: String },
    emergencyNumbers: {
      police: { type: String },
      ambulance: { type: String },
      fire: { type: String },
    },
    published: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IState>('State', stateSchema);
