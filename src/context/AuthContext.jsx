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
    async ({ usernameOrEmail, password } = {}) => {
      setLoading(true);
      try {
        const data = await authService.login({ usernameOrEmail, password });
        persist(data.token, data.user);
        return { user: data.user, token: data.token };
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const register = useCallback(
    async ({ fullname, username, email, password } = {}) => {
      setLoading(true);
      try {
        const data = await authService.register({ fullname, username, email, password });
        persist(data.token, data.user);
        return { user: data.user, token: data.token };
      } finally {
        setLoading(false);
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
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