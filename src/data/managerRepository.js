import { tourPlaceService } from "../services/tourPlaceService";
import { hotelService } from "../services/hotelService";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import { provinceService } from "../services/provinceService";
import { entityMeta } from "./managerData";
import { toNumber, pickPlaceImage } from "../lib/format";

// Entities that have a real backing service. Each returns rows shaped to match
// the entity's columns. Everything else uses demo data.
const SERVICE = {
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
  hotels: async () => {
    const list = await hotelService.getAllHotelsWithImages();
    return (list || []).map((h) => ({
      id: h.id,
      name: h.hotelName,
      location: h.locationName || "—",
      rooms: toNumber(h.roomCount) ?? "—",
      rating: toNumber(h.rating),
      status: h.status === "INACTIVE" ? "Inactive" : "Active",
    }));
  },
  restaurants: async () => {
    const list = await restaurantService.getAllRestaurantsWithImages();
    return (list || []).map((r) => ({
      id: r.id,
      name: r.name,
      location: r.tourismPlaceName || "—",
      cuisine: r.cuisine || "—",
      rating: toNumber(r.rating),
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
  provinces: async () => {
    const list = await provinceService.getAllProvinces();
    return (list || []).map((p) => ({ id: p.id, name: p.name, districts: "—", places: "—" }));
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
