import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import BusinessGuard from "../components/dashboard/BusinessGuard";
import { OwnerBusinessProvider } from "../context/OwnerBusinessContext";
import { useAuth } from "../context/AuthContext";

// Dashboard (overview)
import KPICards from "../components/dashboard/KPICards";
import RevenueChart from "../components/dashboard/RevenueChart";
import BookingsChannelChart from "../components/dashboard/BookingsChannelChart";
import RecentBookingsTable from "../components/dashboard/RecentBookingsTable";
import TopPropertiesTable from "../components/dashboard/TopPropertiesTable";
import QuickActions from "../components/dashboard/QuickActions";
import InsightsCards from "../components/dashboard/InsightsCards";

// Hotel Manage pages
import OwnerPropertiesPage from "./owner/PropertiesPage";
import OwnerRoomsPage from "./owner/RoomsPage";
import OwnerBookingsPage from "./owner/BookingsPage";
import OwnerPricingPage from "./owner/PricingPage";

// Restaurant Manage pages
import OwnerRestaurantsPage from "./owner/RestaurantsPage";
import OwnerMenuPage from "./owner/MenuPage";
import OwnerOrdersPage from "./owner/OrdersPage";

// Tour Manage pages
import OwnerToursPage from "./owner/ToursPage";
import OwnerTicketsPage from "./owner/TicketsPage";
import OwnerTicketBookingsPage from "./owner/TicketBookingsPage";
import OwnerPackagesPage from "./owner/PackagesPage";

// Engagement & Analytics pages
import OwnerReviewsPage from "./owner/ReviewsPage";
import OwnerPromotionsPage from "./owner/PromotionsPage";
import OwnerReportsPage from "./owner/ReportsPage";
import OwnerInsightsPage from "./owner/InsightsPage";

// Account pages
import OwnerPayoutsPage from "./owner/PayoutsPage";
import OwnerSettingsPage from "./owner/SettingsPage";
import OwnerTeamPage from "./owner/TeamPage";

// Help & Profile
import OwnerHelpPage from "./owner/HelpPage";
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

// Refreshes the current user from the backend when the owner console mounts or
// comes back into focus, so role / business-assignment changes made in the
// admin dashboard appear without a re-login.
function OwnerRoleSync() {
  const { refreshUser } = useAuth();
  const refreshRef = useRef(refreshUser);
  refreshRef.current = refreshUser;

  useEffect(() => {
    const sync = () => {
      refreshRef.current();
    };
    sync();
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return null;
}

export default function OwnerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <OwnerBusinessProvider>
      <OwnerRoleSync />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <Sidebar
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
          <Topbar onMenu={() => setSidebarOpen(true)} />

          <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
            <Routes>
              <Route index element={<DashboardOverview />} />

              {/* Hotel Routes - Protected by BusinessGuard */}
              <Route
                path="properties"
                element={
                  <BusinessGuard business="hotel">
                    <OwnerPropertiesPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="rooms"
                element={
                  <BusinessGuard business="hotel">
                    <OwnerRoomsPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="bookings"
                element={
                  <BusinessGuard business="hotel">
                    <OwnerBookingsPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="pricing"
                element={
                  <BusinessGuard business="hotel">
                    <OwnerPricingPage />
                  </BusinessGuard>
                }
              />

              {/* Restaurant Routes - Protected by BusinessGuard */}
              <Route
                path="restaurants"
                element={
                  <BusinessGuard business="restaurant">
                    <OwnerRestaurantsPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="menu"
                element={
                  <BusinessGuard business="restaurant">
                    <OwnerMenuPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="orders"
                element={
                  <BusinessGuard business="restaurant">
                    <OwnerOrdersPage />
                  </BusinessGuard>
                }
              />

              {/* Tour / Tourists Routes - Protected by BusinessGuard */}
              <Route
                path="tours"
                element={
                  <BusinessGuard business="tour">
                    <OwnerToursPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="tickets"
                element={
                  <BusinessGuard business="tour">
                    <OwnerTicketsPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="ticket-bookings"
                element={
                  <BusinessGuard business="tour">
                    <OwnerTicketBookingsPage />
                  </BusinessGuard>
                }
              />
              <Route
                path="packages"
                element={
                  <BusinessGuard business="tour">
                    <OwnerPackagesPage />
                  </BusinessGuard>
                }
              />

              {/* Shared Marketing & Analytics */}
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
    </OwnerBusinessProvider>
  );
}
