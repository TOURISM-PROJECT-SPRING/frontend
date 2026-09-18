import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useInbox } from "./context/InboxContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InboxPage from "./pages/InboxPage";
import InboxDrawer from "./components/inbox/InboxDrawer";
import BookingVoucherModal from "./components/inbox/BookingVoucherModal";
import InboxToast from "./components/inbox/InboxToast";
import SovannAiChat from "./components/ai/SovannAiChat";
import ToursPage from "./pages/ToursPage";
import TourDetailPage from "./pages/TourDetailPage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ManagerArea from "./pages/manager/ManagerArea";
import AdminDashboard from "./pages/AdminDashboard";

function PublicLayout() {
  const { selectedBooking, closeBookingDetails } = useInbox();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-canvas font-sans text-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
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
      {/* Global Tourist Inbox & Booking Alerts */}
      <InboxDrawer />
      <BookingVoucherModal booking={selectedBooking} onClose={closeBookingDetails} />
      <InboxToast />
      {/* Floating Sovann AI Concierge */}
      <SovannAiChat />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage mode="login" />} />
      <Route path="/register" element={<LoginPage mode="register" />} />
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute>
            <ManagerArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;
