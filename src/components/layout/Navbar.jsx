import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Heart, Bell, Globe, Menu, X, Landmark, Sun, Moon } from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

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
            <button className="hidden sm:flex p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
            </button>

            <button className="hidden sm:flex relative p-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>

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

            <div className="hidden sm:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5 sm:mx-1" />

            <Link
              to="/login"
              className="hidden sm:inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-[12px] sm:text-[13px] font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              {t("nav.signIn")}
            </Link>

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

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors mt-2"
              >
                {t("nav.signIn")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
