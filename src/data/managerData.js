import { img } from "./site";

// Column types: text | strong | money | status | rating | image | bool
// Each entity has `columns` (for DataTable) and `demo` rows (used when the
// backing service is empty/unavailable — which is the case on the current
// stale backend). Real services are wired in managerRepository.

export const ENTITIES = {
  "tour-places": {
    title: "Tourist Places",
    columns: [
      { key: "name", label: "Name", strong: true },
      { key: "category", label: "Category" },
      { key: "district", label: "District" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Angkor Wat", category: "Temple", district: "Siem Reap", rating: 4.9, status: "Active" },
      { id: 2, name: "Ta Prohm", category: "Temple", district: "Siem Reap", rating: 4.8, status: "Active" },
      { id: 3, name: "Bayon Temple", category: "Temple", district: "Siem Reap", rating: 4.8, status: "Active" },
      { id: 4, name: "Koh Rong Island", category: "Island", district: "Koh Kong", rating: 4.7, status: "Active" },
      { id: 5, name: "Royal Palace", category: "Landmark", district: "Phnom Penh", rating: 4.6, status: "Active" },
      { id: 6, name: "Bokor Hill Station", category: "Nature", district: "Kampot", rating: 4.5, status: "Inactive" },
    ],
  },

  "tour-packages": {
    title: "Tour Packages",
    columns: [
      { key: "name", label: "Package", strong: true },
      { key: "province", label: "Province" },
      { key: "duration", label: "Duration" },
      { key: "price", label: "Price", type: "money", align: "right" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Angkor Sunrise Explorer", province: "Siem Reap", duration: "1 Day", price: 45, rating: 4.9, status: "Active" },
      { id: 2, name: "Island Escape — Koh Rong", province: "Sihanoukville", duration: "2 Days", price: 120, rating: 4.8, status: "Active" },
      { id: 3, name: "Phnom Penh City Highlights", province: "Phnom Penh", duration: "1 Day", price: 35, rating: 4.7, status: "Active" },
      { id: 4, name: "Mondulkiri Elephant Trek", province: "Mondulkiri", duration: "2 Days", price: 95, rating: 4.9, status: "Active" },
      { id: 5, name: "Kampot Pepper & Caves", province: "Kampot", duration: "1 Day", price: 40, rating: 4.6, status: "Draft" },
    ],
  },

  "tour-stops": {
    title: "Package Stops",
    columns: [
      { key: "package", label: "Package", strong: true },
      { key: "stop", label: "Stop" },
      { key: "order", label: "Order #" },
      { key: "duration", label: "Stay" },
    ],
    demo: [
      { id: 1, package: "Angkor Sunrise Explorer", stop: "Angkor Wat", order: 1, duration: "90 min" },
      { id: 2, package: "Angkor Sunrise Explorer", stop: "Ta Prohm", order: 2, duration: "60 min" },
      { id: 3, package: "Angkor Sunrise Explorer", stop: "Bayon", order: 3, duration: "45 min" },
      { id: 4, package: "Island Escape — Koh Rong", stop: "Saracen Beach", order: 1, duration: "2 hrs" },
    ],
  },

  "tour-guides": {
    title: "Tour Guides",
    columns: [
      { key: "name", label: "Guide", strong: true },
      { key: "languages", label: "Languages" },
      { key: "phone", label: "Phone" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Chan Vuthy", languages: "EN, KH, FR", phone: "+855 12 345 678", rating: 4.9, status: "Active" },
      { id: 2, name: "Srey Neang", languages: "EN, KH", phone: "+855 98 765 432", rating: 4.8, status: "Active" },
      { id: 3, name: "Dara Phon", languages: "EN, KH, JP", phone: "+855 11 222 333", rating: 4.7, status: "Inactive" },
    ],
  },

  provinces: {
    title: "Provinces",
    columns: [
      { key: "name", label: "Province", strong: true },
      { key: "districts", label: "Districts" },
      { key: "places", label: "Tourist Places" },
    ],
    demo: [
      { id: 1, name: "Siem Reap", districts: 8, places: 12 },
      { id: 2, name: "Phnom Penh", districts: 14, places: 20 },
      { id: 3, name: "Kampot", districts: 7, places: 8 },
      { id: 4, name: "Sihanoukville", districts: 6, places: 9 },
      { id: 5, name: "Mondulkiri", districts: 6, places: 6 },
    ],
  },

  districts: {
    title: "Districts",
    columns: [
      { key: "name", label: "District", strong: true },
      { key: "province", label: "Province" },
      { key: "places", label: "Tourist Places" },
    ],
    demo: [
      { id: 1, name: "Sangkum", province: "Siem Reap", places: 6 },
      { id: 2, name: "Chbar Ampov", province: "Phnom Penh", places: 3 },
      { id: 3, name: "Kampot City", province: "Kampot", places: 4 },
    ],
  },

  "tour-bookings": {
    title: "Tour Bookings",
    columns: [
      { key: "id", label: "Booking ID", strong: true },
      { key: "pkg", label: "Package" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Booking Date" },
      { key: "guests", label: "Guests" },
      { key: "total", label: "Total", type: "money", align: "right" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "TB-1042", pkg: "Angkor Sunrise Explorer", customer: "Emma Wilson", date: "Apr 12, 2025", guests: 2, total: 90, status: "Confirmed" },
      { id: "TB-1043", pkg: "Island Escape — Koh Rong", customer: "Kenji Tanaka", date: "Apr 13, 2025", guests: 4, total: 480, status: "Pending" },
      { id: "TB-1044", pkg: "Mondulkiri Elephant Trek", customer: "Lucas Meyer", date: "Apr 14, 2025", guests: 2, total: 190, status: "Completed" },
      { id: "TB-1045", pkg: "Phnom Penh City Highlights", customer: "Ava Chen", date: "Apr 15, 2025", guests: 3, total: 105, status: "Cancelled" },
    ],
  },

  customers: {
    title: "Customers",
    columns: [
      { key: "name", label: "Customer", strong: true },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "orders", label: "Orders" },
      { key: "joined", label: "Joined" },
    ],
    demo: [
      { id: 1, name: "Emma Wilson", email: "emma@example.com", phone: "+1 555 01", orders: 6, joined: "Jan 2025" },
      { id: 2, name: "Kenji Tanaka", email: "kenji@example.com", phone: "+81 555 02", orders: 3, joined: "Feb 2025" },
      { id: 3, name: "Lucas Meyer", email: "lucas@example.com", phone: "+49 555 03", orders: 8, joined: "Dec 2024" },
      { id: 4, name: "Ava Chen", email: "ava@example.com", phone: "+65 555 04", orders: 2, joined: "Mar 2025" },
    ],
  },

  reviews: {
    title: "Reviews",
    columns: [
      { key: "target", label: "Target", strong: true },
      { key: "customer", label: "Customer" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "comment", label: "Comment" },
    ],
    demo: [
      { id: 1, target: "Angkor Wat", customer: "Emma Wilson", rating: 5, comment: "Breathtaking sunrise!" },
      { id: 2, target: "Koh Rong Escape", customer: "Kenji Tanaka", rating: 4, comment: "Great island, long boat ride." },
      { id: 3, target: "Khmer Kitchen", customer: "Ava Chen", rating: 5, comment: "Best amok in town." },
    ],
  },

  "tour-images": {
    title: "Tour Images",
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "target", label: "Place", strong: true },
      { key: "type", label: "Type" },
      { key: "primary", label: "Primary", type: "bool" },
    ],
    demo: [
      { id: 1, image: img("Angkor Wat, reflejo 2.jpg", 200), target: "Angkor Wat", type: "PRIMARY", primary: true },
      { id: 2, image: img("Ta_Prohm.jpg", 200), target: "Ta Prohm", type: "GALLERY", primary: false },
      { id: 3, image: img("Bayon temple 02.jpg", 200), target: "Bayon", type: "GALLERY", primary: false },
    ],
  },

  hotels: {
    title: "Hotels",
    columns: [
      { key: "name", label: "Hotel", strong: true },
      { key: "location", label: "Location" },
      { key: "rooms", label: "Rooms" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Sofitel Angkor Phokeethra", location: "Siem Reap", rooms: 120, rating: 4.8, status: "Active" },
      { id: 2, name: "The Royal Sands", location: "Sihanoukville", rooms: 80, rating: 4.6, status: "Active" },
      { id: 3, name: "Kampot Riverside Villa", location: "Kampot", rooms: 24, rating: 4.7, status: "Active" },
      { id: 4, name: "Kep Garden Resort", location: "Kep", rooms: 18, rating: 4.5, status: "Inactive" },
    ],
  },

  "room-types": {
    title: "Room Types",
    columns: [
      { key: "name", label: "Room Type", strong: true },
      { key: "capacity", label: "Capacity" },
      { key: "price", label: "Price / night", type: "money", align: "right" },
      { key: "count", label: "Rooms" },
    ],
    demo: [
      { id: 1, name: "Deluxe King", capacity: 2, price: 85, count: 20 },
      { id: 2, name: "Twin Garden", capacity: 2, price: 65, count: 30 },
      { id: 3, name: "Family Suite", capacity: 4, price: 140, count: 8 },
      { id: 4, name: "Standard", capacity: 2, price: 45, count: 40 },
    ],
  },

  rooms: {
    title: "Rooms",
    columns: [
      { key: "number", label: "Room", strong: true },
      { key: "hotel", label: "Hotel" },
      { key: "type", label: "Type" },
      { key: "floor", label: "Floor" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, number: "101", hotel: "Sofitel Angkor", type: "Deluxe King", floor: 1, status: "Available" },
      { id: 2, number: "102", hotel: "Sofitel Angkor", type: "Twin Garden", floor: 1, status: "Occupied" },
      { id: 3, number: "204", hotel: "The Royal Sands", type: "Family Suite", floor: 2, status: "Reserved" },
      { id: 4, number: "305", hotel: "Kampot Riverside", type: "Standard", floor: 3, status: "Maintenance" },
    ],
  },

  "hotel-images": {
    title: "Hotel Images",
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "hotel", label: "Hotel", strong: true },
      { key: "type", label: "Type" },
    ],
    demo: [
      { id: 1, image: img("Palm Paradise Pool.jpg", 200), hotel: "Sofitel Angkor", type: "POOL" },
      { id: 2, image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 200), hotel: "The Royal Sands", type: "RESORT" },
    ],
  },

  "hotel-hours": {
    title: "Opening Hours",
    columns: [
      { key: "day", label: "Day", strong: true },
      { key: "open", label: "Opens" },
      { key: "close", label: "Closes" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, day: "Monday", open: "00:00", close: "23:59", status: "Open" },
      { id: 2, day: "Tuesday", open: "00:00", close: "23:59", status: "Open" },
      { id: 3, day: "Sunday", open: "06:00", close: "22:00", status: "Limited" },
    ],
  },

  "hotel-bookings": {
    title: "Hotel Bookings",
    columns: [
      { key: "id", label: "Booking ID", strong: true },
      { key: "hotel", label: "Hotel" },
      { key: "roomType", label: "Room Type" },
      { key: "guest", label: "Guest" },
      { key: "checkIn", label: "Check-in" },
      { key: "checkOut", label: "Check-out" },
      { key: "amount", label: "Amount", type: "money", align: "right" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "HB-2201", hotel: "Sofitel Angkor", roomType: "Deluxe King", guest: "Emma Wilson", checkIn: "Apr 18, 2025", checkOut: "Apr 20, 2025", amount: 170, status: "Confirmed" },
      { id: "HB-2202", hotel: "The Royal Sands", roomType: "Family Suite", guest: "Kenji Tanaka", checkIn: "Apr 22, 2025", checkOut: "Apr 25, 2025", amount: 420, status: "Pending" },
      { id: "HB-2203", hotel: "Kampot Riverside", roomType: "Standard", guest: "Ava Chen", checkIn: "May 01, 2025", checkOut: "May 02, 2025", amount: 45, status: "Completed" },
    ],
  },

  payments: {
    title: "Payments",
    columns: [
      { key: "id", label: "Payment", strong: true },
      { key: "customer", label: "Customer" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", type: "money", align: "right" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "PAY-9001", customer: "Emma Wilson", method: "ABA KHQR", amount: 170, status: "Paid" },
      { id: "PAY-9002", customer: "Kenji Tanaka", method: "Card", amount: 420, status: "Pending" },
      { id: "PAY-9003", customer: "Lucas Meyer", method: "Cash", amount: 90, status: "Paid" },
    ],
  },

  restaurants: {
    title: "Restaurants",
    columns: [
      { key: "name", label: "Restaurant", strong: true },
      { key: "location", label: "Location" },
      { key: "cuisine", label: "Cuisine" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Khmer Kitchen", location: "Phnom Penh", cuisine: "Khmer", rating: 4.8, status: "Open" },
      { id: 2, name: "Romdeng", location: "Siem Reap", cuisine: "Traditional", rating: 4.7, status: "Open" },
      { id: 3, name: "Chanry Noodles", location: "Phnom Penh", cuisine: "Street Food", rating: 4.6, status: "Closed" },
      { id: 4, name: "Night Market BBQ", location: "Siem Reap", cuisine: "BBQ", rating: 4.5, status: "Open" },
    ],
  },

  "food-categories": {
    title: "Food Categories",
    columns: [
      { key: "name", label: "Category", strong: true },
      { key: "items", label: "Items" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Main", items: 14, status: "Active" },
      { id: 2, name: "Noodles", items: 8, status: "Active" },
      { id: 3, name: "Street", items: 11, status: "Active" },
      { id: 4, name: "Dessert", items: 6, status: "Active" },
    ],
  },

  foods: {
    title: "Foods",
    columns: [
      { key: "image", label: "", type: "image" },
      { key: "name", label: "Dish", strong: true },
      { key: "category", label: "Category" },
      { key: "price", label: "Price", type: "money", align: "right" },
      { key: "available", label: "Available", type: "bool" },
    ],
    demo: [
      { id: 1, image: img("Amok trey.jpg", 200), name: "Fish Amok", category: "Main", price: 6.5, available: true },
      { id: 2, image: img("Beef Lok Lak.jpg", 200), name: "Beef Lok Lak", category: "Main", price: 7, available: true },
      { id: 3, image: img("Num Banh Chok Somlar Kari.jpg", 200), name: "Num Banh Chok", category: "Noodles", price: 3.5, available: true },
      { id: 4, image: img("Kabobs at Phnom Penh Night Market.jpg", 200), name: "Skewer BBQ", category: "Street", price: 2, available: false },
      { id: 5, image: img("Chek ktis.jpg", 200), name: "Nom Koma", category: "Dessert", price: 2.5, available: true },
    ],
  },

  "food-variants": {
    title: "Food Variants",
    columns: [
      { key: "name", label: "Variant", strong: true },
      { key: "food", label: "Food" },
      { key: "price", label: "Price", type: "money", align: "right" },
    ],
    demo: [
      { id: 1, name: "Small", food: "Fish Amok", price: 5 },
      { id: 2, name: "Large", food: "Fish Amok", price: 7.5 },
      { id: 3, name: "Spicy", food: "Beef Lok Lak", price: 7 },
    ],
  },

  "food-addons": {
    title: "Food Addons",
    columns: [
      { key: "name", label: "Addon Group", strong: true },
      { key: "items", label: "Items" },
      { key: "required", label: "Required", type: "bool" },
    ],
    demo: [
      { id: 1, name: "Extra Rice", items: 2, required: false },
      { id: 2, name: "Toppings", items: 5, required: false },
      { id: 3, name: "Drink", items: 4, required: true },
    ],
  },

  "food-addon-items": {
    title: "Addon Items",
    columns: [
      { key: "name", label: "Item", strong: true },
      { key: "group", label: "Addon Group" },
      { key: "price", label: "Price", type: "money", align: "right" },
    ],
    demo: [
      { id: 1, name: "Fried Egg", group: "Toppings", price: 0.75 },
      { id: 2, name: "Iced Tea", group: "Drink", price: 1 },
    ],
  },

  "food-orders": {
    title: "Orders",
    columns: [
      { key: "id", label: "Order ID", strong: true },
      { key: "customer", label: "Customer" },
      { key: "type", label: "Type" },
      { key: "items", label: "Items" },
      { key: "total", label: "Total", type: "money", align: "right" },
      { key: "time", label: "Time" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "FO-5001", customer: "Emma Wilson", type: "Dine-in", items: 3, total: 18.5, time: "12:30", status: "Ready" },
      { id: "FO-5002", customer: "Kenji Tanaka", type: "Delivery", items: 2, total: 12, time: "12:42", status: "Preparing" },
      { id: "FO-5003", customer: "Ava Chen", type: "Dine-in", items: 4, total: 26, time: "12:55", status: "Pending" },
      { id: "FO-5004", customer: "Lucas Meyer", type: "Delivery", items: 1, total: 6.5, time: "13:05", status: "Completed" },
    ],
  },

  tables: {
    title: "Restaurant Tables",
    columns: [
      { key: "number", label: "Table", strong: true },
      { key: "capacity", label: "Capacity" },
      { key: "status", label: "Status", type: "status" },
      { key: "order", label: "Current Order" },
      { key: "reservation", label: "Reservation" },
    ],
    demo: [
      { id: 1, number: "T-01", capacity: 2, status: "Occupied", order: "FO-5001", reservation: "—" },
      { id: 2, number: "T-02", capacity: 4, status: "Available", order: "—", reservation: "19:00" },
      { id: 3, number: "T-03", capacity: 6, status: "Reserved", order: "—", reservation: "20:00" },
      { id: 4, number: "T-04", capacity: 2, status: "Cleaning", order: "—", reservation: "—" },
    ],
  },

  reservations: {
    title: "Table Reservations",
    columns: [
      { key: "id", label: "Reservation", strong: true },
      { key: "customer", label: "Customer" },
      { key: "table", label: "Table" },
      { key: "time", label: "Time" },
      { key: "guests", label: "Guests" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "RS-301", customer: "Emma Wilson", table: "T-02", time: "19:00", guests: 3, status: "Confirmed" },
      { id: "RS-302", customer: "Sokha Dara", table: "T-03", time: "20:00", guests: 5, status: "Pending" },
    ],
  },

  ingredients: {
    title: "Ingredients",
    columns: [
      { key: "name", label: "Ingredient", strong: true },
      { key: "unit", label: "Unit" },
      { key: "stock", label: "In Stock" },
      { key: "reorder", label: "Reorder Level" },
    ],
    demo: [
      { id: 1, name: "Fish Sauce", unit: "L", stock: 24, reorder: 10 },
      { id: 2, name: "Coconut Milk", unit: "L", stock: 8, reorder: 12 },
      { id: 3, name: "Rice", unit: "kg", stock: 60, reorder: 20 },
    ],
  },

  suppliers: {
    title: "Suppliers",
    columns: [
      { key: "name", label: "Supplier", strong: true },
      { key: "contact", label: "Contact" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Orussey Market Co.", contact: "+855 12 000 111", category: "Produce", status: "Active" },
      { id: 2, name: "Mekong Seafood", contact: "+855 12 000 222", category: "Seafood", status: "Active" },
    ],
  },

  inventory: {
    title: "Inventory",
    columns: [
      { key: "item", label: "Item", strong: true },
      { key: "branch", label: "Branch" },
      { key: "qty", label: "Quantity" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, item: "Coconut Milk", branch: "Phnom Penh", qty: 8, status: "Low" },
      { id: 2, item: "Rice", branch: "Phnom Penh", qty: 60, status: "OK" },
      { id: 3, item: "Tamarind", branch: "Siem Reap", qty: 0, status: "Out" },
    ],
  },

  "inventory-tx": {
    title: "Inventory Transactions",
    columns: [
      { key: "id", label: "Tx", strong: true },
      { key: "item", label: "Item" },
      { key: "type", label: "Type" },
      { key: "qty", label: "Qty" },
      { key: "date", label: "Date" },
    ],
    demo: [
      { id: "TX-77", item: "Rice", type: "Purchase", qty: 40, date: "Apr 10, 2025" },
      { id: "TX-78", item: "Coconut Milk", type: "Waste", qty: 2, date: "Apr 11, 2025" },
    ],
  },

  recipes: {
    title: "Recipes",
    columns: [
      { key: "name", label: "Recipe", strong: true },
      { key: "food", label: "Food" },
      { key: "items", label: "Ingredients" },
    ],
    demo: [
      { id: 1, name: "Amok Base", food: "Fish Amok", items: 7 },
      { id: 2, name: "Lok Lak Sauce", food: "Beef Lok Lak", items: 5 },
    ],
  },

  users: {
    title: "Users",
    columns: [
      { key: "name", label: "User", strong: true },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: 1, name: "Sokha Dara", email: "sokha@example.com", role: "Customer", status: "Active" },
      { id: 2, name: "Tour Manager", email: "tour@sovannomnour.app", role: "Tour Manager", status: "Active" },
      { id: 3, name: "Hotel Manager", email: "hotel@sovannomnour.app", role: "Hotel Manager", status: "Active" },
      { id: 4, name: "Resto Manager", email: "resto@sovannomnour.app", role: "Restaurant Manager", status: "Inactive" },
    ],
  },

  roles: {
    title: "Roles & Permissions",
    columns: [
      { key: "name", label: "Role", strong: true },
      { key: "users", label: "Users" },
      { key: "access", label: "Access" },
    ],
    demo: [
      { id: 1, name: "Super Admin", users: 1, access: "Full platform" },
      { id: 2, name: "Tour Manager", users: 4, access: "Tour workspace" },
      { id: 3, name: "Hotel Manager", users: 3, access: "Hotel workspace" },
      { id: 4, name: "Restaurant Manager", users: 5, access: "Restaurant workspace" },
    ],
  },

  "all-bookings": {
    title: "All Bookings",
    columns: [
      { key: "id", label: "ID", strong: true },
      { key: "domain", label: "Domain" },
      { key: "customer", label: "Customer" },
      { key: "date", label: "Date" },
      { key: "amount", label: "Amount", type: "money", align: "right" },
      { key: "status", label: "Status", type: "status" },
    ],
    demo: [
      { id: "TB-1042", domain: "Tour", customer: "Emma Wilson", date: "Apr 12, 2025", amount: 90, status: "Confirmed" },
      { id: "HB-2201", domain: "Hotel", customer: "Kenji Tanaka", date: "Apr 18, 2025", amount: 170, status: "Confirmed" },
      { id: "FO-5001", domain: "Restaurant", customer: "Ava Chen", date: "Apr 20, 2025", amount: 18.5, status: "Ready" },
      { id: "TB-1045", domain: "Tour", customer: "Lucas Meyer", date: "Apr 15, 2025", amount: 105, status: "Cancelled" },
    ],
  },
};

export function entityMeta(entity) {
  return ENTITIES[entity] || { title: entity, columns: [{ key: "id", label: "ID" }], demo: [] };
}
