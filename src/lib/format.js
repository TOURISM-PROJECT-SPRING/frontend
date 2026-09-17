// Small formatting + derivation helpers shared across the API integration layer.

export function money(n, { digits = 0 } = {}) {
  if (n == null || n === "" || Number.isNaN(Number(n))) return null;
  const v = Number(n);
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function toNumber(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

// Derive open/closed from "HH:mm" (or "HH:mm:ss") strings against Phnom Penh local time.
export function isOpenNow(openTime, closeTime, now = new Date()) {
  const parse = (t) => {
    if (!t) return null;
    const m = String(t).match(/(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
  };
  const o = parse(openTime);
  const c = parse(closeTime);
  if (o == null || c == null) return null;
  const mins = now.getHours() * 60 + now.getMinutes();
  if (c >= o) return mins >= o && mins < c;
  return mins >= o || mins < c; // crosses midnight
}

export function timeLabel(t) {
  if (!t) return null;
  const m = String(t).match(/(\d{1,2}):(\d{2})/);
  if (!m) return String(t);
  let h = Number(m[1]);
  const mm = m[2];
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ap}`;
}

// Pick the best image URL from a tour place's attachment list.
export function pickPlaceImage(images) {
  if (!Array.isArray(images) || images.length === 0) return null;
  const primary = images.find((i) => i.isPrimary) || images[0];
  return primary?.imageUrl || null;
}

export function joinImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((i) => i?.imageUrl).filter(Boolean);
}
