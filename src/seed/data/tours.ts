// Sample group tours. Images come from the linked places when seeding (see seed/seedTours.ts).

export interface TourSeed {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  placeSlugs: string[];
  startCity: string;
  endCity: string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice?: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  groupSize: number;
  tags: string[];
  /** ISO dates (YYYY-MM-DD); every departure gets `groupSize` seats. */
  departures: string[];
  highlights: string[];
  itinerary: { title: string; description: string; meals: string[]; stay: string }[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  featured: boolean;
}

const STANDARD_EXCLUSIONS = [
  'Flights or trains to the starting city',
  'Lunch unless mentioned',
  'Monument entry tickets, camera fees and activity charges',
  'Personal expenses, tips and travel insurance',
  'Anything not listed under inclusions',
];

export const toursData: TourSeed[] = [
  {
    title: 'Darjeeling & Sikkim Himalayan Escape',
    slug: 'darjeeling-sikkim-himalayan-escape',
    tagline: 'Tea gardens, toy trains and sunrise over Kanchenjunga',
    description:
      'A relaxed six-day journey through the Eastern Himalaya — sip first-flush tea in Darjeeling, ride the UNESCO-listed toy train, watch the sun light up Kanchenjunga from Tiger Hill, then cross into Sikkim for monasteries, MG Marg evenings and the glacial Tsomgo Lake.',
    placeSlugs: ['darjeeling', 'kalimpong', 'gangtok'],
    startCity: 'Bagdogra (IXB) / NJP',
    endCity: 'Bagdogra (IXB) / NJP',
    durationDays: 6,
    durationNights: 5,
    price: 24999,
    originalPrice: 28999,
    difficulty: 'Easy',
    groupSize: 14,
    tags: ['Hill Station', 'Family Trip', 'Honeymoon'],
    departures: ['2026-11-14', '2026-12-12', '2027-03-20', '2027-04-17'],
    highlights: [
      'Sunrise over Kanchenjunga from Tiger Hill',
      'Darjeeling Himalayan Railway joy ride',
      'Tea tasting at a working estate',
      'Day trip to Tsomgo Lake and Baba Mandir',
      'Rumtek Monastery and Gangtok ropeway',
      'Evening walk on the car-free MG Marg',
    ],
    itinerary: [
      { title: 'Arrive Bagdogra, drive to Darjeeling', description: 'Pick-up from Bagdogra airport or NJP station and a scenic 3-hour drive through tea gardens to Darjeeling (2,042 m). Evening free to stroll the Chowrasta and Mall Road.', meals: ['Dinner'], stay: 'Darjeeling — hill-view hotel' },
      { title: 'Tiger Hill sunrise & Darjeeling sightseeing', description: 'Early 4 AM drive to Tiger Hill for sunrise over Kanchenjunga, then Ghoom Monastery and Batasia Loop. After breakfast visit the Himalayan Mountaineering Institute, the zoo (red pandas!) and Happy Valley Tea Estate.', meals: ['Breakfast', 'Dinner'], stay: 'Darjeeling — hill-view hotel' },
      { title: 'Toy train ride & transfer to Gangtok via Kalimpong', description: 'Morning joy ride on the Darjeeling Himalayan Railway. Drive to Gangtok via Kalimpong with a stop at Deolo Hill and the Teesta river viewpoint. Sikkim entry formalities at Rangpo.', meals: ['Breakfast', 'Dinner'], stay: 'Gangtok — boutique hotel near MG Marg' },
      { title: 'Excursion to Tsomgo Lake', description: 'Full-day excursion (permits arranged) to the glacial Tsomgo Lake at 3,753 m and Baba Harbhajan Singh Mandir. Nathu La can be added on request, subject to permits. Return to Gangtok for a relaxed evening.', meals: ['Breakfast', 'Dinner'], stay: 'Gangtok — boutique hotel near MG Marg' },
      { title: 'Gangtok sightseeing', description: 'Visit Rumtek Monastery, Enchey Monastery, the Namgyal Institute of Tibetology and Do Drul Chorten, then ride the Gangtok ropeway. Farewell dinner with Sikkimese dishes.', meals: ['Breakfast', 'Dinner'], stay: 'Gangtok — boutique hotel near MG Marg' },
      { title: 'Departure', description: 'Breakfast and drive back to Bagdogra airport or NJP station (about 4–5 hours) for your onward journey.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '5 nights in handpicked hotels (twin sharing)',
      'Daily breakfast and dinner',
      'All transfers and sightseeing in a private SUV',
      'Toy train joy-ride tickets',
      'Tsomgo Lake permits',
      'Tour coordinator throughout the trip',
    ],
    exclusions: STANDARD_EXCLUSIONS,
    thingsToCarry: ['Heavy woollens and a windproof jacket', 'Comfortable walking shoes', 'Government photo ID (needed for Sikkim permits)', 'Sunscreen and sunglasses', 'Basic medicines'],
    featured: true,
  },
  {
    title: 'Golden Triangle with Ranthambore Safari',
    slug: 'golden-triangle-ranthambore-safari',
    tagline: 'Taj Mahal at sunrise, tigers in the wild and Jaipur\'s pink palaces',
    description:
      'India\'s classic first-timer circuit with a wild twist. See the Taj Mahal at dawn, wander Akbar\'s abandoned capital at Fatehpur Sikri, go tiger-spotting on two jeep safaris in Ranthambore and finish among the forts and bazaars of Jaipur.',
    placeSlugs: ['taj-mahal', 'fatehpur-sikri', 'ranthambore-national-park', 'jaipur'],
    startCity: 'New Delhi',
    endCity: 'Jaipur',
    durationDays: 6,
    durationNights: 5,
    price: 27999,
    originalPrice: 31999,
    difficulty: 'Easy',
    groupSize: 16,
    tags: ['Heritage', 'Wildlife', 'Family Trip'],
    departures: ['2026-11-21', '2026-12-19', '2027-01-23', '2027-02-20'],
    highlights: [
      'Sunrise visit to the Taj Mahal',
      'Two jeep safaris in Ranthambore Tiger Reserve',
      'Fatehpur Sikri and the Buland Darwaza',
      'Amber Fort, Hawa Mahal and City Palace',
      'Rajasthani dinner with folk music',
    ],
    itinerary: [
      { title: 'Delhi to Agra', description: 'Morning pick-up in Delhi and drive to Agra on the Yamuna Expressway (about 3.5 hours). Afternoon at Agra Fort, then sunset over the Taj from Mehtab Bagh across the river.', meals: ['Dinner'], stay: 'Agra — hotel with Taj views' },
      { title: 'Taj Mahal sunrise, Fatehpur Sikri, on to Ranthambore', description: 'Enter the Taj Mahal at sunrise with a licensed guide. After breakfast drive to Fatehpur Sikri to explore Akbar\'s red-sandstone city, then continue to Sawai Madhopur.', meals: ['Breakfast', 'Dinner'], stay: 'Ranthambore — jungle resort' },
      { title: 'Ranthambore safaris', description: 'Morning and afternoon jeep safaris in the tiger reserve, looking for tigers, leopards, sloth bears and crocodiles. Midday break at the resort pool.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Ranthambore — jungle resort' },
      { title: 'Ranthambore Fort & drive to Jaipur', description: 'Visit the hilltop Ranthambore Fort and Trinetra Ganesh Temple, then drive to Jaipur (about 3.5 hours). Evening in the bazaars of the Pink City.', meals: ['Breakfast', 'Dinner'], stay: 'Jaipur — heritage haveli' },
      { title: 'Jaipur sightseeing', description: 'Amber Fort in the morning, photo stop at Jal Mahal, then City Palace, Jantar Mantar and Hawa Mahal. Farewell Rajasthani dinner with folk music and dance.', meals: ['Breakfast', 'Dinner'], stay: 'Jaipur — heritage haveli' },
      { title: 'Departure from Jaipur', description: 'Breakfast and transfer to Jaipur airport or railway station.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '5 nights accommodation (twin sharing)',
      'Daily breakfast and dinner; all meals at Ranthambore',
      'AC vehicle for all transfers and sightseeing',
      'Two shared canter/gypsy safaris in Ranthambore',
      'Licensed English/Hindi guides at Agra and Jaipur',
    ],
    exclusions: STANDARD_EXCLUSIONS,
    thingsToCarry: ['Light layers and a warm jacket for early safaris', 'Hat, sunglasses and sunscreen', 'Earth-coloured clothes for the safari', 'Photo ID for monument entry', 'Comfortable walking shoes'],
    featured: true,
  },
  {
    title: 'Kerala Backwaters & Hills',
    slug: 'kerala-backwaters-and-hills',
    tagline: 'Tea-covered hills, spice forests and a night on a houseboat',
    description:
      'Seven unhurried days in God\'s Own Country — colonial Fort Kochi, the misty tea estates of Munnar, spice plantations and a boat safari in Thekkady, an overnight houseboat cruise on the Alleppey backwaters and a final beach day in Kovalam.',
    placeSlugs: ['fort-kochi', 'munnar', 'thekkady', 'alappuzha-backwaters', 'kovalam'],
    startCity: 'Kochi (COK)',
    endCity: 'Thiruvananthapuram (TRV)',
    durationDays: 7,
    durationNights: 6,
    price: 32999,
    originalPrice: 36999,
    difficulty: 'Easy',
    groupSize: 14,
    tags: ['Honeymoon', 'Hill Station', 'Beach'],
    departures: ['2026-11-07', '2026-12-05', '2027-01-09', '2027-02-13'],
    highlights: [
      'Overnight houseboat cruise on the backwaters',
      'Tea estate walk and Eravikulam National Park in Munnar',
      'Boat safari on Periyar Lake',
      'Kathakali performance in Fort Kochi',
      'Sunset at Kovalam Lighthouse Beach',
    ],
    itinerary: [
      { title: 'Arrive Kochi', description: 'Airport pick-up and check-in. Afternoon walk in Fort Kochi past the Chinese fishing nets, St. Francis Church and Jew Town. Evening Kathakali performance.', meals: ['Dinner'], stay: 'Fort Kochi — heritage boutique hotel' },
      { title: 'Kochi to Munnar', description: 'Drive into the Western Ghats (about 4 hours) stopping at Cheeyappara and Valara waterfalls and a spice garden. Evening at leisure among the tea hills.', meals: ['Breakfast', 'Dinner'], stay: 'Munnar — tea-estate resort' },
      { title: 'Munnar sightseeing', description: 'Eravikulam National Park to see the Nilgiri tahr, the Tata Tea Museum, Mattupetty Dam and Echo Point. Guided walk through the tea estates.', meals: ['Breakfast', 'Dinner'], stay: 'Munnar — tea-estate resort' },
      { title: 'Munnar to Thekkady', description: 'Drive to Thekkady (about 3 hours). Afternoon spice-plantation tour, evening Kalaripayattu martial-arts show.', meals: ['Breakfast', 'Dinner'], stay: 'Thekkady — forest-edge resort' },
      { title: 'Periyar boat safari & Alleppey houseboat', description: 'Early boat safari on Periyar Lake to spot elephants and gaur, then drive to Alleppey and board your private kettuvallam houseboat for a cruise through the backwaters.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Alleppey — private houseboat' },
      { title: 'Alleppey to Kovalam', description: 'Breakfast on board and disembark. Drive to Kovalam (about 4 hours) for a relaxed evening on Lighthouse Beach.', meals: ['Breakfast', 'Dinner'], stay: 'Kovalam — sea-view resort' },
      { title: 'Departure', description: 'Morning at the beach, then transfer to Thiruvananthapuram airport.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '5 nights in hotels and 1 night on a private houseboat',
      'Daily breakfast and dinner; all meals on the houseboat',
      'AC vehicle with driver for the whole trip',
      'Periyar boat safari tickets',
      'Kathakali and Kalaripayattu show tickets',
    ],
    exclusions: STANDARD_EXCLUSIONS,
    thingsToCarry: ['Light cotton clothes and a light jacket for Munnar', 'Rain jacket or umbrella', 'Insect repellent', 'Swimwear for Kovalam', 'Modest clothing for temple visits'],
    featured: true,
  },
  {
    title: 'Ladakh Adventure: Leh, Nubra & Pangong',
    slug: 'ladakh-adventure-leh-nubra-pangong',
    tagline: 'High passes, sand dunes and the blue waters of Pangong',
    description:
      'A carefully paced high-altitude adventure with two acclimatisation days in Leh before crossing Khardung La to the sand dunes and Bactrian camels of Nubra Valley, then on to the ever-changing blues of Pangong Lake.',
    placeSlugs: ['leh', 'nubra-valley', 'pangong-lake'],
    startCity: 'Leh (IXL)',
    endCity: 'Leh (IXL)',
    durationDays: 7,
    durationNights: 6,
    price: 38999,
    originalPrice: 42999,
    difficulty: 'Challenging',
    groupSize: 12,
    tags: ['Adventure'],
    departures: ['2027-05-22', '2027-06-12', '2027-07-03'],
    highlights: [
      'Two easy acclimatisation days in Leh',
      'Drive over Khardung La',
      'Camel ride on the Hunder sand dunes',
      'Overnight camp at Pangong Lake',
      'Thiksey Monastery morning prayers',
    ],
    itinerary: [
      { title: 'Arrive Leh — rest & acclimatise', description: 'Airport pick-up and complete rest to acclimatise to 3,500 m. Short evening walk to Leh market if you feel well.', meals: ['Dinner'], stay: 'Leh — boutique hotel' },
      { title: 'Leh local sightseeing', description: 'Gentle day visiting Shanti Stupa, Leh Palace, the Hall of Fame, Magnetic Hill and the Indus–Zanskar confluence at Sangam.', meals: ['Breakfast', 'Dinner'], stay: 'Leh — boutique hotel' },
      { title: 'Leh to Nubra Valley via Khardung La', description: 'Cross Khardung La into Nubra Valley. Visit Diskit Monastery and its giant Maitreya Buddha, then a Bactrian camel ride on the Hunder sand dunes at sunset.', meals: ['Breakfast', 'Dinner'], stay: 'Hunder — Swiss-tent camp' },
      { title: 'Nubra to Pangong Lake', description: 'Drive along the Shyok river route to Pangong Tso (4,225 m). Spend the evening by the lake as the colours change with the light.', meals: ['Breakfast', 'Dinner'], stay: 'Pangong — lakeside camp' },
      { title: 'Pangong to Leh via Chang La', description: 'Sunrise by the lake, then drive back to Leh over Chang La (5,360 m) with a stop at Hemis or Thiksey Monastery on the way.', meals: ['Breakfast', 'Dinner'], stay: 'Leh — boutique hotel' },
      { title: 'Free day in Leh', description: 'Optional rafting on the Zanskar, a visit to Hemis Monastery, or shopping for pashmina and apricot jams.', meals: ['Breakfast', 'Dinner'], stay: 'Leh — boutique hotel' },
      { title: 'Departure', description: 'Early transfer to Leh airport.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '4 nights in Leh, 1 night in Nubra and 1 night at Pangong (twin sharing)',
      'Daily breakfast and dinner',
      'Inner Line Permits and environment fees',
      'Tempo Traveller/SUV with an experienced mountain driver',
      'Oxygen cylinder and first-aid kit in the vehicle',
    ],
    exclusions: [...STANDARD_EXCLUSIONS, 'Camel ride and rafting charges'],
    thingsToCarry: ['Thermal innerwear, down jacket, gloves and a woollen cap', 'Sunglasses with UV protection and SPF 50 sunscreen', 'Lip balm and moisturiser', 'Personal medicines (consult a doctor about altitude sickness)', 'Original photo ID for permits'],
    featured: false,
  },
  {
    title: 'Odisha Temples & Coast',
    slug: 'odisha-temples-and-coast',
    tagline: 'Sun temple, sacred Puri and dolphins on Chilika Lake',
    description:
      'A compact five-day trail through Odisha\'s Golden Triangle — the temple city of Bhubaneswar, the colossal stone chariot at Konark, the beaches and Jagannath Temple of Puri, and an Irrawaddy dolphin-spotting cruise on Chilika Lake.',
    placeSlugs: ['bhubaneswar', 'konark-sun-temple', 'puri', 'chilika-lake'],
    startCity: 'Bhubaneswar (BBI)',
    endCity: 'Bhubaneswar (BBI)',
    durationDays: 5,
    durationNights: 4,
    price: 16999,
    originalPrice: 19499,
    difficulty: 'Easy',
    groupSize: 16,
    tags: ['Heritage', 'Religious', 'Beach'],
    departures: ['2026-11-28', '2026-12-26', '2027-01-30', '2027-02-27'],
    highlights: [
      'Konark Sun Temple with an ASI-approved guide',
      'Dolphin-spotting boat ride on Chilika Lake',
      'Udayagiri and Khandagiri caves',
      'Sunrise on Puri\'s Golden Beach',
      'Raghurajpur heritage crafts village',
    ],
    itinerary: [
      { title: 'Arrive Bhubaneswar', description: 'Airport pick-up. Afternoon visit to the Lingaraja Temple (outside viewing platform for non-Hindus), Mukteshwar and Rajarani temples, then sunset at Udayagiri–Khandagiri caves.', meals: ['Dinner'], stay: 'Bhubaneswar — city hotel' },
      { title: 'Dhauli, Raghurajpur and Puri', description: 'Visit the Dhauli Peace Pagoda and Ashokan edicts, then Raghurajpur village to watch pattachitra painters at work. Check in at Puri for an evening on the beach.', meals: ['Breakfast', 'Dinner'], stay: 'Puri — beach resort' },
      { title: 'Konark Sun Temple & Chandrabhaga', description: 'Morning at the Konark Sun Temple with a guide, then Chandrabhaga beach. Afternoon free in Puri — Jagannath Temple darshan for Hindu guests.', meals: ['Breakfast', 'Dinner'], stay: 'Puri — beach resort' },
      { title: 'Chilika Lake day trip', description: 'Drive to Satapada for a boat ride on Chilika Lake to spot Irrawaddy dolphins and visit the sandbar where the lagoon meets the sea. Return to Bhubaneswar.', meals: ['Breakfast', 'Lunch', 'Dinner'], stay: 'Bhubaneswar — city hotel' },
      { title: 'Departure', description: 'Breakfast and transfer to Bhubaneswar airport or station.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '4 nights accommodation (twin sharing)',
      'Daily breakfast and dinner, lunch on the Chilika day',
      'AC vehicle for all transfers and sightseeing',
      'Chilika boat ride',
      'Guide at Konark',
    ],
    exclusions: STANDARD_EXCLUSIONS,
    thingsToCarry: ['Light cotton clothes', 'Modest clothing for temples (no leather inside Jagannath Temple)', 'Sunscreen and a hat', 'Swimwear', 'Photo ID'],
    featured: false,
  },
  {
    title: 'Meghalaya: Clouds, Caves & Living Root Bridges',
    slug: 'meghalaya-living-root-bridges',
    tagline: 'Waterfalls, root bridges and the crystal-clear Umngot river',
    description:
      'Explore the "abode of clouds" — Shillong\'s lakes and viewpoints, the waterfalls and caves of Cherrapunji, the famous double-decker living root bridge at Nongriat and a boat ride on the glass-clear Umngot river at Dawki, with a stop at Asia\'s cleanest village.',
    placeSlugs: ['shillong', 'cherrapunji', 'living-root-bridges', 'dawki'],
    startCity: 'Guwahati (GAU)',
    endCity: 'Guwahati (GAU)',
    durationDays: 5,
    durationNights: 4,
    price: 21999,
    originalPrice: 24999,
    difficulty: 'Moderate',
    groupSize: 14,
    tags: ['Adventure', 'Hill Station'],
    departures: ['2026-11-12', '2026-12-10', '2027-02-18', '2027-03-18'],
    highlights: [
      'Trek to the double-decker living root bridge',
      'Nohkalikai and Seven Sisters waterfalls',
      'Boating on the clear Umngot river at Dawki',
      'Mawlynnong — Asia\'s cleanest village',
      'Umiam Lake and Shillong Peak',
    ],
    itinerary: [
      { title: 'Guwahati to Shillong', description: 'Pick-up from Guwahati airport and drive to Shillong (about 3 hours) with a stop at Umiam Lake. Evening at Police Bazaar and Ward\'s Lake.', meals: ['Dinner'], stay: 'Shillong — boutique hotel' },
      { title: 'Shillong to Cherrapunji', description: 'Shillong Peak and Elephant Falls in the morning, then drive to Cherrapunji to see Nohkalikai Falls, Mawsmai Cave and Seven Sisters Falls.', meals: ['Breakfast', 'Dinner'], stay: 'Cherrapunji — valley-view resort' },
      { title: 'Nongriat double-decker root bridge trek', description: 'Full-day guided trek down about 3,500 steps to the double-decker living root bridge and the natural pools at Nongriat. Go further to Rainbow Falls if energy allows.', meals: ['Breakfast', 'Packed lunch', 'Dinner'], stay: 'Cherrapunji — valley-view resort' },
      { title: 'Mawlynnong & Dawki', description: 'Visit Mawlynnong village and the Riwai single root bridge, then boat on the crystal-clear Umngot river at Dawki near the Bangladesh border. Return to Shillong.', meals: ['Breakfast', 'Dinner'], stay: 'Shillong — boutique hotel' },
      { title: 'Departure', description: 'Breakfast and drive back to Guwahati airport.', meals: ['Breakfast'], stay: '' },
    ],
    inclusions: [
      '4 nights accommodation (twin sharing)',
      'Daily breakfast and dinner, packed lunch on the trek day',
      'SUV with driver for all transfers and sightseeing',
      'Local guide for the Nongriat trek',
      'Dawki boat ride and village entry fees',
    ],
    exclusions: STANDARD_EXCLUSIONS,
    thingsToCarry: ['Shoes with good grip for the steep trek', 'Rain jacket — it can rain any time', 'Light woollens', 'Quick-dry clothes and a towel', 'Personal water bottle'],
    featured: true,
  },
];

/** Sample bookings so the admin Bookings page has data; seats are reserved to match. */
export const bookingsData = [
  { tourSlug: 'darjeeling-sikkim-himalayan-escape', departure: '2026-11-14', name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '+91 98300 11223', adults: 2, children: 1, status: 'confirmed', message: 'Celebrating our anniversary — a room with a view would be lovely.' },
  { tourSlug: 'darjeeling-sikkim-himalayan-escape', departure: '2026-11-14', name: 'Rahul Verma', email: 'rahul.verma@example.com', phone: '+91 99876 54321', adults: 4, children: 0, status: 'confirmed', message: '' },
  { tourSlug: 'golden-triangle-ranthambore-safari', departure: '2026-11-21', name: 'Ananya Iyer', email: 'ananya.iyer@example.com', phone: '+91 90030 77881', adults: 2, children: 2, status: 'pending', message: 'Kids are 8 and 11. Is the safari suitable for them?' },
  { tourSlug: 'kerala-backwaters-and-hills', departure: '2026-11-07', name: 'Sourav Ghosh', email: 'sourav.ghosh@example.com', phone: '+91 98310 44556', adults: 2, children: 0, status: 'confirmed', message: 'Honeymoon trip.' },
  { tourSlug: 'kerala-backwaters-and-hills', departure: '2026-11-07', name: 'Meera Nair', email: 'meera.nair@example.com', phone: '+91 94470 22334', adults: 6, children: 2, status: 'confirmed', message: 'Family group, two senior citizens.' },
  { tourSlug: 'meghalaya-living-root-bridges', departure: '2026-11-12', name: 'Arjun Das', email: 'arjun.das@example.com', phone: '+91 70020 99887', adults: 3, children: 0, status: 'pending', message: '' },
  { tourSlug: 'odisha-temples-and-coast', departure: '2026-11-28', name: 'Kavya Reddy', email: 'kavya.reddy@example.com', phone: '+91 98490 66778', adults: 2, children: 0, status: 'cancelled', message: 'Dates clash with a family function, sorry.' },
] as const;
