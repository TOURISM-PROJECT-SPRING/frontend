import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  MessageSquare,
  Maximize2,
  Minimize2,
  Calendar,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

const searchPages = [
  { label: "Dashboard", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Owners", path: "/admin/owners" },
  { label: "Tourist Places", path: "/admin/places" },
  { label: "Hotels", path: "/admin/hotels" },
  { label: "Rooms", path: "/admin/rooms" },
  { label: "Tickets", path: "/admin/tickets" },
  { label: "Restaurants", path: "/admin/restaurants" },
  { label: "Food Orders", path: "/admin/food-orders" },
  { label: "Tour Packages", path: "/admin/packages" },
  { label: "Bookings", path: "/admin/bookings" },
  { label: "Payments", path: "/admin/payments" },
  { label: "Reviews", path: "/admin/reviews" },
  { label: "Promotions", path: "/admin/promotions" },
  { label: "Notifications", path: "/admin/notifications" },
  { label: "Contact Messages", path: "/admin/contact-messages" },
  { label: "Reports", path: "/admin/reports" },
  { label: "System Logs", path: "/admin/logs" },
  { label: "Settings", path: "/admin/settings" },
  { label: "My Profile", path: "/admin/profile" },
];

export default function AdminTopbar({ isDarkMode = false, onToggleDarkMode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredPages = searchQuery.trim()
    ? searchPages.filter((p) => p.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const goToPage = (path) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate(path);
  };

  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end px-5 shrink-0 animate-slide-down relative z-30">
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <div className={`relative transition-all duration-200 ${searchFocused ? "w-64" : "w-48"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredPages.length > 0) {
                goToPage(filteredPages[0].path);
              }
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
          {searchFocused && filteredPages.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-1.5 z-50 max-h-64 overflow-y-auto">
              {filteredPages.map((p) => (
                <button
                  key={p.path}
                  onMouseDown={(e) => { e.preventDefault(); goToPage(p.path); }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5 transition"
                >
                  <Search className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span>{p.label}</span>
                  <span className="ml-auto text-[10px] text-gray-300 dark:text-gray-600 truncate">{p.path}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="whitespace-nowrap">{today}</span>
        </div>

        <button className="relative p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <Bell className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">5</span>
        </button>

        <button className="relative p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <MessageSquare className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">3</span>
        </button>

        <button onClick={toggleFullscreen} className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          {isFullscreen ? <Minimize2 className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" /> : <Maximize2 className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />}
        </button>

        <button
          onClick={onToggleDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {isDarkMode ? (
            <Sun className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-0.5" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{(user?.fullname || "AU").slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="hidden md:block leading-none text-left">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{user?.fullname || "Admin User"}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{user?.email || "Super Admin"}</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullname || "Admin User"}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email || "admin@smarttourism.com"}</p>
                </div>
                <Link
                  to="/admin/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" /> My Profile
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" /> Settings
                </Link>
                <div className="border-t border-gray-50 dark:border-gray-800 my-1" />
                <button onClick={handleSignOut} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition w-full text-left">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
