// Pure helpers for the unified Explore page: province enrichment, filtering and
// same-province matching. Uses province NAMES (the only province concept the
// backend exposes) but tracks the destination/location id as `provinceId` so
// filtering is still id-driven wherever the API gives us one.

import { toNumber } from "./format";

export const SECTION_META = {
  tours: { icon: "compass", label: "Tours", blurb: "Explore temples, islands and adventures." },
  hotels: { icon: "bed", label: "Hotels", blurb: "Find a comfortable place to stay." },
  restaurants: { icon: "utensils", label: "Restaurants", blurb: "Taste authentic Khmer cuisine." },
  all: { icon: "layers", label: "Everything", blurb: "See tours, hotels and restaurants together." },
};

export const DURATION_OPTIONS = [
  { id: "any", label: "Any length" },
  { id: "half", label: "Half day" },
  { id: "1", label: "1 day" },
  { id: "2", label: "2 days" },
  { id: "3", label: "3+ days" },
];

export const RATING_OPTIONS = [
  { id: "0", label: "Any rating" },
  { id: "4", label: "4.0 & up" },
  { id: "4.5", label: "4.5 & up" },
  { id: "4.8", label: "4.8 & up" },
];

export const PRICE_MAX = 300;

export function norm(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Build { name -> provinceId } from the destinations/provinces list.
export function buildProvinceIndex(provinces) {
  const map = new Map();
  for (const p of provinces || []) {
    const key = norm(p.title || p.name);
    if (!map.has(key) && p.id != null) map.set(key, p.id);
  }
  return map;
}

// Attach province + provinceId to an item when it has location/province info.
export function enrichProvince(item, index) {
  const name = item.province || item.location || item.title || "";
  const province = item.province || item.location || null;
  const id = index.get(norm(province)) ?? index.get(norm(name)) ?? null;
  return { ...item, province, provinceId: id ?? item.provinceId ?? null };
}

// Does `item` belong to the selected province (by id or normalised name)?
export function inProvince(item, provinceId, provinces) {
  if (provinceId == null || provinceId === "all") return true;
  if (item.provinceId != null && String(item.provinceId) === String(provinceId)) return true;
  const target = provinces.find((p) => String(p.id) === String(provinceId));
  if (!target) return item.province == null || norm(item.province) === norm(target.title || target.name);
  const tn = norm(target.title || target.name);
  const i = norm(item.province) || norm(item.location);
  return Boolean(i && (tn.includes(i) || i.includes(tn)));
}

// Parse a duration label like "1 Day", "2 Days", "Half Day" into a number.
export function durationValue(label) {
  if (!label) return null;
  const s = String(label).toLowerCase();
  if (s.includes("half")) return 0.5;
  const m = s.match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
}

export function matchesDuration(label, filter) {
  if (!filter || filter === "any") return true;
  const v = durationValue(label);
  if (v == null) return true; // unknown duration — don't hide real data
  if (filter === "half") return v < 1;
  if (filter === "3") return v >= 3;
  return v >= Number(filter) && v < Number(filter) + 1;
}

export function applyExploreFilters(items, filters, provinces) {
  const q = norm(filters.q);
  const minPrice = filters.minPrice != null && filters.minPrice !== "" ? toNumber(filters.minPrice) : null;
  const maxPrice = filters.maxPrice != null && filters.maxPrice !== "" ? toNumber(filters.maxPrice) : null;
  const minRating = toNumber(filters.minRating ?? 0);

  return items.filter((item) => {
    if (!inProvince(item, filters.provinceId, provinces)) return false;
    if (filters.category && filters.category !== "all" && norm(item.category) !== norm(filters.category)) return false;
    if (filters.duration && filters.duration !== "any" && !matchesDuration(item.duration, filters.duration)) return false;
    if (minPrice != null && (item.price == null || item.price < minPrice)) return false;
    if (maxPrice != null && item.price != null && item.price > maxPrice) return false;
    if (minRating > 0 && (item.rating == null || item.rating < minRating)) return false;
    if (q && ![item.title, item.subtitle, item.location, item.province, item.category, item.description].some((f) => f && norm(f).includes(q))) return false;
    return true;
  });
}

export function uniqueCategories(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const c = it.category;
    if (c && !seen.has(c)) {
      seen.add(c);
      const count = items.filter((x) => x.category === c).length;
      out.push({ id: c, name: c, count });
    }
  }
  return out;
}

// Stable same-province recommendation: never mix provinces.
export function sameProvince(items, tour) {
  const targets = [tour?.province, tour?.location].filter(Boolean).map(norm);
  if (!targets.length) return [];
  const scored = items
    .map((item) => {
      const hay = [item.province, item.location].filter(Boolean).map(norm);
      const score = hay.some((h) => targets.some((t) => h === t || h.includes(t) || t.includes(h))) ? 1 : 0;
      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => (b.item.rating || 0) - (a.item.rating || 0));
  return scored.map((r) => r.item);
}

export function guideFallback() {
  return { id: "local", name: "Licensed local guide", languages: "Khmer, English, French", experience: 5, rating: 4.8 };
}