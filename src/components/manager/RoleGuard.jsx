import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasAnyRole, homePathFor } from "../../utils/rbac";

// Guards a route so only users holding at least one of `roles` may render it.
// Anyone else is redirected to `fallback` (a console page) — or, when no
// fallback is given, to the caller's own role home (admin → /admin, owner →
// /owner, everyone else → /).
export default function RoleGuard({ roles, fallback, children }) {
  const { user } = useAuth();
  if (!hasAnyRole(user, roles)) return <Navigate to={fallback ?? homePathFor(user)} replace />;
  return children;
}