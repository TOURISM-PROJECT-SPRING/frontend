import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  ownerBusinessScope,
  readOwnerRoleOverride,
  isOwnerRoleOverrideKey,
  isOwnerRole,
  hasRole,
} from "../utils/rbac";
import { ownerService } from "../services/ownerService";

const OWNER_BIZ_KEY_PREFIX = "smart_tourism_owner_businesses_";

// Generic OWNER is licensed for two verticals (admin assignment wins when
// present); SUPEROWNER / business-scoped roles bypass via their role scope.
const GENERIC_OWNER_DEFAULT = ["hotel", "restaurant"];
const GENERIC_OWNER_MAX = 2;

// Keeps a business list valid (only known verticals). Supports all 3 verticals.
const sanitizeBusinesses = (types, max = 3) => {
  const valid = Array.isArray(types)
    ? types
        .map((t) => String(t || "").toLowerCase())
        .filter((t) => ["hotel", "restaurant", "tour"].includes(t))
    : [];
  return [...new Set(valid)].slice(0, max);
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
    if (!currentUser) return [];

    // Admin has access to all verticals
    if (hasRole(currentUser, "ADMIN")) {
      return ["hotel", "restaurant", "tour"];
    }

    // 0. Check if user status is suspended
    if (currentUser?.ownerStatus === "SUSPENDED" || currentUser?.status === "SUSPENDED") {
      return [];
    }

    // 1. Admin role override
    const storedRole = readOwnerRoleOverride(currentUser);
    if (storedRole) {
      const overridden = ownerBusinessScope({ roles: [storedRole] });
      if (overridden) return overridden;
    }

    // 2. Role-scoped owner roles
    const scoped = ownerBusinessScope(currentUser);
    if (scoped) return scoped;

    const uname = (currentUser?.username || "").toLowerCase();

    // 3. User assignedBusinesses array if explicitly present from backend contract
    if (Array.isArray(currentUser?.assignedBusinesses)) {
      return sanitizeBusinesses(currentUser.assignedBusinesses, GENERIC_OWNER_MAX);
    }

    // 4. Stored in localStorage
    const saved = localStorage.getItem(`${OWNER_BIZ_KEY_PREFIX}${currentUser?.id || uname}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return sanitizeBusinesses(parsed, GENERIC_OWNER_MAX);
        }
      } catch {}
    }

    // 5. Generic OWNER manages two verticals by default; anything else is locked.
    if (hasRole(currentUser, "OWNER")) {
      return [...GENERIC_OWNER_DEFAULT];
    }

    // If the user has no assigned businesses, their contracted list is empty (locked)
    return [];
  }, []);

  const [businessTypes, setBusinessTypesState] = useState(() => resolveBusinessesForUser(user));
  const [activeBusinessView, setActiveBusinessView] = useState("all");
  const [isSuspended, setIsSuspended] = useState(() => user?.ownerStatus === "SUSPENDED" || user?.status === "SUSPENDED");
  const [permissionsData, setPermissionsData] = useState(null);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Re-evaluate when the user changes in this tab.
  const applyResolution = useCallback(
    (currentUser) => {
      if (currentUser?.ownerStatus === "SUSPENDED" || currentUser?.status === "SUSPENDED") {
        setIsSuspended(true);
        setBusinessTypesState([]);
        return;
      }
      setIsSuspended(false);
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

  // Fetch live permissions and contract directly from backend API
  const refreshPermissions = useCallback(async () => {
    if (!user || (!isOwnerRole(user) && !hasRole(user, "ADMIN"))) return;
    try {
      setIsLoadingPermissions(true);
      const data = await ownerService.getPermissions();
      setPermissionsData(data);
      if (data && (data.status === "SUSPENDED" || data.active === false)) {
        setIsSuspended(true);
        setBusinessTypesState([]);
        return;
      }
      setIsSuspended(false);
      // Business-scoped roles (OWNER_RESTAURANT, OWNER_HOTEL, OWNER_TOUR) and
      // SUPEROWNER are locked to their own vertical, so their role scope always
      // wins over a possibly stale backend contract (e.g. a default HOTEL row).
      const scoped = ownerBusinessScope(user);
      if (Array.isArray(scoped) && scoped.length) {
        setBusinessTypesState(scoped);
        return;
      }
      // For generic OWNER (and ADMIN), a live contract from the backend wins
      // when it lists verticals; otherwise fall back to the role-scoped
      // resolution instead of wiping the dashboard.
      if (data && Array.isArray(data.contractedBusinessTypes) && data.contractedBusinessTypes.length) {
        const licenseMax =
          hasRole(user, "SUPEROWNER") || hasRole(user, "ADMIN") ? 3 : GENERIC_OWNER_MAX;
        setBusinessTypesState(sanitizeBusinesses(data.contractedBusinessTypes, licenseMax));
      } else {
        setBusinessTypesState(resolveBusinessesForUser(user));
      }
    } catch (err) {
      console.warn("Failed to fetch live permissions:", err);
    } finally {
      setIsLoadingPermissions(false);
    }
  }, [user, resolveBusinessesForUser]);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  // Listen for admin role changes or focus
  useEffect(() => {
    const sync = () => {
      applyResolution(user);
      refreshPermissions();
    };
    const onStorage = (e) => {
      if (e.key && isOwnerRoleOverrideKey(e.key)) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", sync);
    };
  }, [applyResolution, refreshPermissions, user]);

  const setAssignedBusinesses = useCallback(
    (types) => {
      if (ownerBusinessScope(user)) return;
      const finalTypes = sanitizeBusinesses(types, GENERIC_OWNER_MAX);
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
      if (isSuspended) return true;
      return !businessTypes.includes(typeId);
    },
    [businessTypes, isSuspended]
  );

  const hasHotel = !isSuspended && businessTypes.includes("hotel");
  const hasRestaurant = !isSuspended && businessTypes.includes("restaurant");
  const hasTour = !isSuspended && businessTypes.includes("tour");
  const isMultiBusiness = businessTypes.length > 1;
  const isAllUnlocked = !isSuspended && businessTypes.length === 3;
  const activeCount = isSuspended ? 0 : businessTypes.length;
  const lockedCount = 3 - activeCount;

  const statusSummary = isSuspended
    ? "Account Suspended"
    : activeCount === 3
    ? "All 3 Businesses Active"
    : activeCount === 2
    ? "2 Active • 1 Locked"
    : activeCount === 1
    ? "1 Active • 2 Locked"
    : "No Active Business";

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
        isSuspended,
        permissionsData,
        isLoadingPermissions,
        refreshPermissions,
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