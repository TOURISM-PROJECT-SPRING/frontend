import { img } from "./site";

// Single source of truth for the multi-role manager area.
// view: dashboard | list | kanban | rooms | menu | analytics | settings | profile | superadmin | switch
// list items carry an `entity` key resolved by managerRepository.

export const WORKSPACES = {
  tour: {
    key: "tour",
    name: "Tour Management",
    title: "Tour Manager",
    subtitle: "Manage your destinations, experiences, and tour bookings.",
    icon: "compass",
    image: img("Bayon temple 02.jpg", 1000),
    base: "/manager/tour",
    nav: [
      { label: "Dashboard", to: "/manager/tour", icon: "grid", view: "dashboard" },
      {
        label: "Tour Management",
        items: [
          { label: "Tourist Places", to: "/manager/tour/places", icon: "landmark", view: "list", entity: "tour-places" },
          { label: "Tour Packages", to: "/manager/tour/packages", icon: "ticket", view: "list", entity: "tour-packages" },
          { label: "Package Stops", to: "/manager/tour/stops", icon: "map-pin", view: "list", entity: "tour-stops" },
          { label: "Tour Guides", to: "/manager/tour/guides", icon: "user", view: "list", entity: "tour-guides" },
          { label: "Tour Categories", to: "/manager/tour/categories", icon: "layers", view: "list", entity: "place-categories" },
          { label: "Provinces", to: "/manager/tour/provinces", icon: "globe", view: "list", entity: "provinces" },
          { label: "Districts", to: "/manager/tour/districts", icon: "globe", view: "list", entity: "districts" },
        ],
      },
      {
        label: "Bookings",
        items: [{ label: "Tour Bookings", to: "/manager/tour/bookings", icon: "calendar", view: "list", entity: "tour-bookings" }],
      },
      {
        label: "Management",
        items: [
          { label: "Customers", to: "/manager/tour/customers", icon: "users", view: "list", entity: "customers" },
          { label: "Reviews", to: "/manager/tour/reviews", icon: "star", view: "list", entity: "reviews" },
          { label: "Tour Images", to: "/manager/tour/images", icon: "eye", view: "list", entity: "tour-images" },
        ],
      },
      { label: "Analytics", to: "/manager/tour/analytics", icon: "trending-up", view: "analytics" },
      { label: "Reports", to: "/manager/tour/reports", icon: "trending-up", view: "analytics" },
      { label: "Settings", to: "/manager/tour/settings", icon: "settings", view: "settings" },
      { label: "Profile", to: "/manager/tour/profile", icon: "user", view: "profile" },
    ],
  },

  hotel: {
    key: "hotel",
    name: "Hotel Management",
    title: "Hotel Manager",
    subtitle: "Manage your hotel, rooms, and reservations.",
    icon: "bed",
    image: img("Palm Paradise Pool.jpg", 1000),
    base: "/manager/hotel",
    nav: [
      { label: "Dashboard", to: "/manager/hotel", icon: "grid", view: "dashboard" },
      {
        label: "Hotel Management",
        items: [
          { label: "Hotels", to: "/manager/hotel/hotels", icon: "bed", view: "list", entity: "hotels" },
          { label: "Room Types", to: "/manager/hotel/room-types", icon: "grid", view: "list", entity: "room-types" },
          { label: "Rooms", to: "/manager/hotel/rooms", icon: "layers", view: "list", entity: "rooms" },
          { label: "Hotel Images", to: "/manager/hotel/images", icon: "eye", view: "list", entity: "hotel-images" },
          { label: "Opening Hours", to: "/manager/hotel/hours", icon: "clock", view: "list", entity: "hotel-hours" },
        ],
      },
      {
        label: "Bookings",
        items: [{ label: "Hotel Bookings", to: "/manager/hotel/bookings", icon: "calendar", view: "list", entity: "hotel-bookings" }],
      },
      {
        label: "Operations",
        items: [
          { label: "Room Availability", to: "/manager/hotel/availability", icon: "grid", view: "rooms" },
          { label: "Guests", to: "/manager/hotel/guests", icon: "users", view: "list", entity: "customers" },
          { label: "Payments", to: "/manager/hotel/payments", icon: "trending-up", view: "list", entity: "payments" },
        ],
      },
      { label: "Analytics", to: "/manager/hotel/analytics", icon: "trending-up", view: "analytics" },
      { label: "Reports", to: "/manager/hotel/reports", icon: "trending-up", view: "analytics" },
      { label: "Settings", to: "/manager/hotel/settings", icon: "settings", view: "settings" },
      { label: "Profile", to: "/manager/hotel/profile", icon: "user", view: "profile" },
    ],
  },

  restaurant: {
    key: "restaurant",
    name: "Restaurant Management",
    title: "Restaurant Manager",
    subtitle: "Manage your menu, orders, and restaurant operations.",
    icon: "utensils",
    image: img("Fish Amok.jpg", 1000),
    base: "/manager/restaurant",
    nav: [
      { label: "Dashboard", to: "/manager/restaurant", icon: "grid", view: "dashboard" },
      {
        label: "Restaurant Management",
        items: [
          { label: "Restaurants", to: "/manager/restaurant/restaurants", icon: "utensils", view: "list", entity: "restaurants" },
          { label: "Food Categories", to: "/manager/restaurant/categories", icon: "grid", view: "list", entity: "food-categories" },
          { label: "Foods", to: "/manager/restaurant/foods", icon: "utensils", view: "menu" },
          { label: "Food Variants", to: "/manager/restaurant/variants", icon: "layers", view: "list", entity: "food-variants" },
          { label: "Food Addons", to: "/manager/restaurant/addons", icon: "plus", view: "list", entity: "food-addons" },
          { label: "Addon Items", to: "/manager/restaurant/addon-items", icon: "plus", view: "list", entity: "food-addon-items" },
        ],
      },
      {
        label: "Operations",
        items: [
          { label: "Orders", to: "/manager/restaurant/orders", icon: "ticket", view: "list", entity: "food-orders" },
          { label: "Kitchen Board", to: "/manager/restaurant/kitchen", icon: "grid", view: "kanban" },
          { label: "Tables", to: "/manager/restaurant/tables", icon: "layers", view: "tables" },
          { label: "Reservations", to: "/manager/restaurant/reservations", icon: "calendar", view: "list", entity: "reservations" },
          { label: "Customers", to: "/manager/restaurant/customers", icon: "users", view: "list", entity: "customers" },
        ],
      },
      {
        label: "Inventory",
        items: [
          { label: "Ingredients", to: "/manager/restaurant/ingredients", icon: "layers", view: "list", entity: "ingredients" },
          { label: "Suppliers", to: "/manager/restaurant/suppliers", icon: "users", view: "list", entity: "suppliers" },
          { label: "Inventory", to: "/manager/restaurant/inventory", icon: "grid", view: "list", entity: "inventory" },
          { label: "Transactions", to: "/manager/restaurant/transactions", icon: "trending-up", view: "list", entity: "inventory-tx" },
          { label: "Recipes", to: "/manager/restaurant/recipes", icon: "utensils", view: "list", entity: "recipes" },
        ],
      },
      { label: "Analytics", to: "/manager/restaurant/analytics", icon: "trending-up", view: "analytics" },
      { label: "Reports", to: "/manager/restaurant/reports", icon: "trending-up", view: "analytics" },
      { label: "Settings", to: "/manager/restaurant/settings", icon: "settings", view: "settings" },
      { label: "Profile", to: "/manager/restaurant/profile", icon: "user", view: "profile" },
    ],
  },

  admin: {
    key: "admin",
    name: "Super Admin",
    title: "Platform Overview",
    subtitle: "Full platform management and analytics.",
    icon: "shield",
    image: img("Skyline of Phnom Penh.jpg", 1000),
    base: "/manager/admin",
    nav: [
      { label: "Dashboard", to: "/manager/admin", icon: "grid", view: "superadmin" },
      { label: "Users", to: "/manager/admin/users", icon: "users", view: "list", entity: "users" },
      { label: "Roles & Permissions", to: "/manager/admin/roles", icon: "shield", view: "list", entity: "roles" },
      { label: "Tour Management", to: "/manager/tour", icon: "compass", view: "switch", switchTo: "tour" },
      { label: "Hotel Management", to: "/manager/hotel", icon: "bed", view: "switch", switchTo: "hotel" },
      { label: "Restaurant Management", to: "/manager/restaurant", icon: "utensils", view: "switch", switchTo: "restaurant" },
      { label: "Bookings", to: "/manager/admin/bookings", icon: "calendar", view: "list", entity: "all-bookings" },
      { label: "Reports", to: "/manager/admin/reports", icon: "trending-up", view: "analytics" },
      { label: "Settings", to: "/manager/admin/settings", icon: "settings", view: "settings" },
    ],
  },
};

