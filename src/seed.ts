import mongoose from 'mongoose';
import dotenv from 'dotenv';
import State from './models/State';
import City from './models/City';
import Place from './models/Place';
import Hotel from './models/Hotel';
import Restaurant from './models/Restaurant';
import Attraction from './models/Attraction';
import Itinerary from './models/Itinerary';
import { seedTours } from './seed/seedTours';
import User from './models/User';
import { statesData } from './seed/data/states';
import { placesData } from './seed/data/places';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // ─── CLEAR ALL TOURISM DATA ───────────────────────────────────────────────
  // User accounts (and blogs) are kept; favourites point at old places, so reset them.
  await Promise.all([
    State.deleteMany({}),
    City.deleteMany({}),
    Place.deleteMany({}),
    Hotel.deleteMany({}),
    Restaurant.deleteMany({}),
    Attraction.deleteMany({}),
    Itinerary.deleteMany({}),
    User.updateMany({}, { $set: { favorites: [] } }),
  ]);
  console.log('Cleared existing data');

  // ─── STATES (only those that have a seeded place) ─────────────────────────
  const usedStateSlugs = new Set(placesData.map((p) => p.stateSlug));
  const missing = [...usedStateSlugs].filter((slug) => !statesData.some((s) => s.slug === slug));
  if (missing.length) throw new Error(`Missing state data for: ${missing.join(', ')}`);

  const states = await State.insertMany(
    statesData
      .filter((s) => usedStateSlugs.has(s.slug))
      .map((s) => {
        const statePlaces = placesData.filter((p) => p.stateSlug === s.slug);
        return {
          name: s.name,
          slug: s.slug,
          description: s.description,
          capital: s.capital,
          image: s.image,
          gallery: s.gallery.length ? s.gallery : statePlaces.slice(0, 3).map((p) => p.images[0]),
          weather: s.weather,
          bestTimeToVisit: s.bestTimeToVisit,
          localLanguage: s.localLanguage,
          emergencyNumbers: s.emergencyNumbers,
          published: s.published,
          seo: s.seo,
        };
      })
  );
  const stateMap = new Map(states.map((s) => [s.slug, s]));
  console.log(`✅ States: ${states.length}`);

  // ─── CITIES (built from the first place in each city; some places share one) ─
  const cityPlaces = placesData.filter((p, i) => placesData.findIndex((q) => q.city.slug === p.city.slug) === i);
  const cities = await City.insertMany(
    cityPlaces.map((p) => ({
      name: p.city.name,
      slug: p.city.slug,
      state: stateMap.get(p.stateSlug)!._id,
      description: p.city.description,
      image: p.images[0],
      gallery: p.images.slice(1),
      location: p.location,
      weather: p.weather,
      bestTimeToVisit: p.bestTimeToVisit,
      transportation: {
        nearestAirport: { name: p.transportation.byFlight.nearestAirport, distance: p.transportation.byFlight.distance, cabCost: p.transportation.byFlight.cabCost },
        nearestStation: { name: p.transportation.byTrain.nearestStation, distance: p.transportation.byTrain.distance, taxiFare: p.transportation.byTrain.taxiFare },
        busStand: { name: p.transportation.byBus.busStand, autoFare: p.transportation.byBus.autoFare },
      },
      estimatedBudget: p.estimatedCost,
      localFoods: p.localFoods,
      travelTips: p.travelTips,
      published: true,
      seo: {
        title: `${p.city.name} Tourism — ${p.name}`,
        metaDescription: p.city.description,
        keywords: [p.city.name, p.name, ...p.seo.keywords.slice(2)],
      },
    }))
  );
  const cityMap = new Map(cities.map((c) => [c.slug, c]));
  console.log(`✅ Cities: ${cities.length}`);

  // ─── PLACES ───────────────────────────────────────────────────────────────
  const places = await Place.insertMany(
    placesData.map(({ stateSlug, city, ...p }) => ({
      ...p,
      state: stateMap.get(stateSlug)!._id,
      city: cityMap.get(city.slug)!._id,
    }))
  );
  console.log(`✅ Places: ${places.length}`);

  // ─── LINK STATES AND CITIES TO THEIR PLACES ───────────────────────────────
  for (const state of states) {
    const statePlaces = places.filter((p) => String(p.state) === String(state._id));
    await State.findByIdAndUpdate(state._id, {
      popularPlaces: statePlaces.map((p) => p._id),
      popularCities: [...new Set(statePlaces.map((p) => String(p.city)))],
    });
  }
  for (const place of places) {
    await City.findByIdAndUpdate(place.city, { $addToSet: { popularPlaces: place._id } });
  }

  // ─── TOURS & BOOKINGS (sample data, linked to the places above) ───────────
  const tourCounts = await seedTours();

  console.log('\n✅ Seed complete!');
  console.log(`   States: ${states.length}`);
  console.log(`   Cities: ${cities.length}`);
  console.log(`   Places: ${places.length}`);
  console.log(`   Tours:  ${tourCounts.tours} (bookings: ${tourCounts.bookings})`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
