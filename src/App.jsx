import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import TripCart from "./components/explore/TripCart";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import HotelsPage from "./pages/HotelsPage";
import TourDetailPage from "./pages/TourDetailPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import ManagerArea from "./pages/manager/ManagerArea";

function PublicLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-canvas font-sans text-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tour" element={<PlaceholderPage title="Tours" icon="binoculars" blurb="Tour packages across the Kingdom are coming soon." />} />
          <Route path="/hotel" element={<HotelsPage />} />
          <Route path="/restaurant" element={<PlaceholderPage title="Restaurants" icon="utensils" blurb="The best places to eat and drink are coming soon." />} />
          <Route path="/tours/:id" element={<TourDetailPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
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
      {/* Global trip cart — mounted here so the navbar cart button works on every page. */}
      <TripCart />
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
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}

export default App;
