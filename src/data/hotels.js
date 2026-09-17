// Hotels listing data layer.
//
// The UI never talks to raw mock objects: `decorateHotels()` takes any
// normalized hotel card (from repository.getHotels() → GET /api/hotels) and
// fills in listing metadata (stars, reviews, amenities, deals, awards,
// property type). When the Spring Boot backend starts returning those fields,
// the decorator simply passes them through — the components won't change.
//
// `applyHotelFilters` + `sortHotels` are pure and mirror the future query
// params: ?destination=&minRating=&stars=&maxPrice=&amenities=&sort=

import { img } from "./site";
import { toNumber } from "../lib/format";

/* ------------------------------------------------------------------ */
/* Constants (shared by sidebar, chips, sort dropdown)                 */
/* ------------------------------------------------------------------ */

export const AMENITY_ICONS = {
  "Free parking": "car",
  Pool: "waves",
  Restaurant: "utensils",
  WiFi: "wifi",
  "Air conditioning": "wind",
  "Fitness center": "dumbbell",
  "Bar/Lounge": "wine",
  Spa: "sparkles",
  "Pets allowed": "paw-print",
  Beachfront: "waves",
};

export const ALL_AMENITIES = Object.keys(AMENITY_ICONS);

export const PROPERTY_TYPES = [
  { key: "hotels", label: "Hotels", icon: "bed-double" },
  { key: "bb", label: "B&Bs & Inns", icon: "house" },
  { key: "hostels", label: "Hostels", icon: "users" },
  { key: "specialty", label: "Specialty lodgings", icon: "tent" },
];

