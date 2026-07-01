import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name: string;
  slug: string;
  state: mongoose.Types.ObjectId;
  description: string;
  image: string;
  gallery: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  bestTimeToVisit: string;
  popularPlaces: mongoose.Types.ObjectId[];
  hotels: mongoose.Types.ObjectId[];
  restaurants: mongoose.Types.ObjectId[];
  transportation: {
    nearestAirport: {
      name: string;
      distance: string;
      cabCost: string;
    };
    nearestStation: {
      name: string;
      distance: string;
      taxiFare: string;
    };
    busStand: {
      name: string;
      autoFare: string;
    };
  };
  estimatedBudget: {
    budget: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    standard: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    luxury: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
  };
  localFoods: string[];
  travelTips: {
    dos: string[];
    donts: string[];
    safety: string[];
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

const citySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    weather: {
      summer: { type: String },
      winter: { type: String },
      monsoon: { type: String },
    },
    bestTimeToVisit: { type: String },
    popularPlaces: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    transportation: {
      nearestAirport: {
        name: { type: String },
        distance: { type: String },
        cabCost: { type: String },
      },
      nearestStation: {
        name: { type: String },
        distance: { type: String },
        taxiFare: { type: String },
      },
      busStand: {
        name: { type: String },
        autoFare: { type: String },
      },
    },
    estimatedBudget: {
      budget: {
        hotel: { type: String },
        food: { type: String },
        travel: { type: String },
        tickets: { type: String },
        shopping: { type: String },
        total: { type: String },
      },
      standard: {
        hotel: { type: String },
        food: { type: String },
        travel: { type: String },
        tickets: { type: String },
        shopping: { type: String },
        total: { type: String },
      },
      luxury: {
        hotel: { type: String },
        food: { type: String },
        travel: { type: String },
        tickets: { type: String },
        shopping: { type: String },
        total: { type: String },
      },
    },
    localFoods: [{ type: String }],
    travelTips: {
      dos: [{ type: String }],
      donts: [{ type: String }],
      safety: [{ type: String }],
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

export default mongoose.model<ICity>('City', citySchema);
