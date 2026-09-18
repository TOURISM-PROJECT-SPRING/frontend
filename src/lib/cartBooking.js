// Build backend-ready booking payloads for direct purchases from the
// tour/hotel detail pages. The API requires ticketId / roomId and real dates
// (@NotNull on the DTOs), so this normalises the page's selection into what
// createTicketBooking / createRoomBooking expect.

function toIsoDate(v) {
  if (!v) return null;
  try {
    const dt = new Date(v);
    if (Number.isNaN(dt.getTime())) return String(v);
    return dt.toISOString().slice(0, 10);
  } catch {
    return String(v);
  }
}

function addDays(iso, days) {
  const dt = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return iso;
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildTicketBookingPayload(item, userId) {
  const ticketId = Number(item.ticketId) || item.ticketId || null;
  const date = toIsoDate(item.meta?.date) || todayISO();
  return {
    userId,
    ticketId,
    quantity: Number(item.qty) || 1,
    visitDate: date,
    paymentMethod: "Card",
  };
}

export function buildRoomBookingPayload(item, userId) {
  const roomId = Number(item.meta?.roomId) || item.meta?.roomId || null;
  const nights = Math.max(1, Number(item.meta?.nights) || Number(item.qty) || 1);
  const checkIn = toIsoDate(item.meta?.checkIn) || todayISO();
  const checkOut = toIsoDate(item.meta?.checkOut) || addDays(checkIn, nights);
  return {
    userId,
    roomId,
    numGuest: Number(item.meta?.guests) || 2,
    checkIn,
    checkOut,
    paymentMethod: "Card",
  };
}

export function buildUnifiedPaymentPayload(cart, paymentMethod = "Card") {
  const items = Array.isArray(cart) ? cart : [cart];
  const payload = {
    roomBookingIds: [],
    ticketBookingIds: [],
    foodOrderIds: [],
    tourBookingIds: [],
    paymentMethod,
  };
  for (const item of items) {
    const kind = item.kind;
    if (kind === "hotel") {
      payload.roomBookingIds.push(Number(item.roomBookingId) || Number(item.id) || item.roomBookingId);
    } else if (kind === "tour") {
      payload.ticketBookingIds.push(Number(item.ticketBookingId) || Number(item.id) || item.ticketBookingId);
    } else if (kind === "restaurant") {
      payload.foodOrderIds.push(Number(item.foodOrderId) || Number(item.id) || item.foodOrderId);
    }
  }
  return payload;
}