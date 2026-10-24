// Room allocation and pricing for tour bookings. Mirrored in frontend/src/lib/tours.ts — keep them in sync.

export const MAX_TRAVELLERS = 50;

/** Number of rooms of each size. double = 2 per room, triple = 3, quad = 4. */
export interface RoomPlan {
  double: number;
  triple: number;
  quad: number;
}

interface RoomPrices {
  /** Per person, 2 in a room. */
  price: number;
  /** Per person, 3–4 in a room (not offered when empty). */
  priceQuad?: number | null;
}

/** Default plan: everyone in 2-person rooms (one room may hold a single traveller). */
export const suggestRooms = (travellers: number): RoomPlan => ({ double: Math.ceil(travellers / 2), triple: 0, quad: 0 });

/**
 * Prices a room plan. 3- and 4-person rooms must be full; 2-person rooms may have one
 * room with a single traveller. Returns an error message when the plan doesn't fit the group.
 */
export function quoteRooms(tour: RoomPrices, travellers: number, rooms: RoomPlan) {
  const inShared = rooms.triple * 3 + rooms.quad * 4;
  const inDoubles = travellers - inShared;
  const total = Math.max(0, inDoubles) * tour.price + inShared * (tour.priceQuad || 0);

  let error: string | null = null;
  if (!tour.priceQuad && inShared > 0) error = 'This tour only offers 2 in a room.';
  else if (inDoubles < 0) error = `Those rooms sleep ${inShared}, but you have ${travellers} traveller${travellers === 1 ? '' : 's'}.`;
  else if (rooms.double * 2 < inDoubles) {
    const missing = inDoubles - rooms.double * 2;
    error = `Add a room for ${missing} more traveller${missing === 1 ? '' : 's'}.`;
  } else if (rooms.double * 2 - inDoubles > 1) error = 'Too many rooms — remove a 2-person room.';

  return { inDoubles: Math.max(0, inDoubles), inShared, total, error };
}
