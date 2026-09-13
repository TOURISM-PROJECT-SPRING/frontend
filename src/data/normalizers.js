import { toNumber, money, isOpenNow, timeLabel, pickPlaceImage, joinImages } from "../lib/format";

// Every API entity is mapped into ONE card shape so homepage + listing + detail pages
// and the shared card components all speak the same language.
//
// Card = {
//   id, kind, title, subtitle, image, images[],
//   location, category, rating, reviews, price, priceUnit,
//   badge, badgeTone, open, openLabel, duration, status,
//   phone, email, address, description, href
// }

export function normalizeTourPlace(t, priceByPlace = {}) {
  const images = joinImages(t.placeImages);
  const price = toNumber(priceByPlace[t.id]) ?? null;
  const category = t.placeCategory?.name || null;
  const province = t.district?.province?.name || t.district?.name || null;
  return {
    id: t.id,
    kind: "tour",
    title: t.name || "Untitled experience",
    subtitle: t.description || "",
    description: t.description || "",
    image: pickPlaceImage(t.placeImages) || images[0] || null,
    images,
    location: t.district?.name || t.district?.district || t.address || null,
    province,
    address: t.address || null,
    category,
    badge: category || "Featured",
    badgeTone: "green",
    rating: toNumber(t.rating),
    reviews: null,
    price,
    priceUnit: "/person",
    duration: null,
    status: t.status || null,
    href: `/tours/${t.id}`,
  };
}

export function normalizeHotel(h, priceByHotel = {}) {
  const price = toNumber(priceByHotel[h.id]) ?? null;
  return {
    id: h.id,
    kind: "hotel",
    title: h.hotelName || h.name || "Unnamed hotel",
    subtitle: h.locationName || "",
    description: h.description || "",
    image: h.imageUrl || h.image || null,
    images: h.imageUrl ? [h.imageUrl] : [],
    location: h.locationName || null,
    province: h.locationName || h.provinceName || null,
    category: null,
    badge: "Stay",
    badgeTone: "green",
    rating: toNumber(h.rating),
    reviews: null,
    price,
    priceUnit: "/night",
    status: h.status || null,
    phone: h.phoneContact || null,
    email: h.emailContact || null,
    href: `/hotels/${h.id}`,
  };
}

export function normalizeRestaurant(r) {
  const open = isOpenNow(r.openTime, r.closeTime);
  const openLabel =
    r.openTime && r.closeTime
      ? `${timeLabel(r.openTime)} – ${timeLabel(r.closeTime)}`
      : null;
  return {
    id: r.id,
    kind: "restaurant",
    title: r.name || "Unnamed restaurant",
    subtitle: r.tourismPlaceName || "",
    description: r.description || "",
    image: r.imageUrl || r.image || null,
    images: r.imageUrl ? [r.imageUrl] : [],
    location: r.tourismPlaceName || null,
    province: r.tourismPlaceName || r.provinceName || null,
    category: r.foodCategoryName || r.cuisine || null,
    badge: r.cuisine || "Dining",
    badgeTone: "green",
    rating: toNumber(r.rating),
    reviews: null,
    price: null,
    priceUnit: "",
    open,
    openLabel,
    href: `/restaurants/${r.id}`,
  };
}

export function normalizeProvince(p) {
  return {
    id: p.id,
    kind: "destination",
    title: p.name || "Destination",
    image: p.image || null,
    attractions: toNumber(p.attractions),
    href: `/destinations/${p.id}`,
  };
}

export function normalizeFood(f) {
  return {
    id: f.id,
    kind: "food",
    title: f.name || "Dish",
    image: f.image || null,
    price: toNumber(f.price),
    available: f.isAvailable !== false,
    category: f.foodCategoryName || null,
    restaurantName: f.restaurantName || null,
  };
}

export function normalizeTicket(t) {
  return {
    id: t.id,
    name: t.name || "Ticket",
    price: toNumber(t.price),
    description: t.description || "",
    available: t.isAvailable !== false,
    placeId: t.tourismPlaceId,
    placeName: t.tourismPlaceName || null,
  };
}

export function normalizeHotelRoom(hr) {
  return {
    id: hr.id,
    roomType: hr.roomType || "Room",
    capacity: toNumber(hr.capacity),
    total: toNumber(hr.totalRoom),
    price: toNumber(hr.pricePerNight),
  };
}

// ---- Bookings (dashboard) — one unified shape across the 3 services ----
// Booking = { key, kind, title, location, date, status, amount, image }

function titleCase(s) {
  if (!s) return "Pending";
  return String(s)
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtDate(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return String(d);
  }
}

export function normalizeTicketBooking(b) {
  return {
    key: `ticket-${b.id}`,
    id: b.id,
    kind: "tour",
    title: b.ticketName || "Ticket booking",
    location: b.tourismPlaceName || null,
    date: fmtDate(b.visitDate),
    status: titleCase(b.status),
    amount: toNumber(b.totalPrice),
    quantity: toNumber(b.quantity),
    image: null,
  };
}

export function normalizeRoomBooking(b) {
  const range =
    b.checkIn && b.checkOut ? `${fmtDate(b.checkIn)} – ${fmtDate(b.checkOut)}` : fmtDate(b.checkIn);
  return {
    key: `room-${b.id}`,
    id: b.id,
    kind: "hotel",
    title: b.hotelName || "Hotel booking",
    location: b.roomType ? `${b.hotelName || "Room"} · ${b.roomType}` : b.hotelName || null,
    date: range,
    status: titleCase(b.status),
    amount: toNumber(b.amount),
    image: null,
  };
}

export function normalizeFoodOrder(o) {
  return {
    key: `order-${o.id}`,
    id: o.id,
    kind: "restaurant",
    title: o.restaurantName || "Food order",
    location: o.restaurantName || null,
    date: fmtDate(o.pickupTime),
    status: titleCase(o.status),
    amount: toNumber(o.totalPrice),
    itemCount: Array.isArray(o.items) ? o.items.length : null,
    image: null,
  };
}

export { money };
