import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Shared trip cart for tours and hotels (and optional restaurant selections).
// Persisted to localStorage so the cart survives navigation and refresh.

const STORAGE_KEY = "sdn.tripCart";

const TripCartContext = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function TripCartProvider({ children }) {
  const [items, setItems] = useState(() => load());
  const [isOpen, setIsOpen] = useState(false);
  const [flashed, setFlashed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const key = item.key || `${item.kind}-${item.id}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, key, qty }];
    });
    setFlashed((v) => !v);
  }, []);

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const summary = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + (Number(i.price) || 0) * i.qty, 0);
    return { count, subtotal };
  }, [items]);

  const province = useMemo(() => items.find((i) => i.province)?.province || null, [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      flashed,
      province,
      ...summary,
      openCart,
      closeCart,
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [items, isOpen, flashed, province, summary, openCart, closeCart, addItem, setQty, removeItem, clear]
  );

  return <TripCartContext.Provider value={value}>{children}</TripCartContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useTripCart() {
  const ctx = useContext(TripCartContext);
  if (!ctx) throw new Error("useTripCart must be used within a TripCartProvider");
  return ctx;
}