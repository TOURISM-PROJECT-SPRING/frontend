import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isOwnerRole, homePathFor } from "../../utils/rbac";

// Gateway for the /owner/* console. Only accounts holding an owner-type role
// (SUPEROWNER, OWNER, OWNER_HOTEL, OWNER_TOUR, OWNER_RESTAURANT) may enter;
// everyone else is sent to their own role home. Inside the dashboard, each
// business manage page is further narrowed to the account's licensed vertical
// by BusinessGuard.
export default function OwnerRoute({ children }) {
  const { user } = useAuth();
  if (!isOwnerRole(user)) return <Navigate to={homePathFor(user)} replace />;
  return children;
}