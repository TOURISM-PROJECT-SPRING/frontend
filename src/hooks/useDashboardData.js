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

function computeDashboard([roomBookings, ticketBookings, foodOrders, tourPlaces, hotels, rooms, restaurants, tickets, foods]) {
  const rb = roomBookings || [];
  const tb = ticketBookings || [];
  const fo = foodOrders || [];
  const tp = tourPlaces || [];
  const hs = hotels || [];
  const rs = rooms || [];
  const rest = restaurants || [];
  const tks = tickets || [];
  const fds = foods || [];

  const totalBookings = rb.length + tb.length + fo.length;
  const totalRevenue = [...rb, ...tb, ...fo].reduce((sum, b) => sum + amountOf(b), 0);

  const ratings = tp.map((p) => Number(p.rating)).filter((r) => r > 0);
  const avgRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null;

  const allBookings = [
    ...rb.map((b) => ({
      id: `RB-${b.id}`,
      type: "Room",
      guest: b.userName || "Guest",
      property: b.hotelName || "Hotel",
      date: shortDate(b.checkIn || b.createdAt),
      amount: money(b.amount),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
    ...tb.map((b) => ({
      id: `TB-${b.id}`,
      type: "Ticket",
      guest: b.userName || "Guest",
      property: b.tourismPlaceName || b.ticketName || "Tour",
      date: shortDate(b.visitDate || b.createdAt),
      amount: money(b.totalPrice),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
    ...fo.map((b) => ({
      id: `FO-${b.id}`,
      type: "Food",
      guest: b.userName || "Guest",
      property: b.restaurantName || "Restaurant",
      date: shortDate(b.createdAt),
      amount: money(b.totalPrice),
      status: b.status || "PENDING",
      createdAt: new Date(b.createdAt || 0),
    })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const monthMap = new Map();
  [...rb, ...tb, ...fo].forEach((b) => {
    const k = monthKey(b.createdAt);
    monthMap.set(k, (monthMap.get(k) || 0) + amountOf(b));
  });
  const revenueByMonth = [...monthMap.entries()]
    .sort()
    .slice(-6)
    .map(([k, v]) => ({ month: monthLabel(k), revenue: v }));

  const weekOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayMap = new Map();
  const weekdayCounts = { hotel: {}, ticket: {}, food: {} };
  [...rb, ...tb, ...fo].forEach((b) => {
    const d = new Date(b.createdAt);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    weekdayMap.set(label, (weekdayMap.get(label) || 0) + amountOf(b));
  });
  rb.forEach((b) => {
    const label = new Date(b.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    weekdayCounts.hotel[label] = (weekdayCounts.hotel[label] || 0) + 1;
  });
  tb.forEach((b) => {
    const label = new Date(b.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    weekdayCounts.ticket[label] = (weekdayCounts.ticket[label] || 0) + 1;
  });
  fo.forEach((b) => {
    const label = new Date(b.createdAt).toLocaleDateString("en-US", { weekday: "short" });
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
    { name: "Hotel Rooms", value: rb.length, color: "#3b82f6" },
    { name: "Tickets", value: tb.length, color: "#22c55e" },
    { name: "Food Orders", value: fo.length, color: "#f59e0b" },
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

  const activeRoomBookings = rb.filter((b) => b.status && b.status !== "CANCELLED").length;
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
    totalBookings,
    totalRevenue,
    revenueText: money(totalRevenue),
    avgRating,
    totalPlaces: tp.length,
    totalHotels: hs.length,
    totalRooms: rs.length,
    totalRestaurants: rest.length,
    totalFoods: fds.length,
    totalTickets: tks.length,
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

async function fetchAll() {
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

  return { data, loading, error, reload };
}