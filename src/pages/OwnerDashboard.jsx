import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import BusinessGuard from "../components/dashboard/BusinessGuard";
import { OwnerBusinessProvider } from "../context/OwnerBusinessContext";

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

export default function OwnerDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <OwnerBusinessProvider>
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
