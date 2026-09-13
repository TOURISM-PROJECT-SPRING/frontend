import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../../components/manager/ManagerLayout";
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
import { WORKSPACE_ORDER, flattenNav } from "../../data/managerConfig";

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

function allItems() {
  return WORKSPACE_ORDER.flatMap((key) =>
    flattenNav(key)
      .filter((i) => i.view !== "switch")
      .map((i) => ({ ...i, ws: key }))
  );
}

export default function ManagerArea() {
  return (
    <Routes>
      <Route element={<ManagerLayout />}>
        <Route index element={<OverviewPage />} />
        {allItems().map((item) => {
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
      </Route>
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}