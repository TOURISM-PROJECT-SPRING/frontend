// "Things to do in Siem Reap" — travel activity listing data layer for SovannDomNour.
//
// Mirrors the shape of data/restaurants.js: pure helpers (emptyFilters,
// countActiveFilters, applyTourFilters, sortTours, decorateTours,
// resultsCountLabel) plus a curated demo dataset so the marketplace behaves like
// a real booking site without a backend. When GET /api/tour-places (+ tickets)
// returns these fields, the `??` fallbacks stop firing and real data flows in.
//
// Images are verified Wikimedia Commons files (Special:FilePath) already used
// elsewhere in the app, so nothing 404s.

import { img } from "./site";
import { provinceLabel } from "./restaurants";

/* ------------------------------------------------------------------ */
/* Verified Cambodia imagery pool                                       */
/* ------------------------------------------------------------------ */

const F = {
  angkorReflejo: "Angkor Wat, reflejo 2.jpg",
  angkor: "Angkor_Wat.jpg",
  taProhm: "Ta_Prohm.jpg",
  taProhmEntrance: "Ta Prohm entrance.jpg",
  bayon: "Bayon temple 02.jpg",
  angkorThomGate: "Angkor Thom Gate.jpg",
  banteaySrei: "Banteay Srei - panoramio.jpg",
  kbalSpean: "Kbal Spean.jpg",
  kompongPhluk: "Kompong Phluk.jpg",
  palace: "Royal Palace, Phnom Penh Cambodia 1.jpg",
  skyline: "Skyline of Phnom Penh.jpg",
  amok: "Fish Amok.jpg",
  lokLak: "Beef Lok Lak.jpg",
  amokTrey: "Amok trey.jpg",
  noodles: "Num Banh Chok Somlar Kari.jpg",
  bamboo: "Bamboo train Battambang.jpg",
  kohRong: "Koh_Rong_island.jpg",
  palmPool: "Palm Paradise Pool.jpg",
  bbq: "Kabobs at Phnom Penh Night Market.jpg",
  street: "Street food vendor in Phnom Pehn.jpg",
  kampot: "Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg",
  kep: "06-Kep Crab Market Cambodia-nX-7.jpg",
  beach: "Sihanoukville - Prek Treng beach.jpg",
  elephant: "Elephant conservation and indigenous experiences in Cambodia Project.jpg",
};

// Build a 5-image carousel from a themed list of pool keys (wraps if short).
function gallery(keys) {
  const base = keys.length ? keys : ["angkor", "taProhm", "bayon"];
  return Array.from({ length: 5 }, (_, i) => img(F[base[i % base.length]], 900));
}

/* ------------------------------------------------------------------ */
/* Filter + sort option constants (single source of truth)             */
/* ------------------------------------------------------------------ */

export const AWARD_OPTIONS = [
  { key: "choice", label: "Travelers’ Choice" },
  { key: "winner", label: "Award winners" },
  { key: "all", label: "All awards" },
];

export const LANGUAGE_OPTIONS = ["English", "Khmer", "Chinese", "French", "Japanese", "Korean"];

export const TIME_OPTIONS = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
  { key: "full-day", label: "Full day" },
];

export const PRICE_OPTIONS = [
  { key: "under25", label: "Under $25" },
  { key: "25to50", label: "$25 – $50" },
  { key: "50to100", label: "$50 – $100" },
  { key: "100plus", label: "$100+" },
];

export const CATEGORY_OPTIONS = [
  { key: "temples", label: "Temples & ruins" },
  { key: "nature", label: "Nature & outdoors" },
  { key: "food", label: "Food & drink" },
  { key: "culture", label: "Culture & local life" },
  { key: "photography", label: "Photography" },
  { key: "sunset", label: "Sunset views" },
];

export const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "top-rated", label: "Top rated" },
  { key: "most-reviewed", label: "Most reviewed" },
  { key: "price-asc", label: "Price: Low to high" },
  { key: "price-desc", label: "Price: High to low" },
];

/* ------------------------------------------------------------------ */
/* Filter state                                                         */
/* ------------------------------------------------------------------ */

