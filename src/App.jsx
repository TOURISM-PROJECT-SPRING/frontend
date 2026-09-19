import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleGuard from "./components/manager/RoleGuard";
import { useAuth } from "./context/AuthContext";
import { useInbox } from "./context/InboxContext";
import MyTrips from "./components/explore/MyTrips";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InboxPage from "./pages/InboxPage";
import InboxDrawer from "./components/inbox/InboxDrawer";
import BookingVoucherModal from "./components/inbox/BookingVoucherModal";
import InboxToast from "./components/inbox/InboxToast";
import SovannAiChat from "./components/ai/SovannAiChat";
import ToursPage from "./pages/ToursPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import HotelsPage from "./pages/HotelsPage";
import RestaurantSearchPage from "./pages/RestaurantSearchPage";
import TourDetailPage from "./pages/TourDetailPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerRoute from "./components/owner/OwnerRoute";
import AdminDashboard from "./pages/AdminDashboard";
import { ROLES, homePathFor } from "./utils/rbac";

function PublicLayout() {
  const { selectedBooking, closeBookingDetails } = useInbox();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-canvas font-sans text-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tour" element={<ToursPage />} />
          <Route path="/hotel" element={<HotelsPage />} />
          <Route path="/restaurant" element={<RestaurantSearchPage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
          <Route path="/activity/:id" element={<ActivityDetailPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/my-bookings" element={<InboxPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {/* Global "My trips" favorites panel — mounted here so the navbar heart button works on every page. */}
      <MyTrips />
      {/* Global Tourist Inbox & Booking Alerts */}
      <InboxDrawer />
      <BookingVoucherModal booking={selectedBooking} onClose={closeBookingDetails} />
      <InboxToast />
      {/* Floating Sovann AI Concierge */}
      <SovannAiChat />
    </div>
  );
}

// Auth pages are only for guests — a signed-in admin/owner/user is bounced to
// their role home instead of being shown a login form again.
function GuestOnly({ children }) {
  const { isAuthenticated, ready, user } = useAuth();
  if (!ready) return null;
  if (isAuthenticated) return <Navigate to={homePathFor(user)} replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage mode="login" />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <LoginPage mode="register" />
          </GuestOnly>
        }
      />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route
        path="/owner/*"
        element={
          <ProtectedRoute>
            <OwnerRoute>
              <OwnerDashboard />
            </OwnerRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleGuard roles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;
