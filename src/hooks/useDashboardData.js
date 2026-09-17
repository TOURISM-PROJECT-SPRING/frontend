import { useCallback, useEffect, useState } from "react";
import { roomBookingService } from "../services/roomBookingService";
import { ticketBookingService } from "../services/ticketBookingService";
import { orderService } from "../services/orderService";
import { tourPlaceService } from "../services/tourPlaceService";
import { hotelService } from "../services/hotelService";
import { roomService } from "../services/roomService";
import { restaurantService } from "../services/restaurantService";
import { ticketService } from "../services/ticketService";
import { foodService } from "../services/foodService";
import { adminService } from "../services/adminService";
import { managementService } from "../services/managementService";
import { img } from "../data/site";
import { pickPlaceImage } from "../lib/format";

let sharedPromise = null;
let sharedData = null;

const money = (v) =>
  `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const shortDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-US", { month: "short" });
};

const amountOf = (b) => Number(b.amount ?? b.totalPrice) || 0;

// Default fallbacks for sparklines and trends
const DEFAULT_TREND = [
  { label: "Nov", value: 120 },
  { label: "Dec", value: 158 },
  { label: "Jan", value: 142 },
  { label: "Feb", value: 190 },
  { label: "Mar", value: 232 },
  { label: "Apr", value: 276 },
];

const DEFAULT_OCCUPANCY = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 70 },
  { label: "Wed", value: 66 },
  { label: "Thu", value: 78 },
  { label: "Fri", value: 90 },
  { label: "Sat", value: 96 },
  { label: "Sun", value: 84 },
];

const DEFAULT_ORDERS_TREND = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 63 },
  { label: "Fri", value: 88 },
  { label: "Sat", value: 104 },
  { label: "Sun", value: 76 },
];

function computeDashboard(input = {}) {
  let rb, tb, fo, tp, hs, rs, rest, tks, fds, us, pkgs, guides;
  if (Array.isArray(input)) {
    [rb, tb, fo, tp, hs, rs, rest, tks, fds, us, pkgs, guides] = input;
  } else if (input && typeof input === "object") {
    ({
      roomBookings: rb,
      ticketBookings: tb,
      foodOrders: fo,
      tourPlaces: tp,
      hotels: hs,
      rooms: rs,
      restaurants: rest,
      tickets: tks,
      foods: fds,
      users: us,
      tourPackages: pkgs,
      tourGuides: guides,
    } = input);
  }

  rb = Array.isArray(rb) ? rb : [];
  tb = Array.isArray(tb) ? tb : [];
  fo = Array.isArray(fo) ? fo : [];
  tp = Array.isArray(tp) ? tp : [];
  hs = Array.isArray(hs) ? hs : [];
  rs = Array.isArray(rs) ? rs : [];
  rest = Array.isArray(rest) ? rest : [];
  tks = Array.isArray(tks) ? tks : [];
  fds = Array.isArray(fds) ? fds : [];
  us = Array.isArray(us) ? us : [];
  pkgs = Array.isArray(pkgs) ? pkgs : [];
  guides = Array.isArray(guides) ? guides : [];

  const totalBookings = rb.length + tb.length + fo.length;
  const totalRevenue = [...rb, ...tb, ...fo].reduce((sum, b) => sum + amountOf(b), 0);

  const ratings = tp.map((p) => Number(p.rating)).filter((r) => r > 0);
  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "4.8";

  const allBookings = [
    ...rb.map((b) => ({
      id: `HB-${b.id}`,
      type: "Room",
      domain: "Hotel",
      guest: b.userName || "Guest",
      customer: b.userName || "Guest",
      property: b.hotelName || "Hotel",
      date: shortDate(b.checkIn || b.createdAt),
      amount: money(b.amount),
      total: Number(b.amount || 0),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
    ...tb.map((b) => ({
      id: `TB-${b.id}`,
      type: "Ticket",
      domain: "Tour",
      guest: b.userName || "Guest",
      customer: b.userName || "Guest",
      property: b.tourismPlaceName || b.ticketName || "Tour",
      date: shortDate(b.visitDate || b.createdAt),
      amount: money(b.totalPrice),
      total: Number(b.totalPrice || 0),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
    ...fo.map((b) => ({
      id: `FO-${b.id}`,
      type: "Food",
      domain: "Restaurant",
      guest: b.userName || "Guest",
      customer: b.userName || "Guest",
      property: b.restaurantName || "Restaurant",
      date: shortDate(b.createdAt),
      amount: money(b.totalPrice),
      total: Number(b.totalPrice || 0),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  // Month-by-month calculation
  const monthMap = new Map();
  [...rb, ...tb, ...fo].forEach((b) => {
    const k = monthKey(b.createdAt || new Date());
    monthMap.set(k, (monthMap.get(k) || 0) + amountOf(b));
  });
  const revenueByMonth = monthMap.size >= 3
    ? [...monthMap.entries()]
        .sort()
        .slice(-6)
        .map(([k, v]) => ({ month: monthLabel(k), revenue: v }))
    : [
        { month: "Jan", revenue: 38000 },
        { month: "Feb", revenue: 42000 },
        { month: "Mar", revenue: 47000 },
        { month: "Apr", revenue: 52000 },
        { month: "May", revenue: 49000 },
        { month: "Jun", revenue: 58000 },
      ];

  // Bookings trend
  const bookingsCountByMonth = new Map();
  [...rb, ...tb, ...fo].forEach((b) => {
    const k = monthKey(b.createdAt || new Date());
    bookingsCountByMonth.set(k, (bookingsCountByMonth.get(k) || 0) + 1);
  });
  const bookingsTrend = bookingsCountByMonth.size >= 3
    ? [...bookingsCountByMonth.entries()]
        .sort()
        .slice(-6)
        .map(([k, v]) => ({ label: monthLabel(k), value: v }))
    : DEFAULT_TREND;

  // Mix breakdown
  const tourCount = tb.length || 46;
  const hotelCount = rb.length || 33;
  const foodCount = fo.length || 21;
  const mix = [
    { label: "Tours", value: tourCount, color: "#02462e" },
    { label: "Hotels", value: hotelCount, color: "#fec700" },
    { label: "Restaurants", value: foodCount, color: "#4f8d70" },
  ];

  // Unique customers
  const customerSet = new Set();
  [...rb, ...tb, ...fo].forEach((b) => {
    if (b.userEmail) customerSet.add(b.userEmail);
    else if (b.userName) customerSet.add(b.userName);
  });
  const totalCustomers = us.length || customerSet.size || 4820;

  // Active listings
  const activeListings = (hs.length || 4) + (tp.length || 5) + (rest.length || 4);

  // ----------------------------------------------------------------
  // HOTEL DOMAIN STATS
  // ----------------------------------------------------------------
  const hotelRevenue = rb.reduce((sum, b) => sum + amountOf(b), 0);
  const activeRoomBookings = rb.filter((b) => b.status && b.status !== "CANCELLED").length;
  const upcomingReservations = rb.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;
  const totalRoomsCount = rs.length || 242;
  const availableRoomsCount = Math.max(0, totalRoomsCount - activeRoomBookings) || 86;

  const hotelStats = {
    totalHotels: hs.length || 4,
    totalRooms: totalRoomsCount,
    availableRooms: availableRoomsCount,
    upcomingReservations: upcomingReservations || 54,
    monthlyRevenue: hotelRevenue > 0 ? money(hotelRevenue) : "$32.5k",
    occupancy: DEFAULT_OCCUPANCY,
    availability: [
      { label: "Available", value: availableRoomsCount, tone: "bg-success" },
      { label: "Occupied", value: activeRoomBookings || 120, tone: "bg-danger" },
      { label: "Reserved", value: upcomingReservations || 24, tone: "bg-warning" },
      { label: "Maintenance", value: 12, tone: "bg-brand-300" },
    ],
    hotels: hs.length
      ? hs.slice(0, 4).map((h) => ({
          id: h.id,
          name: h.hotelName,
          meta: h.locationName || h.district?.name || "Cambodia",
          price: h.pricePerNight || 85,
          rating: Number(h.rating ?? h.avgRating ?? 4.8),
          image: h.imageUrl || img("Palm Paradise Pool.jpg", 600),
        }))
      : [
          { id: 1, name: "Sofitel Angkor Phokeethra", meta: "Siem Reap", price: 120, rating: 4.8, image: img("Palm Paradise Pool.jpg", 600) },
          { id: 2, name: "The Royal Sands", meta: "Sihanoukville", price: 85, rating: 4.6, image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 600) },
          { id: 3, name: "Kampot Riverside Villa", meta: "Kampot", price: 60, rating: 4.7, image: img("Main swimming pool at Paradisus by Meliá Bali.jpg", 600) },
          { id: 4, name: "Kep Garden Resort", meta: "Kep", price: 55, rating: 4.5, image: img("Negombo Beach resort pool (Unsplash).jpg", 600) },
        ],
  };

  // ----------------------------------------------------------------
  // TOUR DOMAIN STATS
  // ----------------------------------------------------------------
  const tourRevenue = tb.reduce((sum, b) => sum + amountOf(b), 0);
  const upcomingTourBookings = tb.filter((b) => b.status === "PENDING" || b.status === "CONFIRMED").length;

  const tourStats = {
    totalPackages: pkgs.length || tp.length || 5,
    activeTours: tp.length || 4,
    upcomingBookings: upcomingTourBookings || 128,
    totalRevenue: tourRevenue > 0 ? money(tourRevenue) : "$48.2k",
    availableGuides: guides.length || 3,
    bookingsTrend: bookingsTrend,
    packages: tp.length
      ? tp.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          meta: p.district?.name || "Cambodia",
          price: Number(p.ticketPrice || 45),
          rating: Number(p.rating || 4.9),
          image: pickPlaceImage(p.placeImages) || img("Angkor Wat, reflejo 2.jpg", 600),
        }))
      : [
          { id: 1, name: "Angkor Sunrise Explorer", meta: "Siem Reap", price: 45, rating: 4.9, image: img("Angkor Wat, reflejo 2.jpg", 600) },
          { id: 2, name: "Island Escape — Koh Rong", meta: "Sihanoukville", price: 120, rating: 4.8, image: img("Koh_Rong_island.jpg", 600) },
          { id: 3, name: "Mondulkiri Elephant Trek", meta: "Mondulkiri", price: 95, rating: 4.9, image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 600) },
          { id: 4, name: "Phnom Penh Highlights", meta: "Phnom Penh", price: 35, rating: 4.7, image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 600) },
        ],
  };

  // ----------------------------------------------------------------
  // RESTAURANT DOMAIN STATS
  // ----------------------------------------------------------------
  const restaurantRevenue = fo.reduce((sum, b) => sum + amountOf(b), 0);
  const pendingFoodOrders = fo.filter((o) => o.status === "PENDING").length;

  const restaurantStats = {
    todayOrders: fo.length || 38,
    pendingOrders: pendingFoodOrders || 6,
    totalFoods: fds.length || 42,
    activeTables: 12,
    todayRevenue: restaurantRevenue > 0 ? money(restaurantRevenue) : "$1.2k",
    ordersTrend: DEFAULT_ORDERS_TREND,
    dishes: fds.length
      ? fds.slice(0, 4).map((f) => ({
          id: f.id,
          name: f.name,
          meta: f.foodCategoryName || "Main",
          price: Number(f.price || 6.5),
          image: f.image || img("Amok trey.jpg", 600),
        }))
      : [
          { id: 1, name: "Fish Amok", meta: "Main", price: 6.5, image: img("Amok trey.jpg", 600) },
          { id: 2, name: "Beef Lok Lak", meta: "Main", price: 7, image: img("Beef Lok Lak.jpg", 600) },
          { id: 3, name: "Num Banh Chok", meta: "Noodles", price: 3.5, image: img("Num Banh Chok Somlar Kari.jpg", 600) },
          { id: 4, name: "Nom Koma", meta: "Dessert", price: 2.5, image: img("Chek ktis.jpg", 600) },
        ],
  };

  // ----------------------------------------------------------------
  // SUPER ADMIN OVERVIEW STATS
  // ----------------------------------------------------------------
  const superAdminStats = {
    totalUsers: us.length || totalCustomers,
    tourPackages: pkgs.length || tp.length || 5,
    hotels: hs.length || 4,
    restaurants: rest.length || 4,
    totalBookings: totalBookings || 1284,
    totalRevenue: totalRevenue > 0 ? money(totalRevenue) : "$286k",
    revenueTrend: revenueByMonth,
    mix: mix,
  };

  // Weekday breakdown
  const weekOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayMap = new Map();
  const weekdayCounts = { hotel: {}, ticket: {}, food: {} };
  [...rb, ...tb, ...fo].forEach((b) => {
    const d = new Date(b.createdAt || Date.now());
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    weekdayMap.set(label, (weekdayMap.get(label) || 0) + amountOf(b));
  });
  rb.forEach((b) => {
    const label = new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: "short" });
    weekdayCounts.hotel[label] = (weekdayCounts.hotel[label] || 0) + 1;
  });
  tb.forEach((b) => {
    const label = new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: "short" });
    weekdayCounts.ticket[label] = (weekdayCounts.ticket[label] || 0) + 1;
  });
  fo.forEach((b) => {
    const label = new Date(b.createdAt || Date.now()).toLocaleDateString("en-US", { weekday: "short" });
    weekdayCounts.food[label] = (weekdayCounts.food[label] || 0) + 1;
  });
  const revenueByWeekday = weekOrder
    .filter((day) => weekdayMap.has(day))
    .map((day) => ({ day, revenue: weekdayMap.get(day) }));
  const bookingsByWeekday = weekOrder
    .filter((day) => weekdayCounts.hotel[day] || weekdayCounts.ticket[day] || weekdayCounts.food[day])
    .map((day) => ({
      day,
      hotel: weekdayCounts.hotel[day] || 0,
      ticket: weekdayCounts.ticket[day] || 0,
      food: weekdayCounts.food[day] || 0,
    }));

  const bookingsByType = [
    { name: "Hotel Rooms", value: rb.length, color: "#1b3b2b" },
    { name: "Tickets", value: tb.length, color: "#f4b938" },
    { name: "Food Orders", value: fo.length, color: "#2d6a4f" },
  ].filter((x) => x.value > 0);
  const totalChannel = bookingsByType.reduce((sum, x) => sum + x.value, 0);

  const hotelMap = new Map();
  rb.forEach((b) => {
    const key = b.hotelName || `Hotel ${b.hotelId}`;
    const cur = hotelMap.get(key) || { name: key, bookings: 0, revenue: 0 };
    cur.bookings += 1;
    cur.revenue += amountOf(b);
    hotelMap.set(key, cur);
  });
  const topProperties = [...hotelMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxPropBookings = topProperties[0]?.bookings || 1;
  topProperties.forEach((p, i) => {
    p.rank = i + 1;
    p.revenueText = money(p.revenue);
    p.popularity = Math.round((p.bookings / maxPropBookings) * 100);
  });

  const placeMap = new Map();
  tb.forEach((b) => {
    const key = b.tourismPlaceName || b.ticketName || `Place ${b.tourismPlaceId}`;
    const cur = placeMap.get(key) || { name: key, bookings: 0, revenue: 0 };
    cur.bookings += 1;
    cur.revenue += amountOf(b);
    placeMap.set(key, cur);
  });
  const placeRating = new Map(tp.map((p) => [p.name, Number(p.rating) || null]));
  const placeLocation = new Map(tp.map((p) => [p.name, p.district?.province?.name || ""]));
  const topPlaces = [...placeMap.values()].sort((a, b) => b.bookings - a.bookings).slice(0, 5);
  topPlaces.forEach((p, i) => {
    p.rank = i + 1;
    p.rating = placeRating.get(p.name) ?? null;
    p.location = placeLocation.get(p.name) || "";
    p.revenueText = money(p.revenue);
  });

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;
  const bookingsThisWeek = [...rb, ...tb, ...fo].filter((b) => {
    const t = new Date(b.createdAt || 0).getTime();
    return t > weekAgo && t <= now;
  }).length;
  const bookingsLastWeek = [...rb, ...tb, ...fo].filter((b) => {
    const t = new Date(b.createdAt || 0).getTime();
    return t > twoWeeksAgo && t <= weekAgo;
  }).length;
  const bookingsDelta = bookingsLastWeek
    ? Math.round(((bookingsThisWeek - bookingsLastWeek) / bookingsLastWeek) * 100)
    : null;

  const occupancyRate = rs.length ? Math.round((activeRoomBookings / rs.length) * 100) : null;

  return {
    roomBookings: rb,
    ticketBookings: tb,
    foodOrders: fo,
    tourPlaces: tp,
    hotels: hs,
    rooms: rs,
    restaurants: rest,
    tickets: tks,
    foods: fds,
    users: us,
    totalBookings: totalBookings || 1284,
    totalRevenue,
    revenueText: totalRevenue > 0 ? money(totalRevenue) : "$286k",
    totalPlaces: tp.length,
    totalHotels: hs.length,
    totalRooms: rs.length,
    totalRestaurants: rest.length,
    totalFoods: fds.length,
    totalTickets: tks.length,
    activeListings,
    totalCustomers,
    avgRating,
    allBookings,
    revenueByMonth,
    revenueByWeekday,
    bookingsByWeekday,
    bookingsByType,
    totalChannel,
    bookingsDelta,
    occupancyRate,
    topProperties,
    topPlaces,
    bookingsTrend,
    mix,
    hotelStats,
    tourStats,
    restaurantStats,
    superAdminStats,
  };
}

const BOOKING_TYPE_LABEL = { ROOM: "Room", TICKET: "Ticket", FOOD_ORDER: "Food", TOUR: "Tour" };
const BREAKDOWN_LABEL = { ROOM: "Hotel Rooms", TICKET: "Tickets", FOOD_ORDER: "Food Orders", TOUR: "Tours" };
const BREAKDOWN_COLOR = { ROOM: "#3b82f6", TICKET: "#22c55e", FOOD_ORDER: "#f59e0b", TOUR: "#a855f7" };

// Overlay the backend's dedicated admin dashboard endpoint
// (GET /api/admin/dashboard-stats) on top of the aggregated fallback data so
// the overview reflects the server's authoritative totals.
function mergeAdminStats(dashboard, stats) {
  dashboard.backendConnected = Boolean(stats);
  if (!stats) return;

  dashboard.totalUsers = Number(stats.totalUsers) || 0;
  dashboard.pendingOrders = Number(stats.pendingOrders) || 0;
  dashboard.activePromotions = Number(stats.activePromotions) || 0;

  if (stats.totalBookings != null) {
    dashboard.totalBookings = Number(stats.totalBookings) || 0;
  }
  if (stats.totalRevenue != null) {
    dashboard.totalRevenue = Number(stats.totalRevenue) || 0;
    dashboard.revenueText = money(dashboard.totalRevenue);
  }

  if (Array.isArray(stats.revenueTrend) && stats.revenueTrend.length) {
    dashboard.revenueByMonth = stats.revenueTrend.map((m) => ({
      month: m.label,
      revenue: Number(m.revenue) || 0,
    }));
  }

  if (stats.bookingBreakdown && typeof stats.bookingBreakdown === "object") {
    const breakdown = Object.entries(stats.bookingBreakdown)
      .map(([key, value]) => ({
        name: BREAKDOWN_LABEL[key] || key,
        value: Number(value) || 0,
        color: BREAKDOWN_COLOR[key] || "#94a3b8",
      }))
      .filter((x) => x.value > 0);
    if (breakdown.length) {
      dashboard.bookingsByType = breakdown;
      dashboard.totalChannel = breakdown.reduce((sum, x) => sum + x.value, 0);
    }
  }

  if (Array.isArray(stats.recentBookings) && stats.recentBookings.length) {
    dashboard.recentBookings = stats.recentBookings.map((b) => ({
      id: b.id,
      type: BOOKING_TYPE_LABEL[b.bookingType] || b.bookingType || "Room",
      guest: b.customerName || "Guest",
      property: b.serviceName || "",
      date: shortDate(b.bookingDate || b.createdAt),
      amount: money(b.totalAmount),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    }));
  }
}

const SOURCES = [
  ["room bookings", roomBookingService.getAllRoomBookings],
  ["ticket bookings", ticketBookingService.getAllTicketBookings],
  ["food orders", orderService.getAllOrders],
  ["tour places", tourPlaceService.getAllTourPlaces],
  ["hotels", hotelService.getAllHotels],
  ["rooms", roomService.getAllRooms],
  ["restaurants", restaurantService.getAllRestaurants],
  ["tickets", ticketService.getAllTickets],
  ["foods", foodService.getAllFoods],
  ["users", managementService.getUsers],
  ["admin stats", adminService.getDashboardStats],
];

const AGGREGATE_KEYS = [
  "room bookings",
  "ticket bookings",
  "food orders",
  "tour places",
  "hotels",
  "rooms",
  "restaurants",
  "tickets",
  "foods",
  "users",
];

// Turn an axios error into something readable in the UI so a failed backend
// call is obvious instead of silently rendering zeros.
function describeError(e) {
  if (!e) return null;
  const status = e.response?.status;
  const detail = e.response?.data?.message || e.response?.data?.error;
  if (status) return detail ? `HTTP ${status} — ${detail}` : `HTTP ${status}`;
  if (e.request) return "No response from the API (is the backend running on localhost:8080?)";
  return e.message || "Unknown error";
}

async function fetchAll(force = false) {
  if (force) {
    sharedPromise = null;
    sharedData = null;
  }
  if (sharedPromise) return sharedPromise;
  sharedPromise = Promise.allSettled(SOURCES.map(([, request]) => request())).then((settled) => {
    const byLabel = {};
    const failed = [];
    let firstError = null;
    settled.forEach((result, i) => {
      const label = SOURCES[i][0];
      if (result.status === "fulfilled") {
        byLabel[label] = result.value;
      } else {
        failed.push(label);
        if (!firstError) firstError = result.reason;
      }
    });
    if (failed.length) {
      console.warn(`Dashboard: ${failed.length}/${settled.length} sources failed (${failed.join(", ")}). Showing partial data.`);
    }
    const dashboard = computeDashboard(AGGREGATE_KEYS.map((key) => byLabel[key]));
    mergeAdminStats(dashboard, byLabel["admin stats"]);
    // Fallback: if the admin-stats endpoint is unavailable, still report the
    // user count from the management users endpoint.
    if (dashboard.totalUsers == null && Array.isArray(byLabel["users"])) {
      dashboard.totalUsers = byLabel["users"].length;
    }
    dashboard.partial = failed.length > 0;
    dashboard.failedSources = failed;
    dashboard.error = describeError(firstError);
    dashboard.loadedAt = Date.now();

    // Only cache a load that actually reached the backend, so a total
    // failure doesn't stick for two minutes and block a retry.
    if (failed.length < settled.length) {
      sharedData = dashboard;
      setTimeout(() => {
        sharedPromise = null;
        sharedData = null;
      }, 120000);
    } else {
      sharedPromise = null;
    }
    return dashboard;
  });
  return sharedPromise;
}

export default function useDashboardData() {
  const [data, setData] = useState(sharedData);
  const [loading, setLoading] = useState(!sharedData);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => {
    sharedPromise = null;
    sharedData = null;
    setData(null);
    setError(null);
    setLoading(true);
    setTick((t) => t + 1);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const d = await fetchAll(true);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sharedData) {
      setData(sharedData);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchAll()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        if (!cancelled) {
          setError(describeError(err) || "Could not load dashboard data.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  return { data, loading, error, reload, refresh };
}