import { tourPlaceService } from "../services/tourPlaceService";
import { ticketService } from "../services/ticketService";
import { hotelService } from "../services/hotelService";
import { hotelRoomService } from "../services/hotelRoomService";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import { provinceService } from "../services/provinceService";
import { placeCategoryService } from "../services/placeCategoryService";
import { ticketBookingService } from "../services/ticketBookingService";
import { roomBookingService } from "../services/roomBookingService";
import { orderService } from "../services/orderService";
import {
  normalizeTourPlace,
  normalizeHotel,
  normalizeRestaurant,
  normalizeProvince,
  normalizeFood,
  normalizeTicket,
  normalizeHotelRoom,
  normalizeTicketBooking,
  normalizeRoomBooking,
  normalizeFoodOrder,
} from "./normalizers";
import {
  fallbackTours,
  fallbackHotels,
  fallbackRestaurants,
  fallbackDestinations,
  fallbackFoods,
  fallbackRooms,
  fallbackBookings,
} from "./fallbacks";
import { demoExtraHotels } from "./hotels";
import { demoRestaurants, decorateRestaurants } from "./restaurants";
import { toNumber } from "../lib/format";

// Each fetcher returns { items, source } where source is "api" or "demo".
// We fall back to demo data when the backend is unreachable OR when it
// responds successfully but with no content — so the site always looks
// complete, and automatically switches to real data once the DB is seeded.

async function tryApi(fn, fallback) {
  try {
    const items = await fn();
    if (Array.isArray(items) && items.length === 0) {
      return { items: fallback, source: "demo" };
    }
    return { items: items ?? [], source: "api" };
  } catch (e) {
    return { items: fallback, source: "demo", error: e };
  }
}

// min ticket price per tourism place id
async function ticketPriceByPlace() {
  const map = {};
  try {
    const tickets = await ticketService.getAvailableTickets();
    for (const t of tickets || []) {
      const pid = t.tourismPlaceId;
      const price = toNumber(t.price);
      if (pid == null || price == null) continue;
      if (map[pid] == null || price < map[pid].price) {
        map[pid] = { price, ticketId: t.id };
      }
    }
  } catch {
    /* ignore — prices optional */
  }
  return map;
}

async function hotelPriceByHotel() {
  const map = {};
  try {
    const rooms = await hotelRoomService.getAllHotelRooms();
    for (const r of rooms || []) {
      const hid = r.hotelId;
      const price = toNumber(r.pricePerNight);
      if (hid == null || price == null) continue;
      if (map[hid] == null || price < map[hid].price) {
        map[hid] = { price, roomId: r.id, roomType: r.roomType };
      }
    }
  } catch {
    /* ignore */
  }
  return map;
}

