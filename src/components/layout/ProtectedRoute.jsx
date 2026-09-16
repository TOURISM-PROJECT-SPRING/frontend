import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, ready, hasRole } = useAuth();
  const location = useLocation();

  if (!ready) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.some((role) => hasRole(role))) {
    return <Navigate to="/" replace />;
  }
  return children;
}