export const emptyFilters = () => ({
  location: "Siem Reap",
  dates: { from: "", to: "" },
  awards: [],
  languages: [],
  timeOfDay: [],
  price: [],
  categories: [],
  freeCancel: false,
});

export function countActiveFilters(f) {
  let n = 0;
  n += f.awards.length + f.languages.length + f.timeOfDay.length;
  n += f.price.length + f.categories.length;
  if (f.freeCancel) n++;
  if (f.dates?.from || f.dates?.to) n++;
  return n;
}

/* ------------------------------------------------------------------ */
/* Demo dataset — 12 Siem Reap activities (matches reference)          */
/* ------------------------------------------------------------------ */

export const demoTours = [
  {
    id: "a1", title: "Angkor Wat Private Day Tour from Siem Reap",
    rating: 5.0, reviews: 950, recommend: 99, duration: "6–7 hours", durationHours: 6.5,
    price: 15, awardTier: "choice", featured: true, freeCancel: true,
    languages: ["English", "Khmer", "French"], timeOfDay: ["morning", "full-day"], categories: ["temples", "culture"],
    images: gallery(["angkorReflejo", "angkor", "bayon", "taProhm", "angkorThomGate"]),
  },
  {
    id: "a2", title: "Angkor Wat one Day Private Tour for All Highlight Angkor Temples",
    rating: 5.0, reviews: 233, recommend: 100, duration: "7–9 hours", durationHours: 8,
    price: 20, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer", "Chinese"], timeOfDay: ["full-day"], categories: ["temples"],
    images: gallery(["angkor", "taProhmEntrance", "banteaySrei", "bayon", "angkorThomGate"]),
  },
  {
    id: "a3", title: "Angkor Wat Sunrise or Sunset Tour with Guide from Siem Reap",
    rating: 5.0, reviews: 12136, recommend: 99, duration: "6+ hours", durationHours: 6,
    price: 26, awardTier: "winner", featured: false, freeCancel: true,
    languages: ["English", "Khmer", "Japanese", "Korean"], timeOfDay: ["morning", "evening"], categories: ["temples", "sunset", "photography"],
    images: gallery(["angkorReflejo", "angkor", "bayon", "angkorThomGate", "taProhm"]),
  },
  {
    id: "a4", title: "Angkor Wat Sunrise Private Tour with Guide from Siem Reap",
    rating: 5.0, reviews: 3072, recommend: 99, duration: "6+ hours", durationHours: 6,
    price: 30, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "French"], timeOfDay: ["morning"], categories: ["temples", "photography", "sunset"],
    images: gallery(["angkor", "angkorReflejo", "banteaySrei", "bayon", "taProhmEntrance"]),
  },
  {
    id: "a5", title: "Angkor Wat Private Tour by Tuk-Tuk with English Speaking Driver",
    rating: 4.9, reviews: 184, recommend: 96, duration: "3–8 hours", durationHours: 5,
    price: 15, awardTier: null, featured: false, freeCancel: true,
    languages: ["English"], timeOfDay: ["morning", "afternoon"], categories: ["temples", "culture"],
    images: gallery(["angkorThomGate", "taProhm", "bayon", "angkor", "banteaySrei"]),
  },
  {
    id: "a6", title: "Angkor Wat Discovery – Small Group Tour with Local Experience",
    rating: 4.9, reviews: 3242, recommend: 99, duration: "9–10 hours", durationHours: 9.5,
    price: 20, awardTier: "choice", featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["full-day"], categories: ["temples", "culture"],
    images: gallery(["taProhmEntrance", "angkor", "bayon", "angkorThomGate", "taProhm"]),
  },
  {
    id: "a7", title: "Angkor Wat Small Group Tour and Sunset with Lunch Included",
    rating: 5.0, reviews: 417, recommend: 100, duration: "6+ hours", durationHours: 6,
    price: 26, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Chinese"], timeOfDay: ["afternoon", "evening"], categories: ["temples", "sunset", "food"],
    images: gallery(["angkorReflejo", "bayon", "angkor", "banteaySrei", "angkorThomGate"]),
  },
  {
    id: "a8", title: "Angkor 2-Day Sunset & Sunrise Small-Group Tour",
    rating: 5.0, reviews: 2594, recommend: 99, duration: "2 days", durationHours: 16,
    price: 49, awardTier: "winner", featured: false, freeCancel: true,
    languages: ["English", "French", "Japanese"], timeOfDay: ["morning", "evening"], categories: ["temples", "sunset", "photography"],
    images: gallery(["angkor", "angkorReflejo", "taProhm", "bayon", "banteaySrei"]),
  },
  {
    id: "a9", title: "Angkor Wat Sunrise Photography Tour",
    rating: 4.9, reviews: 156, recommend: 98, duration: "5–6 hours", durationHours: 5.5,
    price: 45, awardTier: null, featured: false, freeCancel: true,
    languages: ["English"], timeOfDay: ["morning"], categories: ["photography", "temples", "sunset"],
    images: gallery(["angkorReflejo", "banteaySrei", "angkor", "taProhmEntrance", "bayon"]),
  },
  {
    id: "a10", title: "Kulen Mountain Waterfall & Lost Rivers Tour",
    rating: 4.8, reviews: 620, recommend: 97, duration: "7–8 hours", durationHours: 7.5,
    price: 38, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["full-day"], categories: ["nature", "temples"],
    images: gallery(["kbalSpean", "banteaySrei", "taProhm", "angkor", "bayon"]),
  },
  {
    id: "a11", title: "Tonle Sap Floating Village Sunset Cruise",
    rating: 4.7, reviews: 480, recommend: 95, duration: "4–5 hours", durationHours: 4.5,
    price: 22, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer", "French"], timeOfDay: ["afternoon", "evening"], categories: ["nature", "culture", "sunset"],
    images: gallery(["kompongPhluk", "kohRong", "palmPool", "skyline", "angkorReflejo"]),
  },
  {
    id: "a12", title: "Siem Reap Street Food & Market Night Tour",
    rating: 4.9, reviews: 730, recommend: 99, duration: "3–4 hours", durationHours: 3.5,
    price: 18, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["evening"], categories: ["food", "culture"],
    images: gallery(["amok", "lokLak", "noodles", "amokTrey", "skyline"]),
  },

  /* --------------------------- Phnom Penh --------------------------- */
  {
    id: "pp1", province: "Phnom Penh", title: "Phnom Penh City Highlights Tour — Royal Palace & Silver Pagoda",
    rating: 4.8, reviews: 1240, recommend: 97, duration: "4–5 hours", durationHours: 4.5,
    price: 18, awardTier: "choice", featured: true, freeCancel: true,
    languages: ["English", "Khmer", "French"], timeOfDay: ["morning", "afternoon"], categories: ["culture", "temples"],
    images: gallery(["palace", "skyline", "street", "amok", "bbq"]),
  },
  {
    id: "pp2", province: "Phnom Penh", title: "Khmer Rouge History & Tuol Sleng Museum Tour",
    rating: 4.7, reviews: 890, recommend: 95, duration: "4–5 hours", durationHours: 4.5,
    price: 15, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "French"], timeOfDay: ["morning", "afternoon"], categories: ["culture"],
    images: gallery(["skyline", "palace", "street", "bbq", "amok"]),
  },
  {
    id: "pp3", province: "Phnom Penh", title: "Phnom Penh Street Food & Riverside Night Tour",
    rating: 4.9, reviews: 640, recommend: 98, duration: "3 hours", durationHours: 3,
    price: 12, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["evening"], categories: ["food", "culture"],
    images: gallery(["street", "bbq", "amok", "lokLak", "skyline"]),
  },

  /* ----------------------------- Kampot ----------------------------- */
  {
    id: "kp1", province: "Kampot", title: "Kampot Pepper Farm & Cave Temple Tour",
    rating: 4.8, reviews: 520, recommend: 97, duration: "4–6 hours", durationHours: 5,
    price: 20, awardTier: "choice", featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["morning", "afternoon"], categories: ["nature", "culture", "food"],
    images: gallery(["kampot", "kbalSpean", "banteaySrei", "palmPool", "amok"]),
  },
  {
    id: "kp2", province: "Kampot", title: "Kampot Riverside Sunset & Firefly Cruise",
    rating: 4.6, reviews: 380, recommend: 94, duration: "2–3 hours", durationHours: 2.5,
    price: 10, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer", "Chinese"], timeOfDay: ["evening"], categories: ["sunset", "nature"],
    images: gallery(["kampot", "kompongPhluk", "palmPool", "skyline", "beach"]),
  },

  /* ------------------------------ Kep ------------------------------- */
  {
    id: "kp3", province: "Kep", title: "Kep Crab Market & Kampot Pepper Day Trip",
    rating: 4.7, reviews: 460, recommend: 96, duration: "8–9 hours", durationHours: 8.5,
    price: 35, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["full-day"], categories: ["food", "nature"],
    images: gallery(["kep", "amok", "lokLak", "kampot", "beach"]),
  },

  /* ------------------------ Preah Sihanouk -------------------------- */
  {
    id: "sh1", province: "Preah Sihanouk", title: "Koh Rong Island Day Trip from Sihanoukville",
    rating: 4.8, reviews: 1520, recommend: 98, duration: "Full day", durationHours: 9,
    price: 45, awardTier: "winner", featured: false, freeCancel: true,
    languages: ["English", "Khmer", "Chinese"], timeOfDay: ["full-day"], categories: ["nature"],
    images: gallery(["kohRong", "beach", "palmPool", "kompongPhluk", "skyline"]),
  },
  {
    id: "sh2", province: "Preah Sihanouk", title: "Sihanoukville Beach & Sunset Sand Casino Tour",
    rating: 4.5, reviews: 210, recommend: 92, duration: "4 hours", durationHours: 4,
    price: 14, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["afternoon", "evening"], categories: ["sunset", "nature"],
    images: gallery(["beach", "kohRong", "palmPool", "skyline", "kampot"]),
  },

  /* --------------------------- Battambang --------------------------- */
  {
    id: "bb1", province: "Battambang", title: "Battambang Bamboo Train & Farmhouse Lunch Tour",
    rating: 4.7, reviews: 640, recommend: 96, duration: "4–5 hours", durationHours: 4.5,
    price: 16, awardTier: "choice", featured: false, freeCancel: true,
    languages: ["English", "Khmer", "French"], timeOfDay: ["morning", "afternoon"], categories: ["culture", "nature"],
    images: gallery(["bamboo", "banteaySrei", "palace", "street", "amok"]),
  },
  {
    id: "bb2", province: "Battambang", title: "Battambang Cave Temples & Sunset Vulture Viewing",
    rating: 4.6, reviews: 300, recommend: 93, duration: "Full day", durationHours: 10,
    price: 28, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["full-day", "evening"], categories: ["nature", "temples", "sunset"],
    images: gallery(["bamboo", "kbalSpean", "banteaySrei", "palmPool", "beach"]),
  },

  /* -------------------------- Mondulkiri ---------------------------- */
  {
    id: "md1", province: "Mondulkiri", title: "Mondulkiri Elephant Sanctuary & Waterfall Trek",
    rating: 4.9, reviews: 720, recommend: 99, duration: "2 days", durationHours: 16,
    price: 85, awardTier: "winner", featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["full-day"], categories: ["nature"],
    images: gallery(["elephant", "kbalSpean", "banteaySrei", "palmPool", "kohRong"]),
  },
  {
    id: "md2", province: "Mondulkiri", title: "Mondulkiri Hill Tribe Villages & Sunrise Viewpoint",
    rating: 4.7, reviews: 260, recommend: 95, duration: "Full day", durationHours: 9,
    price: 40, awardTier: null, featured: false, freeCancel: true,
    languages: ["English", "Khmer"], timeOfDay: ["morning", "full-day"], categories: ["culture", "nature", "photography"],
    images: gallery(["elephant", "banteaySrei", "kbalSpean", "skyline", "beach"]),
  },
];