export const repository = {
  async getTours() {
    return tryApi(async () => {
      const [places, priceByPlace] = await Promise.all([
        tourPlaceService.getAllTourPlaces(),
        ticketPriceByPlace(),
      ]);
      return (places || []).map((t) => normalizeTourPlace(t, priceByPlace));
    }, fallbackTours);
  },

  async getTour(id) {
    return tryApi(async () => {
      const [t, tickets] = await Promise.all([
        tourPlaceService.getTourPlaceById(id),
        ticketService.getTicketsByTourismPlace(id).catch(() => []),
      ]);
      const card = normalizeTourPlace(t, {});
      card.tickets = (tickets || []).map(normalizeTicket);
      return [card];
    }, fallbackTours.filter((x) => String(x.id) === String(id)));
  },

  async getHotels() {
    return tryApi(async () => {
      const [hotels, priceByHotel] = await Promise.all([
        hotelService.getAllHotelsWithImages(),
        hotelPriceByHotel(),
      ]);
      return (hotels || []).map((h) => normalizeHotel(h, priceByHotel));
    }, fallbackHotels);
  },

  async getHotel(id) {
    const res = await tryApi(async () => {
      const [h, rooms] = await Promise.all([
        hotelService.getHotelByIdWithImages(id),
        hotelRoomService.getHotelRoomsByHotel(id).catch(() => []),
      ]);
      const card = normalizeHotel(h, {});
      card.rooms = (rooms || []).map(normalizeHotelRoom);
      if (card.price == null && card.rooms.length) {
        card.price = Math.min(...card.rooms.map((r) => r.price).filter((p) => p != null));
        card.priceUnit = "/night";
      }
      return [card];
    }, [...fallbackHotels, ...demoExtraHotels].filter((x) => String(x.id) === String(id)));
    if (res.source === "demo" && res.items[0] && !res.items[0].rooms) res.items[0].rooms = fallbackRooms;
    return res;
  },

  async getRestaurants() {
    return tryApi(
      async () => {
        const list = await restaurantService.getAllRestaurantsWithImages();
        return (list || []).map(normalizeRestaurant);
      },
      fallbackRestaurants
    );
  },

  async getRestaurant(id) {
    const res = await tryApi(async () => {
      const [r, foods] = await Promise.all([
        restaurantService.getRestaurantByIdWithImages(id),
        foodService.getFoodsByRestaurant(id).catch(() => []),
      ]);
      const card = normalizeRestaurant(r);
      card.menu = (foods || []).map(normalizeFood);
      return [card];
    }, [...fallbackRestaurants, ...decorateRestaurants(demoRestaurants)].filter((x) => String(x.id) === String(id)));
    if (res.source === "demo" && res.items[0] && !res.items[0].menu) res.items[0].menu = fallbackFoods;
    return res;
  },

  async getFoodsByRestaurant(id) {
    return tryApi(
      async () => {
        const foods = await foodService.getFoodsByRestaurant(id);
        return (foods || []).map(normalizeFood);
      },
      fallbackFoods
    );
  },

  async getDestinations() {
    return tryApi(
      async () => {
        const list = await provinceService.getAllProvinces();
        return (list || []).map(normalizeProvince);
      },
      fallbackDestinations
    );
  },

  async getCategories() {
    return tryApi(async () => {
      const list = await placeCategoryService.getAllCategories();
      return (list || []).map((c) => ({ id: c.id, name: c.name }));
    }, [
      { id: "all", name: "All" },
      { id: "culture", name: "Culture" },
      { id: "nature", name: "Nature" },
      { id: "adventure", name: "Adventure" },
      { id: "food", name: "Food" },
    ]);
  },

  // ---- Dashboard bookings: aggregate the 3 booking services ----
  // Uses the signed-in user's id when available (user-specific endpoints),
  // otherwise falls back to the global "all" endpoints.
  async getBookings() {
    let userId = null;
    try {
      const raw = localStorage.getItem("sdn.user");
      const u = raw ? JSON.parse(raw) : null;
      if (u && u.id != null) userId = u.id;
    } catch {
      /* ignore */
    }

    const [tickets, rooms, orders] = await Promise.allSettled(
      userId != null
        ? [
            ticketBookingService.getTicketBookingsByUser(userId),
            roomBookingService.getRoomBookingsByUser(userId),
            orderService.getOrdersByUser(userId),
          ]
        : [
            ticketBookingService.getAllTicketBookings(),
            roomBookingService.getAllRoomBookings(),
            orderService.getAllOrders(),
          ]
    );
    const pick = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []);
    const items = [
      ...pick(tickets).map(normalizeTicketBooking),
      ...pick(rooms).map(normalizeRoomBooking),
      ...pick(orders).map(normalizeFoodOrder),
    ];
    const anyError = [tickets, rooms, orders].some((r) => r.status === "rejected");
    if (items.length === 0) {
      return { items: fallbackBookings, source: "demo", error: anyError ? "backend" : null };
    }
    return { items, source: "api" };
  },

  async getDashboardStats() {
    const { items, source } = await this.getBookings();
    const upcoming = items.filter((b) => ["Confirmed", "Pending"].includes(b.status));
    return {
      items: [
        { label: "Upcoming Trips", value: upcoming.filter((b) => b.kind === "tour").length, icon: "luggage", tone: "green" },
        { label: "Hotel Bookings", value: items.filter((b) => b.kind === "hotel").length, icon: "bed", tone: "gold" },
        { label: "Restaurant Orders", value: items.filter((b) => b.kind === "restaurant").length, icon: "utensils", tone: "green" },
        { label: "Saved Places", value: source === "demo" ? 8 : upcoming.length, icon: "heart", tone: "gold" },
      ],
      source,
    };
  },

  // ---- Same-province recommendations for a chosen tour ----
  async getRecommendationsForTour(tour) {
    if (!tour) return { hotels: [], restaurants: [], source: "demo" };
    const tokens = [tour.province, tour.location]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase());
    const matches = (item) => {
      const hay = [item.province, item.location].filter(Boolean).map((s) => String(s).toLowerCase());
      return tokens.some((t) => hay.some((h) => h === t || h.includes(t) || t.includes(h)));
    };
    const [hotels, restaurants] = await Promise.all([this.getHotels(), this.getRestaurants()]);
    const src = hotels.source === "api" || restaurants.source === "api" ? "api" : "demo";
    let nearHotels = hotels.items.filter(matches);
    let nearRestaurants = restaurants.items.filter(matches);
    if (nearHotels.length === 0) nearHotels = hotels.items.slice(0, 2);
    if (nearRestaurants.length === 0) nearRestaurants = restaurants.items.slice(0, 2);
    return { hotels: nearHotels.slice(0, 3), restaurants: nearRestaurants.slice(0, 3), source: src };
  },
};
