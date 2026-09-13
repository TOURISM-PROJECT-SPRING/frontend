import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../../components/manager/ManagerLayout";
import WorkspacePicker from "./WorkspacePicker";
import ListPage from "./ListPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import TourDashboard from "./tour/TourDashboard";
import HotelDashboard from "./hotel/HotelDashboard";
import RoomAvailability from "./hotel/RoomAvailability";
import RestaurantDashboard from "./restaurant/RestaurantDashboard";
import KitchenBoard from "./restaurant/KitchenBoard";
import MenuManager from "./restaurant/MenuManager";
import TablesBoard from "./restaurant/TablesBoard";
import SuperAdminDashboard from "./admin/SuperAdminDashboard";
import { WORKSPACES, WORKSPACE_ORDER, flattenNav } from "../../data/managerConfig";

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
    default:
      return <ListPage entity={item.entity} />;
  }
}

function childRoutes(wsKey) {
  const base = WORKSPACES[wsKey].base;
  return flattenNav(wsKey)
    .filter((i) => i.view !== "switch")
    .map((item) => {
      const rel = item.to === base ? "" : item.to.slice(base.length + 1);
      return <Route key={item.to} index={rel === ""} path={rel || undefined} element={elementFor({ ...item, ws: wsKey })} />;
    });
}

export default function ManagerArea() {
  return (
    <Routes>
      <Route index element={<WorkspacePicker />} />
      {WORKSPACE_ORDER.map((key) => (
        <Route key={key} path={key} element={<ManagerLayout />}>
          {childRoutes(key)}
        </Route>
      ))}
      <Route path="*" element={<Navigate to="/manager" replace />} />
    </Routes>
  );
}
