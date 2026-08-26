import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import StaysPage from "./pages/StaysPage";
import ToursPage from "./pages/ToursPage";
import DiningPage from "./pages/DiningPage";
import FeaturedExperiencesPage from "./pages/FeaturedExperiencesPage";
import AboutCambodiaPage from "./pages/AboutCambodiaPage";
import AboutPage from "./pages/AboutPage";
import OffersPage from "./pages/OffersPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import WelcomeOverlay from "./components/home/WelcomeOverlay";

function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 font-sans overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationsPage />} />
          <Route path="/stays" element={<StaysPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/experiences" element={<FeaturedExperiencesPage />} />
          <Route path="/about-cambodia" element={<AboutCambodiaPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <WelcomeOverlay />
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