/* ------------------------------------------------------------------ */
/* Decoration                                                           */
/* ------------------------------------------------------------------ */

function priceBand(p) {
  if (p == null) return null;
  if (p < 25) return "under25";
  if (p < 50) return "25to50";
  if (p < 100) return "50to100";
  return "100plus";
}

// Backend place categories (Temple, Beach, Heritage, Nature, City, Mountain)
// map onto our filter keys so real-data category filters keep working.
const CATEGORY_KEYS_FROM_NAME = {
  temple: ["temples"],
  beach: ["nature"],
  heritage: ["culture", "temples"],
  nature: ["nature"],
  city: ["culture"],
  mountain: ["nature"],
};

export function decorateTour(a) {
  const province = a.province || "Siem Reap";
  const namedCats = Array.isArray(a.categories) && a.categories.length
    ? a.categories
    : CATEGORY_KEYS_FROM_NAME[String(a.category || "").toLowerCase()] || [];
  return {
    ...a,
    province,
    categories: namedCats,
    categoryLabel: a.categoryLabel || a.category || null,
    priceBand: a.priceBand || priceBand(a.price),
    location: a.location || provinceLabel(province) || province,
    href: a.href || `/tours/${a.id}`,
  };
}

export function decorateTours(list) {
  return (list || []).map(decorateTour);
}

