// Restaurant DETAIL data layer — the sibling of data/hotelDetail.js.
//
// Turns a listing card (from data/restaurants.js or the API) into a full
// editorial *detail page* model: gallery, award, description, feature rows,
// opening hours, location, rating breakdown and traveler reviews.
//
// Nothing here is bound to the UI. When the backend starts returning richer
// fields on GET /api/restaurants/{id} (address, hours, per-category photo
// counts, …) the matching `??` fallbacks below stop firing and the real payload
// flows through unchanged. Components only ever read `buildRestaurantDetail(card)`.

import { img } from "./site";
import { toNumber } from "../lib/format";

/* ------------------------------------------------------------------ */
/* Deterministic helpers (stable per restaurant id)                     */
/* ------------------------------------------------------------------ */

function hashId(id) {
  const s = String(id);
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Verified Cambodia dining / garden imagery reused across the app (Wikimedia
// Special:FilePath). Nothing guessed — all are already referenced elsewhere.
const POOL = {
  garden: "Palm Paradise Pool.jpg",
  interior: "Kabobs at Phnom Penh Night Market.jpg",
  food: "Fish Amok.jpg",
  food2: "Beef Lok Lak.jpg",
  food3: "Amok trey.jpg",
  street: "Street food vendor in Phnom Pehn.jpg",
  noodles: "Num Banh Chok Somlar Kari.jpg",
  dessert: "Chek ktis.jpg",
};
const photo = (key, w = 1200, off = 0) => {
  const order = ["garden", "interior", "food", "food2", "food3", "street", "noodles", "dessert"];
  const k = order[(order.indexOf(key) + off + order.length) % order.length];
  return img(POOL[k], w);
};

/* ------------------------------------------------------------------ */
/* Feature + review catalogues                                          */
/* ------------------------------------------------------------------ */

const RATING_CATEGORIES = ["Food", "Service", "Value", "Atmosphere", "Cleanliness"];

const REVIEW_AUTHORS = [
  "Sophal K", "Emily R", "Chantha N", "Daniel W", "Bopha T",
  "Meas D", "Grace L", "Sokha C", "Amara P", "James V",
];

const REVIEW_SNIPPETS = [
  "We came for the sunset over the river and stayed three hours. The rooftop cocktails are superb and the Khmer small plates keep coming — every dish is beautifully presented.",
  "Gorgeous lush garden setting on three levels. The wine bar on the middle floor is a lovely surprise, and the staff remember your drink after one order.",
  "Easily one of the best riverside dinners in Siem Reap. Amok was fragrant, the service unhurried, and the golden-pagoda views are worth the trip alone.",
  "Perfect for a special occasion — elegant without being stiff. Vegan options were generous and genuinely delicious, not an afterthought.",
  "Watched one of Cambodia's iconic sunsets with a cool drink in hand. The late-night cocktail menu and live music made the evening.",
  "Booked a table for eight and they handled it flawlessly. Great for groups, quick digital payment, and free parking right off the avenue.",
  "The ground-floor café is a hidden gem for brunch, and the rooftop is pure magic after dark. We went back two nights in a row.",
  "Warm, professional and attentive. The gluten-free menu was clear and the kitchen happily adapted dishes. Would recommend to anyone.",
];

function buildReviews(h) {
  const count = 6 + (h % 3);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: i + 1,
      author: REVIEW_AUTHORS[(h + i * 3) % REVIEW_AUTHORS.length],
      date: `${MONTHS[(h + i * 2) % 12]} 2026`,
      rating: i % 4 === 3 ? 4 : 5,
      text: REVIEW_SNIPPETS[(h + i) % REVIEW_SNIPPETS.length],
    });
  }
  return out;
}

function buildRatingBreakdown(rating, h) {
  return RATING_CATEGORIES.map((label, i) => {
    const bump = ((h + i * 5) % 3) / 10 - 0.05;
    const score = Math.min(5, Math.max(3.9, Number((rating + bump).toFixed(1))));
    return { label, score };
  });
}

/* ------------------------------------------------------------------ */
/* Opening hours                                                        */
/* ------------------------------------------------------------------ */

function buildHours(card) {
  if (Array.isArray(card.openingHours) && card.openingHours.length === 7) return card.openingHours;
  const range = card.openLabel || "10:00 AM - 12:00 AM";
  return DAYS.map((day) => ({ day, hours: range }));
}

/* ------------------------------------------------------------------ */
/* Feature rows (3 concise lines on the page) + full grouped catalogue  */
/* ------------------------------------------------------------------ */

function buildFeatureRows(card) {
  const dietary = (card.dietary || []).length
    ? [...card.dietary, "Gluten free options"].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3).join(", ")
    : "Vegetarian friendly, Vegan options, Gluten free options";
  const payments = card.payments || "Digital Payments, Accepts Credit Cards";
  const meals = (card.meals && card.meals.length)
    ? card.meals.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).concat(["Late Night", "Drinks"])
        .filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).join(", ")
    : "Lunch, Dinner, Brunch, Late Night, Drinks";
  return [
    { icon: "leaf", text: dietary },
    { icon: "credit-card", text: payments },
    { icon: "check", text: meals },
  ];
}

