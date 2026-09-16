import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Search,
  Bell,
  MessageSquare,
  Maximize2,
  Minimize2,
  Calendar,
  ChevronRight,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/profile": "My Profile",
  "/admin/users": "Users",
  "/admin/owners": "Owners / Businesses",
  "/admin/places": "Tourist Places",
  "/admin/hotels": "Hotels",
  "/admin/rooms": "Rooms",
  "/admin/tickets": "Tickets",
  "/admin/restaurants": "Restaurants",
  "/admin/food-orders": "Food & Orders",
  "/admin/packages": "Tour Packages",
  "/admin/bookings": "Bookings",
  "/admin/payments": "Payments",
  "/admin/reviews": "Reviews & Ratings",
  "/admin/promotions": "Promotions",
  "/admin/notifications": "Notifications",
  "/admin/reports": "Reports",
  "/admin/logs": "System Logs",
  "/admin/settings": "Settings",
};

export default function AdminTopbar() {
  const location = useLocation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
    <header className="h-14 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-5 shrink-0 animate-slide-down relative z-30">
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">{pageTitle}</span>
        </div>
        <h1 className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
        <div className={`relative transition-all duration-200 ${searchFocused ? "w-64" : "w-48"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search anything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
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

        <div className="w-px h-6 bg-gray-100 dark:bg-gray-800 mx-0.5" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">AU</span>
            </div>
            <div className="hidden md:block leading-none text-left">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">Admin User</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">Super Admin</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">admin@smarttourism.com</p>
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
                <button className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition w-full text-left">
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
