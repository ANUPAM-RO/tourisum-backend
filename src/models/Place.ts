import mongoose, { Document, Schema } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  slug: string;
  description: string;
  state: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  location: {
    latitude: number;
    longitude: number;
  };
  category: string[];
  bestTimeToVisit: string;
  openingTime: string;
  closingTime: string;
  entryFee: string;
  images: string[];
  videos: string[];
  history: string;
  highlights: string[];
  thingsToKnow: string[];
  photography: boolean;
  weather: {
    summer: string;
    winter: string;
    monsoon: string;
  };
  safetyTips: string[];
  nearbySpots: {
    place: mongoose.Types.ObjectId;
    distance: string;
    travelTime: string;
    entryFee: string;
    category: string;
  }[];
  hotels: mongoose.Types.ObjectId[];
  restaurants: mongoose.Types.ObjectId[];
  transportation: {
    byFlight: {
      nearestAirport: string;
      distance: string;
      cabCost: string;
    };
    byTrain: {
      nearestStation: string;
      distance: string;
      taxiFare: string;
    };
    byBus: {
      busStand: string;
      autoFare: string;
    };
    privateCab: string;
    bikeRental: string;
  };
  estimatedCost: {
    budget: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    standard: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
    luxury: { hotel: string; food: string; travel: string; tickets: string; shopping: string; total: string };
  };
  bestMonths: {
    month: string;
    temperature: string;
    crowd: string;
    recommendation: string;
  }[];
  localFoods: string[];
  travelTips: {
    dos: string[];
    donts: string[];
    safety: string[];
  };
  localLanguage: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
  faqs: { question: string; answer: string }[];
  rating: number;
  reviews: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    photos: string[];
    createdAt?: Date;
  }[];
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const placeSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    category: [{ type: String, enum: ['Hill Station', 'Beach', 'Heritage', 'Wildlife', 'Religious', 'Adventure', 'Honeymoon', 'Family Trip'] }],
    bestTimeToVisit: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },
    entryFee: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    history: { type: String },
    highlights: [{ type: String }],
    thingsToKnow: [{ type: String }],
    photography: { type: Boolean, default: true },
    weather: {
      summer: { type: String },
      winter: { type: String },
      monsoon: { type: String },
    },
    safetyTips: [{ type: String }],
    nearbySpots: [
      {
        place: { type: Schema.Types.ObjectId, ref: 'Place' },
        distance: { type: String },
        travelTime: { type: String },
        entryFee: { type: String },
        category: { type: String },
      },
    ],
    hotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    transportation: {
      byFlight: {
        nearestAirport: { type: String },
        distance: { type: String },
        cabCost: { type: String },
      },
      byTrain: {
        nearestStation: { type: String },
        distance: { type: String },
        taxiFare: { type: String },
      },
      byBus: {
        busStand: { type: String },
        autoFare: { type: String },
      },
      privateCab: { type: String },
      bikeRental: { type: String },
    },
    estimatedCost: {
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
    bestMonths: [
      {
        month: { type: String },
        temperature: { type: String },
        crowd: { type: String },
        recommendation: { type: String },
      },
    ],
    localFoods: [{ type: String }],
    travelTips: {
      dos: [{ type: String }],
      donts: [{ type: String }],
      safety: [{ type: String }],
    },
    localLanguage: { type: String },
    emergencyNumbers: {
      police: { type: String },
      ambulance: { type: String },
      fire: { type: String },
    },
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        photos: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    published: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPlace>('Place', placeSchema);
