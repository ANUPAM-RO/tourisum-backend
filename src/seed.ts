import mongoose from 'mongoose';
import dotenv from 'dotenv';
import State from './models/State';
import City from './models/City';
import Place from './models/Place';
import Hotel from './models/Hotel';
import Restaurant from './models/Restaurant';
import { statesData } from './seed/data/states';
import { citiesData } from './seed/data/cities';
import { placesData } from './seed/data/places';
import { hotelsData } from './seed/data/hotels';
import { restaurantsData } from './seed/data/restaurants';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourism-db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    State.deleteMany({}),
    City.deleteMany({}),
    Place.deleteMany({}),
    Hotel.deleteMany({}),
    Restaurant.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // ─── STATES ───────────────────────────────────────────────────────────────
  const stateMap = new Map<string, any>();
  const states = await State.insertMany(
    statesData.map((s) => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
      capital: s.capital,
      image: s.image,
      gallery: s.gallery,
      weather: s.weather,
      bestTimeToVisit: s.bestTimeToVisit,
      localLanguage: s.localLanguage,
      emergencyNumbers: s.emergencyNumbers,
      published: s.published,
      seo: s.seo,
    }))
  );
  states.forEach((s) => stateMap.set(s.slug, s));
  console.log(`✅ States: ${states.length}`);

  // ─── CITIES ───────────────────────────────────────────────────────────────
  const cityMap = new Map<string, any>();
  const cities = await City.insertMany(
    citiesData.map((c) => ({
      name: c.name,
      slug: c.slug,
      state: stateMap.get(c.stateSlug)?._id,
      description: c.description,
      image: c.image,
      gallery: c.gallery,
      location: c.location,
      transportation: c.transportation,
      estimatedBudget: c.estimatedBudget,
      localFoods: c.localFoods,
      travelTips: c.travelTips,
      published: c.published,
      seo: c.seo,
    }))
  );
  cities.forEach((c) => cityMap.set(c.slug, c));
  console.log(`✅ Cities: ${cities.length}`);

  // ─── HOTELS ───────────────────────────────────────────────────────────────
  const hotelMap = new Map<string, any>();
  const hotels = await Hotel.insertMany(
    hotelsData.map((h) => ({
      name: h.name,
      slug: h.slug,
      description: h.description,
      address: h.address,
      location: h.location,
      googleMapLink: h.googleMapLink,
      phone: h.phone,
      website: h.website,
      starRating: h.starRating,
      pricePerNight: h.pricePerNight,
      amenities: h.amenities,
      images: h.images,
      distance: h.distance,
      category: h.category,
      published: h.published,
    }))
  );
  hotels.forEach((h) => hotelMap.set(h.slug, h));
  console.log(`✅ Hotels: ${hotels.length}`);

  // ─── RESTAURANTS ──────────────────────────────────────────────────────────
  const restaurantMap = new Map<string, any>();
  const restaurants = await Restaurant.insertMany(
    restaurantsData.map((r) => ({
      name: r.name,
      slug: r.slug,
      description: r.description,
      cuisine: r.cuisine,
      address: r.address,
      location: r.location,
      googleMapLink: r.googleMapLink,
      phone: r.phone,
      averageCost: r.averageCost,
      openingTime: r.openingTime,
      closingTime: r.closingTime,
      images: r.images,
      vegNonVeg: r.vegNonVeg,
      rating: r.rating,
      distance: r.distance,
      published: r.published,
    }))
  );
  restaurants.forEach((r) => restaurantMap.set(r.slug, r));
  console.log(`✅ Restaurants: ${restaurants.length}`);

  // ─── PLACES ───────────────────────────────────────────────────────────────
  const placeMap = new Map<string, any>();
  const places = await Place.insertMany(
    placesData.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      state: stateMap.get(p.stateSlug)?._id,
      city: cityMap.get(p.citySlug)?._id,
      location: p.location,
      category: p.category,
      bestTimeToVisit: p.bestTimeToVisit,
      openingTime: p.openingTime,
      closingTime: p.closingTime,
      entryFee: p.entryFee,
      images: p.images,
      history: p.history,
      highlights: p.highlights,
      thingsToKnow: p.thingsToKnow,
      photography: p.photography,
      weather: p.weather,
      safetyTips: p.safetyTips,
      transportation: p.transportation,
      estimatedCost: p.estimatedCost,
      bestMonths: p.bestMonths,
      localFoods: p.localFoods,
      travelTips: p.travelTips,
      localLanguage: p.localLanguage,
      emergencyNumbers: p.emergencyNumbers,
      faqs: p.faqs,
      rating: p.rating,
      published: p.published,
      seo: p.seo,
    }))
  );
  places.forEach((p) => placeMap.set(p.slug, p));
  console.log(`✅ Places: ${places.length}`);

  // ─── UPDATE STATE REFERENCES ──────────────────────────────────────────────
  for (const stateData of statesData) {
    const state = stateMap.get(stateData.slug);
    if (!state) continue;

    const popularCityIds = stateData._popularCitySlugs
      .map((slug) => cityMap.get(slug)?._id)
      .filter(Boolean);
    const popularPlaceIds = stateData._popularPlaceSlugs
      .map((slug) => placeMap.get(slug)?._id)
      .filter(Boolean);

    await State.findByIdAndUpdate(state._id, {
      popularCities: popularCityIds,
      popularPlaces: popularPlaceIds,
    });
  }

  // ─── UPDATE CITY REFERENCES ───────────────────────────────────────────────
  for (const cityData of citiesData) {
    const city = cityMap.get(cityData.slug);
    if (!city) continue;

    const popularPlaceIds = cityData._popularPlaceSlugs
      .map((slug) => placeMap.get(slug)?._id)
      .filter(Boolean);
    const hotelIds = cityData._hotelSlugs
      .map((slug) => hotelMap.get(slug)?._id)
      .filter(Boolean);
    const restaurantIds = cityData._restaurantSlugs
      .map((slug) => restaurantMap.get(slug)?._id)
      .filter(Boolean);

    await City.findByIdAndUpdate(city._id, {
      popularPlaces: popularPlaceIds,
      hotels: hotelIds,
      restaurants: restaurantIds,
    });
  }

  // ─── UPDATE PLACE REFERENCES ──────────────────────────────────────────────
  for (const placeData of placesData) {
    const place = placeMap.get(placeData.slug);
    if (!place) continue;

    const hotelIds = placeData._hotelSlugs
      .map((slug) => hotelMap.get(slug)?._id)
      .filter(Boolean);
    const restaurantIds = placeData._restaurantSlugs
      .map((slug) => restaurantMap.get(slug)?._id)
      .filter(Boolean);

    await Place.findByIdAndUpdate(place._id, {
      hotels: hotelIds,
      restaurants: restaurantIds,
    });
  }

  console.log('\n✅ Seed complete!');
  console.log(`   States:      ${states.length}`);
  console.log(`   Cities:      ${cities.length}`);
  console.log(`   Places:      ${places.length}`);
  console.log(`   Hotels:      ${hotels.length}`);
  console.log(`   Restaurants: ${restaurants.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
