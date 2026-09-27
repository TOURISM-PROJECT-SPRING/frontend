// FoodOrderResponse has no payment-method or table column — the backend has no
// concept of either — so the only way to show them on a dining order afterwards
// is to remember them client-side at checkout time, keyed by order id.
//
// The stored shape is { [orderId]: { paymentMethod, fulfilment, tableNumber } }.
// Entries written by an older build are bare method strings, so reads treat a
// string value as { paymentMethod: <string> }.
const FOOD_ORDER_PREFS_KEY = "smart_tourism_food_order_prefs";

// Legacy key written by the first version of this module.
const LEGACY_PAYMENT_KEY = "smart_tourism_food_order_payment";

const PAYMENT_LABELS = {
  BAKONG_KHQR: "Bakong KHQR",
  CARD: "Card",
  CASH: "Cash on Collection",
};

function readAll() {
  let parsed = {};
  try {
    const raw = localStorage.getItem(FOOD_ORDER_PREFS_KEY);
    const obj = raw ? JSON.parse(raw) : {};
    if (obj && typeof obj === "object") parsed = obj;
  } catch {
    parsed = {};
  }

  try {
    const legacy = localStorage.getItem(LEGACY_PAYMENT_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      for (const [id, method] of Object.entries(old || {})) {
        if (!parsed[id]) parsed[id] = { paymentMethod: method };
      }
    }
  } catch {
    // Ignore an unreadable legacy blob.
  }

  return parsed;
}

function writeAll(all) {
  try {
    localStorage.setItem(FOOD_ORDER_PREFS_KEY, JSON.stringify(all));
  } catch {
    // Private-mode / quota failures are non-fatal: the order still goes through,
    // the voucher just falls back to its default labels.
  }
}

export function rememberFoodOrderPrefs(orderId, prefs) {
  if (orderId == null || !prefs) return;
  const all = readAll();
  all[String(orderId)] = { ...(all[String(orderId)] || {}), ...prefs };
  writeAll(all);
}

export function readFoodOrderPrefs(orderId) {
  const entry = readAll()[String(orderId)];
  if (!entry) return null;
  if (typeof entry === "string") return { paymentMethod: entry };
  return entry;
}

export function foodOrderPaymentLabel(orderId) {
  return PAYMENT_LABELS[readFoodOrderPrefs(orderId)?.paymentMethod] || "Cash on Collection";
}