// Provinces that actually have activities, Siem Reap first, plus an "All" entry.
// Accepts any decorated list so real backend data drives the dropdown too.
export function getLocationOptions(list = demoTours) {
  const seen = new Set();
  const keys = [];
  for (const a of list || []) {
    const p = a.province || "Siem Reap";
    if (!seen.has(p)) {
      seen.add(p);
      keys.push(p);
    }
  }
  keys.sort((x, y) => (x === "Siem Reap" ? -1 : y === "Siem Reap" ? 1 : (provinceLabel(x) || x).localeCompare(provinceLabel(y) || y)));
  return [
    ...keys.map((k) => ({ key: k, label: provinceLabel(k) || k })),
    { key: "", label: "All Cambodia" },
  ];
}

/* ------------------------------------------------------------------ */
/* Filtering + sorting (pure)                                          */
/* ------------------------------------------------------------------ */

const anyOverlap = (selected, values) =>
  selected.length === 0 || selected.some((v) => values.includes(v));

export function applyTourFilters(list, f) {
  return list.filter((a) => {
    if (f.location && a.province !== f.location) return false;
    if (f.awards.length) {
      const wantsAll = f.awards.includes("all");
      const ok =
        (wantsAll && a.awardTier != null) ||
        f.awards.includes(a.awardTier || "");
      if (!ok) return false;
    }
    if (!anyOverlap(f.languages, a.languages || [])) return false;
    if (!anyOverlap(f.timeOfDay, a.timeOfDay || [])) return false;
    if (f.price.length && !f.price.includes(a.priceBand)) return false;
    if (!anyOverlap(f.categories, a.categories || [])) return false;
    if (f.freeCancel && !a.freeCancel) return false;
    return true;
  });
}

