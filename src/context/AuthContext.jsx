import { createContext, useCallback, useContext, useState } from "react";
import { authService } from "../services/authService";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const login = useCallback(
    async ({ username, usernameOrEmail, email, password } = {}) => {
      setLoading(true);
      try {
        const data = await authService.login({ username, usernameOrEmail, email, password });
        const receivedToken = data.accessToken || data.token;
        persist(receivedToken, data.user);
        return { user: data.user, token: receivedToken };
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await authService.register(payload);
        const receivedToken = data.accessToken || data.token;
        persist(receivedToken, data.user);
        return { user: data.user, token: receivedToken };
      } finally {
        setLoading(false);
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
    authService.logout().catch(() => {});
    persist(null, null);
  }, [persist]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        register,
        switchTestAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}