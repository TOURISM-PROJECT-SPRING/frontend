import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasAnyRole } from "../../utils/rbac";

// Guards a route so only users holding at least one of `roles` may render it.
// Anyone else is redirected to `fallback` (a console page by default).
export default function RoleGuard({ roles, fallback = "/manager", children }) {
  const { user } = useAuth();
  if (!hasAnyRole(user, roles)) return <Navigate to={fallback} replace />;
  return children;
}