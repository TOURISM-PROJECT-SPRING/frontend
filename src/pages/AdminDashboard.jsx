import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminKPICards from "../components/admin/AdminKPICards";
import AdminBookingsChart from "../components/admin/AdminBookingsChart";
import AdminRevenueChart from "../components/admin/AdminRevenueChart";
import AdminRecentBookings from "../components/admin/AdminRecentBookings";
import AdminTopPlaces from "../components/admin/AdminTopPlaces";
import AdminSystemStats from "../components/admin/AdminSystemStats";
import AdminRecentActivities from "../components/admin/AdminRecentActivities";

import AdminUsersPage from "./admin/AdminUsersPage";
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

function AdminOverview() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, Admin!</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Here's what's happening with your system.</p>
      </div>
      <AdminKPICards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <AdminBookingsChart />
        </div>
        <div>
          <AdminRevenueChart />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <AdminRecentBookings />
          <AdminRecentActivities />
        </div>
        <div className="space-y-5">
          <AdminTopPlaces />
          <AdminSystemStats />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <AdminTopbar />

        <main className="flex-1 p-5 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="owners" element={<AdminOwnersPage />} />
            <Route path="places" element={<AdminPlacesPage />} />
            <Route path="hotels" element={<AdminHotelsPage />} />
            <Route path="rooms" element={<AdminRoomsPage />} />
            <Route path="tickets" element={<AdminTicketsPage />} />
            <Route path="restaurants" element={<AdminRestaurantsPage />} />
            <Route path="food-orders" element={<AdminFoodOrdersPage />} />
            <Route path="packages" element={<AdminPackagesPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="promotions" element={<AdminPromotionsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="contact-messages" element={<AdminContactMessagesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
