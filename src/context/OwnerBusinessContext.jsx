import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  ownerBusinessScope,
  readOwnerRoleOverride,
  isOwnerRoleOverrideKey,
} from "../utils/rbac";

const OWNER_BIZ_KEY_PREFIX = "smart_tourism_owner_businesses_";

// Keeps a business list valid (only known verticals) and caps generic owners
// at two verticals; SUPEROWNER / single-vertical owners bypass via role scope.
const sanitizeBusinesses = (types, max = 2) => {
  const valid = Array.isArray(types)
    ? types.filter((t) => ["hotel", "restaurant", "tour"].includes(t))
    : [];
  if (valid.length === 0) return ["hotel", "restaurant"];
  return valid.slice(0, max);
};

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
    // 0. Admin role override wins above everything. It mirrors the role chosen
    // in the admin dashboard, so OWNER_HOTEL locks every non-hotel vertical even
    // if the auth payload hasn't caught up yet — and SUPEROWNER unlocks all.
    const storedRole = readOwnerRoleOverride(currentUser);
    if (storedRole) {
      const overridden = ownerBusinessScope({ roles: [storedRole] });
      if (overridden) return overridden;
    }

    // 1. SUPEROWNER and business-scoped owner roles (OWNER_HOTEL / OWNER_TOUR /
    // OWNER_RESTAURANT) are role-locked and always win over assignments.
    const scoped = ownerBusinessScope(currentUser);
    if (scoped) return scoped;

    const uname = (currentUser?.username || "").toLowerCase();

    // 1. User assignedBusinesses array if explicitly present (admin assignment)
    if (Array.isArray(currentUser?.assignedBusinesses) && currentUser.assignedBusinesses.length > 0) {
      return sanitizeBusinesses(currentUser.assignedBusinesses, 2);
    }

    // 2. Stored in localStorage
    const saved = localStorage.getItem(`${OWNER_BIZ_KEY_PREFIX}${currentUser?.id || uname}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeBusinesses(parsed, 2);
        }
      } catch {}
    }

    // Default fallback: a generic OWNER manages two verticals until an admin
    // assigns a specific pair.
    return ["hotel", "restaurant"];
  }, []);

  const [businessTypes, setBusinessTypesState] = useState(() => resolveBusinessesForUser(user));
  const [activeBusinessView, setActiveBusinessView] = useState("all");

  // Re-evaluate when the user changes in this tab.
  const applyResolution = useCallback(
    (currentUser) => {
      const next = resolveBusinessesForUser(currentUser);
      setBusinessTypesState((prev) =>
        JSON.stringify(prev) === JSON.stringify(next) ? prev : next
      );
    },
    [resolveBusinessesForUser]
  );

  useEffect(() => {
    applyResolution(user);
  }, [user, applyResolution]);

  // Listen for admin role changes written from another tab (same browser).
  useEffect(() => {
    const sync = () => applyResolution(user);
    const onStorage = (e) => {
      if (e.key && isOwnerRoleOverrideKey(e.key)) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, [applyResolution, user]);

  const setAssignedBusinesses = useCallback(
    (types) => {
      // Role-scoped owners (OWNER_HOTEL / OWNER_TOUR / OWNER_RESTAURANT) are
      // locked to their vertical and cannot be reassigned from the UI.
      if (ownerBusinessScope(user)) return;
      const finalTypes = sanitizeBusinesses(types, 2);
      setBusinessTypesState(finalTypes);
      try {
        localStorage.setItem(storageKey, JSON.stringify(finalTypes));
      } catch (e) {
        console.error("Failed to save owner business types:", e);
      }
    },
    [storageKey, user]
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