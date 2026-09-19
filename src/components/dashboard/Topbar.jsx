import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOwnerBusiness, TEST_OWNERS } from "../../context/OwnerBusinessContext";
import ThemeMenu from "../ui/ThemeMenu";

const pageTitles = {
  "/owner": "Dashboard",
  "/owner/profile": "My Profile",
  "/owner/properties": "Properties",
  "/owner/rooms": "Rooms",
  "/owner/bookings": "Bookings",
  "/owner/packages": "Packages",
  "/owner/pricing": "Pricing & Availability",
  "/owner/restaurants": "Restaurants",
  "/owner/menu": "Menu & Dishes",
  "/owner/orders": "Food Orders",
  "/owner/tours": "Tour Places",
  "/owner/tickets": "Tour Tickets",
  "/owner/ticket-bookings": "Ticket Bookings",
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
  const { user, avatarUrl, logout, switchTestAccount } = useAuth();
  const {
    activeCount,
    lockedCount,
    statusSummary,
    currentTestOwner,
  } = useOwnerBusiness();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const pageTitle = pageTitles[location.pathname] || "Owner Portal";
  const displayName = user?.fullname || currentTestOwner?.fullname || "Business Owner";
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
        {/* Active Business Permissions Pill */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs select-none ${
            activeCount === 3
              ? "bg-[#edf5f0] border-[#1b3b2b]/30 text-[#1b3b2b] dark:bg-[#16291e] dark:border-emerald-800 dark:text-emerald-300"
              : activeCount === 2
              ? "bg-[#edf5f0] border-[#1b3b2b]/20 text-[#1b3b2b] dark:bg-[#16291e] dark:border-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 border-amber-300/60 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300"
          }`}
          title="Assigned by Administrator"
        >
          <span className="w-2 h-2 rounded-full bg-[#f4b938] shrink-0" />
          <span>{currentTestOwner?.badge || statusSummary}</span>
          {lockedCount > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] font-semibold opacity-85 text-[#1b3b2b]/80 dark:text-emerald-300/80">
              <Lock className="w-2.5 h-2.5 text-[#f4b938]" />
              <span>{lockedCount} locked</span>
            </span>
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
{currentTestOwner?.badge || "Property Owner"}
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
{currentTestOwner?.badge || "Owner Account"}
                  </span>
                </div>

                {/* Quick 1-Click Test Owner Switcher */}
                <div className="px-3 py-2 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Switch Test Owner:
                  </p>
                  <div className="space-y-1">
                    {TEST_OWNERS.map((to) => {
                      const isCurrent =
                        user?.username === to.username ||
                        (to.username === "owner_hotel" && user?.username === "owner");
                      return (
                        <button
                          key={to.username}
                          type="button"
                          onClick={() => {
                            switchTestAccount(to);
                            setProfileOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                            isCurrent
                              ? "bg-[#1b3b2b] text-white shadow-xs"
                              : "text-gray-700 dark:text-gray-300 hover:bg-[#edf5f0] hover:text-[#1b3b2b] dark:hover:bg-gray-700"
                          }`}
                        >
                          <span className="truncate">{to.badge}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#f4b938] text-gray-950 font-black px-1.5 py-0.2 rounded-full ml-1 shrink-0">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Switch to Other Roles: Admin & Customer */}
                <div className="px-3 py-2 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Switch Platform Role:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        switchTestAccount({
                          id: 1,
                          username: "admin",
                          fullname: "System Administrator",
                          role: "ADMIN",
                          roles: ["ADMIN"],
                        });
                        setProfileOpen(false);
                        navigate("/admin");
                      }}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold bg-[#edf5f0] text-[#1b3b2b] border border-[#1b3b2b]/20 hover:bg-[#1b3b2b] hover:text-white transition cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>👑</span>
                      <span>Admin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchTestAccount({
                          id: 201,
                          username: "customer",
                          fullname: "Dara Customer",
                          role: "TOURIST",
                          roles: ["TOURIST"],
                        });
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold bg-[#edf5f0] text-[#1b3b2b] border border-[#1b3b2b]/20 hover:bg-[#1b3b2b] hover:text-white transition cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>🎒</span>
                      <span>Customer</span>
                    </button>
                  </div>
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