export function sortTours(list, sortKey) {
  const arr = [...list];
  switch (sortKey) {
    case "top-rated":
      return arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "most-reviewed":
      return arr.sort((a, b) => b.reviews - a.reviews);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "featured":
    default:
      return arr.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0)
      );
  }
}

// Shows a believable marketplace total when nothing is filtered; once narrowed,
// (or when the total is provided, e.g. real backend lists) show the real count.
export function resultsCountLabel(shown, { filtered, total }) {
  const n = filtered ? shown : total ?? 2637;
  return `${n.toLocaleString("en-US")} results`;
}

/* ================================================================== */
/* ACTIVITY DETAIL builder (mirrors data/hotelDetail.js)              */
/* ================================================================== */

function hashId(id) {
  const s = String(id);
  let h = 5;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const REVIEW_AUTHORS = [
  "Sarah M", "Vichea P", "Thomas B", "Linda K", "Dara C",
  "Yuki T", "Marco R", "Chenda N", "Emma W", "Sok D",
];
const REVIEW_SNIPPETS = [
  "Absolutely magical — our guide brought the temples to life and timed everything to beat the crowds and heat. Booked the sunrise slot and it was worth the early start.",
  "Seamless from pickup to drop-off. Small group, an air-conditioned car, and plenty of time at each stop without feeling rushed. Highly recommend.",
  "The best experience of our whole trip. Photos everywhere, knowledgeable English-speaking guide, and great value for money in Siem Reap.",
  "Well organised and genuinely enjoyable. Bottled water included, flexible pace, and our guide knew all the quiet corners away from the tour buses.",
  "A perfect introduction to Khmer history and culture. Friendly driver, comfortable vehicle, and stunning light for photography at every temple.",
  "Exceeded expectations. The itinerary flowed beautifully and the sunset view was unforgettable. Would book again with this operator.",
];

function buildReviews(h) {
  const count = 4 + (h % 3);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: i + 1,
      author: REVIEW_AUTHORS[(h + i * 3) % REVIEW_AUTHORS.length],
      date: `${MONTHS[(h + i * 2) % 12]} 2026`,
      rating: i % 5 === 4 ? 4 : 5,
      text: REVIEW_SNIPPETS[(h + i) % REVIEW_SNIPPETS.length],
    });
  }
  return out;
}

