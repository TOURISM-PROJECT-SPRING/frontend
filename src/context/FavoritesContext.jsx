import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Favorites ("My trips") — the lightweight, price-free list fed by the heart
// buttons on cards and detail pages. Only display data is stored (kind, id,
// title, image, location); bookings are placed directly from detail pages.
// Persisted to localStorage so saved places survive reloads.

const STORAGE_KEY = "sdn.favorites.v1";

const FavoritesContext = createContext(null);

function sanitize(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((i) => i && i.key && i.title)
    .map(({ key, kind, id, title, image, location, href }) => ({ key, kind, id, title, image, location, href }));
}

function load() {
  try {
    return sanitize(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [items, setItems] = useState(load);
  const [isOpen, setIsOpen] = useState(false);
  const [flashed, setFlashed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — favorites stay in memory for this session */
    }
  }, [items]);

  const openFavorites = useCallback(() => setIsOpen(true), []);
  const closeFavorites = useCallback(() => setIsOpen(false), []);

  const isSaved = useCallback(
    (kind, id) => items.some((i) => i.key === `${kind}-${id}`),
    [items]
  );

  // Add a place to the list (idempotent). Returns true when something was added.
  const add = useCallback(
    (item) => {
      const key = item.key || `${item.kind}-${item.id}`;
      if (items.some((i) => i.key === key)) return false;
      setItems((prev) =>
        prev.some((i) => i.key === key)
          ? prev
          : [...prev, { kind: item.kind, id: item.id, key, title: item.title, image: item.image, location: item.location, href: item.href }]
      );
      setFlashed((v) => !v);
      return true;
    },
    [items]
  );

  // Heart toggle: saves the item or removes it if already saved.
  // Returns true when the item ended up saved, false when removed.
  const toggle = useCallback(
    (item) => {
      const key = item.key || `${item.kind}-${item.id}`;
      const exists = items.some((i) => i.key === key);
      if (exists) {
        setItems(items.filter((i) => i.key !== key));
        return false;
      }
      add(item);
      return true;
    },
    [items, add]
  );

  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isOpen,
      flashed,
      openFavorites,
      closeFavorites,
      isSaved,
      add,
      toggle,
      remove,
      clear,
    }),
    [items, isOpen, flashed, openFavorites, closeFavorites, isSaved, add, toggle, remove, clear]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