function buildAllFeatures(card) {
  const features = card.features || ["Outdoor seating", "Free Wi-Fi", "Parking", "Full Bar", "Reservations", "Takeout"];
  const dietary = card.dietary && card.dietary.length
    ? [...card.dietary, "Gluten free options"].filter((v, i, a) => a.indexOf(v) === i)
    : ["Vegetarian friendly", "Vegan options", "Gluten free options"];
  return [
    {
      group: "Dietary options",
      icon: "leaf",
      items: dietary,
    },
    {
      group: "Meal types",
      icon: "utensils",
      items: card.meals && card.meals.length
        ? [...new Set([...card.meals.map((m) => m.charAt(0).toUpperCase() + m.slice(1)), "Brunch", "Late Night", "Drinks"])]
        : ["Breakfast", "Brunch", "Lunch", "Dinner", "Late Night", "Drinks"],
    },
    {
      group: "Payment",
      icon: "credit-card",
      items: ["Digital Payments", "Accepts Credit Cards", "Accepts ABA PayWave"],
    },
    {
      group: "Amenities & services",
      icon: "check",
      items: features,
    },
    {
      group: "Atmosphere",
      icon: "sparkles",
      items: ["Rooftop", "River view", "Sunset spot", "Romantic", "Lively"],
    },
    {
      group: "Good for",
      icon: "users",
      items: ["Groups", "Special occasions", "Families", "Tourists", "Lunch alone"],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

export function buildRestaurantDetail(card) {
  if (!card) return null;
  const h = hashId(card.id);
  const title = card.title || card.name || "Restaurant";
  const rating = toNumber(card.rating) ?? Number((4.4 + ((h % 6) / 10)).toFixed(1));
  const reviews = toNumber(card.reviews) ?? 120 + ((h * 37) % 2400);
  const city = card.location || card.province || "Siem Reap";
  const totalInCity = card.totalRestaurantsInCity ?? 120 + (h % 1400);
  const ranking = card.rank ?? 1 + (h % Math.max(20, reviews % 120));

  const cuisineList = Array.isArray(card.cuisines) && card.cuisines.length
    ? card.cuisines
    : card.category
      ? [card.category]
      : ["Asian", "Cambodian"];
  const priceLabel = card.priceLabel || "$$ - $$$";
  const claimed = card.claimed ?? true;

  const galleryImages = (() => {
    const urls = (card.images && card.images.length ? card.images : [card.image, photo("garden"), photo("food"), photo("interior")]).filter(Boolean);
    return [
      { url: urls[0], category: card.galleryMainLabel || "Restaurant", span: "main" },
      { url: urls[1] || photo("interior"), category: "Interior", count: card.interiorCount ?? 40 + (h % 400) },
      { url: urls[2] || photo("food"), category: "Food", count: card.foodCount ?? 80 + (h % 700) },
      { url: urls[3] || photo("food2"), category: "Menu", count: card.menuCount ?? 12 + (h % 40) },
    ];
  })();

  const awardKey = card.award || (rating >= 4.8 ? "best" : rating >= 4.6 ? "choice" : null);
  const award =
    awardKey === "best"
      ? { title: "Travelers' Choice Best of the Best", year: "2026", tone: "gold" }
      : awardKey === "choice"
        ? { title: "Travelers' Choice", year: "2026", tone: "green" }
        : null;

  return {
    ...card,
    title,
    city,
    country: "Cambodia",
    province: card.province || city,
    rating: Number(rating.toFixed(1)),
    reviews,
    ranking,
    totalRestaurantsInCity: totalInCity,

    claimed,
    cuisines: cuisineList,
    cuisineLabel: `${cuisineList.join(", ")}, ${priceLabel}`,
    priceLabel,

    description:
      card.description ||
      `${title} is a much-loved spot for authentic Khmer cooking and warm hospitality. Set in ${city}, it pairs a relaxed atmosphere with a menu of local favourites and seasonal specials.`,

    galleryImages,

    award,
    featureRows: buildFeatureRows(card),
    allFeatures: buildAllFeatures(card),
    openingHours: buildHours(card),

    address:
      card.address ||
      `${city} central, Cambodia`,
    phone: card.phone || null,
    email: card.email || null,
    parking: card.parking || ["Free off-street parking", "Street Parking"],

    latitude: card.latitude ?? Number((13.36 + ((h % 100) / 1000)).toFixed(4)),
    longitude: card.longitude ?? Number((103.86 + ((h % 100) / 1000)).toFixed(4)),

    ratingBreakdown: buildRatingBreakdown(rating, h),
    reviewsList: buildReviews(h),
  };
}
