import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

// Dashboard (overview)
import KPICards from "../components/dashboard/KPICards";
import RevenueChart from "../components/dashboard/RevenueChart";
import BookingsChannelChart from "../components/dashboard/BookingsChannelChart";
import RecentBookingsTable from "../components/dashboard/RecentBookingsTable";
import TopPropertiesTable from "../components/dashboard/TopPropertiesTable";
import QuickActions from "../components/dashboard/QuickActions";
import InsightsCards from "../components/dashboard/InsightsCards";

// Manage pages
import OwnerPropertiesPage from "./owner/PropertiesPage";
import OwnerBookingsPage from "./owner/BookingsPage";
import OwnerPackagesPage from "./owner/PackagesPage";
import OwnerPricingPage from "./owner/PricingPage";
import OwnerReviewsPage from "./owner/ReviewsPage";
import OwnerPromotionsPage from "./owner/PromotionsPage";

// Analytics pages
import OwnerReportsPage from "./owner/ReportsPage";
import OwnerInsightsPage from "./owner/InsightsPage";

// Account pages
import OwnerPayoutsPage from "./owner/PayoutsPage";
import OwnerSettingsPage from "./owner/SettingsPage";
import OwnerTeamPage from "./owner/TeamPage";

// Help
import OwnerHelpPage from "./owner/HelpPage";

// Profile
import OwnerProfilePage from "./owner/OwnerProfilePage";

function DashboardOverview() {
  return (
    <div className="space-y-5">
      <KPICards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <BookingsChannelChart />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <RecentBookingsTable />
          <TopPropertiesTable />
        </div>
        <div className="space-y-5">
          <QuickActions />
          <InsightsCards />
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-64"
        }`}
      >
        <Topbar />

        <main className="flex-1 p-5 overflow-y-auto">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="properties" element={<OwnerPropertiesPage />} />
            <Route path="bookings" element={<OwnerBookingsPage />} />
            <Route path="packages" element={<OwnerPackagesPage />} />
            <Route path="pricing" element={<OwnerPricingPage />} />
            <Route path="reviews" element={<OwnerReviewsPage />} />
            <Route path="promotions" element={<OwnerPromotionsPage />} />
            <Route path="reports" element={<OwnerReportsPage />} />
            <Route path="insights" element={<OwnerInsightsPage />} />
            <Route path="payouts" element={<OwnerPayoutsPage />} />
            <Route path="settings" element={<OwnerSettingsPage />} />
            <Route path="team" element={<OwnerTeamPage />} />
            <Route path="help" element={<OwnerHelpPage />} />
            <Route path="profile" element={<OwnerProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
