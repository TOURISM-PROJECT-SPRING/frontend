import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Routes, Route } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";
import AdminKPICards from "./components/AdminKPICards";
import AdminBookingsChart from "./components/AdminBookingsChart";
import AdminRevenueChart from "./components/AdminRevenueChart";
import AdminRecentBookings from "./components/AdminRecentBookings";
import AdminTopPlaces from "./components/AdminTopPlaces";
import AdminSystemStats from "./components/AdminSystemStats";
import AdminRecentActivities from "./components/AdminRecentActivities";

import AdminUsersPage from "./pages/AdminUsersPage";
import AdminOwnersPage from "./pages/AdminOwnersPage";
import AdminPlaceholderPage from "./pages/AdminPlaceholderPage";
import AdminNotFoundPage from "./pages/AdminNotFoundPage";
import useDashboardData from "./hooks/useDashboardData";
import AdminPlacesPage from "./pages/AdminPlacesPage";
import AdminHotelsPage from "./pages/AdminHotelsPage";
import AdminRoomsPage from "./pages/AdminRoomsPage";
import AdminTicketsPage from "./pages/AdminTicketsPage";
import AdminRestaurantsPage from "./pages/AdminRestaurantsPage";
import AdminFoodOrdersPage from "./pages/AdminFoodOrdersPage";
import AdminPackagesPage from "./pages/AdminPackagesPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminReviewsPage from "./pages/AdminReviewsPage";
import AdminPromotionsPage from "./pages/AdminPromotionsPage";
import AdminNotificationsPage from "./pages/AdminNotificationsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminLogsPage from "./pages/AdminLogsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdminContactMessagesPage from "./pages/AdminContactMessagesPage";

function AdminOverview() {
  const { error } = useDashboardData();
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, Admin!</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Here's what's happening with your system.</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Some data failed to load. Check the backend connection and refresh.</span>
          </div>
        )}
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("tourism_admin_theme") === "dark";
    } catch {
      return false;
    }
  });
  const [themeTween, setThemeTween] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("tourism_admin_theme", isDarkMode ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!themeTween) return;
    const t = setTimeout(() => setThemeTween(false), 450);
    return () => clearTimeout(t);
  }, [themeTween]);

  const toggleDarkMode = () => {
    const apply = () => {
      flushSync(() => {
        setIsDarkMode((prev) => !prev);
        setThemeTween(true);
      });
    };
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 flex ${isDarkMode ? "admin-dark" : ""} ${themeTween ? "theme-transition" : ""}`}>
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <AdminTopbar
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

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
            <Route path="help" element={<AdminPlaceholderPage title="Help Center" description="Search help articles and documentation here (coming soon)." />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="*" element={<AdminNotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}