const RATING_CATEGORIES = ["Value", "Guide", "Organisation", "Fun"];
function buildRatingBreakdown(rating, h) {
  return RATING_CATEGORIES.map((label, i) => {
    const bump = ((h + i * 5) % 3) / 10 - 0.05;
    return { label, score: Math.min(5, Math.max(4, Number((rating + bump).toFixed(1)))) };
  });
}

const SIGHTS = {
  temples: ["Angkor Wat", "Ta Prohm (the 'Tomb Raider' temple)", "the Bayon faces", "the South Gate of Angkor Thom"],
  nature: ["Kbal Spean's carved riverbed", "a jungle waterfall", "the countryside by tuk-tuk"],
  food: ["a bustling local market", "Khmer street-food stalls", "a family-run kitchen"],
  culture: ["a floating village on Tonlé Sap", "local artisan workshops", "lakeside stilted homes"],
  sunset: ["the golden hour over the towers", "a serene reservoir viewpoint"],
  photography: ["the best photo spots and light", "hidden corners away from the crowds"],
};

function primaryCategory(a) {
  const order = ["temples", "nature", "food", "culture", "sunset", "photography"];
  return (a.categories || []).find((c) => order.includes(c)) || "temples";
}

function buildHighlights(a) {
  const cat = primaryCategory(a);
  const sights = SIGHTS[cat] || SIGHTS.temples;
  const privateOrSmall = /private/i.test(a.title) ? "private tour — just your party" : "small group — maximum 8 travelers";
  return [
    `Explore ${sights[0]} and ${sights[1]} with an expert local guide`,
    `Skip-the-line entry and ${a.freeCancel ? "flexible, fully refundable" : "well-planned"} booking`,
    `Hotel pickup and drop-off in ${a.location || "Siem Reap"} in air-conditioned transport`,
    `Enjoy a ${privateOrSmall} at a relaxed, photo-friendly pace`,
    `Bottled water, all entrance logistics and a licensed English-speaking guide included`,
  ];
}

function buildItinerary(a) {
  const cat = primaryCategory(a);
  const city = a.location || "Siem Reap";
  const multi = /day|2 days/i.test(a.duration);
  const base = {
    temples: [
      `Morning hotel pickup in ${city} (around 7:30 AM) with a welcome briefing`,
      "Angkor Wat — wander the iconic temple and its intricate bas-reliefs",
      "Ta Prohm — the atmospheric jungle temple wrapped in tree roots",
      "Lunch at a local restaurant (on your own unless specified)",
      "Bayon Temple and the ancient gates of Angkor Thom",
      "Golden-hour viewpoint, then comfortable return transfer to your hotel",
    ],
    nature: [
      "Hotel pickup and a scenic drive into the Cambodian countryside",
      "Kbal Spean — walk the jungle trail to the carved riverbed",
      "Cool off at a waterfall and enjoy a picnic-style lunch",
      "Optional ox-cart or tuk-tuk ride through rice paddies",
      `Return to ${city} in the late afternoon`,
    ],
    food: [
      "Meet your foodie guide in the Old Market area at golden hour",
      "Taste your way through market stalls and family kitchens",
      "Learn the stories behind iconic Khmer dishes",
      "Finish with a Khmer dessert and a stroll through the night market",
    ],
    culture: [
      `Depart ${city} by boat or car toward the waterways`,
      "Glide through flooded forest and stilted village lanes",
      "Meet local families and learn about life on the water",
      "Return as the light fades over the lake",
    ],
    sunset: [
      "Afternoon pickup and transfer to a scenic lakeside or temple viewpoint",
      "Settle in with a drink as the sun drops behind the towers",
      "Guided photo session during the golden hour",
      "Return transfer to your hotel after dark",
    ],
    photography: [
      "Pre-dawn pickup to reach the temple before the crowds",
      "Capture the famous sunrise reflection over the lotus pond",
      "Move through quiet galleries as the light softens",
      "Optional portrait stops with your guide's tips",
    ],
  };
  const steps = base[cat] || base.temples;
  if (multi) return [...steps, "Day 2 — repeat highlights at a slower pace with an overnight break and breakfast included"];
  return steps;
}

