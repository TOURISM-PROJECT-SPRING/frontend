import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authService } from "../services/authService";
import { managementService } from "../services/managementService";
import { ROLES, hasRole, canUseManager, isOwnerRole, setOwnerRoleOverride, clearOwnerRoleOverride } from "../utils/rbac";

// Token lives under localStorage key "token" because axiosClient.js attaches
// `Authorization: Bearer <token>` from that exact key.
const TOKEN_KEY = "token";
const USER_KEY = "sdn.user";
const AVATAR_KEY = "sdn.avatar";

// Exported so other modules (e.g. the admin user editor) can write-through to
// the signed-in session, which keeps every open tab in sync.
export const AUTH_USER_STORAGE_KEY = USER_KEY;

// When an admin changes a signed-in account's role, that account must be
// signed out and sent to the login page so it re-authenticates with the new
// authority. A per-user marker is written to localStorage so every tab in the
// same browser picks it up; the tab that owns the session clears it and
// redirects to /login.
export const RELOGIN_MARKER_PREFIX = "sdn.relogin_";

export function reloginMarkerKeys(currentUser) {
  return [
    `${RELOGIN_MARKER_PREFIX}${currentUser?.id ?? ""}`,
    `${RELOGIN_MARKER_PREFIX}${(currentUser?.username || "").toLowerCase()}`,
  ].filter((k) => k && k.length > RELOGIN_MARKER_PREFIX.length);
}

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// A network failure (no HTTP response) means the backend is down. A 404/5xx on
// the auth endpoint means auth isn't deployed/available on this backend build.
// In both cases we allow a demo sign-in so the app stays usable. A 400/401/403
// is a genuine credential rejection and should surface to the user.
function shouldDemoFallback(e) {
  if (!e) return false;
  if (e.request && !e.response) return true; // network / backend down
  const status = e.response?.status;
  if (status == null) return true;
  return status === 404 || status >= 500;
}

function authErrorMessage(e) {
  return (
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    "Invalid username or password."
  );
}