export const SORT_OPTIONS = [
  { key: "best-value", label: "Best Value" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Rating" },
  { key: "reviews", label: "Most Reviewed" },
];

export const emptyFilters = () => ({
  destination: "",
  pets: false,
  fiveStar: false,
  rating4: false,
  luxury: false,
  refundable: false,
  noPrepay: false,
  offers: false,
  bestOfBest: false,
  travelersChoice: false,
  types: [], // subset of PROPERTY_TYPES keys
  amenities: [], // subset of ALL_AMENITIES
  maxPrice: null, // number | null
});

export function countActiveFilters(f) {
  let n = 0;
  if (f.pets) n++;
  if (f.fiveStar) n++;
  if (f.rating4) n++;
  if (f.luxury) n++;
  if (f.refundable) n++;
  if (f.noPrepay) n++;
  if (f.offers) n++;
  if (f.bestOfBest) n++;
  if (f.travelersChoice) n++;
  n += f.types.length + f.amenities.length;
  if (f.maxPrice != null) n++;
  return n;
}

/* ------------------------------------------------------------------ */
/* Deterministic decoration                                            */
/* ------------------------------------------------------------------ */

function hashId(id) {
  const s = String(id);
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const TYPE_BY_HASH = ["hotels", "hotels", "hotels", "bb", "specialty", "hotels", "bb", "hostels"];

// Pick `count` amenities from the pool starting at an offset — stable per id.
function pickAmenities(h, count) {
  const pool = ALL_AMENITIES;
  const out = [];
  for (let i = 0; i < count; i++) out.push(pool[(h + i * 3) % pool.length]);
  if (!out.includes("WiFi")) out[0] = "WiFi";
  return [...new Set(out)];
}

export function decorateHotel(card) {
  const h = hashId(card.id);
  const rating = toNumber(card.rating) ?? 4 + ((h % 10) / 10 > 0.9 ? 0.9 : (h % 10) / 10);
  const stars = rating >= 4.7 ? 5 : rating >= 4.2 ? 4 : 3;
  const price = toNumber(card.price);
  const amenities = card.amenities?.length ? card.amenities : pickAmenities(h, 3 + (h % 3));
  const typeKey =
    PROPERTY_TYPES.some((t) => t.key === card.propertyType) ? card.propertyType : TYPE_BY_HASH[h % TYPE_BY_HASH.length];
  const refundable = card.refundable ?? h % 3 !== 0;
  return {
    ...card,
    href: `/hotels/${card.id}`,
    rating: Number(rating.toFixed(1)),
    stars,
    reviews: card.reviews ?? 120 + ((h * 37) % 2800),
    amenities,
    petsAllowed: amenities.includes("Pets allowed"),
    breakfastIncluded: card.breakfastIncluded ?? h % 2 === 1,
    refundable,
    noPrepay: card.noPrepay ?? (refundable && h % 4 !== 0),
    specialOffer: card.specialOffer ?? h % 5 === 0,
    travelersChoice: card.travelersChoice ?? (rating >= 4.6 && h % 3 !== 2),
    bestOfBest: card.bestOfBest ?? (rating >= 4.8 && h % 4 === 1),
    propertyType: typeKey,
    luxury: card.luxury ?? (stars === 5 && (price == null || price >= 80)),
    bestValue: card.bestValue ?? (price != null && price <= 90 && rating >= 4.5 && h % 2 === 0),
  };
}

export function decorateHotels(list) {
  return (list || []).map(decorateHotel);
}

/* ------------------------------------------------------------------ */
/* Demo enrichment — used ONLY when the repository is in demo mode,    */
/* so the listing feels like a real marketplace before the DB is seeded*/
/* ------------------------------------------------------------------ */

export const demoExtraHotels = [
  { id: "hx1", kind: "hotel", title: "Palace Gate Hotel & Residence", subtitle: "Phnom Penh", description: "Central riverside residence with rooftop pool and easy access to the Royal Palace.", image: img("Skyline of Phnom Penh.jpg", 900), images: [img("Skyline of Phnom Penh.jpg", 1200)], location: "Phnom Penh", badge: "Best Value", badgeTone: "gold", rating: 4.8, price: 46, priceUnit: "/night", href: "/hotels/hx1" },
  { id: "hx2", kind: "hotel", title: "The Peninsula Phnom Penh", subtitle: "Phnom Penh", description: "Landmark luxury tower above the riverside promenade, with a infinity pool and spa.", image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 900), images: [img("Royal Palace, Phnom Penh Cambodia 1.jpg", 1200)], location: "Phnom Penh", badge: "Luxury", badgeTone: "green", rating: 4.9, price: 141, priceUnit: "/night", href: "/hotels/hx2" },
  { id: "hx3", kind: "hotel", title: "Angkor Village Hotel", subtitle: "Siem Reap", description: "Colonial-style cottages around a palm garden, minutes from the Old Market.", image: img("Ta_Prohm.jpg", 900), images: [img("Ta_Prohm.jpg", 1200)], location: "Siem Reap", badge: "Travelers' Choice", badgeTone: "green", rating: 4.7, price: 68, priceUnit: "/night", href: "/hotels/hx3" },
  { id: "hx4", kind: "hotel", title: "Sorailey Boutique Residence", subtitle: "Siem Reap", description: "Quiet Khmer-modern residence with a rooftop bar watching over the temple town.", image: img("Bayon temple 02.jpg", 900), images: [img("Bayon temple 02.jpg", 1200)], location: "Siem Reap", badge: null, badgeTone: "green", rating: 4.5, price: 52, priceUnit: "/night", href: "/hotels/hx4" },
  { id: "hx5", kind: "hotel", title: "Serendip Beach Resort", subtitle: "Sihanoukville", description: "Sands-side resort with lagoon pool and a short stroll to Serendipity's night market.", image: img("Sihanoukville - Prek Treng beach.jpg", 900), images: [img("Sihanoukville - Prek Treng beach.jpg", 1200)], location: "Sihanoukville", badge: "Popular", badgeTone: "green", rating: 4.4, price: 74, priceUnit: "/night", href: "/hotels/hx5" },
  { id: "hx6", kind: "hotel", title: "Kampot River Residence", subtitle: "Kampot", description: "Colonial villa on the river with a pool deck facing the French quarter.", image: img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 900), images: [img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 1200)], location: "Kampot", badge: null, badgeTone: "green", rating: 4.6, price: 58, priceUnit: "/night", href: "/hotels/hx6" },
  { id: "hx7", kind: "hotel", title: "Coco Guesthouse Kep", subtitle: "Kep", description: "Sunny garden guesthouse a bicycle ride from the crab market and beach.", image: img("06-Kep Crab Market Cambodia-nX-7.jpg", 900), images: [img("06-Kep Crab Market Cambodia-nX-7.jpg", 1200)], location: "Kep", badge: null, badgeTone: "green", rating: 4.3, price: 28, priceUnit: "/night", href: "/hotels/hx7" },
  { id: "hx8", kind: "hotel", title: "Shinta Mani Secret Garden", subtitle: "Siem Reap", description: "Boutique hideaway with a lap pool, library lounge and Khmer courtyard.", image: img("Palm Paradise Pool.jpg", 900), images: [img("Palm Paradise Pool.jpg", 1200)], location: "Siem Reap", badge: "Luxury", badgeTone: "green", rating: 4.8, price: 96, priceUnit: "/night", href: "/hotels/hx8" },
  { id: "hx9", kind: "hotel", title: "Mondulkiri Jungle Lodge", subtitle: "Mondulkiri", description: "Timber bungalows above the misty highlands, gateway to elephant valleys.", image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 900), images: [img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 1200)], location: "Mondulkiri", badge: null, badgeTone: "green", rating: 4.5, price: 39, priceUnit: "/night", href: "/hotels/hx9" },
  { id: "hx10", kind: "hotel", title: "Battambang Villa Nat", subtitle: "Battambang", description: "Heritage guest villa with a garden pool near the arts quarter and bamboo train.", image: img("Bamboo train Battambang.jpg", 900), images: [img("Bamboo train Battambang.jpg", 1200)], location: "Battambang", badge: null, badgeTone: "green", rating: 4.4, price: 33, priceUnit: "/night", href: "/hotels/hx10" },
];

