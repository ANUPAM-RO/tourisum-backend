// Adds the sample hotels to existing tours that don't have any yet (keeps tours, bookings and
// hotels already entered in admin). Usage: npm run seed:tour-hotels
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../models/Tour';
import { tourHotelsData } from '../seed/data/tourHotels';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db');
  let updated = 0;
  for (const [slug, hotels] of Object.entries(tourHotelsData)) {
    const result = await Tour.updateOne(
      { slug, $or: [{ hotels: { $exists: false } }, { hotels: { $size: 0 } }] },
      { $set: { hotels } }
    );
    if (result.modifiedCount) updated++;
    console.log(`${result.modifiedCount ? '✅' : '⏭️ '} ${slug}${result.matchedCount ? '' : ' (skipped: missing or already has hotels)'}`);
  }
  console.log(`Hotels added to ${updated} tour(s)`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Tour hotel seed failed:', err);
  process.exit(1);
});
