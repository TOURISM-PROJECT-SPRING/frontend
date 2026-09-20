import { createContext, useCallback, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { effectivePermissions } from "../utils/permissions";

const PermissionsContext = createContext(null);

export function PermissionsProvider({ children }) {
  const { user, refreshUser } = useAuth();

  const permissions = useMemo(() => effectivePermissions(user), [user]);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);

  const can = useCallback(
    (perm) => (perm ? permissionSet.has(perm) : true),
    [permissionSet]
  );

  const reload = useCallback(() => refreshUser(), [refreshUser]);

  const value = useMemo(
    () => ({ permissions, can, reload }),
    [permissions, can, reload]
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within a PermissionsProvider");
  return ctx;
}