export const WORKSPACE_ORDER = ["tour", "hotel", "restaurant", "admin"];

export const PICKER = {
  tour: { eyebrow: "Tours", title: "Tour Management", description: "Explore and manage tour packages and travel experiences.", icon: "compass", cta: "Open Tour Manager", to: "/manager/tour", image: WORKSPACES.tour.image },
  hotel: { eyebrow: "Hotels", title: "Hotel Management", description: "Manage rooms, reservations, and hotel operations.", icon: "bed", cta: "Open Hotel Manager", to: "/manager/hotel", image: WORKSPACES.hotel.image },
  restaurant: { eyebrow: "Restaurants", title: "Restaurant Management", description: "Manage menus, food orders, and restaurant operations.", icon: "utensils", cta: "Open Restaurant Manager", to: "/manager/restaurant", image: WORKSPACES.restaurant.image },
  admin: { eyebrow: "Platform", title: "Super Admin", description: "Full platform oversight across every business line.", icon: "shield", cta: "Open Admin Console", to: "/manager/admin", image: WORKSPACES.admin.image },
};

export function workspaceForPath(pathname) {
  if (pathname.startsWith("/manager/tour")) return "tour";
  if (pathname.startsWith("/manager/hotel")) return "hotel";
  if (pathname.startsWith("/manager/restaurant")) return "restaurant";
  if (pathname.startsWith("/manager/admin")) return "admin";
  return null;
}

