import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const OWNER_BIZ_KEY_PREFIX = "smart_tourism_owner_businesses_";

export const BUSINESS_TYPES = [
  {
    id: "hotel",
    label: "Hotel & Stays",
    shortLabel: "Hotels",
    icon: "Building2",
    color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800",
    badge: "🏨 Hotel",
    description: "Manage properties, room types, pricing, and guest bookings",
  },
  {
    id: "restaurant",
    label: "Restaurant & Dining",
    shortLabel: "Restaurants",
    icon: "UtensilsCrossed",
    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800",
    badge: "🍽️ Restaurant",
    description: "Manage restaurants, food menus, dish prices, and food orders",
  },
  {
    id: "tour",
    label: "Tours & Experiences",
    shortLabel: "Tours",
    icon: "Compass",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    badge: "🎫 Tour",
    description: "Manage tourism places, attraction tickets, and packages",
  },
];

const OwnerBusinessContext = createContext(null);

export function OwnerBusinessProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  const storageKey = `${OWNER_BIZ_KEY_PREFIX}${userId}`;

  const [businessTypes, setBusinessTypesState] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    // Default to hotel, or if role specifies
    return ["hotel"];
  });

  const [activeBusinessView, setActiveBusinessView] = useState("all");

  // Reload when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBusinessTypesState(parsed);
          return;
        }
      }
    } catch {}
    // default
    setBusinessTypesState(["hotel"]);
  }, [storageKey]);

  const saveTypes = useCallback(
    (types) => {
      const valid = types.filter((t) => ["hotel", "restaurant", "tour"].includes(t));
      const finalTypes = valid.length > 0 ? valid : ["hotel"];
      setBusinessTypesState(finalTypes);
      try {
        localStorage.setItem(storageKey, JSON.stringify(finalTypes));
      } catch (e) {
        console.error("Failed to save owner business types:", e);
      }
    },
    [storageKey]
  );

  const toggleBusinessType = useCallback(
    (typeId) => {
      setBusinessTypesState((prev) => {
        let updated;
        if (prev.includes(typeId)) {
          // Do not allow deselecting all businesses
          if (prev.length === 1) return prev;
          updated = prev.filter((t) => t !== typeId);
        } else {
          updated = [...prev, typeId];
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [storageKey]
  );

  const hasHotel = businessTypes.includes("hotel");
  const hasRestaurant = businessTypes.includes("restaurant");
  const hasTour = businessTypes.includes("tour");
  const isMultiBusiness = businessTypes.length > 1;

  return (
    <OwnerBusinessContext.Provider
      value={{
        businessTypes,
        setBusinessTypes: saveTypes,
        toggleBusinessType,
        hasHotel,
        hasRestaurant,
        hasTour,
        isMultiBusiness,
        activeBusinessView,
        setActiveBusinessView,
        BUSINESS_TYPES,
      }}
    >
      {children}
    </OwnerBusinessContext.Provider>
  );
}

export function useOwnerBusiness() {
  const ctx = useContext(OwnerBusinessContext);
  if (!ctx) {
    throw new Error("useOwnerBusiness must be used within an OwnerBusinessProvider");
  }
  return ctx;
}
