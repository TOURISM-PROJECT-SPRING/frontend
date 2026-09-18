import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import StaysPage from "./pages/StaysPage";
import ToursPage from "./pages/ToursPage";
import DiningPage from "./pages/DiningPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import TourPlaceDetailPage from "./pages/TourPlaceDetailPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import FeaturedExperiencesPage from "./pages/FeaturedExperiencesPage";
import AboutCambodiaPage from "./pages/AboutCambodiaPage";
import AboutPage from "./pages/AboutPage";
import OffersPage from "./pages/OffersPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
<<<<<<< Updated upstream
<<<<<<< Updated upstream

import InboxPage from "./pages/InboxPage";
import InboxDrawer from "./components/inbox/InboxDrawer";
import BookingVoucherModal from "./components/inbox/BookingVoucherModal";
import InboxToast from "./components/inbox/InboxToast";
import { useInbox } from "./context/InboxContext";
=======
=======
>>>>>>> Stashed changes
import SovannAiChat from "./components/ai/SovannAiChat";
import { ROLES, homePathFor } from "./utils/rbac";
>>>>>>> Stashed changes

function PublicLayout() {
  const { selectedBooking, closeBookingDetails } = useInbox();

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 font-sans overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationsPage />} />
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/stays/:id" element={<HotelDetailPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:id" element={<TourPlaceDetailPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/dining/:id" element={<RestaurantDetailPage />} />
          <Route path="/experiences" element={<FeaturedExperiencesPage />} />
          <Route path="/about-cambodia" element={<AboutCambodiaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/my-bookings" element={<InboxPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
<<<<<<< Updated upstream

      {/* Global Tourist Inbox & Booking Alerts Components */}
      <InboxDrawer />
      <BookingVoucherModal booking={selectedBooking} onClose={closeBookingDetails} />
      <InboxToast />
=======
      {/* Global "My trips" favorites panel — mounted here so the navbar heart button works on every page. */}
      <MyTrips />
      {/* Floating Sovann AI Concierge */}
      <SovannAiChat />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/owner/*" element={<OwnerDashboard />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