export function flattenNav(wsKey) {
  const ws = WORKSPACES[wsKey];
  if (!ws) return [];
  const out = [];
  for (const entry of ws.nav) {
    if (entry.items) entry.items.forEach((it) => out.push(it));
    else out.push(entry);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Unified management console                                          */
/* ------------------------------------------------------------------ */
// The console is one workspace that groups Tours, Hotels and Restaurants
// together — no "choose your workspace" step. UNIFIED_NAV drives the
// sidebar (curated to the spec); the page routes are still grouped by
// business under /manager.

export const UNIFIED_NAV = [
  { label: "Overview", to: "/manager", icon: "grid", view: "overview" },
  {
    label: "Tours",
    icon: "compass",
    items: [
      { label: "Tour Overview", to: "/manager/tour", icon: "compass", view: "dashboard", ws: "tour" },
      { label: "Tour Places", to: "/manager/tour/places", icon: "landmark", view: "list", entity: "tour-places", ws: "tour" },
      { label: "Tour Packages", to: "/manager/tour/packages", icon: "ticket", view: "list", entity: "tour-packages", ws: "tour" },
      { label: "Tour Bookings", to: "/manager/tour/bookings", icon: "calendar", view: "list", entity: "tour-bookings", ws: "tour" },
      { label: "Tour Guides", to: "/manager/tour/guides", icon: "user", view: "list", entity: "tour-guides", ws: "tour" },
      { label: "Tour Categories", to: "/manager/tour/categories", icon: "layers", view: "list", entity: "place-categories", ws: "tour" },
    ],
  },
  {
    label: "Hotels",
    icon: "bed",
    items: [
      { label: "Hotel Overview", to: "/manager/hotel", icon: "bed", view: "dashboard", ws: "hotel" },
      { label: "Hotels", to: "/manager/hotel/hotels", icon: "bed", view: "list", entity: "hotels", ws: "hotel" },
      { label: "Room Types", to: "/manager/hotel/room-types", icon: "grid", view: "list", entity: "room-types", ws: "hotel" },
      { label: "Rooms", to: "/manager/hotel/rooms", icon: "layers", view: "list", entity: "rooms", ws: "hotel" },
      { label: "Hotel Bookings", to: "/manager/hotel/bookings", icon: "calendar", view: "list", entity: "hotel-bookings", ws: "hotel" },
    ],
  },
  {
    label: "Restaurants",
    icon: "utensils",
    items: [
      { label: "Restaurant Overview", to: "/manager/restaurant", icon: "utensils", view: "dashboard", ws: "restaurant" },
      { label: "Restaurants", to: "/manager/restaurant/restaurants", icon: "utensils", view: "list", entity: "restaurants", ws: "restaurant" },
      { label: "Food Categories", to: "/manager/restaurant/categories", icon: "grid", view: "list", entity: "food-categories", ws: "restaurant" },
      { label: "Foods", to: "/manager/restaurant/foods", icon: "layers", view: "menu", ws: "restaurant" },
      { label: "Orders", to: "/manager/restaurant/orders", icon: "ticket", view: "list", entity: "food-orders", ws: "restaurant" },
      { label: "Customers", to: "/manager/restaurant/customers", icon: "users", view: "list", entity: "customers", ws: "restaurant" },
    ],
  },
];

export const UNIFIED_BOTTOM_NAV = [
  { label: "Settings", to: "/manager/tour/settings", icon: "settings", view: "settings", ws: "tour" },
  { label: "Profile", to: "/manager/tour/profile", icon: "user", view: "profile", ws: "tour" },
];
