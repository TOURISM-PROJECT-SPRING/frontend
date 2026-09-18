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
    tagline: "Properties, Rooms, Reservations & Dynamic Pricing",
    description: "Manage hotel properties, room categories, night rates, and guest bookings",
  },
  {
    id: "restaurant",
    label: "Restaurant & Dining",
    shortLabel: "Restaurants",
    icon: "UtensilsCrossed",
    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800",
    badge: "🍽️ Restaurant",
    tagline: "Outlets, Menus, Dishes & Live Food Orders",
    description: "Manage restaurant profiles, food dishes, price menus, and food delivery orders",
  },
  {
    id: "tour",
    label: "Tourists & Tours",
    shortLabel: "Tourists / Tours",
    icon: "Compass",
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    badge: "🎫 Tourist & Tour",
    tagline: "Destinations, Attraction Tickets & Packages",
    description: "Manage tourist attractions, entrance tickets, visitor bookings, and tour packages",
  },
];

const OwnerBusinessContext = createContext(null);

export function OwnerBusinessProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || user?.username || "guest";
  const storageKey = `${OWNER_BIZ_KEY_PREFIX}${userId}`;

  const resolveBusinessesForUser = useCallback((currentUser) => {
    const uname = (currentUser?.username || "").toLowerCase();

    // 1. User assignedBusinesses array if explicitly present
    if (Array.isArray(currentUser?.assignedBusinesses) && currentUser.assignedBusinesses.length > 0) {
      return currentUser.assignedBusinesses;
    }

    // 2. Stored in localStorage
    const saved = localStorage.getItem(`${OWNER_BIZ_KEY_PREFIX}${currentUser?.id || uname}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }

    // Default fallback
    return ["hotel"];
  }, []);

  const [businessTypes, setBusinessTypesState] = useState(() => resolveBusinessesForUser(user));
  const [activeBusinessView, setActiveBusinessView] = useState("all");

  // Re-evaluate when user changes
  useEffect(() => {
    setBusinessTypesState(resolveBusinessesForUser(user));
  }, [user, resolveBusinessesForUser]);

  const setAssignedBusinesses = useCallback(
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

  const isBusinessLocked = useCallback(
    (typeId) => {
      return !businessTypes.includes(typeId);
    },
    [businessTypes]
  );

  const hasHotel = businessTypes.includes("hotel");
  const hasRestaurant = businessTypes.includes("restaurant");
  const hasTour = businessTypes.includes("tour");
  const isMultiBusiness = businessTypes.length > 1;
  const isAllUnlocked = businessTypes.length === 3;
  const activeCount = businessTypes.length;
  const lockedCount = 3 - activeCount;

  const statusSummary =
    activeCount === 3
      ? "All 3 Businesses Active"
      : activeCount === 2
      ? "2 Active • 1 Locked"
      : "1 Active • 2 Locked";

  return (
    <OwnerBusinessContext.Provider
      value={{
        businessTypes,
        setAssignedBusinesses,
        isBusinessLocked,
        hasHotel,
        hasRestaurant,
        hasTour,
        isMultiBusiness,
        isAllUnlocked,
        activeCount,
        lockedCount,
        statusSummary,
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