/* ------------------------------------------------------------------ */
/* Filtering + sorting (pure — mirror future /api/hotels?params)       */
/* ------------------------------------------------------------------ */

export function applyHotelFilters(hotels, filters) {
  const q = filters.destination.trim().toLowerCase();
  return hotels.filter((h) => {
    if (q) {
      const hay = [h.title, h.location, h.province, h.subtitle].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.pets && !h.petsAllowed) return false;
    if (filters.fiveStar && h.stars < 5) return false;
    if (filters.rating4 && h.rating < 4) return false;
    if (filters.luxury && !h.luxury) return false;
    if (filters.refundable && !h.refundable) return false;
    if (filters.noPrepay && !h.noPrepay) return false;
    if (filters.offers && !h.specialOffer) return false;
    if (filters.bestOfBest && !h.bestOfBest) return false;
    if (filters.travelersChoice && !h.travelersChoice) return false;
    if (filters.types.length && !filters.types.includes(h.propertyType)) return false;
    if (filters.amenities.length && !filters.amenities.every((a) => h.amenities.includes(a))) return false;
    if (filters.maxPrice != null && h.price != null && h.price > filters.maxPrice) return false;
    return true;
  });
}

export function sortHotels(hotels, sortKey) {
  const list = [...hotels];
  const price = (h) => h.price ?? Number.POSITIVE_INFINITY;
  switch (sortKey) {
    case "price-asc":
      return list.sort((a, b) => price(a) - price(b));
    case "price-desc":
      return list.sort((a, b) => price(b) - price(a));
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || a.price - b.price);
    case "reviews":
      return list.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    case "best-value":
    default: {
      // value score ≈ rating × log(reviews) ÷ price
      const score = (h) => (h.rating * Math.log10(10 + (h.reviews ?? 0))) / (price(h) || 60);
      return list.sort((a, b) => score(b) - score(a));
    }
  }
}

// "3,000" style count label; demo mode shows a believable marketplace size.
export function resultsCountLabel(shown, total, source) {
  const n = source === "api" ? shown : Math.max(shown, 1) * 27 + 412;
  return `${n.toLocaleString("en-US")} properties`;
}
