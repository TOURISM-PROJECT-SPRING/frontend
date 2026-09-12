import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useInbox } from "../../context/InboxContext";
import {
  Globe,
  Menu,
  X,
  Landmark,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Bell,
  Inbox,
} from "lucide-react";

const navKeys = [
  { key: "nav.home", href: "/" },
  { key: "nav.destinations", href: "/destinations" },
  { key: "nav.stays", href: "/stays" },
  { key: "nav.tours", href: "/tours" },
  { key: "nav.dining", href: "/dining" },
  { key: "nav.about", href: "/about-cambodia" },
  { key: "nav.offers", href: "/offers" },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { dark, toggle } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { openInbox, unreadCount } = useInbox();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const upperRoles = roles.map((r) => String(r).toUpperCase());
  const isAdmin = upperRoles.some((r) => r.includes("ADMIN"));
  const isOwner = upperRoles.some((r) => r.includes("OWNER"));

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 w-full">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
              <Landmark className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="block text-[14px] sm:text-[15px] font-bold text-primary">
                Smart Tourism
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase mt-0.5">
                Cambodia
              </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5">
            {navKeys.map(({ key, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  `px-2.5 xl:px-3 py-2 rounded-lg text-[12px] xl:text-[13px] font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="hidden sm:flex p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" /> : <Moon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />}
            </button>

            <div className="hidden md:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[12px] sm:text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {i18n.language === "km" ? "KM" : "EN"}
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50 min-w-[100px]">
                    <button
                      onClick={() => toggleLang("en")}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        i18n.language === "en"
                          ? "text-primary bg-primary/5"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => toggleLang("km")}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                        i18n.language === "km"
                          ? "text-primary bg-primary/5"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      ខ្មែរ
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Inbox & Booking Alerts Bell */}
            <button
              onClick={openInbox}
              className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
              title="Inbox & Booking Alerts"
            >
              <Bell className="w-[17px] h-[17px] sm:w-[19px] sm:h-[19px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5 sm:mx-1" />

            {/* User Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-gray-800 dark:text-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.fullname ? user.fullname.charAt(0) : user.username ? user.username.charAt(0) : "U"}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                    {user.fullname || user.username}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in-up">
                      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.fullname || user.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email || user.username}</p>
                        <div className="mt-1 flex gap-1">
                          {roles.map((r) => (
                            <span
                              key={r}
                              className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary rounded"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            openInbox();
                          }}
                          className="flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <span className="flex items-center gap-2.5">
                            <Bell className="w-4 h-4 text-primary" />
                            My Inbox & Alerts
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-primary text-white rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            <ShieldCheck className="w-4 h-4 text-red-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        {isOwner && (
                          <Link
                            to="/owner"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            <Building2 className="w-4 h-4 text-primary" />
                            Owner Portal
                          </Link>
                        )}
                        <Link
                          to="/"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          Home
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-[12px] sm:text-[13px] font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t("nav.signIn")}
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navKeys.map(({ key, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}

            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
              {isAuthenticated && user && (
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl mb-2">
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                    {user.fullname || user.username}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{user.email || user.username}</div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="mt-2 block text-xs font-semibold text-red-500"
                    >
                      → Go to Admin Dashboard
                    </Link>
                  )}
                  {isOwner && (
                    <Link
                      to="/owner"
                      onClick={() => setMobileOpen(false)}
                      className="mt-2 block text-xs font-semibold text-primary"
                    >
                      → Go to Owner Portal
                    </Link>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  openInbox();
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-primary" />
                  My Inbox & Alerts
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-primary text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </button>

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {t("nav.contactUs")}
              </Link>

              <div className="flex items-center gap-2 px-3 py-2.5">
                <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <button
                  onClick={() => i18n.changeLanguage("en")}
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    i18n.language === "en"
                      ? "text-primary bg-primary/10"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage("km")}
                  className={`text-sm font-medium px-2 py-0.5 rounded ${
                    i18n.language === "km"
                      ? "text-primary bg-primary/10"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  KM
                </button>
              </div>

              {/* Mobile theme toggle */}
              <button
                onClick={toggle}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {dark ? "Light Mode" : "Dark Mode"}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="block w-full text-center px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors mt-2"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors mt-2"
                >
                  {t("nav.signIn")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

