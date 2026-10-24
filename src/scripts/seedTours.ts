// Seeds only the sample tours and bookings (keeps states, cities, places and users).
// Usage: npm run seed:tours
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedTours } from '../seed/seedTours';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db');
  const { tours, bookings } = await seedTours();
  console.log(`✅ Tours: ${tours}, Bookings: ${bookings}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Tour seed failed:', err);
  process.exit(1);
});
