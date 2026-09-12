import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/owner": "Dashboard",
  "/owner/profile": "My Profile",
  "/owner/properties": "Properties",
  "/owner/bookings": "Bookings",
  "/owner/packages": "Packages",
  "/owner/pricing": "Pricing & Availability",
  "/owner/reviews": "Reviews",
  "/owner/promotions": "Promotions",
  "/owner/reports": "Reports",
  "/owner/insights": "Insights",
  "/owner/payouts": "Payouts",
  "/owner/settings": "Profile & Settings",
  "/owner/team": "Team Members",
  "/owner/help": "Help Center",
};

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user?.fullname || user?.username || "Business Owner";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BO";

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 animate-slide-down relative z-30">
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
          <span>Owner</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">{pageTitle}</span>
        </div>
        <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
        <div className={`relative transition-all duration-200 ${searchFocused ? "w-72" : "w-52"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="whitespace-nowrap">{today}</span>
        </div>

        <button className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">3</span>
        </button>

        <button className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">1</span>
        </button>

        <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
        </button>

        <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 py-1 transition"
          >
            <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{initials}</span>
            </div>
            <div className="hidden md:block leading-none text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{user?.roles?.[0] || "Property Owner"}</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email || "owner@smarttourism.com"}</p>
                </div>
                <Link
                  to="/owner/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <User className="w-4 h-4 text-gray-400 dark:text-gray-500" /> My Profile
                </Link>
                <Link
                  to="/owner/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Settings className="w-4 h-4 text-gray-400 dark:text-gray-500" /> Settings
                </Link>
                <div className="border-t border-gray-50 dark:border-gray-800 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition w-full text-left"
                >
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
