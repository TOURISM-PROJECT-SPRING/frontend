import { useEffect, useState } from "react";
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
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { userAttachmentService } from "../../services/userAttachmentService";
import AdminThemeMenu from "./AdminThemeMenu";

const THEME_CYCLE = ["light", "dark", "system"];
const THEME_LABEL = { light: "Light", dark: "Dark", system: "System" };
const THEME_ICON = { light: Sun, dark: Moon, system: Monitor };

export default function AdminTopbar() {
  const navigate = useNavigate();
  const { user, userId, logout, avatarUrl, setAvatarUrl } = useAuth();
  const { mode, setThemeMode } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    userAttachmentService
      .getUserAttachments(userId)
      .then((attachments) => {
        if (!active) return;
        const profile =
          (attachments || []).find((a) => a.type === "PROFILE") || (attachments || [])[0];
        setAvatarUrl(profile?.cloudinaryUrl || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId, setAvatarUrl]);

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(mode) + 1) % THEME_CYCLE.length];
    setThemeMode(next);
  };
  const AppearanceIcon = (THEME_ICON[mode] || Monitor);

  const displayName = user?.fullname || user?.username || "Admin User";
  const displayEmail = user?.email || "admin@smarttourism.com";
  const roleLabel = user?.role || user?.roles?.[0] || "Super Admin";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AU";

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

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
      <div className="flex items-center">
        <div className={`relative transition-all duration-200 ${searchFocused ? "w-80" : "w-64"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search anything in admin..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4 shrink-0">
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

        {/* Theme mode selector (Light / Dark / System) */}
        <AdminThemeMenu />

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
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{initials}</span>
              )}
            </div>
            <div className="hidden md:block leading-none text-left">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{displayName}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{roleLabel}</p>
            </div>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{displayEmail}</p>
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
                <button
                  type="button"
                  onClick={cycleTheme}
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition w-full text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <AppearanceIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>Appearance</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {THEME_LABEL[mode] || "System"}
                  </span>
                </button>
                <div className="border-t border-gray-50 dark:border-gray-800 my-1" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition w-full text-left cursor-pointer font-medium"
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
