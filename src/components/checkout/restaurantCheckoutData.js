// Pickup-slot and totals helpers for the restaurant (food order) checkout.
//
// `FoodOrderRequest.pickupTime` is a java.time.LocalDateTime annotated with
// @Future, so it must be sent as a *local* ISO string ("yyyy-MM-ddTHH:mm:ss").
// An ISO string carrying an offset (what `Date#toISOString` produces) is
// rejected by Jackson's LocalDateTime deserializer, so never call toISOString()
// for this field.

export const PICKUP_LEAD_MINUTES = 30;
export const PICKUP_STEP_MINUTES = 30;
const SLOT_COUNT = 20;

const pad = (n) => String(n).padStart(2, "0");

export function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export function toLocalDateTimeValue(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function parseLocalDateTime(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(value || ""));
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
  return Number.isNaN(d.getTime()) ? null : d;
}

// First bookable slot: at least PICKUP_LEAD_MINUTES from now, rounded up to the
// next slot boundary. Both the default selection and the option list derive
// from this so a default is always present in the list.
export function nextPickupSlot(now = new Date(), leadMinutes = PICKUP_LEAD_MINUTES) {
  const stepMs = PICKUP_STEP_MINUTES * 60 * 1000;
  return new Date(Math.ceil((now.getTime() + leadMinutes * 60 * 1000) / stepMs) * stepMs);
}

export function earliestPickupValue(now = new Date()) {
  return toLocalDateTimeValue(nextPickupSlot(now));
}

export function pickupSlots(now = new Date(), count = SLOT_COUNT) {
  const first = nextPickupSlot(now).getTime();
  const stepMs = PICKUP_STEP_MINUTES * 60 * 1000;
  return Array.from({ length: count }, (_, i) => {
    const value = toLocalDateTimeValue(new Date(first + i * stepMs));
    return { value, label: pickupLabel(value) };
  });
}

function dayLabel(date) {
  const today = new Date();
  const startOf = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(date) - startOf(today)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function pickupLabel(value) {
  const d = parseLocalDateTime(value);
  if (!d) return "";
  return `${dayLabel(d)} · ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

// Menu-price totals. The authoritative payable amount is the server's
// FoodOrderResponse.totalPrice, which is applied on top of these figures once
// the order exists — see RestaurantCheckoutPage.
export function orderTotals(items = [], promoApplied = false) {
  const rows = Array.isArray(items) ? items : [];
  const count = rows.reduce((n, i) => n + (Number(i.qty) || 0), 0);
  const subtotal = round2(rows.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0));
  const discount = promoApplied ? round2(subtotal * 0.1) : 0;
  return { count, subtotal, discount, total: round2(Math.max(0, subtotal - discount)) };
}

export function orderReference(id) {
  if (id == null || id === "") return null;
  return `SDN-FO-${id}`;
}

// ---------------------------------------------------------------------------
// Fulfilment: Takeaway vs Dine in
// ---------------------------------------------------------------------------
// The order payload still goes to FoodOrderRequest, which has no table field —
// the backend has no table concept at all. The chosen fulfilment and table are
// therefore persisted per order id in localStorage (see utils/foodOrderPrefs)
// and re-read wherever the order is displayed. Treat the table list below as
// demo inventory, in the same spirit as the other demo fixtures in this repo.

export const FULFILMENT = {
  TAKEAWAY: "takeaway",
  DINE_IN: "dine_in",
};

const DEMO_TABLES = [
  { id: 1, number: "T-01", capacity: 2, area: "Window" },
  { id: 2, number: "T-02", capacity: 4, area: "Window" },
  { id: 3, number: "T-03", capacity: 4, area: "Main hall" },
  { id: 4, number: "T-04", capacity: 6, area: "Main hall" },
  { id: 5, number: "T-05", capacity: 2, area: "Main hall" },
  { id: 6, number: "T-06", capacity: 8, area: "Terrace" },
  { id: 7, number: "T-07", capacity: 4, area: "Terrace" },
  { id: 8, number: "T-08", capacity: 6, area: "Private nook" },
];

export function restaurantTables() {
  return DEMO_TABLES.map((t) => ({ ...t }));
}

export function tableByNumber(number) {
  if (number == null || number === "") return null;
  return DEMO_TABLES.find((t) => t.number === String(number)) || null;
}

export function tableLabel(table) {
  if (!table) return "";
  return `${table.number} · seats ${table.capacity}`;
}

// Tables that can actually hold `guests`. Always returns something when the
// list is non-empty: if nothing fits, fall back to the largest tables rather
// than leaving the customer with no way to continue.
export function tablesForGuests(guests) {
  const need = Math.max(1, Number(guests) || 1);
  const fits = DEMO_TABLES.filter((t) => t.capacity >= need);
  if (fits.length > 0) return fits.map((t) => ({ ...t }));
  return [...DEMO_TABLES]
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 2)
    .map((t) => ({ ...t }));
}

export function fulfilmentLabel(fulfilment) {
  return fulfilment === FULFILMENT.DINE_IN ? "Dine in" : "Takeaway";
}

