// Sample "Hotels we provide" for each seeded tour, keyed by tour slug.
// Prices are indicative per-night rates for the sample data, not live quotes.
import type { ITourHotel } from '../../models/Tour';

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const maps = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

function hotel(name: string, location: string, starRating: number, pricePerNight: number, imageId: string): ITourHotel {
  return { name, location, starRating, pricePerNight, image: unsplash(imageId), googleMapLink: maps(`${name}, ${location}`) };
}

export const tourHotelsData: Record<string, ITourHotel[]> = {
  'darjeeling-sikkim-himalayan-escape': [
    hotel('The Elgin, Darjeeling', 'Darjeeling, West Bengal', 4, 9500, '1566073771259-6a8506099945'),
    hotel('The Elgin Nor-Khill', 'Gangtok, Sikkim', 4, 8500, '1542314831-068cd1dbfeeb'),
  ],
  'golden-triangle-ranthambore-safari': [
    hotel('ITC Mughal', 'Agra, Uttar Pradesh', 5, 11000, '1551882547-ff40c63fe5fa'),
    hotel('Nahargarh Ranthambhore', 'Sawai Madhopur, Rajasthan', 5, 14000, '1520250497591-112f2f40a3f4'),
    hotel('Alsisar Haveli', 'Jaipur, Rajasthan', 4, 7500, '1445019980597-93fa8acb246c'),
  ],
  'kerala-backwaters-and-hills': [
    hotel('Brunton Boatyard', 'Fort Kochi, Kerala', 5, 16000, '1571896349842-33c89424de2d'),
    hotel('Blanket Hotel & Spa', 'Munnar, Kerala', 5, 12500, '1596394516093-501ba68a0ba6'),
    hotel('Spice Village', 'Thekkady, Kerala', 4, 13000, '1582719478250-c89cae4dc85b'),
    hotel('The Leela Kovalam', 'Kovalam, Kerala', 5, 18000, '1520250497591-112f2f40a3f4'),
  ],
  'ladakh-adventure-leh-nubra-pangong': [
    hotel('The Grand Dragon Ladakh', 'Leh, Ladakh', 5, 15000, '1611892440504-42a792e24d32'),
    hotel('Nubra Organic Retreat', 'Hunder, Nubra Valley, Ladakh', 3, 7000, '1590490360182-c33d57733427'),
  ],
  'odisha-temples-and-coast': [
    hotel('Mayfair Lagoon', 'Bhubaneswar, Odisha', 5, 9000, '1564501049412-61c2a3083791'),
    hotel('Mayfair Heritage', 'Puri, Odisha', 4, 8000, '1571896349842-33c89424de2d'),
  ],
  'meghalaya-living-root-bridges': [
    hotel('Ri Kynjai – Serenity by the Lake', 'Umiam, Shillong, Meghalaya', 4, 12000, '1578683010236-d716f9a3f461'),
    hotel('Polo Orchid Resort', 'Cherrapunji, Meghalaya', 3, 6500, '1566073771259-6a8506099945'),
  ],
  'kashmir-vaishno-devi-amritsar': [
    hotel('Hyatt Regency Amritsar', 'Amritsar, Punjab', 5, 9000, '1551882547-ff40c63fe5fa'),
    hotel('Hotel Asia Vaishno Devi', 'Katra, Jammu & Kashmir', 3, 5500, '1582719478250-c89cae4dc85b'),
    hotel('Vivanta Dal View', 'Srinagar, Jammu & Kashmir', 5, 15000, '1542314831-068cd1dbfeeb'),
    hotel('Welcomhotel by ITC Hotels, Pine N Peak', 'Pahalgam, Jammu & Kashmir', 5, 13000, '1596394516093-501ba68a0ba6'),
  ],
  'rajasthan-desert-safari-mount-abu': [
    hotel('Alsisar Haveli', 'Jaipur, Rajasthan', 4, 7500, '1445019980597-93fa8acb246c'),
    hotel('Trident Udaipur', 'Udaipur, Rajasthan', 5, 11000, '1571896349842-33c89424de2d'),
    hotel('Hotel Hillock', 'Mount Abu, Rajasthan', 4, 6500, '1611892440504-42a792e24d32'),
    hotel('Ajit Bhawan', 'Jodhpur, Rajasthan', 4, 9000, '1564501049412-61c2a3083791'),
    hotel('Desert camp, Sam Sand Dunes', 'Sam, Jaisalmer, Rajasthan', 3, 5500, '1520250497591-112f2f40a3f4'),
  ],
  'gujarat-rann-dwarka-somnath-gir': [
    hotel('House of MG', 'Ahmedabad, Gujarat', 4, 9000, '1578683010236-d716f9a3f461'),
    hotel('Rann Utsav – The Tent City', 'Dhordo, Kutch, Gujarat', 4, 12000, '1566073771259-6a8506099945'),
    hotel('Hawthorn Suites by Wyndham Dwarka', 'Dwarka, Gujarat', 4, 6500, '1590490360182-c33d57733427'),
    hotel('The Fern Gir Forest Resort', 'Sasan Gir, Gujarat', 4, 8500, '1596394516093-501ba68a0ba6'),
    hotel('Tent City Narmada', 'Ekta Nagar, Kevadia, Gujarat', 4, 9500, '1542314831-068cd1dbfeeb'),
  ],
};