const DEMO_USER = {
  id: 1,
  fullname: "Sokha Dara",
  username: "demo",
  email: "demo@sovannomnour.app",
  roles: [ROLES.OWNER],
  demo: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [avatarUrl, setAvatarUrlState] = useState(() => localStorage.getItem(AVATAR_KEY) || "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const setAvatarUrl = useCallback((url) => {
    setAvatarUrlState(url || "");
    if (url) localStorage.setItem(AVATAR_KEY, url);
    else localStorage.removeItem(AVATAR_KEY);
  }, []);

  const persist = useCallback((jwt, nextUser) => {
    if (jwt) localStorage.setItem(TOKEN_KEY, jwt);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
    // Keep the role mirror in step with the session role so the owner console
    // never falls back to a stale override it can't manage.
    if (nextUser) {
      setOwnerRoleOverride(nextUser, nextUser.roles?.[0] || nextUser.role || null);
      // A fresh sign-in starts clean — any earlier "role changed, re-login"
      // marker is now obsolete.
      reloginMarkerKeys(nextUser).forEach((k) => localStorage.removeItem(k));
    }
    setToken(jwt || null);
    setUser(nextUser || null);
  }, []);

  const login = useCallback(
    async ({ username, password, role, forceDemo } = {}) => {
      // Quick demo access always uses the sample account with the requested
      // role — never the backend's real "demo" account — so role simulators
      // (Super owner, Hotel owner, ...) behave exactly as labeled even when the
      // backend is online.
      if (forceDemo) {
        const demo = role ? { ...DEMO_USER, roles: [role] } : DEMO_USER;
        persist("demo-token", demo);
        return { user: demo, demo: true };
      }
      try {
        const data = await authService.login({ username, password });
        persist(data.accessToken, data.user || null);
        return { user: data.user, demo: false };
      } catch (e) {
        // A requested role (demo button) always falls back to a sample account,
        // even when the backend is up but rejects the demo credentials.
        if (shouldDemoFallback(e) || role) {
          // Auth endpoint unavailable / backend offline — sign in with a demo account.
          const demo = role ? { ...DEMO_USER, roles: [role] } : DEMO_USER;
          persist("demo-token", demo);
          return { user: demo, demo: true };
        }
        throw new Error(authErrorMessage(e));
      }
    },
    [persist]
  );

  const register = useCallback(
    async ({ fullname, username, email, password }) => {
      try {
        const data = await authService.register({ fullname, username, email, password });
        // Register may or may not return a token; if not, log the user in.
        if (data?.accessToken) {
          persist(data.accessToken, data.user || null);
          return { user: data.user, demo: false };
        }
        const loginData = await authService.login({ username, password });
        persist(loginData.accessToken, loginData.user || null);
        return { user: loginData.user, demo: false };
      } catch (e) {
        if (shouldDemoFallback(e)) {
          const demo = { ...DEMO_USER, fullname: fullname || DEMO_USER.fullname, username, email };
          persist("demo-token", demo);
          return { user: demo, demo: true };
        }
        throw new Error(e?.response?.data?.message || e?.response?.data?.error || "Could not create your account.");
      }
    },
    [persist]
  );

  const switchTestAccount = useCallback(
    (account) => {
      const isRoleAdmin =
        account.role === "ADMIN" ||
        account.roles?.includes("ADMIN") ||
        account.username === "admin";
      const isRoleTourist =
        account.role === "TOURIST" ||
        account.roles?.includes("TOURIST") ||
        account.username === "tourist" ||
        account.username === "customer";

      const defaultRoles = isRoleAdmin ? ["ADMIN"] : isRoleTourist ? ["TOURIST"] : ["OWNER"];

      const mockUser = {
        id:
          account.id ||
          (account.username === "admin"
            ? 1
            : account.username === "customer" || account.username === "tourist"
            ? 201
            : account.username === "owner_restaurant"
            ? 102
            : account.username === "owner_tour"
            ? 103
            : 101),
        username: account.username,
        fullname:
          account.fullname ||
          account.label ||
          (isRoleAdmin
            ? "System Administrator"
            : isRoleTourist
            ? "Dara Customer"
            : "Business Owner"),
        email: account.email || `${account.username}@smart-tourism.com`,
        roles: account.roles || defaultRoles,
        assignedBusinesses:
          account.assignedBusinesses ||
          (account.username === "owner_restaurant"
            ? ["restaurant"]
            : account.username === "owner_tour"
            ? ["tour"]
            : isRoleAdmin || isRoleTourist
            ? []
            : ["hotel"]),
      };
      const existingToken = localStorage.getItem(TOKEN_KEY);
      const testToken = existingToken || `test-token-${account.username}`;
      persist(testToken, mockUser);
      return mockUser;
    },
    [persist]
  );

  const logout = useCallback(() => {
    // Best-effort server logout; never block the local sign-out.
    if (token && token !== "demo-token") {
      authService.logout().catch(() => {});
    }
    setAvatarUrl("");
    persist(null, null);
  }, [persist, token, setAvatarUrl]);

  // Clears the local session and bounces the account to the login page. Used
  // when an admin changes a signed-in account's role, so the user re-authenticates
  // and picks up the new authority from the backend.
  const handleForcedRelogin = useCallback(() => {
    setAvatarUrl("");
    persist(null, null);
    window.location.assign("/login");
  }, [persist, setAvatarUrl]);

  // Call this after an admin successfully changes a user's platform role on the
  // server. Any tab where that account is signed in — including this one — is
  // signed out and sent to /login to log in with the new role. Returns true when
  // the current tab owns that session and is being redirected.
  const markReloginForUser = useCallback(
    (editedUser) => {
      if (!editedUser) return false;
      reloginMarkerKeys(editedUser).forEach((k) => {
        try {
          localStorage.setItem(k, String(Date.now()));
        } catch {}
      });
      clearOwnerRoleOverride(editedUser);
      // The storage event does not fire in the tab that wrote the marker, so
      // when this account is signed in right here, log it out directly.
      if (
        user &&
        reloginMarkerKeys(user).some((k) => reloginMarkerKeys(editedUser).includes(k))
      ) {
        handleForcedRelogin();
        return true;
      }
      return false;
    },
    [user, handleForcedRelogin]
  );

  // If an admin raised a "role changed" re-login marker for the account signed
  // in on this tab, drop the stale session and bounce to the login page.
  const checkForcedRelogin = useCallback(() => {
    if (user && reloginMarkerKeys(user).some((k) => localStorage.getItem(k))) {
      handleForcedRelogin();
    }
  }, [user, handleForcedRelogin]);

  // Keep the session in sync across tabs: when anything writes the stored user
  // (e.g. the admin dashboard updates the signed-in user's role), every open
  // tab — including the owner console — re-reads it immediately. Background
  // tabs can delay or coalesce storage events, so the re-login marker is also
  // re-checked when the tab regains focus / becomes visible.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === AUTH_USER_STORAGE_KEY && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key && e.key.startsWith(RELOGIN_MARKER_PREFIX) && e.newValue) {
        checkForcedRelogin();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", checkForcedRelogin);
    document.addEventListener("visibilitychange", checkForcedRelogin);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", checkForcedRelogin);
      document.removeEventListener("visibilitychange", checkForcedRelogin);
    };
  }, [user, handleForcedRelogin, checkForcedRelogin]);

  // Merges freshly saved profile data (e.g. full name, phone) into the current
  // session so every open tab sees the change immediately.
  const updateUser = useCallback(
    (patch) => {
      if (!user) return;
      const merged = { ...user, ...patch, demo: user.demo };
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(merged));
      setUser(merged);
    },
    [user]
  );

  // Re-fetches the current user from the backend so role / business assignment
  // changes made in the admin dashboard take effect in the owner console
  // without a full re-login. Silent no-op for demo/offline users.
  const refreshUser = useCallback(async () => {
    const currentId = user?.id;
    if (!currentId || user?.demo) return false;
    try {
      const fresh = await managementService.getUserById(currentId);
      if (!fresh) return false;
      const nextRoles =
        Array.isArray(fresh.roles) && fresh.roles.length > 0
          ? fresh.roles
          : fresh.role
          ? [fresh.role]
          : user.roles;
      const merged = {
        ...user,
        ...fresh,
        roles: nextRoles ?? user.roles,
        demo: user.demo,
      };
      // Avoid rebuilding the whole tree when nothing actually changed (the
      // owner dashboard refreshes on focus, which could otherwise get noisy).
      if (JSON.stringify(merged) === JSON.stringify(user)) return true;
      if (JSON.stringify(merged.roles) !== JSON.stringify(user.roles)) {
        setOwnerRoleOverride(merged, merged.roles?.[0] || merged.role || null);
      }
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(merged));
      setUser(merged);
      return true;
    } catch {
      return false;
    }
  }, [user]);

  // On a fresh load with a real token, pull the latest user so role / business
  // changes made while the app was closed are picked up right away. Runs once
  // on mount; refs keep it from looping when the user refreshes.
  const refreshUserRef = useRef(refreshUser);
  refreshUserRef.current = refreshUser;
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const forceReloginRef = useRef(handleForcedRelogin);
  forceReloginRef.current = handleForcedRelogin;

  useEffect(() => {
    if (tokenRef.current && tokenRef.current !== "demo-token") {
      refreshUserRef.current();
    }
    // If an admin left a "role changed" marker while this tab was closed, drop
    // the stale session and require a fresh login with the new role.
    const mountedUser = readStoredUser();
    if (mountedUser && reloginMarkerKeys(mountedUser).some((k) => localStorage.getItem(k))) {
      forceReloginRef.current();
    }
    // Run once on mount only.
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      userId: user?.id ?? null,
      avatarUrl,
      setAvatarUrl,
      isAuthenticated: Boolean(token),
      isDemo: Boolean(user?.demo),
      ready,
      roles: user?.roles || [],
      hasRole: (role) => hasRole(user, role),
      isAdmin: hasRole(user, ROLES.ADMIN),
      isSuperOwner: hasRole(user, ROLES.SUPEROWNER),
      isOwner: hasRole(user, ROLES.OWNER),
      isOwnerHotel: hasRole(user, ROLES.OWNER_HOTEL),
      isOwnerTour: hasRole(user, ROLES.OWNER_TOUR),
      isOwnerRestaurant: hasRole(user, ROLES.OWNER_RESTAURANT),
      canManageOwner: isOwnerRole(user),
      isManager: hasRole(user, ROLES.MANAGER),
      canUseManager: canUseManager(user),
      login,
      register,
      logout,
      switchTestAccount,
      refreshUser,
      updateUser,
      markReloginForUser,
    }),
    [user, token, ready, avatarUrl, setAvatarUrl, login, register, logout, switchTestAccount, refreshUser, updateUser, markReloginForUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
