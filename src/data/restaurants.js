// Restaurant discovery / search-results data layer for SovannDomNour.
//
// Mirrors the shape of data/hotels.js: pure helpers (emptyFilters,
// countActiveFilters, applyRestaurantFilters, sortRestaurants,
// decorateRestaurants, resultsCountLabel) plus a curated demo dataset so the
// listing behaves like a real marketplace without a backend.
//
// Restaurants span every major Cambodian province (not just Siem Reap); a
// `province` field drives the location selector + sidebar filter, and each
// restaurant carries a mock `marker` {x,y} placed to reflect Cambodia's
// geography on the illustrative map.
//
// Images reuse the verified Wikimedia Commons food/restaurant photos already
// used elsewhere in the app (via site.js `img()`), so nothing 404s.

import { img } from "./site";

/* ------------------------------------------------------------------ */
/* Shared image pool (verified Cambodia food / dining photography)     */
/* ------------------------------------------------------------------ */

const FOOD = {
  amok: img("Amok trey.jpg", 1000),
  fishAmok: img("Fish Amok.jpg", 1000),
  fishAmokRice: img("Fish Amok with Rice.jpg", 1000),
  lokLak: img("Beef Lok Lak.jpg", 1000),
  noodles: img("Num Banh Chok Somlar Kari.jpg", 1000),
  bbq: img("Kabobs at Phnom Penh Night Market.jpg", 1000),
  street: img("Street food vendor in Phnom Pehn.jpg", 1000),
  dessert: img("Chek ktis.jpg", 1000),
  crab: img("06-Kep Crab Market Cambodia-nX-7.jpg", 1000),
};

// Build a 5-image carousel from the pool starting at an offset — stable & varied.
function gallery(offset) {
  const pool = [FOOD.amok, FOOD.fishAmok, FOOD.lokLak, FOOD.noodles, FOOD.bbq, FOOD.street, FOOD.fishAmokRice, FOOD.crab, FOOD.dessert];
  return Array.from({ length: 5 }, (_, i) => pool[(offset + i) % pool.length]);
}

/* ------------------------------------------------------------------ */
/* Provinces (location selector + sidebar filter)                      */
/* ------------------------------------------------------------------ */

// key = the province name stored on each restaurant; label = display text.
export const PROVINCES = [
  { key: "Phnom Penh", label: "Phnom Penh" },
  { key: "Siem Reap", label: "Siem Reap" },
  { key: "Battambang", label: "Battambang" },
  { key: "Kampong Cham", label: "Kampong Cham" },
  { key: "Kampot", label: "Kampot" },
  { key: "Kep", label: "Kep" },
  { key: "Preah Sihanouk", label: "Sihanoukville" },
  { key: "Koh Kong", label: "Koh Kong" },
  { key: "Mondulkiri", label: "Mondulkiri" },
  { key: "Ratanakiri", label: "Ratanakiri" },
];

// Rough centroid of each province on the stylised Cambodia map (percentages).
export const PROVINCE_POINTS = {
  "Phnom Penh": { x: 47, y: 60 },
  "Siem Reap": { x: 33, y: 30 },
  Battambang: { x: 20, y: 42 },
  "Kampong Cham": { x: 60, y: 54 },
  Kampot: { x: 41, y: 80 },
  Kep: { x: 49, y: 87 },
  "Preah Sihanouk": { x: 28, y: 82 },
  "Koh Kong": { x: 15, y: 84 },
  Mondulkiri: { x: 80, y: 46 },
  Ratanakiri: { x: 84, y: 24 },
};

export const provinceLabel = (key) => PROVINCES.find((p) => p.key === key)?.label || key;

/* ------------------------------------------------------------------ */
/* Filter option constants (single source of truth for sidebar/chips)  */
/* ------------------------------------------------------------------ */

export const ESTABLISHMENT_TYPES = [
  { key: "restaurant", label: "Restaurants", icon: "utensils" },
  { key: "cafe", label: "Coffee & Tea", icon: "coffee" },
  { key: "bar", label: "Bars & Pubs", icon: "wine" },
  { key: "dessert", label: "Dessert", icon: "sparkles" },
];
// Revealed by "Show more".
export const MORE_ESTABLISHMENT_TYPES = [
  { key: "fastfood", label: "Fast Food", icon: "utensils_crossed" },
  { key: "bakery", label: "Bakery", icon: "coffee" },
  { key: "buffet", label: "Buffet", icon: "utensils" },
  { key: "family", label: "Family Restaurants", icon: "users" },
];

