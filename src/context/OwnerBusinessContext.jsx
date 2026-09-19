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
    color:
      "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    badge: "🎫 Tourist & Tour",
    tagline: "Destinations, Attraction Tickets & Packages",
    description:
      "Manage tourist attractions, entrance tickets, visitor bookings, and tour packages",
  },
];

export const TEST_OWNERS = [
  {
    id: 101,
    username: "owner_hotel",
    password: "owner123",
    label: "Hotel Owner",
    fullname: "Sovann Hotel Owner",
    email: "owner.hotel@smart-tourism.com",
    badge: "🏨 Hotel Owner",
    assignedBusinesses: ["hotel"],
    redirect: "/owner",
    description: "Owns Hotel & Stays. Restaurant and Tourists are LOCKED.",
  },
  {
    id: 102,
    username: "owner_restaurant",
    password: "owner123",
    label: "Restaurant Owner",
    fullname: "Chann Restaurant Owner",
    email: "owner.restaurant@smart-tourism.com",
    badge: "🍽️ Restaurant Owner",
    assignedBusinesses: ["restaurant"],
    redirect: "/owner",
    description: "Owns Restaurant & Dining. Hotel and Tourists are LOCKED.",
  },
  {
    id: 103,
    username: "owner_tour",
    password: "owner123",
    label: "Tourists Owner",
    fullname: "Bopha Tour Owner",
    email: "owner.tour@smart-tourism.com",
    badge: "🎫 Tourists Owner",
    assignedBusinesses: ["tour"],
    redirect: "/owner",
    description:
      "Owns Tourists & Attractions. Hotel and Restaurant are LOCKED.",
  },
];

export const TEST_ALL_ROLES = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    label: "Admin",
    fullname: "System Administrator",
    email: "admin@smart-tourism.com",
    role: "ADMIN",
    roles: ["ADMIN"],
    badge: "👑 Admin",
    type: "admin",
    redirect: "/admin",
    description:
      "System Administrator with full management & verification privileges.",
  },
  {
    id: 201,
    username: "customer",
    password: "customer123",
    label: "Customer / Tourist",
    fullname: "Dara Customer",
    email: "customer@smart-tourism.com",
    role: "TOURIST",
    roles: ["TOURIST"],
    badge: "🎒 Customer / Tourist",
    type: "customer",
    redirect: "/",
    description:
      "Customer / Tourist booking hotels, attraction tickets, and food.",
  },
  {
    id: 101,
    username: "owner_hotel",
    password: "owner123",
    label: "Hotel Owner",
    fullname: "Sovann Hotel Owner",
    email: "owner.hotel@smart-tourism.com",
    role: "OWNER",
    roles: ["OWNER"],
    badge: "🏨 Hotel Owner",
    type: "owner",
    assignedBusinesses: ["hotel"],
    redirect: "/owner",
    description: "Hotel Stays active. Restaurant & Tourists modules LOCKED.",
  },
  {
    id: 102,
    username: "owner_restaurant",
    password: "owner123",
    label: "Restaurant Owner",
    fullname: "Chann Restaurant Owner",
    email: "owner.restaurant@smart-tourism.com",
    role: "OWNER",
    roles: ["OWNER"],
    badge: "🍽️ Dining Owner",
    type: "owner",
    assignedBusinesses: ["restaurant"],
    redirect: "/owner",
    description: "Restaurant Dining active. Hotel & Tourists modules LOCKED.",
  },
  {
    id: 103,
    username: "owner_tour",
    password: "owner123",
    label: "Tourists Owner",
    fullname: "Bopha Tour Owner",
    email: "owner.tour@smart-tourism.com",
    role: "OWNER",
    roles: ["OWNER"],
    badge: "🎫 Tour Owner",
    type: "owner",
    assignedBusinesses: ["tour"],
    redirect: "/owner",
    description: "Tourists & Tours active. Hotel & Restaurant modules LOCKED.",
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

  // Expose global helper for browser console testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__setOwnerBusinesses = (types) => {
        setAssignedBusinesses(types);
        console.log("Simulated assigned businesses:", types);
      };
    }
  }, [setAssignedBusinesses]);

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

  // Find which test owner profile matches currently
  const currentTestOwner = TEST_OWNERS.find(
    (o) =>
      o.username === user?.username ||
      (user?.username === "owner" && o.username === "owner_hotel"),
  ) || {
    username: user?.username || "owner",
    fullname: user?.fullname || "Business Owner",
    badge: hasHotel
      ? "🏨 Hotel Owner"
      : hasRestaurant
        ? "🍽️ Restaurant Owner"
        : "🎫 Tourists Owner",
    assignedBusinesses: businessTypes,
  };

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
        TEST_OWNERS,
        currentTestOwner,
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
