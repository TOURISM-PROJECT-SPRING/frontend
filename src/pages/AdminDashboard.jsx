import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminAccessDenied from "../components/admin/AdminAccessDenied";
import { OwnerBusinessProvider } from "../context/OwnerBusinessContext";
import { PermissionsProvider, usePermissions } from "../context/PermissionsContext";
import { permissionForPage } from "../utils/permissions";

import AdminUsersPage from "./admin/AdminUsersPage";
import AdminRolesPage from "./admin/AdminRolesPage";
import AdminOwnersPage from "./admin/AdminOwnersPage";
import AdminPlacesPage from "./admin/AdminPlacesPage";
import AdminHotelsPage from "./admin/AdminHotelsPage";
import AdminRoomsPage from "./admin/AdminRoomsPage";
import AdminTicketsPage from "./admin/AdminTicketsPage";
import AdminRestaurantsPage from "./admin/AdminRestaurantsPage";
import AdminFoodOrdersPage from "./admin/AdminFoodOrdersPage";
import AdminPackagesPage from "./admin/AdminPackagesPage";
import AdminBookingsPage from "./admin/AdminBookingsPage";
import AdminPaymentsPage from "./admin/AdminPaymentsPage";
import AdminReviewsPage from "./admin/AdminReviewsPage";
import AdminPromotionsPage from "./admin/AdminPromotionsPage";
import AdminNotificationsPage from "./admin/AdminNotificationsPage";
import AdminReportsPage from "./admin/AdminReportsPage";
import AdminLogsPage from "./admin/AdminLogsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import AdminProfilePage from "./admin/AdminProfilePage";
import AdminContactMessagesPage from "./admin/AdminContactMessagesPage";

function PermissionGate({ path, children }) {
  const { can } = usePermissions();
  const perm = permissionForPage(path);
  return can(perm) ? children : <AdminAccessDenied />;
}

function Gate({ path, children }) {
  return <PermissionGate path={path}>{children}</PermissionGate>;
}

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <OwnerBusinessProvider>
    <PermissionsProvider>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        open={sidebarOpen}
        onClose={closeSidebar}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
        }`}
      >
        <AdminTopbar onMenu={() => setSidebarOpen(true)} />

        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<Gate path="/admin/users"><AdminUsersPage /></Gate>} />
            <Route path="roles" element={<Gate path="/admin/roles"><AdminRolesPage /></Gate>} />
            <Route path="owners" element={<Gate path="/admin/owners"><AdminOwnersPage /></Gate>} />
            <Route path="places" element={<Gate path="/admin/places"><AdminPlacesPage /></Gate>} />
            <Route path="hotels" element={<Gate path="/admin/hotels"><AdminHotelsPage /></Gate>} />
            <Route path="rooms" element={<Gate path="/admin/rooms"><AdminRoomsPage /></Gate>} />
            <Route path="tickets" element={<Gate path="/admin/tickets"><AdminTicketsPage /></Gate>} />
            <Route path="restaurants" element={<Gate path="/admin/restaurants"><AdminRestaurantsPage /></Gate>} />
            <Route path="food-orders" element={<Gate path="/admin/food-orders"><AdminFoodOrdersPage /></Gate>} />
            <Route path="packages" element={<Gate path="/admin/packages"><AdminPackagesPage /></Gate>} />
            <Route path="bookings" element={<Gate path="/admin/bookings"><AdminBookingsPage /></Gate>} />
            <Route path="payments" element={<Gate path="/admin/payments"><AdminPaymentsPage /></Gate>} />
            <Route path="reviews" element={<Gate path="/admin/reviews"><AdminReviewsPage /></Gate>} />
            <Route path="promotions" element={<Gate path="/admin/promotions"><AdminPromotionsPage /></Gate>} />
            <Route path="notifications" element={<Gate path="/admin/notifications"><AdminNotificationsPage /></Gate>} />
            <Route path="contact-messages" element={<Gate path="/admin/contact-messages"><AdminContactMessagesPage /></Gate>} />
            <Route path="reports" element={<Gate path="/admin/reports"><AdminReportsPage /></Gate>} />
            <Route path="logs" element={<Gate path="/admin/logs"><AdminLogsPage /></Gate>} />
            <Route path="settings" element={<Gate path="/admin/settings"><AdminSettingsPage /></Gate>} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
    </PermissionsProvider>
    </OwnerBusinessProvider>
  );
}
