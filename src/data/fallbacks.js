import { img } from "./site";

// Demo fallbacks used when the backend is unreachable. Shapes match the
// normalized API cards exactly so components don't need to care about source.

export const fallbackTours = [
  {
    id: "t1", kind: "tour", title: "Angkor Wat Sunrise Tour",
    subtitle: "Witness the iconic temple reflected at dawn.",
    description: "Begin before daybreak and watch the sun rise behind the five towers of Angkor Wat, then explore the main temple complex with a licensed guide.",
    image: img("Angkor Wat, reflejo 2.jpg", 900),
    images: [img("Angkor Wat, reflejo 2.jpg", 1200), img("Ta_Prohm.jpg", 1200), img("Bayon temple 02.jpg", 1200)],
    location: "Siem Reap", address: "Angkor Archaeological Park, Siem Reap",
    category: "Culture", badge: "Best Seller", badgeTone: "gold",
    rating: 4.9, reviews: 486, price: 45, priceUnit: "/person", duration: "1 Day",
    ticketId: "tk1",
    href: "/explore?section=tours",
  },
  {
    id: "t2", kind: "tour", title: "Koh Rong Island Escape",
    subtitle: "Two days of white sand and turquoise water.",
    description: "A relaxing island escape with snorkelling, bioluminescent plankton and time to unwind on pristine beaches.",
    image: img("Koh_Rong_island.jpg", 900),
    images: [img("Koh_Rong_island.jpg", 1200)],
    location: "Sihanoukville", address: "Koh Rong, Sihanoukville",
    category: "Nature", badge: "Nature", badgeTone: "green",
    rating: 4.8, reviews: 230, price: 120, priceUnit: "/person", duration: "2 Days",
    ticketId: "tk2",
    href: "/explore?section=tours",
  },
  {
    id: "t3", kind: "tour", title: "Phnom Penh City Tour",
    subtitle: "Royal Palace, museums and colonial boulevards.",
    description: "Discover the capital's landmarks — the Royal Palace, Silver Pagoda and National Museum — with a local storyteller.",
    image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 900),
    images: [img("Royal Palace, Phnom Penh Cambodia 1.jpg", 1200), img("Skyline of Phnom Penh.jpg", 1200)],
    location: "Phnom Penh", address: "Phnom Penh",
    category: "Culture", badge: "Culture", badgeTone: "green",
    rating: 4.7, reviews: 180, price: 35, priceUnit: "/person", duration: "1 Day",
    ticketId: "tk3",
    href: "/explore?section=tours",
  },
  {
    id: "t4", kind: "tour", title: "Mondulkiri Elephant Tour",
    subtitle: "Meet rescued elephants in the highlands.",
    description: "Travel to the green hills of Mondulkiri for an ethical elephant sanctuary experience and jungle trekking.",
    image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 900),
    images: [img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 1200)],
    location: "Mondulkiri", address: "Mondulkiri",
    category: "Adventure", badge: "Adventure", badgeTone: "green",
    rating: 4.9, reviews: 156, price: 95, priceUnit: "/person", duration: "2 Days",
    ticketId: "tk4",
    href: "/explore?section=tours",
  },
];

export const fallbackHotels = [
  { id: "h1", kind: "hotel", title: "Sofitel Angkor Phokeethra", subtitle: "Siem Reap", description: "Colonial-style luxury resort steps from the Angkor park, with a large pool and spa.", image: img("Palm Paradise Pool.jpg", 900), images: [img("Palm Paradise Pool.jpg", 1200)], location: "Siem Reap", badge: "Luxury", badgeTone: "green", rating: 4.8, price: 120, priceUnit: "/night", roomId: "rm1", roomType: "Deluxe King", phone: "+855 63 963 963", email: "reservations@sofitel-kh.com", href: "/explore?section=hotels" },
  { id: "h2", kind: "hotel", title: "The Royal Sands", subtitle: "Sihanoukville", description: "Beachfront resort with lagoon pools and easy access to the coast.", image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 900), images: [img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 1200)], location: "Sihanoukville", badge: "Popular", badgeTone: "green", rating: 4.6, price: 85, priceUnit: "/night", roomId: "rm2", roomType: "Twin Garden", href: "/explore?section=hotels" },
  { id: "h3", kind: "hotel", title: "Kampot Riverside Villa", subtitle: "Kampot", description: "Calm riverside stay near the old market and pepper hills.", image: img("Main swimming pool at Paradisus by Meliá Bali.jpg", 900), images: [img("Main swimming pool at Paradisus by Meliá Bali.jpg", 1200)], location: "Kampot", badge: "Best Value", badgeTone: "green", rating: 4.7, price: 60, priceUnit: "/night", roomId: "rm3", roomType: "Family Suite", href: "/explore?section=hotels" },
  { id: "h4", kind: "hotel", title: "Kep Garden Resort", subtitle: "Kep", description: "Laid-back garden resort a short walk from the crab market.", image: img("Negombo Beach resort pool (Unsplash).jpg", 900), images: [img("Negombo Beach resort pool (Unsplash).jpg", 1200)], location: "Kep", badge: "Recommended", badgeTone: "green", rating: 4.5, price: 55, priceUnit: "/night", roomId: "rm1", roomType: "Deluxe King", href: "/explore?section=hotels" },
];

