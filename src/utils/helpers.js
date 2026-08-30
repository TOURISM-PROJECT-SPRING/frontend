const withQuery = (id, w = 600, h = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const HOTEL_IMAGES = [
  withQuery("photo-1566073771259-6a8506099945"),
  withQuery("photo-1551882547-ff40c63fe5fa"),
  withQuery("photo-1571896349842-33c89424de2d"),
  withQuery("photo-1520250497591-112f2f40a3f4"),
  withQuery("photo-1582719508461-905c673771fd"),
  withQuery("photo-1504214208698-ea1916a2195a"),
];

export const RESTAURANT_IMAGES = [
  withQuery("photo-1517248135467-4c7edcad34c4"),
  withQuery("photo-1414235077428-338989a2e8c0"),
  withQuery("photo-1559339352-11d035aa65de"),
  withQuery("photo-1555939594-58d7cb561ad1"),
  withQuery("photo-1504674900247-0877df9cc836"),
  withQuery("photo-1544025162-d76694265947"),
];

export const DESTINATION_IMAGES = [
  withQuery("photo-1508159441828-3d031a33e1e3"),
  withQuery("photo-1544551763-46a013bb70d5"),
  withQuery("photo-1569949381669-ecf31ae866fd"),
  withQuery("photo-1441974231531-c6227db76b6e"),
  withQuery("photo-1507525428034-b723cf961d3e"),
  withQuery("photo-1470071459604-3b5ec3a7fe05"),
];

export const TRAVEL_IMAGES = [
  withQuery("photo-1508159441828-3d031a33e1e3"),
  withQuery("photo-1507525428034-b723cf961d3e"),
  withQuery("photo-1569949381669-ecf31ae866fd"),
  withQuery("photo-1441974231531-c6227db76b6e"),
  withQuery("photo-1544551763-46a013bb70d5"),
  withQuery("photo-1469854523086-cc02fe5d8800"),
];

export function pickImage(list, seed) {
  return list[Math.abs(Number(seed) || 0) % list.length];
}

export function primaryPlaceImage(place, fallback = TRAVEL_IMAGES[0]) {
  const images = place?.placeImages;
  const primary = images?.find((i) => i.isPrimary);
  return primary?.imageUrl || images?.[0]?.imageUrl || fallback;
}

export function formatPrice(value) {
  const n = Number(value) || 0;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 !== 0 ? 2 : 0 })}`;
}

export function formatTime(value) {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}