export const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast" },
  { key: "brunch", label: "Brunch" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

export const CUISINES = [
  { key: "Asian", label: "Asian" },
  { key: "Cambodian", label: "Cambodian" },
  { key: "Cafe", label: "Cafe" },
  { key: "European", label: "European" },
];
export const MORE_CUISINES = [
  { key: "French", label: "French" },
  { key: "International", label: "International" },
  { key: "Italian", label: "Italian" },
  { key: "Japanese", label: "Japanese" },
  { key: "Seafood", label: "Seafood" },
  { key: "Street Food", label: "Street Food" },
  { key: "Thai", label: "Thai" },
  { key: "Vegan", label: "Vegan" },
  { key: "Western", label: "Western" },
  { key: "Bar & Grill", label: "Bar & Grill" },
];

export const DISHES = [
  { key: "Chicken dishes", label: "Chicken dishes" },
  { key: "Fish", label: "Fish" },
  { key: "Salad", label: "Salad" },
  { key: "Rice dishes", label: "Rice dishes" },
];
export const MORE_DISHES = [
  { key: "Beef", label: "Beef" },
  { key: "Noodles", label: "Noodles" },
  { key: "Soup", label: "Soup" },
  { key: "Vegetables", label: "Vegetables" },
  { key: "Seafood", label: "Seafood" },
  { key: "Barbecue", label: "Barbecue" },
  { key: "Curry", label: "Curry" },
  { key: "Dessert", label: "Dessert" },
];

export const AWARDS = [
  { key: "best", label: "Travelers' Choice Best of the Best", icon: "award" },
  { key: "choice", label: "Travelers' Choice", icon: "badge-check" },
];

export const PRICE_TIERS = [
  { key: "cheap", label: "Cheap Eats", rank: 1 },
  { key: "mid", label: "Mid-range", rank: 2 },
  { key: "fine", label: "Fine Dining", rank: 4 },
];

export const ONLINE_OPTIONS = [
  { key: "reservations", label: "Online Reservations" },
  { key: "offers", label: "Special Offers" },
];

export const TRAVELER_RATINGS = [
  { key: "4", label: "4 & up", min: 4 },
  { key: "45", label: "4.5 & up", min: 4.5 },
];

export const DISTANCE_OPTIONS = [
  { key: "1", label: "Less than 1 km", km: 1 },
  { key: "3", label: "Less than 3 km", km: 3 },
  { key: "5", label: "Less than 5 km", km: 5 },
];

export const DIETARY_OPTIONS = [
  { key: "Vegetarian friendly", label: "Vegetarian friendly" },
  { key: "Vegan options", label: "Vegan options" },
  { key: "Gluten free", label: "Gluten free" },
];

export const FEATURES = [
  { key: "Outdoor seating", label: "Outdoor seating", icon: "sun" },
  { key: "Free Wi-Fi", label: "Free Wi-Fi", icon: "wifi" },
  { key: "Parking", label: "Parking", icon: "car" },
  { key: "Delivery", label: "Delivery", icon: "utensils_crossed" },
];

export const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "rating", label: "Traveler rating" },
  { key: "reviews", label: "Most reviewed" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "distance", label: "Distance" },
];

/* ------------------------------------------------------------------ */
/* Filter state                                                        */
/* ------------------------------------------------------------------ */

export const emptyFilters = () => ({
  search: "",
  province: "", // single selected province key ("" = all of Cambodia)
  establishments: [],
  meals: [],
  cuisines: [],
  dishes: [],
  awards: [],
  prices: [],
  online: [],
  rating: null, // number | null (min rating)
  distance: null, // number | null (max km)
  dietary: [],
  features: [],
});

export function countActiveFilters(f) {
  let n = 0;
  if (f.province) n++;
  n += f.establishments.length + f.meals.length + f.cuisines.length + f.dishes.length;
  n += f.awards.length + f.prices.length + f.online.length;
  n += f.dietary.length + f.features.length;
  if (f.rating != null) n++;
  if (f.distance != null) n++;
  return n;
}

