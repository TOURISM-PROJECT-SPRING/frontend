import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Lock,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";
import ThemeMenu from "../ui/ThemeMenu";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, avatarUrl, logout } = useAuth();
  const {
    activeCount,
    lockedCount,
    statusSummary,
    businessTypes,
    isSuspended,
    BUSINESS_TYPES,
  } = useOwnerBusiness();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayName = user?.fullname || "Business Owner";
  const activeBadge = BUSINESS_TYPES.filter((b) => businessTypes.includes(b.id))
    .map((b) => b.badge)
    .join(" · ");
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
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end px-6 shrink-0 animate-slide-down relative z-30">
      <div className="flex items-center gap-2 ml-4 shrink-0">
        {/* Active Business Permissions Pill */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs select-none ${
            isSuspended
              ? "bg-red-50 border-red-300/60 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300"
              : activeCount === 3
              ? "bg-[#edf5f0] border-[#1b3b2b]/30 text-[#1b3b2b] dark:bg-[#16291e] dark:border-emerald-800 dark:text-emerald-300"
              : activeCount === 2
              ? "bg-[#edf5f0] border-[#1b3b2b]/20 text-[#1b3b2b] dark:bg-[#16291e] dark:border-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 border-amber-300/60 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300"
          }`}
          title={isSuspended ? "Account suspended by administrator" : "Assigned by Administrator"}
        >
          {isSuspended ? (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
              <span>Suspended</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#f4b938] shrink-0" />
              <span>{activeBadge || statusSummary}</span>
              {lockedCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold opacity-85 text-[#1b3b2b]/80 dark:text-emerald-300/80">
                  <Lock className="w-2.5 h-2.5 text-[#f4b938]" />
                  <span>{lockedCount} locked</span>
                </span>
              )}
            </>
          )}
        </div>

        <div className={`relative transition-all duration-200 ${searchFocused ? "w-64" : "w-44 lg:w-52"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tours, rooms, orders..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#1b3b2b] focus:ring-2 focus:ring-[#1b3b2b]/15 transition"
          />
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 text-[#1b3b2b] dark:text-emerald-400" />
          <span className="whitespace-nowrap">{today}</span>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-[#edf5f0] dark:hover:bg-gray-800 transition">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#f4b938] text-gray-900 text-[9px] font-black rounded-full flex items-center justify-center animate-pulse-soft">3</span>
        </button>

        <button className="relative p-2 rounded-xl hover:bg-[#edf5f0] dark:hover:bg-gray-800 transition">
          <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#1b3b2b] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">1</span>
        </button>

        {/* Theme mode selector (Light / Dark / System) */}
        <ThemeMenu />

        <button onClick={toggleFullscreen} className="p-2 rounded-xl hover:bg-[#edf5f0] dark:hover:bg-gray-800 transition">
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" /> : <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
        </button>

        <div className="w-px h-8 bg-gray-100 dark:bg-gray-800 mx-1" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-[#edf5f0]/80 dark:hover:bg-gray-800 rounded-xl px-2.5 py-1.5 transition"
          >
            <div className="w-8 h-8 bg-[#1b3b2b] border border-[#2d6a4f]/40 rounded-full flex items-center justify-center shadow-xs overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-black text-[#f4b938]">{initials}</span>
              )}
            </div>
            <div className="hidden md:block leading-none text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {activeBadge || "Business Owner"}
              </p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user?.email || "owner@smarttourism.com"}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#1b3b2b] bg-[#edf5f0] border border-[#1b3b2b]/20 dark:text-emerald-300 dark:bg-[#16291e] px-2 py-0.5 rounded">
                    {activeBadge || "Owner Account"}
                  </span>
                </div>

                <Link
                  to="/owner/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  My Profile
                </Link>

                <Link
                  to="/owner/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  View Assigned Businesses
                </Link>

                <div className="border-t border-gray-50 dark:border-gray-800 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
