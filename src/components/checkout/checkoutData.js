// Shared constants + tiny helpers for the tour booking checkout flow.
// Front-end only: mock data, no backend/payment.

export const DIAL_CODES = [
  { code: "+855", country: "Cambodia" },
  { code: "+66", country: "Thailand" },
  { code: "+84", country: "Vietnam" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+1", country: "United States / Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+61", country: "Australia" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
];

export const COUNTRIES = [
  "Cambodia", "Thailand", "Vietnam", "Singapore", "Malaysia", "Japan",
  "South Korea", "China", "India", "United States", "Canada", "United Kingdom",
  "France", "Germany", "Spain", "Italy", "Netherlands", "Australia", "Other",
];

// Fallback booking so /checkout is always runnable even when opened directly.
export const MOCK_BOOKING = {
  kind: "tour",
  id: "mock-angkor-sunrise",
  title: "Angkor Wat Sunrise or Sunset Tour with Guide from Siem Reap",
  subtitle: "Small Group Sunrise Tour",
  image: "https://commons.wikimedia.org/wiki/Special:FilePath/Angkor_Wat.jpg?width=800",
  operator: "Angkor Wat Travel Tour",
  rating: 5.0,
  reviews: 12133,
  date: "2026-09-25",
  time: "4:30 AM",
  guests: 1,
  price: 19,
  priceUnit: "/adult",
  language: "English - Guide",
  pickup: "I live locally / I'm staying with friends, relatives",
  cancelCutoff: "4:30 AM on September 24",
};

export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
}

// Keep only digits, group in 4s, cap at 16 digits.
export function formatCardNumber(v) {
  const digits = (v || "").replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

// MM/YY with auto slash.
export function formatExpiry(v) {
  const digits = (v || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function cardNumberValid(v) {
  return (v || "").replace(/\s/g, "").length === 16;
}
export function expiryValid(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec((v || "").trim());
  if (!m) return false;
  const mm = Number(m[1]);
  return mm >= 1 && mm <= 12;
}
export function cvcValid(v) {
  return /^\d{3,4}$/.test((v || "").trim());
}

// Human date like "Friday, September 25, 2026" from an ISO yyyy-mm-dd.
export function longDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function bookingReference(iso) {
  const d = iso ? new Date(`${iso}T00:00:00`) : new Date();
  const stamp = Number.isNaN(d.getTime()) ? "20260925" : `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SDN-${stamp}`;
}
