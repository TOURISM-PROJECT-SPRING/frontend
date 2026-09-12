import { useEffect, useState } from "react";
import { roomBookingService } from "../services/roomBookingService";
import { ticketBookingService } from "../services/ticketBookingService";
import { orderService } from "../services/orderService";
import { tourPlaceService } from "../services/tourPlaceService";
import { hotelService } from "../services/hotelService";
import { roomService } from "../services/roomService";
import { restaurantService } from "../services/restaurantService";
import { ticketService } from "../services/ticketService";
import { foodService } from "../services/foodService";

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

async function fetchAll() {
  if (sharedPromise) return sharedPromise;
  sharedPromise = Promise.all([
    roomBookingService.getAllRoomBookings(),
    ticketBookingService.getAllTicketBookings(),
    orderService.getAllOrders(),
    tourPlaceService.getAllTourPlaces(),
    hotelService.getAllHotels(),
    roomService.getAllRooms(),
    restaurantService.getAllRestaurants(),
    ticketService.getAllTickets(),
    foodService.getAllFoods(),
  ])
    .then((results) => {
      sharedData = computeDashboard(results);
      setTimeout(() => {
        sharedPromise = null;
        sharedData = null;
      }, 120000);
      return sharedData;
    })
    .catch((err) => {
      console.error("Failed to load dashboard data:", err);
      sharedPromise = null;
      throw err;
    });
  return sharedPromise;
}

export default function useDashboardData() {
  const [data, setData] = useState(sharedData);
  const [loading, setLoading] = useState(!sharedData);

  useEffect(() => {
    if (sharedData) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchAll()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}