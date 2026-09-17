import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { ROLES, hasRole, canUseManager } from "../utils/rbac";

// Token lives under localStorage key "token" because axiosClient.js attaches
// `Authorization: Bearer <token>` from that exact key.
const TOKEN_KEY = "token";
const USER_KEY = "sdn.user";

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const persist = useCallback((jwt, nextUser) => {
    if (jwt) localStorage.setItem(TOKEN_KEY, jwt);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
    setToken(jwt || null);
    setUser(nextUser || null);
  }, []);

  const login = useCallback(
    async ({ username, password, role }) => {
      try {
        const data = await authService.login({ username, password });
        persist(data.accessToken, data.user || null);
        return { user: data.user, demo: false };
      } catch (e) {
        if (shouldDemoFallback(e)) {
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

  const logout = useCallback(() => {
    // Best-effort server logout; never block the local sign-out.
    if (token && token !== "demo-token") {
      authService.logout().catch(() => {});
    }
    persist(null, null);
  }, [persist, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      userId: user?.id ?? null,
      isAuthenticated: Boolean(token),
      isDemo: Boolean(user?.demo),
      ready,
      roles: user?.roles || [],
      hasRole: (role) => hasRole(user, role),
      isAdmin: hasRole(user, ROLES.ADMIN),
      isOwner: hasRole(user, ROLES.OWNER),
      isManager: hasRole(user, ROLES.MANAGER),
      canUseManager: canUseManager(user),
      login,
      register,
      logout,
    }),
    [user, token, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
