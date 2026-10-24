// Adds sample tours that aren't in the database yet (matched by slug). Existing tours, bookings and
// anything edited in admin are left alone. Usage: npm run seed:new-tours
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../models/Tour';
import { toursData } from '../seed/data/tours';
import { buildTourDocs } from '../seed/seedTours';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db');
  const existing = new Set((await Tour.find().select('slug').lean()).map((t) => t.slug));
  const fresh = toursData.filter((t) => !existing.has(t.slug));
  if (fresh.length) await Tour.insertMany(await buildTourDocs(fresh));
  for (const t of toursData) console.log(`${existing.has(t.slug) ? '⏭️  already there' : '✅ added'}  ${t.title}`);
  console.log(`Added ${fresh.length} tour(s)`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('New tour seed failed:', err);
  process.exit(1);
});