function buildIncludes(a) {
  const city = a.location || "Siem Reap";
  const inc = ["Licensed English-speaking guide", `Hotel pickup and drop-off (${city} city center)`, "Air-conditioned transport & bottled water", "All entrance-fee logistics and itinerary planning"];
  if (/lunch/i.test(a.title)) inc.push("Lunch at a local restaurant");
  return inc;
}

function buildExcludes(a) {
  const exc = ["Gratuities (optional)", "Personal expenses & souvenirs"];
  if (!/lunch/i.test(a.title)) exc.push("Lunch & drinks unless specified");
  return exc;
}

function buildDescription(a) {
  const cat = primaryCategory(a);
  const flavor = {
    temples: "ancient Khmer temples",
    nature: "lush jungle and waterfalls",
    food: "the flavours of Cambodian street food",
    culture: "everyday life on the water",
    sunset: "unforgettable golden-hour views",
    photography: "camera-perfect light and quiet corners",
  }[cat];
  return `Discover ${a.title.toLowerCase()} — a hand-crafted way to experience ${flavor} around ${a.location || "Siem Reap"}. Your friendly local guide shapes the day around the best light, the calmest moments and the stories that bring each stop to life, while private, air-conditioned transport and hotel pickup take care of every practical detail. With generous time for photos, a relaxed small-group pace and all the logistics handled in advance, this is the most rewarding way to see the very best of ${a.location || "Siem Reap"} in a single ${a.duration}.`;
}

export function buildActivityDetail(a) {
  if (!a) return null;
  const h = hashId(a.id);
  const rating = a.rating ?? 4.8;
  const galleryImages = (a.images || []).map((url, i) => ({
    url,
    category: ["Experience", "Sights", "Guide", "Group", "Views"][i % 5],
  }));

  return {
    ...a,
    location: a.location || "Siem Reap",
    country: "Cambodia",
    galleryImages,
    highlights: a.highlights || buildHighlights(a),
    itinerary: a.itinerary || buildItinerary(a),
    includes: a.includes || buildIncludes(a),
    excludes: a.excludes || buildExcludes(a),
    longDescription: a.longDescription || buildDescription(a),
    reviewsList: a.reviewsList || buildReviews(h),
    ratingBreakdown: a.ratingBreakdown || buildRatingBreakdown(rating, h),
    groupSize: a.groupSize || (/private/i.test(a.title) ? "Private · up to your party size" : "Small group · max 8"),
    meetingPoint: a.meetingPoint || "Your hotel in Siem Reap city center (exact pickup time confirmed after booking)",
    languagesSpoken: a.languages || ["English"],
    cancellation: a.freeCancel ? "Free cancellation up to 24 hours before the experience starts" : "Non-refundable",
    instantConfirm: true,
  };
}

export function getActivitiesForSimilar(id, count = 3, list = demoTours) {
  const decorated = decorateTours(list);
  const current = decorated.find((x) => String(x.id) === String(id));
  if (!current) return decorated.slice(0, count);
  const others = decorated.filter((x) => String(x.id) !== String(id));
  const sameProvince = others.filter((x) => x.province === current.province);
  const sameCategory = others.filter(
    (x) => x.province !== current.province && (x.categories || []).some((c) => (current.categories || []).includes(c))
  );
  const rest = others.filter((x) => !sameProvince.includes(x) && !sameCategory.includes(x));
  return [...sameProvince, ...sameCategory, ...rest].slice(0, count);
}
