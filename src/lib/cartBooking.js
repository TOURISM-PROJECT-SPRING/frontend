// Build backend-ready booking payloads from trip-cart items.
// The API requires ticketId / roomId and real dates (@NotNull on the DTOs), so
// this normalises the cart's flexible shape into what createTicketBooking /
// createRoomBooking expect, and tells the caller *why* an item isn't bookable.

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

// Why an item can't be submitted to the backend right now (null => bookable).
export function cartItemBlockers(item) {
  const missing = [];
  if (item.kind === "tour" && !(Number(item.ticketId) || item.ticketId)) {
    missing.push("choose a ticket on its page");
  }
  if (item.kind === "hotel" && !(Number(item.meta?.roomId) || item.meta?.roomId)) {
    missing.push("pick a room on its page");
  }
  return missing;
}