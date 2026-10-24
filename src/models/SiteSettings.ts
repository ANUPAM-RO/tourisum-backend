import mongoose, { Document, Schema } from 'mongoose';

// Site-wide content editable from the admin panel. There is only ever one document.
export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  description: string;
  contact: {
    agentName: string;
    agentTitle: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    workingHours: string;
    mapUrl: string;
  };
  highlights: string[];
  about: {
    heading: string;
    intro: string;
    story: string;
    mission: string;
    vision: string;
    image: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'India Tourism', trim: true },
    tagline: { type: String, default: 'Discover India', trim: true },
    description: {
      type: String,
      default: 'Discover the beauty of India. Explore destinations, plan your trips and create unforgettable memories.',
    },
    contact: {
      agentName: { type: String, default: 'Anupam Roy' },
      agentTitle: { type: String, default: 'Travel Expert & Tour Planner' },
      phone: { type: String, default: '+91 82502 17470' },
      whatsapp: { type: String, default: '+91 82502 17470' },
      email: { type: String, default: 'anupamroy575@gmail.com' },
      address: { type: String, default: 'Kolkata, West Bengal, India' },
      workingHours: { type: String, default: 'Mon–Sat, 9:00 AM – 8:00 PM' },
      mapUrl: { type: String, default: '' },
    },
    highlights: {
      type: [String],
      default: ['Custom itineraries', 'Hotel & transport booking', 'Best-price guarantee', '24×7 on-trip support'],
    },
    about: {
      heading: { type: String, default: 'Helping you discover Incredible India' },
      intro: {
        type: String,
        default: 'We are a small team of travellers who love India and want to help you explore it — from Himalayan passes to Kerala backwaters.',
      },
      story: {
        type: String,
        default:
          'What started as a passion for travel has become a complete travel guide covering states, cities and tourist places across India. We combine honest information with personal trip planning so you can travel with confidence.',
      },
      mission: { type: String, default: 'Make travel across India simple, affordable and memorable for everyone.' },
      vision: { type: String, default: 'To be the most trusted companion for exploring every corner of India.' },
      image: { type: String, default: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da' },
    },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
