import mongoose, { Document, Schema } from 'mongoose';

export interface IItinerary extends Document {
  place: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  duration: number;
  days: {
    day: number;
    title: string;
    morning: {
      activity: string;
      location: string;
      time: string;
      estimatedCost: string;
    }[];
    breakfast: {
      name: string;
      location: string;
      cost: string;
    };
    lunch: {
      name: string;
      location: string;
      cost: string;
    };
    afternoon: {
      activity: string;
      location: string;
      time: string;
      estimatedCost: string;
    }[];
    dinner: {
      name: string;
      location: string;
      cost: string;
    };
    nightStay: {
      hotel: string;
      cost: string;
    };
    estimatedExpense: string;
  }[];
  totalCost: {
    budget: string;
    standard: string;
    luxury: string;
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const itinerarySchema = new Schema<IItinerary>(
  {
    place: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    duration: { type: Number, required: true, enum: [1, 2, 3, 5, 7] },
    days: [
      {
        day: { type: Number },
        title: { type: String },
        morning: [
          {
            activity: { type: String },
            location: { type: String },
            time: { type: String },
            estimatedCost: { type: String },
          },
        ],
        breakfast: {
          name: { type: String },
          location: { type: String },
          cost: { type: String },
        },
        lunch: {
          name: { type: String },
          location: { type: String },
          cost: { type: String },
        },
        afternoon: [
          {
            activity: { type: String },
            location: { type: String },
            time: { type: String },
            estimatedCost: { type: String },
          },
        ],
        dinner: {
          name: { type: String },
          location: { type: String },
          cost: { type: String },
        },
        nightStay: {
          hotel: { type: String },
          cost: { type: String },
        },
        estimatedExpense: { type: String },
      },
    ],
    totalCost: {
      budget: { type: String },
      standard: { type: String },
      luxury: { type: String },
    },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IItinerary>('Itinerary', itinerarySchema);