/* ------------------------------------------------------------------ */
/* Demo dataset — restaurants across every major Cambodian province    */
/* ------------------------------------------------------------------ */

// status: "open" | "closing" | "closed"; closingMin used for "Closes in N min".
// rank is only set for the Siem Reap "Top 10" ordering; elsewhere null.
export const demoRestaurants = [
  /* ---------------------------- Siem Reap --------------------------- */
  {
    id: "rs-sokkhak", name: "Sokkhak River Lounge", rank: 22, rating: 4.9, reviews: 1259,
    province: "Siem Reap", cuisines: ["Asian", "Cambodian"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["brunch", "lunch", "dinner"], dishes: ["Fish", "Rice dishes", "Seafood"],
    award: "choice", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Vegan options", "Gluten free"], features: ["Outdoor seating", "Full Bar", "Free Wi-Fi", "Parking", "Reservations", "Takeout"],
    distanceKm: 0.4, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: [img("Palm Paradise Pool.jpg", 1400), img("Royal Palace, Phnom Penh Cambodia 1.jpg", 1200), img("Fish Amok.jpg", 1200), img("Beef Lok Lak.jpg", 1200)],
    excerpts: [
      "Stunning rooftop with sweeping **river sunset** views and immaculate service",
      "The **amok** and cocktail list are both outstanding — worth every riel",
    ],
    marker: { x: 33, y: 31 },
    // ---- detail-page fields consumed by data/restaurantDetail.js ----
    totalRestaurantsInCity: 1085,
    claimed: true,
    galleryMainLabel: "Restaurant",
    interiorCount: 284,
    foodCount: 559,
    menuCount: 37,
    payments: "Digital Payments, Accepts Credit Cards",
    parking: ["Free off-street parking", "Street Parking"],
    openLabel: "10:00 AM - 12:00 AM",
    phone: "+855 63 762 888",
    email: "hello@sokkhakriverlounge.kh",
    address:
      "Pokambor Avenue along Siem Reap river side, 10m before Preah Prum Rath pagoda, Siem Reap 17252 Cambodia",
    description:
      "Welcome to Sokkhak River Lounge! A family of Chanrey Tree Restaurant! This stunning, three-story building includes a café on the ground floor, an impressive wine bar on the middle level and the crown jewel — a lush, stylish and spacious rooftop cocktail bar with sweeping views of Siem Reap river, golden pagodas and Siem Reap town. It's a magical spot to sit and watch one of Cambodia's iconic sunsets with a cool drink in hand while a curated menu of refined Khmer and Asian cuisine arrives at your table. Whether you gather for a slow brunch in the leafy garden café, an elegant dinner beneath the string lights, or late-night cocktails as the skyline glows, the team pairs warm, unhurried hospitality with generous vegetarian, vegan and gluten-free options and seamless digital payment.",
  },
  {
    id: "rs1", name: "Old Maison Eatery", rank: null, rating: 5.0, reviews: 436,
    province: "Siem Reap", cuisines: ["International", "Asian"], priceLabel: "$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Salad", "Rice dishes"],
    award: "choice", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Outdoor seating", "Free Wi-Fi"],
    distanceKm: 0.6, sponsored: true, hasMenu: true, status: "closing", closingMin: 51,
    images: gallery(0), excerpts: [
      "The vegetable spring second and the green **mango salad** to die for would 100%...",
      "The **beef** sarauman was outstanding!",
    ],
    marker: { x: 31, y: 27 },
  },
  {
    id: "rs2", name: "The Labyrinth", rank: null, rating: 4.9, reviews: 50,
    province: "Siem Reap", cuisines: ["French", "Asian"], priceLabel: "$$$$", priceTier: "fine",
    establishment: "restaurant", meals: ["dinner"], dishes: ["Beef", "Salad"],
    award: "best", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Gluten free"], features: ["Free Wi-Fi"],
    distanceKm: 1.2, sponsored: true, hasMenu: true, status: "closing", closingMin: 21,
    images: gallery(3), excerpts: [
      "More Than Dinner- a truly **unique** experi...",
      "Good experience",
    ],
    marker: { x: 36, y: 33 },
  },
  {
    id: "rs3", name: "Mesa Restaurant - Pubstreet Siem Reap", rank: 1, rating: 4.9, reviews: 3135,
    province: "Siem Reap", cuisines: ["International", "Asian"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Salad", "Rice dishes", "Seafood"],
    award: "choice", onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly", "Vegan options", "Gluten free"], features: ["Outdoor seating", "Free Wi-Fi", "Delivery"],
    distanceKm: 0.3, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(1), excerpts: [
      "Fantastic restaurant, especially our beautiful waitress **Chili**, she is the best",
      "Highly recommend the fried **spring rolls**...",
    ],
    marker: { x: 30, y: 32 },
  },
  {
    id: "rs4", name: "Chanrey Tree", rank: 2, rating: 4.7, reviews: 5748,
    province: "Siem Reap", cuisines: ["Cambodian", "Asian"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Rice dishes", "Curry"],
    award: "choice", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Parking", "Free Wi-Fi"],
    distanceKm: 1.8, sponsored: false, hasMenu: true, status: "closing", closingMin: 51,
    images: gallery(4), excerpts: [
      "Garden setting under the trees, the **amok** is some of the best in town",
      "Warm service and generous **Khmer** flavours",
    ],
    marker: { x: 34, y: 24 },
  },
  {
    id: "rs5", name: "Malis Siem Reap", rank: 3, rating: 4.8, reviews: 4210,
    province: "Siem Reap", cuisines: ["Cambodian", "International"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["breakfast", "lunch", "dinner"], dishes: ["Fish", "Salad", "Rice dishes"],
    award: "best", onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly", "Vegan options", "Gluten free"], features: ["Outdoor seating", "Free Wi-Fi", "Parking"],
    distanceKm: 0.9, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(6), excerpts: [
      "Elegant colonial dining room and refined **modern Khmer** cuisine",
      "The tasting menu was a **highlight** of our trip",
    ],
    marker: { x: 28, y: 29 },
  },
  {
    id: "rs6", name: "Cuisine Wat Damnak", rank: 4, rating: 4.8, reviews: 1980,
    province: "Siem Reap", cuisines: ["French", "European", "International"], priceLabel: "$$$$", priceTier: "fine",
    establishment: "restaurant", meals: ["dinner"], dishes: ["Beef", "Seafood", "Salad"],
    award: "best", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Gluten free"], features: ["Free Wi-Fi"],
    distanceKm: 1.4, sponsored: false, hasMenu: true, status: "closed", closingMin: null,
    images: gallery(2), excerpts: [
      "A destination **set menu** that reimagines Cambodian ingredients",
      "Impeccable **wine pairing** and thoughtful courses",
    ],
    marker: { x: 37, y: 28 },
  },
  {
    id: "rs7", name: "Sugar Palm Cuisine Bar", rank: 5, rating: 4.6, reviews: 1450,
    province: "Siem Reap", cuisines: ["Cambodian", "Bar & Grill", "International"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "bar", meals: ["dinner"], dishes: ["Barbecue", "Seafood", "Chicken dishes"],
    award: "choice", onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Free Wi-Fi"],
    distanceKm: 0.5, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(7), excerpts: [
      "Lively **cocktail bar** with a killer grilled seafood platter",
      "Sunset **mocktails** by the pool are unforgettable",
    ],
    marker: { x: 32, y: 35 },
  },
  {
    id: "rs8", name: "Marum", rank: 6, rating: 4.5, reviews: 1120,
    province: "Siem Reap", cuisines: ["Cambodian", "International", "Vegan"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Salad", "Vegetables", "Curry"],
    award: null, onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Free Wi-Fi", "Delivery"],
    distanceKm: 0.8, sponsored: false, hasMenu: true, status: "closing", closingMin: 34,
    images: gallery(5), excerpts: [
      "Training-restaurant with a buzzing **vibe** and honest prices",
      "The **vegan** curry bowl surprised even our meat-loving table",
    ],
    marker: { x: 29, y: 25 },
  },

  /* --------------------------- Phnom Penh --------------------------- */
  {
    id: "pp1", name: "Romdeng", rank: 1, rating: 4.7, reviews: 2860,
    province: "Phnom Penh", cuisines: ["Cambodian", "Bar & Grill"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["dinner"], dishes: ["Barbecue", "Fish", "Rice dishes"],
    award: "choice", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Free Wi-Fi"],
    distanceKm: 1.1, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(2), excerpts: [
      "Jean-Michel Lorain's grill house — the **lokapil** sizzle is unforgettable",
      "Cosy courtyard and superb **Khmer** grilling",
    ],
    marker: { x: 46, y: 59 },
  },
  {
    id: "pp2", name: "Buddin Cafe", rank: 2, rating: 4.6, reviews: 980,
    province: "Phnom Penh", cuisines: ["Cafe", "Vegan", "Cambodian"], priceLabel: "$", priceTier: "cheap",
    establishment: "cafe", meals: ["breakfast", "brunch", "lunch"], dishes: ["Salad", "Vegetables", "Dessert"],
    award: null, onlineReservations: false, specialOffer: true,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Free Wi-Fi"],
    distanceKm: 0.7, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(8), excerpts: [
      "Serene **vegan** cafe with the calmest brunch in the city",
      "The **jackfruit** bowls and fresh juices are a must",
    ],
    marker: { x: 48, y: 61 },
  },
  {
    id: "pp3", name: "Namak", rank: 3, rating: 4.8, reviews: 1340,
    province: "Phnom Penh", cuisines: ["Cambodian", "International"], priceLabel: "$$$", priceTier: "mid",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Salad", "Rice dishes"],
    award: "best", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Gluten free"], features: ["Outdoor seating", "Free Wi-Fi", "Parking"],
    distanceKm: 1.6, sponsored: true, hasMenu: true, status: "closing", closingMin: 40,
    images: gallery(0), excerpts: [
      "Rooftop **fine dining** with sweeping river views",
      "Beautifully plated **modern Khmer** tasting menu",
    ],
    marker: { x: 45, y: 62 },
  },
  {
    id: "pp4", name: "Chop Chay", rank: 4, rating: 4.5, reviews: 720,
    province: "Phnom Penh", cuisines: ["Vegan", "Cambodian", "Asian"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Vegetables", "Curry", "Salad"],
    award: null, onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Free Wi-Fi", "Delivery"],
    distanceKm: 0.9, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(6), excerpts: [
      "Playful **plant-based** Khmer classics that even meat-lovers adore",
      "The **mushroom lok lak** is a revelation",
    ],
    marker: { x: 49, y: 58 },
  },

  /* --------------------------- Battambang --------------------------- */
  {
    id: "bb1", name: "The Banana Leaf Cafe", rank: 1, rating: 4.7, reviews: 1120,
    province: "Battambang", cuisines: ["Cambodian", "Cafe", "International"], priceLabel: "$$", priceTier: "cheap",
    establishment: "cafe", meals: ["breakfast", "brunch", "lunch"], dishes: ["Salad", "Rice dishes", "Dessert"],
    award: "choice", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Outdoor seating", "Free Wi-Fi"],
    distanceKm: 0.4, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(4), excerpts: [
      "Chic garden cafe serving refined **Khmer** comfort food",
      "The **breakfast** spread and coffee are excellent",
    ],
    marker: { x: 19, y: 41 },
  },
  {
    id: "bb2", name: "Cyber Khmer", rank: 2, rating: 4.6, reviews: 860,
    province: "Battambang", cuisines: ["Cambodian", "Bar & Grill"], priceLabel: "$$", priceTier: "mid",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Barbecue", "Rice dishes"],
    award: null, onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly"], features: ["Free Wi-Fi", "Parking"],
    distanceKm: 0.6, sponsored: false, hasMenu: true, status: "closing", closingMin: 28,
    images: gallery(1), excerpts: [
      "Lakeside grilling with generous **fish amok** portions",
      "Great value and a lovely **sunset** setting",
    ],
    marker: { x: 22, y: 44 },
  },

  /* -------------------------- Kampong Cham -------------------------- */
  {
    id: "kc1", name: "Neak Luong Riverside", rank: 1, rating: 4.4, reviews: 340,
    province: "Kampong Cham", cuisines: ["Cambodian", "Seafood"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Seafood", "Rice dishes"],
    award: null, onlineReservations: false, specialOffer: false,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Parking"],
    distanceKm: 0.8, sponsored: false, hasMenu: false, status: "open", closingMin: null,
    images: gallery(7), excerpts: [
      "Riverbank dining on an island — fresh **Mekong fish**",
      "Relaxed **Khmer** flavours away from the crowds",
    ],
    marker: { x: 61, y: 53 },
  },

  /* ----------------------------- Kampot ----------------------------- */
  {
    id: "kp1", name: "La Petite Cambodge", rank: 1, rating: 4.8, reviews: 1560,
    province: "Kampot", cuisines: ["French", "Cambodian", "International"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["breakfast", "lunch", "dinner"], dishes: ["Beef", "Salad", "Fish"],
    award: "best", onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly", "Gluten free"], features: ["Outdoor seating", "Free Wi-Fi", "Parking"],
    distanceKm: 0.5, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(3), excerpts: [
      "Riverside **French-Khmer** dining with a pepper-forward menu",
      "The ** Kampot pepper beef** is exceptional",
    ],
    marker: { x: 40, y: 79 },
  },
  {
    id: "kp2", name: "Bricelotte", rank: 2, rating: 4.7, reviews: 980,
    province: "Kampot", cuisines: ["Cafe", "European", "Cambodian"], priceLabel: "$$", priceTier: "cheap",
    establishment: "cafe", meals: ["breakfast", "brunch", "lunch"], dishes: ["Dessert", "Salad"],
    award: "choice", onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Free Wi-Fi", "Outdoor seating"],
    distanceKm: 0.7, sponsored: false, hasMenu: true, status: "closing", closingMin: 15,
    images: gallery(8), excerpts: [
      "Beloved **bakery** and brunch spot with gelato and coffee",
      "The **croissants** and pancakes are worth the trip",
    ],
    marker: { x: 42, y: 81 },
  },

  /* ------------------------------ Kep ------------------------------- */
  {
    id: "kp3", name: "Kep Crab Market Kitchen", rank: 1, rating: 4.6, reviews: 1240,
    province: "Kep", cuisines: ["Seafood", "Cambodian"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Seafood", "Fish", "Curry"],
    award: "choice", onlineReservations: false, specialOffer: false,
    dietary: ["Gluten free"], features: ["Outdoor seating"],
    distanceKm: 0.3, sponsored: false, hasMenu: false, status: "open", closingMin: null,
    images: gallery(5), excerpts: [
      "Pick-your-**crab** market stall cooked with **Kep pepper**",
      "Salt-and-pepper **mantis shrimp** — pure seaside bliss",
    ],
    marker: { x: 48, y: 88 },
  },
  {
    id: "kp4", name: "Santi Guesthouse Restaurant", rank: 2, rating: 4.4, reviews: 410,
    province: "Kep", cuisines: ["Cambodian", "International"], priceLabel: "$", priceTier: "cheap",
    establishment: "restaurant", meals: ["breakfast", "lunch", "dinner"], dishes: ["Rice dishes", "Salad", "Noodles"],
    award: null, onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Free Wi-Fi", "Parking"],
    distanceKm: 0.9, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(0), excerpts: [
      "Garden **Khmer** cooking near the crab market, generous plates",
      "Friendly owners and great **squid** dishes",
    ],
    marker: { x: 50, y: 86 },
  },

  /* ------------------------- Preah Sihanouk ------------------------- */
  {
    id: "sh1", name: "Sea Bees Beach Club", rank: 1, rating: 4.5, reviews: 870,
    province: "Preah Sihanouk", cuisines: ["Seafood", "International", "Bar & Grill"], priceLabel: "$$ - $$$", priceTier: "mid",
    establishment: "bar", meals: ["lunch", "dinner"], dishes: ["Seafood", "Barbecue", "Salad"],
    award: null, onlineReservations: true, specialOffer: true,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Free Wi-Fi", "Parking"],
    distanceKm: 1.2, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(2), excerpts: [
      "Barefoot **beachfront** grill with cocktails and fresh catch",
      "Sunset **seafood platters** right on the sand",
    ],
    marker: { x: 27, y: 83 },
  },
  {
    id: "sh2", name: "Ounal Beach Restaurant", rank: 2, rating: 4.3, reviews: 360,
    province: "Preah Sihanouk", cuisines: ["Khmer", "Seafood", "Cambodian"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Fish", "Seafood", "Rice dishes"],
    award: null, onlineReservations: false, specialOffer: false,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating"],
    distanceKm: 2.1, sponsored: false, hasMenu: false, status: "closing", closingMin: 45,
    images: gallery(6), excerpts: [
      "Simple **Khmer** seafood shack steps from the water",
      "Grilled **fish** with green mango, no frills, all flavour",
    ],
    marker: { x: 30, y: 80 },
  },

  /* ---------------------------- Koh Kong ---------------------------- */
  {
    id: "kk1", name: "Koh Kong Tropicana Restaurant", rank: 1, rating: 4.2, reviews: 210,
    province: "Koh Kong", cuisines: ["Seafood", "Cambodian", "International"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["lunch", "dinner"], dishes: ["Seafood", "Fish", "Rice dishes"],
    award: null, onlineReservations: true, specialOffer: false,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Parking"],
    distanceKm: 0.5, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(4), excerpts: [
      "Riverside **seafood** base for cards and Koh Kong island trips",
      "Fresh **prawns** and easygoing service",
    ],
    marker: { x: 14, y: 85 },
  },

  /* --------------------------- Mondulkiri --------------------------- */
  {
    id: "md1", name: "Sok Sabay Restaurant", rank: 1, rating: 4.5, reviews: 260,
    province: "Mondulkiri", cuisines: ["Cambodian", "International"], priceLabel: "$$", priceTier: "cheap",
    establishment: "restaurant", meals: ["breakfast", "lunch", "dinner"], dishes: ["Chicken dishes", "Rice dishes", "Vegetables"],
    award: null, onlineReservations: false, specialOffer: true,
    dietary: ["Vegetarian friendly"], features: ["Outdoor seating", "Free Wi-Fi"],
    distanceKm: 0.4, sponsored: false, hasMenu: true, status: "open", closingMin: null,
    images: gallery(1), excerpts: [
      "Highland **Khmer** cooking with panoramic jungle views",
      "The **grilled chicken** and local greens are lovely",
    ],
    marker: { x: 81, y: 47 },
  },

  /* --------------------------- Ratanakiri --------------------------- */
  {
    id: "rt1", name: "Ban Lung Hill Cafe", rank: 1, rating: 4.3, reviews: 150,
    province: "Ratanakiri", cuisines: ["Cafe", "Cambodian"], priceLabel: "$", priceTier: "cheap",
    establishment: "cafe", meals: ["breakfast", "brunch"], dishes: ["Dessert", "Salad"],
    award: null, onlineReservations: false, specialOffer: false,
    dietary: ["Vegetarian friendly", "Vegan options"], features: ["Free Wi-Fi", "Outdoor seating"],
    distanceKm: 0.6, sponsored: false, hasMenu: true, status: "closed", closingMin: null,
    images: gallery(8), excerpts: [
      "Misty highland **coffee** and simple Western-Khmer bites",
      "Warm **lakeside** nook in Ban Lung town",
    ],
    marker: { x: 85, y: 23 },
  },
];

/* ------------------------------------------------------------------ */
/* Decoration — pass through the demo fields and derive display data   */
/* ------------------------------------------------------------------ */

const PRICE_RANK = Object.fromEntries(PRICE_TIERS.map((t) => [t.key, t.rank]));

export function decorateRestaurant(r) {
  let statusText = "Closed";
  if (r.status === "open") statusText = "Open now";
  else if (r.status === "closing") statusText = `Closes in ${r.closingMin} min`;
  return {
    ...r,
    title: r.name,
    location: r.location || provinceLabel(r.province) || r.province,
    href: `/restaurants/${r.id}`,
    image: r.images?.[0] || null,
    priceRank: PRICE_RANK[r.priceTier] ?? 2,
    statusText,
  };
}

export function decorateRestaurants(list) {
  return (list || []).map(decorateRestaurant);
}

// Bridge from the normalized API card (data/normalizers.js normalizeRestaurant)
// to the marketplace shape the listing consumes. Every demo-only field gets a
// safe default so filtering/sorting/rendering behave the same for real data.
export function decorateMarketplaceRestaurant(r) {
  const open = r.open;
  const status = open === true ? "open" : open === false ? "closed" : null;
  const statusText =
    status === "open"
      ? r.openLabel || "Open now"
      : status === "closed"
        ? "Closed"
        : "Check hours";
  return {
    ...r,
    name: r.title || "Restaurant",
    province: r.province || r.location || "Cambodia",
    cuisines: r.category ? [r.category] : [],
    establishment: "restaurant",
    awards: r.award ? [r.award] : [],
    onlineReservations: false,
    specialOffer: false,
    award: null,
    priceTier: null,
    distanceKm: null,
    dietary: [],
    features: [],
    meals: [],
    dishes: [],
    hasMenu: false,
    sponsored: false,
    rank: null,
    status,
    statusText,
    open,
    openLabel: r.openLabel,
    images: r.images?.length
      ? r.images
      : r.image
        ? [r.image]
        : [],
    excerpts: r.description ? [r.description] : [],
    priceLabel: "",
  };
}

// Province options derived from any restaurant list (real or demo).
export function buildProvinceOptions(list = []) {
  if (!list?.length) return PROVINCES;
  const seen = new Set();
  const out = [];
  for (const r of list) {
    const key = r.province || r.location;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label: provinceLabel(key) || key });
  }
  return out.length ? out : PROVINCES;
}

/* ------------------------------------------------------------------ */
/* Filtering + sorting (pure)                                          */
/* ------------------------------------------------------------------ */

const includesAny = (selected, values) =>
  selected.length === 0 || values.some((v) => selected.includes(v));

export function applyRestaurantFilters(list, f) {
  const q = (f.search || "").trim().toLowerCase();
  return list.filter((r) => {
    if (f.province && r.province !== f.province) return false;
    if (q) {
      const hay = [r.name, r.province, r.location, ...(r.cuisines || [])].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.establishments.length && !f.establishments.includes(r.establishment)) return false;
    if (!includesAny(f.meals, r.meals || [])) return false;
    if (!includesAny(f.cuisines, r.cuisines || [])) return false;
    if (!includesAny(f.dishes, r.dishes || [])) return false;
    if (f.awards.length && !f.awards.includes(r.award || "")) return false;
    if (!includesAny(f.prices, [r.priceTier])) return false;
    if (f.online.length) {
      const wantsRes = f.online.includes("reservations");
      const wantsOffer = f.online.includes("offers");
      if (wantsRes && !r.onlineReservations) return false;
      if (wantsOffer && !r.specialOffer) return false;
    }
    if (f.rating != null && r.rating < f.rating) return false;
    if (f.distance != null && r.distanceKm > f.distance) return false;
    if (f.dietary.length && !f.dietary.every((d) => (r.dietary || []).includes(d))) return false;
    if (f.features.length && !f.features.every((x) => (r.features || []).includes(x))) return false;
    return true;
  });
}

export function sortRestaurants(list, sortKey) {
  const arr = [...list];
  switch (sortKey) {
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "reviews":
      return arr.sort((a, b) => b.reviews - a.reviews);
    case "price-asc":
      return arr.sort((a, b) => a.priceRank - b.priceRank);
    case "price-desc":
      return arr.sort((a, b) => b.priceRank - a.priceRank);
    case "distance":
      return arr.sort((a, b) => a.distanceKm - b.distanceKm);
    case "featured":
    default:
      // Sponsored first, then rank (if any), then rating × log(reviews).
      const score = (r) => r.rating * Math.log10(10 + r.reviews);
      return arr.sort(
        (a, b) =>
          Number(b.sponsored) - Number(a.sponsored) ||
          (a.rank ?? 99) - (b.rank ?? 99) ||
          score(b) - score(a)
      );
  }
}

// When nothing is filtered we surface a believable marketplace total; once the
// traveler narrows the list we show the real matched count so the number moves.
// When `total` is passed (real backend lists) we never fake a larger number.
export function resultsCountLabel(shown, { filtered, total }) {
  const n = filtered ? shown : total ?? 1222;
  return `${n.toLocaleString("en-US")} results`;
}
