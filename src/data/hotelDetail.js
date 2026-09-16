// Hotel DETAIL data layer.
//
// The listing decorator (data/hotels.js) turns a card into a rich *result row*.
// This file turns a card into a full *detail page* model: gallery, reviews,
// rating breakdown, amenities, room features, booking partners, location and
// quick links — all API-ready.
//
// Nothing here is bound to the UI: when the Spring Boot backend starts returning
// GET /api/hotels/{id} (+ /reviews, /amenities, /prices) with these fields, the
// matching `??` fallbacks below simply stop firing and the real payload flows
// through unchanged. Components only ever read `buildHotelDetail(card)`.

import { img } from "./site";
import { toNumber } from "../lib/format";

/* ------------------------------------------------------------------ */
/* Deterministic helpers (stable per hotel id, like data/hotels.js)    */
/* ------------------------------------------------------------------ */

function hashId(id) {
  const s = String(id);
  let h = 11;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// "Wed, Sep 30" — n days from today, used for "free cancellation before …".
function labelFromToday(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// Slug for shareable URLs (still routed by :id today; kept for future /hotels/:slug).
function slugify(s) {
  return String(s || "hotel")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "hotel";
}

/* ------------------------------------------------------------------ */
/* Static Cambodia imagery pools (known-good Wikimedia files)          */
/* ------------------------------------------------------------------ */

const POOL = {
  exterior: ["Skyline of Phnom Penh.jpg", "Royal Palace, Phnom Penh Cambodia 1.jpg"],
  pool: ["Palm Paradise Pool.jpg", "Main swimming pool at Paradisus by Meliá Bali.jpg", "Negombo Beach resort pool (Unsplash).jpg", "Swimming pool and Makuti-thatched villa in Malindi.jpg"],
  dining: ["Fish Amok.jpg", "Beef Lok Lak.jpg", "Kabobs at Phnom Penh Night Market.jpg"],
  rooms: ["Palm Paradise Pool.jpg", "Main swimming pool at Paradisus by Meliá Bali.jpg"],
};

function poolImage(kind, h, offset = 0) {
  const arr = POOL[kind] || POOL.exterior;
  return img(arr[(h + offset) % arr.length], 1200);
}

/* ------------------------------------------------------------------ */
/* Amenity + room-feature catalogues (icon names from ui/Icon.jsx)     */
/* ------------------------------------------------------------------ */

const PROPERTY_AMENITIES = [
  { name: "Free parking", icon: "car" },
  { name: "Free High Speed Internet (WiFi)", icon: "wifi" },
  { name: "Fitness Center with Gym / Workout Room", icon: "dumbbell" },
  { name: "Pool", icon: "waves" },
  { name: "Free breakfast", icon: "coffee" },
  { name: "Airport transportation", icon: "plane" },
  { name: "Business Center with Internet Access", icon: "briefcase" },
  { name: "Conference facilities", icon: "users" },
  { name: "24-hour front desk", icon: "clock" },
  { name: "Room service", icon: "utensils" },
  { name: "Laundry service", icon: "droplet" },
  { name: "Air conditioning", icon: "wind" },
  { name: "Restaurant", icon: "utensils" },
  { name: "Bar / Lounge", icon: "wine" },
  { name: "Spa", icon: "sparkles" },
  { name: "Family rooms", icon: "bed" },
  { name: "Non-smoking rooms", icon: "door-closed" },
  { name: "Safe", icon: "lock" },
];

const ALWAYS_ON = ["Free parking", "Free High Speed Internet (WiFi)", "Pool", "Free breakfast"];

const ROOM_FEATURES = [
  { name: "Air conditioning", icon: "snowflake" },
  { name: "Private bathroom", icon: "droplet" },
  { name: "Flat-screen TV", icon: "tv" },
  { name: "Refrigerator", icon: "lock" },
  { name: "Minibar", icon: "wine" },
  { name: "Desk", icon: "briefcase" },
  { name: "Safe", icon: "lock" },
  { name: "Wardrobe", icon: "hanger" },
  { name: "Hairdryer", icon: "wind" },
  { name: "Electric kettle", icon: "coffee" },
  { name: "Balcony", icon: "door-closed" },
  { name: "City view", icon: "building" },
];

const RATING_CATEGORIES = ["Location", "Rooms", "Value", "Cleanliness", "Service", "Sleep Quality"];

/* ------------------------------------------------------------------ */
/* Review voices                                                       */
/* ------------------------------------------------------------------ */

const REVIEW_AUTHORS = [
  "Guan W", "Sokha C", "Amara P", "Daniel R", "Chantha N",
  "Meas D", "Sophal K", "Elena V", "Bopha T", "James L",
];

const REVIEW_SNIPPETS = [
  "Very warm welcoming staff and the room was cleaned every day. Everyone here is very nice and the front desk went out of their way to help us plan the temples.",
  "Perfect location for exploring Phnom Penh — a short walk to the riverfront and the markets. Quiet rooms and a genuinely relaxing rooftop pool.",
  "Breakfast was excellent with fresh fruit and khmer dishes. The bed was so comfortable we almost skipped our tour one morning.",
  "Spotlessly clean, modern bathroom and great air conditioning after a hot day of sightseeing. Staff arranged a reliable tuk-tuk for us.",
  "Felt like home. The team remembered our names, the pool was calm in the evening, and the value for money in Cambodia is unbeatable.",
  "Beautiful Khmer-modern design. Our city-view room had a gorgeous sunset over the skyline. Would stay again in a heartbeat.",
  "Great for families — spacious room, helpful with extra beds, and the kids loved the pool. Fast WiFi for catching up on work.",
  "Excellent service from check-in to check-out. Free airport pickup was on time and the room was ready early. Highly recommended.",
];

function buildReviews(h) {
  const count = 6 + (h % 3); // 6–8 highlights
  const out = [];
  for (let i = 0; i < count; i++) {
    const authorIdx = (h + i * 3) % REVIEW_AUTHORS.length;
    const textIdx = (h + i) % REVIEW_SNIPPETS.length;
    const stars = i % 4 === 3 ? 4 : 5; // mostly 5s, some 4s
    out.push({
      id: i + 1,
      author: REVIEW_AUTHORS[authorIdx],
      date: `${MONTHS[(h + i * 2) % 12]} 2026`,
      rating: Math.min(5, stars),
      text: REVIEW_SNIPPETS[textIdx],
    });
  }
  return out;
}

function buildRatingBreakdown(rating, h) {
  return RATING_CATEGORIES.map((label, i) => {
    const bump = ((h + i * 5) % 3) / 10 - 0.05; // -0.05 … +0.15
    const score = Math.min(5, Math.max(3.8, Number((rating + bump).toFixed(1))));
    return { label, score };
  });
}

function pickAmenities(h) {
  const pool = PROPERTY_AMENITIES.filter((a) => !ALWAYS_ON.includes(a.name));
  const chosen = PROPERTY_AMENITIES.filter((a) => ALWAYS_ON.includes(a.name));
  const want = 6 + (h % 5); // 6–10 extras beyond the always-on set
  for (let i = 0; i < want; i++) {
    const a = pool[(h + i * 3) % pool.length];
    if (a && !chosen.some((c) => c.name === a.name)) chosen.push(a);
  }
  return chosen;
}

function buildProviders(price) {
  const base = {
    id: 1,
    name: "SovannBooking",
    tagline: "SovannDomNour partner",
    price: price,
    currency: "USD",
    refundable: true,
    refundableUntil: labelFromToday(2),
    url: null,
  };
  const others = [
    { id: 2, name: "Travel Partner", tagline: "Global booking partner", price: price + 3, refundable: true, refundableUntil: labelFromToday(3) },
    { id: 3, name: "Cambodia Stays", tagline: "Local Cambodia partner", price: Math.max(20, price - 3), refundable: true, refundableUntil: labelFromToday(3), roomsRemaining: 5 },
    { id: 4, name: "StayKhmer", tagline: "Regional partner", price: price + 1, refundable: false, refundableUntil: null },
  ].map((o) => ({ ...o, currency: "USD", url: null }));

  // Show 3 by default; the page expands to all four behind "View all deals".
  return [base, ...others];
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function buildHotelDetail(card) {
  if (!card) return null;
  const h = hashId(card.id);
  const rating = toNumber(card.rating) ?? Number((4.3 + ((h % 7) / 10)).toFixed(1));
  const price = toNumber(card.price) ?? 38;
  const reviews = toNumber(card.reviews) ?? 180 + ((h * 41) % 2400);
  const rooms = card.rooms || [];
  const totalHotelsInCity = 200 + (h % 260);
  const ranking = 1 + (h % Math.max(10, Math.round(reviews / 40) % 60));

  // Gallery: real listing image first, then curated Cambodia variety.
  const primary = card.image || poolImage("exterior", h);
  const galleryImages = [
    { url: primary, category: "Hotel", span: "main" },
    { url: poolImage("pool", h, 1), category: "Traveler", count: 80 + (h % 900) },
    { url: poolImage("rooms", h, 2), category: "Room & Suite", count: rooms.length ? Math.max(rooms.length * 6, 24) + (h % 60) : 40 + (h % 60) },
    { url: poolImage("dining", h, 3), category: "Dining", count: 12 + (h % 40) },
    { url: poolImage("pool", h, 4), category: "Pool & Spa", count: 8 + (h % 20) },
  ];

  const breakdown = buildRatingBreakdown(rating, h);
  const amenities = pickAmenities(h);
  const roomFeatures = ROOM_FEATURES.slice(0, 8 + (h % 4));
  const reviewsList = buildReviews(h);
  const providers = buildProviders(price);

  return {
    ...card,
    slug: card.slug || slugify(card.title),
    city: card.location || card.province || "Phnom Penh",
    province: card.province || card.location || "Phnom Penh",
    country: "Cambodia",
    address: card.address || `${100 + (h % 300)} Samdach Phuong St, ${card.location || "Phnom Penh"}`,
    rating: Number(rating.toFixed(1)),
    reviews,
    ranking,
    totalHotelsInCity,

    price, // numeric "from" price — components format with money()
    priceObj: { amount: price, currency: "USD", provider: providers[0]?.name || "SovannBooking" },

    latitude: card.latitude ?? Number((11.55 + ((h % 100) / 1000)).toFixed(4)),
    longitude: card.longitude ?? Number((104.91 + ((h % 100) / 1000)).toFixed(4)),

    galleryImages,
    videoCount: h % 4,
    travelerCount: galleryImages[1].count,
    roomCount: galleryImages[2].count,

    award:
      rating >= 4.6
        ? { title: "Top Stay", year: "2026", tone: rating >= 4.8 ? "gold" : "green" }
        : null,

    ratingBreakdown: breakdown,
    reviewsList,
    amenities,
    roomFeatures,
    bookingProviders: providers,

    quickLinks: [
      { key: "website", label: "Visit hotel website", icon: "globe", href: card.website || "#" },
      { key: "email", label: "E-mail hotel", icon: "mail", href: card.email ? `mailto:${card.email}` : "#" },
      { key: "whatsapp", label: "WhatsApp", icon: "message-circle", href: card.phone ? `https://wa.me/${String(card.phone).replace(/\D/g, "")}` : "#" },
      { key: "location", label: "View location", icon: "map-pin", href: "#location" },
    ],
  };
}

// Simplified nearby card shape used by <NearbyHotelCard/> and the map popup.
export function buildNearby(current, allCards, count = 4) {
  const cur = String(current?.id ?? "");
  return (allCards || [])
    .filter((c) => String(c.id) !== cur)
    .slice(0, count)
    .map((c, i) => {
      const h = hashId(c.id);
      return {
        id: c.id,
        href: `/hotels/${c.id}`,
        name: c.title,
        location: c.location || c.province || "Cambodia",
        rating: toNumber(c.rating) ?? Number((4.2 + ((h % 8) / 10)).toFixed(1)),
        reviews: toNumber(c.reviews) ?? 90 + ((h * 17) % 1200),
        price: toNumber(c.price) ?? 30 + (h % 90),
        image: c.image || poolImage(i % 2 ? "pool" : "exterior", h, i),
        badge:
          (toNumber(c.rating) ?? 4.6) >= 4.7
            ? { title: "Top Stay", year: "2026", tone: "gold" }
            : null,
      };
    });
}
