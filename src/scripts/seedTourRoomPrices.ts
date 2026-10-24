// Adds the sample 3–4-in-a-room prices to existing tours that don't have one yet (keeps everything
// else, including prices already set in admin). Usage: npm run seed:tour-room-prices
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../models/Tour';
import { toursData } from '../seed/data/tours';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db');
  let updated = 0;
  for (const { slug, priceQuad } of toursData) {
    if (!priceQuad) continue;
    const result = await Tour.updateOne({ slug, $or: [{ priceQuad: { $exists: false } }, { priceQuad: null }] }, { $set: { priceQuad } });
    if (result.modifiedCount) updated++;
    console.log(`${result.modifiedCount ? '✅' : '⏭️ '} ${slug}${result.modifiedCount ? ` → ₹${priceQuad}` : ' (skipped: missing or already priced)'}`);
  }
  console.log(`3–4 in a room price added to ${updated} tour(s)`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Room price seed failed:', err);
  process.exit(1);
});