export const fallbackRestaurants = [
  { id: "r1", kind: "restaurant", title: "Khmer Kitchen", subtitle: "Phnom Penh", description: "Classic Khmer dishes in a warm, modern setting.", image: img("Fish Amok.jpg", 900), images: [img("Fish Amok.jpg", 1200)], location: "Phnom Penh", category: "Khmer", badge: "Khmer", badgeTone: "green", rating: 4.8, price: null, priceUnit: "", open: true, openLabel: "10:00 AM – 10:00 PM", href: "/explore?section=restaurants" },
  { id: "r2", kind: "restaurant", title: "Romdeng", subtitle: "Siem Reap", description: "Renowned grill house serving traditional Khmer cooking.", image: img("Beef Lok Lak.jpg", 900), images: [img("Beef Lok Lak.jpg", 1200)], location: "Siem Reap", category: "Traditional", badge: "Traditional", badgeTone: "green", rating: 4.7, price: null, priceUnit: "", open: true, openLabel: "5:00 PM – 10:30 PM", href: "/explore?section=restaurants" },
  { id: "r3", kind: "restaurant", title: "Chanry Noodles", subtitle: "Phnom Penh", description: "Beloved local spot for num banh chok and noodle soups.", image: img("Num Banh Chok Somlar Kari.jpg", 900), images: [img("Num Banh Chok Somlar Kari.jpg", 1200)], location: "Phnom Penh", category: "Street Food", badge: "Street Food", badgeTone: "green", rating: 4.6, price: null, priceUnit: "", open: false, openLabel: "6:00 AM – 1:00 PM", href: "/explore?section=restaurants" },
  { id: "r4", kind: "restaurant", title: "Night Market BBQ", subtitle: "Siem Reap", description: "Sizzling skewers and fresh seafood at the old market.", image: img("Kabobs at Phnom Penh Night Market.jpg", 900), images: [img("Kabobs at Phnom Penh Night Market.jpg", 1200)], location: "Siem Reap", category: "BBQ", badge: "BBQ", badgeTone: "green", rating: 4.5, price: null, priceUnit: "", open: true, openLabel: "4:00 PM – 11:00 PM", href: "/explore?section=restaurants" },
];

export const fallbackDestinations = [
  { id: "d1", kind: "destination", title: "Siem Reap", image: img("Bayon temple 02.jpg", 700), attractions: 12, href: "/destinations/d1" },
  { id: "d2", kind: "destination", title: "Phnom Penh", image: img("Skyline of Phnom Penh.jpg", 700), attractions: 20, href: "/destinations/d2" },
  { id: "d3", kind: "destination", title: "Kampot", image: img("Kampot Riverfront Scene - Kampot - Cambodia (48501740381).jpg", 700), attractions: 8, href: "/destinations/d3" },
  { id: "d4", kind: "destination", title: "Kep", image: img("06-Kep Crab Market Cambodia-nX-7.jpg", 700), attractions: 6, href: "/destinations/d4" },
  { id: "d5", kind: "destination", title: "Battambang", image: img("Bamboo train Battambang.jpg", 700), attractions: 7, href: "/destinations/d5" },
  { id: "d6", kind: "destination", title: "Sihanoukville", image: img("Sihanoukville - Prek Treng beach.jpg", 700), attractions: 9, href: "/destinations/d6" },
  { id: "d7", kind: "destination", title: "Koh Rong", image: img("Koh_Rong_island.jpg", 700), attractions: 5, href: "/destinations/d7" },
  { id: "d8", kind: "destination", title: "Mondulkiri", image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 700), attractions: 6, href: "/destinations/d8" },
];

export const fallbackFoods = [
  { id: "f1", kind: "food", title: "Fish Amok", image: img("Amok trey.jpg", 600), price: 6.5, available: true, category: "Main" },
  { id: "f2", kind: "food", title: "Beef Lok Lak", image: img("Beef Lok Lak.jpg", 600), price: 7.0, available: true, category: "Main" },
  { id: "f3", kind: "food", title: "Num Banh Chok", image: img("Num Banh Chok Somlar Kari.jpg", 600), price: 3.5, available: true, category: "Noodles" },
  { id: "f4", kind: "food", title: "Skewer BBQ", image: img("Kabobs at Phnom Penh Night Market.jpg", 600), price: 2.0, available: false, category: "Street" },
];

export const fallbackRooms = [
  { id: "rm1", roomType: "Deluxe King", capacity: 2, total: 8, price: 85 },
  { id: "rm2", roomType: "Twin Garden", capacity: 2, total: 12, price: 65 },
  { id: "rm3", roomType: "Family Suite", capacity: 4, total: 4, price: 140 },
];

// Ensure every demo listing carries a province so same-province recommendations
// work identically whether data comes from the API or these fallbacks.
for (const t of fallbackTours) t.province = t.province || t.location;
for (const h of fallbackHotels) h.province = h.province || h.location;
for (const r of fallbackRestaurants) r.province = r.province || r.location;

// Demo bookings shown on the dashboard when the booking endpoints are empty.
export const fallbackBookings = [
  { key: "ticket-demo1", id: "demo1", kind: "tour", title: "Angkor Wat Sunrise Tour", location: "Siem Reap", date: "Apr 15, 2025", status: "Confirmed", amount: 45, image: img("Angkor Wat, reflejo 2.jpg", 400) },
  { key: "room-demo2", id: "demo2", kind: "hotel", title: "Angkor Paradise Hotel", location: "Angkor Paradise Hotel · Deluxe King", date: "Apr 18 – Apr 20, 2025", status: "Confirmed", amount: 170, image: img("Palm Paradise Pool.jpg", 400) },
  { key: "order-demo3", id: "demo3", kind: "restaurant", title: "Khmer Garden Restaurant", location: "Phnom Penh", date: "Apr 22, 2025", status: "Pending", amount: 24, image: img("Fish Amok.jpg", 400) },
];
