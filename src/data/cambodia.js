import { img } from "./site";

// Curated demo data for the TripAdvisor-style "Cambodia" homepage.
// All image filenames reuse entries already proven to load in site.js
// (Wikimedia Special:FilePath) to avoid 404s. Swap for the live API later.

export const essentialCategories = [
  { label: "Essentials", icon: "star" },
  { label: "Travelers' Choice", icon: "shield" },
  { label: "Family friendly", icon: "users" },
  { label: "Hidden gems", icon: "heart" },
  { label: "Museums", icon: "landmark" },
  { label: "Outdoors", icon: "compass" },
  { label: "Culture & heritage", icon: "layers" },
  { label: "Food & drink", icon: "utensils" },
  { label: "Beaches & islands", icon: "globe" },
];

// ---- Things to do (rich cards with multi-image carousel + save) ----
// tags = Essential Cambodia category labels the card belongs to (filterable).
export const thingsToDo = [
  {
    id: "td1", name: "Angkor Wat", category: "Ancient Ruins", rating: 4.8, reviews: 49472, badge: "2026",
    tags: ["Travelers' Choice", "Culture & heritage"],
    images: [img("Angkor_Wat.jpg", 800), img("Angkor Wat, reflejo 2.jpg", 800), img("Bayon temple 02.jpg", 800)],
  },
  {
    id: "td2", name: "Bayon Temple", category: "Ancient Ruins", rating: 4.8, reviews: 20895, badge: "2026",
    tags: ["Travelers' Choice", "Culture & heritage"],
    images: [img("Bayon temple 02.jpg", 800), img("Angkor_Wat.jpg", 800)],
  },
  {
    id: "td3", name: "Ta Prohm — The Jungle Temple", category: "Ancient Ruins", rating: 4.7, reviews: 12340,
    tags: ["Travelers' Choice", "Hidden gems"],
    images: [img("Angkor Wat, reflejo 2.jpg", 800), img("Bayon temple 02.jpg", 800), img("Angkor_Wat.jpg", 800)],
  },
  {
    id: "td4", name: "Royal Palace", category: "Historical Sites", rating: 4.6, reviews: 5400,
    tags: ["Travelers' Choice", "Culture & heritage", "Family friendly"],
    images: [img("Royal Palace, Phnom Penh Cambodia 1.jpg", 800), img("Skyline of Phnom Penh.jpg", 800)],
  },
  {
    id: "td5", name: "National Museum of Cambodia", category: "Museums", rating: 4.5, reviews: 2100,
    tags: ["Museums", "Culture & heritage", "Family friendly"],
    images: [img("Royal Palace, Phnom Penh Cambodia 1.jpg", 800), img("Skyline of Phnom Penh.jpg", 800)],
  },
  {
    id: "td6", name: "Phsar Thmei — Central Market", category: "Markets", rating: 4.4, reviews: 3900,
    tags: ["Hidden gems", "Food & drink", "Family friendly"],
    images: [img("Skyline of Phnom Penh.jpg", 800), img("Street food vendor in Phnom Pehn.jpg", 800)],
  },
];

