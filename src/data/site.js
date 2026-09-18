// Central mock/demo data for the SovannDomNour UI.
// Images are served from Wikimedia Commons via Special:FilePath (reliable, on-topic Cambodia photos).

export const img = (file, w = 900) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`;

export const brand = {
  name: "SovannDomNour",
  tagline: "Discover Cambodia",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Destinations", href: "/destinations" },
];

/* ------------------------------------------------------------------ */
/* Homepage — three main services                                      */
/* ------------------------------------------------------------------ */
export const services = [
  {
    key: "tours",
    label: "TOURS",
    icon: "binoculars",
    title: "Explore Tours",
    description: "Discover temples, beaches, nature and unforgettable experiences.",
    cta: "Explore Tours",
    image: img("Angkor_Wat.jpg", 1000),
    href: "/explore?section=tours",
  },
  {
    key: "hotels",
    label: "HOTELS",
    icon: "bed",
    title: "Find Your Stay",
    description: "Discover comfortable hotels and beautiful places to stay.",
    cta: "Explore Hotels",
    image: img("Palm Paradise Pool.jpg", 1000),
    href: "/explore?section=hotels",
  },
  {
    key: "restaurants",
    label: "RESTAURANTS",
    icon: "utensils",
    title: "Taste Cambodia",
    description: "Discover authentic Khmer cuisine and local restaurants.",
    cta: "Explore Restaurants",
    image: img("Fish Amok.jpg", 1000),
    href: "/explore?section=restaurants",
  },
];

/* ------------------------------------------------------------------ */
/* Popular destinations                                                */
/* ------------------------------------------------------------------ */
export const destinations = [
  { name: "Siem Reap", attractions: 12, image: img("Bayon temple 02.jpg", 700) },
  { name: "Phnom Penh", attractions: 20, image: img("Skyline of Phnom Penh.jpg", 700) },
  { name: "Kampot", attractions: 8, image: img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 700) },
  { name: "Kep", attractions: 6, image: img("06-Kep Crab Market Cambodia-nX-7.jpg", 700) },
  { name: "Battambang", attractions: 7, image: img("Bamboo train Battambang.jpg", 700) },
  { name: "Sihanoukville", attractions: 9, image: img("Sihanoukville - Prek Treng beach.jpg", 700) },
  { name: "Koh Rong", attractions: 5, image: img("Koh_Rong_island.jpg", 700) },
  { name: "Mondulkiri", attractions: 6, image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 700) },
];

/* ------------------------------------------------------------------ */
/* Popular experiences (tours)                                         */
/* ------------------------------------------------------------------ */
export const experiences = [
  {
    title: "Angkor Wat Sunrise Tour",
    location: "Siem Reap",
    duration: "1 Day",
    rating: 4.9,
    reviews: 486,
    price: 45,
    badge: "Best Seller",
    badgeTone: "gold",
    image: img("Angkor Wat, reflejo 2.jpg", 800),
  },
  {
    title: "Koh Rong Island Escape",
    location: "Sihanoukville",
    duration: "2 Days",
    rating: 4.8,
    reviews: 230,
    price: 120,
    badge: "Nature",
    badgeTone: "green",
    image: img("Koh_Rong_island.jpg", 800),
  },
  {
    title: "Phnom Penh City Tour",
    location: "Phnom Penh",
    duration: "1 Day",
    rating: 4.7,
    reviews: 180,
    price: 35,
    badge: "Culture",
    badgeTone: "green",
    image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 800),
  },
  {
    title: "Mondulkiri Elephant Tour",
    location: "Mondulkiri",
    duration: "2 Days",
    rating: 4.9,
    reviews: 156,
    price: 95,
    badge: "Adventure",
    badgeTone: "green",
    image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 800),
  },
];

/* ------------------------------------------------------------------ */
/* Featured hotels                                                     */
/* ------------------------------------------------------------------ */
export const hotels = [
  { name: "Sofitel Angkor Phokeethra", location: "Siem Reap", rating: 4.8, price: 120, badge: "Luxury", image: img("Palm Paradise Pool.jpg", 800) },
  { name: "The Royal Sands", location: "Sihanoukville", rating: 4.6, price: 85, badge: "Popular", image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 800) },
  { name: "Kampot Riverside Villa", location: "Kampot", rating: 4.7, price: 60, badge: "Best Value", image: img("Main swimming pool at Paradisus by Meliá Bali.jpg", 800) },
  { name: "Kep Garden Resort", location: "Kep", rating: 4.5, price: 55, badge: "Recommended", image: img("Negombo Beach resort pool (Unsplash).jpg", 800) },
];

/* ------------------------------------------------------------------ */
/* Featured restaurants                                                */
/* ------------------------------------------------------------------ */
export const restaurants = [
  { name: "Khmer Kitchen", location: "Phnom Penh", cuisine: "Khmer", rating: 4.8, price: "$$", open: true, image: img("Fish Amok.jpg", 800) },
  { name: "Romdeng", location: "Siem Reap", cuisine: "Traditional", rating: 4.7, price: "$$", open: true, image: img("Beef Lok Lak.jpg", 800) },
  { name: "Chanry Noodles", location: "Phnom Penh", cuisine: "Street Food", rating: 4.6, price: "$", open: false, image: img("Num Banh Chok Somlar Kari.jpg", 800) },
  { name: "Night Market BBQ", location: "Siem Reap", cuisine: "BBQ", rating: 4.5, price: "$", open: true, image: img("Kabobs at Phnom Penh Night Market.jpg", 800) },
];

/* ------------------------------------------------------------------ */
/* Khmer cuisine editorial                                             */
/* ------------------------------------------------------------------ */
export const dishes = [
  { name: "Fish Amok", note: "Steamed coconut curry", image: img("Amok trey.jpg", 700) },
  { name: "Khmer Noodles", note: "Num Banh Chok", image: img("Num Banh Chok Somlar Kari.jpg", 700) },
  { name: "Lok Lak", note: "Stir-fried beef", image: img("Beef Lok Lak.jpg", 700) },
  { name: "Samlor", note: "Hearty home soup", image: img("Fish Amok with Rice.jpg", 700) },
  { name: "Street BBQ", note: "Grilled skewers", image: img("Kabobs at Phnom Penh Night Market.jpg", 700) },
  { name: "Nom Koma", note: "Sweet sticky rice", image: img("Chek ktis.jpg", 700) },
  { name: "Street Eats", note: "Fresh & local", image: img("Street food vendor in Phnom Pehn.jpg", 700) },
];

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export const footerColumns = [
  { title: "Explore", links: ["Explore", "Destinations"] },
  { title: "Company", links: ["About us", "Careers", "Press", "Blog"] },
  { title: "Support", links: ["Help center", "Contact", "Privacy", "Terms"] },
];
