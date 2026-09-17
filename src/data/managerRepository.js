import { tourPlaceService } from "../services/tourPlaceService";
import { hotelService } from "../services/hotelService";
import { hotelAttachmentService } from "../services/hotelAttachmentService";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import { foodCategoryService } from "../services/foodCategoryService";
import { provinceService } from "../services/provinceService";
import { districtService } from "../services/districtService";
import { placeCategoryService } from "../services/placeCategoryService";
import { roomTypeService } from "../services/roomTypeService";
import { roomService } from "../services/roomService";
import { ticketBookingService } from "../services/ticketBookingService";
import { roomBookingService } from "../services/roomBookingService";
import { orderService } from "../services/orderService";
import { managementService } from "../services/managementService";
import { entityMeta } from "./managerData";
import { toNumber, pickPlaceImage } from "../lib/format";

// Entities that have a real backing service. Each returns rows shaped to match
// the entity's columns. Everything else uses demo data.

const fmtDate = (d) => {
  if (!d) return null;
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return null;
  }
};

const timeOf = (d) => {
  if (!d) return null;
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return String(d);
    return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return null;
  }
};

const label = (s) => (s == null || s === "" ? "—" : s);

const SERVICE = {
  // ---- Tours ----
  "tour-places": async () => {
    const list = await tourPlaceService.getAllTourPlaces();
    return (list || []).map((t) => ({
      id: t.id,
      _image: pickPlaceImage(t.placeImages),
      name: t.name,
      category: t.placeCategory?.name || "—",
      district: t.district?.name || t.address || "—",
      rating: toNumber(t.rating),
      status: t.status === "ACTIVE" ? "Active" : t.status || "Active",
    }));
  },
  "tour-packages": async () => {
    const list = await managementService.getTourPackages();
    return (list || []).map((p) => ({
      id: p.id,
      name: p.name,
      province: p.locationName || "—",
      duration: p.durationDays != null ? `${p.durationDays} Day${p.durationDays > 1 ? "s" : ""}` : "—",
      price: toNumber(p.price),
      rating: toNumber(p.avgRating),
      status: "Active",
    }));
  },
  "tour-guides": async () => {
    const list = await managementService.getTourGuides();
    return (list || []).map((g) => ({
      id: g.id,
      name: g.userName || g.userEmail || "—",
      languages: g.languageSpoken || "—",
      phone: "—",
      rating: null,
      status: "Active",
    }));
  },
  "place-categories": async () => {
    const list = await placeCategoryService.getAllCategories();
    return (list || []).map((c) => ({ id: c.id, name: c.name || "—", places: "—", status: "Active" }));
  },
  provinces: async () => {
    const list = await provinceService.getAllProvinces();
    return (list || []).map((p) => ({ id: p.id, name: label(p.name), districts: "—", places: "—" }));
  },
  districts: async () => {
    const list = await districtService.getAllDistricts();
    return (list || []).map((d) => ({
      id: d.id,
      name: d.name || "—",
      province: d.province?.name || "—",
      places: "—",
    }));
  },
  "tour-bookings": async () => {
    const list = await ticketBookingService.getAllTicketBookings();
    return (list || []).map((b) => ({
      id: `TB-${b.id}`,
      pkg: b.ticketName || b.tourismPlaceName || "—",
      customer: b.userName || "—",
      date: fmtDate(b.visitDate || b.createdAt),
      guests: toNumber(b.quantity),
      total: toNumber(b.totalPrice),
      status: b.status,
    }));
  },
  reviews: async () => {
    const list = await managementService.getReviews();
    return (list || []).map((r) => ({
      id: r.id,
      target: r.targetName || "—",
      customer: r.userName || "—",
      rating: toNumber(r.rating),
      comment: r.comment || "—",
    }));
  },
  "tour-images": async () => {
    const places = await tourPlaceService.getAllTourPlaces();
    const rows = [];
    for (const p of places || []) {
      for (const img of p.placeImages || []) {
        rows.push({
          id: `${p.id}-${img.id}`,
          image: img.imageUrl,
          target: p.name,
          type: img.isPrimary ? "PRIMARY" : "GALLERY",
          primary: img.isPrimary,
        });
      }
    }
    return rows;
  },

  // ---- Hotels ----
  hotels: async () => {
    const list = await hotelService.getAllHotelsWithImages();
    return (list || []).map((h) => ({
      id: h.id,
      name: h.hotelName,
      location: h.locationName || "—",
      rooms: toNumber(h.roomCount) ?? "—",
      rating: toNumber(h.rating ?? h.avgRating),
      status: h.status === "INACTIVE" ? "Inactive" : "Active",
    }));
  },
  "room-types": async () => {
    const list = await roomTypeService.getAllRoomTypes();
    return (list || []).map((rt) => ({
      id: rt.id,
      name: rt.roomType || "—",
      capacity: toNumber(rt.capacity),
      price: null,
      count: null,
    }));
  },
  rooms: async () => {
    const list = await roomService.getAllRooms();
    return (list || []).map((r) => ({
      id: r.id,
      number: `R-${r.id}`,
      hotel: r.hotelName || "—",
      type: r.roomType || "—",
      floor: null,
      status: "Available",
    }));
  },
  "hotel-bookings": async () => {
    const list = await roomBookingService.getAllRoomBookings();
    return (list || []).map((b) => ({
      id: `HB-${b.id}`,
      hotel: b.hotelName || "—",
      roomType: b.roomType || "—",
      guest: b.userName || "—",
      checkIn: fmtDate(b.checkIn),
      checkOut: fmtDate(b.checkOut),
      amount: toNumber(b.amount),
      status: b.status,
    }));
  },
  payments: async () => {
    const list = await managementService.getPayments();
    return (list || []).map((p) => ({
      id: `PAY-${p.id}`,
      customer: p.referenceName || "—",
      method: p.paymentMethod || "—",
      amount: toNumber(p.amount),
      status: p.status,
    }));
  },
  "hotel-images": async () => {
    const hotels = await hotelService.getAllHotels();
    const rows = await Promise.all(
      (hotels || []).map(async (h) => {
        const atts = await hotelAttachmentService.getHotelAttachments(h.id).catch(() => []);
        return (atts || []).map((a, i) => ({
          id: `${h.id}-${a.id || i}`,
          image: a.cloudinaryUrl,
          hotel: h.hotelName || "—",
          type: a.type || "GALLERY",
        }));
      })
    );
    return rows.flat();
  },

  // ---- Restaurants ----
  restaurants: async () => {
    const list = await restaurantService.getAllRestaurantsWithImages();
    return (list || []).map((r) => ({
      id: r.id,
      name: r.name,
      location: r.tourismPlaceName || "—",
      cuisine: r.cuisine || "—",
      rating: toNumber(r.rating ?? r.avgRating),
      status: "Active",
    }));
  },
  "food-categories": async () => {
    const list = await foodCategoryService.getAllFoodCategories();
    return (list || []).map((c) => ({
      id: c.id,
      name: c.name || "—",
      items: "—",
      status: "Active",
    }));
  },
  foods: async () => {
    const list = await foodService.getAllFoods();
    return (list || []).map((f) => ({
      id: f.id,
      image: f.image,
      name: f.name,
      category: f.foodCategoryName || "—",
      price: toNumber(f.price),
      available: f.isAvailable !== false,
    }));
  },
  "food-orders": async () => {
    const list = await orderService.getAllOrders();
    return (list || []).map((o) => ({
      id: `FO-${o.id}`,
      customer: o.userName || "—",
      type: "—",
      items: null,
      total: toNumber(o.totalPrice),
      time: timeOf(o.createdAt || o.pickupTime),
      status: o.status,
    }));
  },

  // ---- Admin / all bookings ----
  users: async () => {
    const list = await managementService.getUsers();
    return (list || []).map((u) => ({
      id: u.id,
      name: u.fullname || u.username || "—",
      email: u.email || "—",
      role: Array.isArray(u.roles) ? u.roles.join(", ") : (u.roles || "—"),
      status: u.status || "Active",
    }));
  },
  roles: async () => {
    const list = await managementService.getRoles();
    return (list || []).map((r) => ({
      id: r.id,
      name: r.name || "—",
      users: toNumber(r.userCount),
      access: "—",
    }));
  },
  "all-bookings": async () => {
    const [tb, rb, fo] = await Promise.allSettled([
      ticketBookingService.getAllTicketBookings(),
      roomBookingService.getAllRoomBookings(),
      orderService.getAllOrders(),
    ]);
    const pick = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value : []);
    const rows = [
      ...pick(tb).map((b) => ({
        id: `TB-${b.id}`,
        domain: "Tour",
        customer: b.userName || "—",
        date: fmtDate(b.visitDate || b.createdAt),
        amount: toNumber(b.totalPrice),
        status: b.status,
      })),
      ...pick(rb).map((b) => ({
        id: `HB-${b.id}`,
        domain: "Hotel",
        customer: b.userName || "—",
        date: fmtDate(b.checkIn || b.createdAt),
        amount: toNumber(b.amount),
        status: b.status,
      })),
      ...pick(fo).map((o) => ({
        id: `FO-${o.id}`,
        domain: "Restaurant",
        customer: o.userName || "—",
        date: fmtDate(o.createdAt || o.pickupTime),
        amount: toNumber(o.totalPrice),
        status: o.status,
      })),
    ];
    return rows.sort((a, b) => String(b.id).localeCompare(String(a.id)));
  },
};

export const managerRepository = {
  async fetch(entity) {
    const meta = entityMeta(entity);
    const svc = SERVICE[entity];
    if (svc) {
      try {
        const rows = await svc();
        if (Array.isArray(rows) && rows.length) return { items: rows, source: "api" };
      } catch {
        /* fall through to demo */
      }
    }
    return { items: meta.demo, source: "demo" };
  },
};