// ---- Cambodia Is Great For (grouped rows) ----
// kind maps each card to a trip-cart type so "Save" works.
export const greatFor = [
  {
    key: "eat-drink",
    title: "Eat & drink",
    subtitle: "Khmer kitchens, riverside bars and night-market stalls",
    kind: "restaurant",
    items: [
      { id: "ed1", name: "Khmer Kitchen", location: "Phnom Penh", category: "Khmer Food", rating: 4.8, reviews: 1240, image: img("Fish Amok.jpg", 700) },
      { id: "ed2", name: "Romdeng by Jet", location: "Siem Reap", category: "Fine Dining", rating: 4.7, reviews: 980, image: img("Beef Lok Lak.jpg", 700) },
      { id: "ed3", name: "Chanry Noodles", location: "Phnom Penh", category: "Noodle Bar", rating: 4.6, reviews: 610, image: img("Num Banh Chok Somlar Kari.jpg", 700) },
      { id: "ed4", name: "Night Market BBQ", location: "Siem Reap", category: "Street Food", rating: 4.5, reviews: 720, image: img("Kabobs at Phnom Penh Night Market.jpg", 700) },
      { id: "ed5", name: "Amok Trey House", location: "Kampot", category: "Seafood", rating: 4.6, reviews: 340, image: img("Amok trey.jpg", 700) },
      { id: "ed6", name: "Street Eats Alley", location: "Phnom Penh", category: "Street Food", rating: 4.4, reviews: 505, image: img("Street food vendor in Phnom Pehn.jpg", 700) },
    ],
  },
  {
    key: "spas",
    title: "Spas",
    subtitle: "Unwind with Khmer massage and poolside wellness",
    kind: "hotel",
    items: [
      { id: "sp1", name: "Sofitel Angkor Spa", location: "Siem Reap", category: "Spa & Wellness", rating: 4.9, reviews: 410, image: img("Palm Paradise Pool.jpg", 700) },
      { id: "sp2", name: "Royal Sands Wellness", location: "Sihanoukville", category: "Resort Spa", rating: 4.6, reviews: 220, image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 700) },
      { id: "sp3", name: "Riverside Villa Spa", location: "Kampot", category: "Spa & Wellness", rating: 4.7, reviews: 180, image: img("Main swimming pool at Paradisus by Meliá Bali.jpg", 700) },
      { id: "sp4", name: "Kep Garden Retreat", location: "Kep", category: "Wellness Retreat", rating: 4.5, reviews: 150, image: img("Negombo Beach resort pool (Unsplash).jpg", 700) },
    ],
  },
  {
    key: "historic",
    title: "Historic sites",
    subtitle: "Ancient temples and royal landmarks",
    kind: "tour",
    items: [
      { id: "hs1", name: "Angkor Wat", location: "Siem Reap", category: "Ancient Ruins", rating: 4.9, reviews: 8200, image: img("Angkor_Wat.jpg", 700) },
      { id: "hs2", name: "Bayon Temple", location: "Siem Reap", category: "Ancient Ruins", rating: 4.8, reviews: 3400, image: img("Bayon temple 02.jpg", 700) },
      { id: "hs3", name: "Angkor Reflection", location: "Siem Reap", category: "Landmark", rating: 4.8, reviews: 1900, image: img("Angkor Wat, reflejo 2.jpg", 700) },
      { id: "hs4", name: "Royal Palace", location: "Phnom Penh", category: "Historical Site", rating: 4.6, reviews: 2600, image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 700) },
      { id: "hs5", name: "Victoria Angkor Resort & Spa", location: "Siem Reap", category: "Heritage Hotel", rating: 4.7, reviews: 1200, image: img("Palm Paradise Pool.jpg", 700) },
    ],
  },
  {
    key: "cities",
    title: "Best cities to visit in Cambodia",
    subtitle: "From the capital to coastal escapes",
    kind: "tour",
    items: [
      { id: "ct1", name: "Phnom Penh", location: "Capital", category: "City", rating: 4.6, reviews: 5400, image: img("Skyline of Phnom Penh.jpg", 700) },
      { id: "ct2", name: "Kampot", location: "Riverside", category: "Town", rating: 4.7, reviews: 2100, image: img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 700) },
      { id: "ct3", name: "Kep", location: "Coastal town", category: "Town", rating: 4.5, reviews: 1300, image: img("06-Kep Crab Market Cambodia-nX-7.jpg", 700) },
      { id: "ct4", name: "Battambang", location: "Northwest", category: "City", rating: 4.5, reviews: 980, image: img("Bamboo train Battambang.jpg", 700) },
      { id: "ct5", name: "Sihanoukville", location: "South coast", category: "Beach City", rating: 4.3, reviews: 1600, image: img("Sihanoukville - Prek Treng beach.jpg", 700) },
      { id: "ct6", name: "Koh Rong", location: "Island", category: "Island", rating: 4.8, reviews: 2400, image: img("Koh_Rong_island.jpg", 700) },
      { id: "ct7", name: "Mondulkiri", location: "Highlands", category: "Nature", rating: 4.9, reviews: 870, image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 700) },
    ],
  },
];

// ---- Related Stories (editorial cards) ----
export const relatedStories = [
  {
    id: "rs1", place: "Phnom Penh", topic: "The capital that never sleeps",
    info: "Riverside dining, royal landmarks and buzzing night markets — a guide to Cambodia's energetic heart.",
    image: img("Skyline of Phnom Penh.jpg", 900),
  },
  {
    id: "rs2", place: "Siem Reap", topic: "Gateway to Angkor",
    info: "Sunrise over the temples, pub-street energy and floating villages on the Tonlé Sap lake.",
    image: img("Angkor_Wat.jpg", 900),
  },
  {
    id: "rs3", place: "Kampot", topic: "Riverside charm & pepper country",
    info: "Lantern-lit riverfront, limestone caves and the freshest crab in the Kingdom.",
    image: img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 900),
  },
];
