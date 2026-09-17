import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../../components/manager/ManagerLayout";
import RoleGuard from "../../components/manager/RoleGuard";
import OverviewPage from "./OverviewPage";
import ListPage from "./ListPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import TourDashboard from "./tour/TourDashboard";
import TourPlacesPage from "./tour/TourPlacesPage";
import HotelDashboard from "./hotel/HotelDashboard";
import RoomAvailability from "./hotel/RoomAvailability";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";
import KitchenBoard from "./restaurant/KitchenBoard";
import MenuManager from "./restaurant/MenuManager";
import TablesBoard from "./restaurant/TablesBoard";
import SuperAdminDashboard from "./admin/SuperAdminDashboard";
import OwnerDashboard from "./owner/OwnerDashboard";
import EarningsPage from "./owner/EarningsPage";
import { WORKSPACE_ORDER, flattenNav } from "../../data/managerConfig";
import { useAuth } from "../../context/AuthContext";
import { ROLES, canAccess } from "../../utils/rbac";

const DASH = {
  tour: <TourDashboard />,
  hotel: <HotelDashboard />,
  restaurant: <RestaurantDashboard />,
  admin: <SuperAdminDashboard />,
};

function elementFor(item) {
  switch (item.view) {
    case "dashboard":
    case "superadmin":
      return DASH[item.ws];
    case "menu":
      return <MenuManager />;
    case "kanban":
      return <KitchenBoard />;
    case "rooms":
      return <RoomAvailability />;
    case "tables":
      return <TablesBoard />;
    case "analytics":
      return <AnalyticsPage title={item.label} />;
    case "settings":
      return <SettingsPage />;
    case "profile":
      return <SettingsPage profile />;
    case "list":
      if (item.entity === "tour-places") return <TourPlacesPage />;
      return <ListPage entity={item.entity} />;
  }
}

const ownerOnly = (node) => <RoleGuard roles={[ROLES.OWNER]}>{node}</RoleGuard>;

// Routes are only registered for nav entries the current role may access, so an
// owner cannot reach tour/admin pages even by typing the URL.
function allItems(user) {
  return WORKSPACE_ORDER.flatMap((key) =>
    flattenNav(key)
      .filter((i) => i.view !== "switch" && canAccess(user, i.to))
      .map((i) => ({ ...i, ws: key }))
  );
}

export default function ManagerArea() {
  const { user, isOwner, canUseManager } = useAuth();

  // Console access is role-checked: USER/MANAGER have no management console.
  if (!canUseManager) return <Navigate to="/" replace />;

  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        <Route index element={isOwner ? <OwnerDashboard /> : <OverviewPage />} />
        {allItems(user).map((item) => {
          const rel = item.to.replace(/^\/manager\/?/, "");
          return (
            <Route
              key={item.to}
              index={rel === ""}
              path={rel || undefined}
              element={elementFor(item)}
            />
          );
        })}

        {/* Owner-only portfolio pages */}
        <Route path="owner" element={ownerOnly(<OwnerDashboard />)} />
        <Route path="owner/revenue" element={ownerOnly(<EarningsPage />)} />
        <Route path="owner/earnings" element={ownerOnly(<EarningsPage />)} />
        <Route path="owner/payments" element={ownerOnly(<EarningsPage />)} />
        <Route
          path="owner/customers"
          element={ownerOnly(<ListPage entity="customers" title="Customers" />)}
        />
        <Route
          path="owner/reviews"
          element={ownerOnly(<ListPage entity="reviews" title="Reviews" />)}
        />
        <Route
          path="owner/bookings"
          element={ownerOnly(<ListPage entity="all-bookings" title="All Bookings" />)}
        />
      </Route>
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}