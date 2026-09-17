import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

const NAV_LINKS = [
  { label: "Explore", to: "/", icon: "compass", end: true },
  { label: "Tours", to: "/tour", icon: "binoculars" },
  { label: "Hotels", to: "/hotel", icon: "bed" },
  { label: "Dining", to: "/restaurant", icon: "utensils" },
];

const TRENDING_SEARCHES = [
  { text: "Angkor Sunrise Tour", to: "/tour?q=Angkor+Sunrise" },
  { text: "Siem Reap Luxury Resorts", to: "/hotel?q=Siem+Reap" },
  { text: "Koh Rong Island Stays", to: "/hotel?q=Koh+Rong" },
  { text: "Khmer Fine Dining", to: "/restaurant?q=Khmer" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, canUseManager: canManager } = useAuth();
  const { count, openFavorites } = useFavorites();

  const isLinkActive = (to, end) =>
    end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + "/");

  // Track scroll for subtle frosted glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setSearchFocused(false);
  }, [location.pathname]);

  // Global keyboard shortcut (Ctrl+K or Cmd+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle clicking outside search container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/tour?q=${encodeURIComponent(q)}` : "/tour");
    setSearchQuery("");
    setSearchFocused(false);
  };

  const userInitials = (user?.fullname || user?.username || "SD")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-white/90 shadow-[0_4px_24px_rgba(2,70,46,0.06)] backdrop-blur-xl"
          : "border-b border-line/40 bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* ================= LEFT: BRAND LOGO ================= */}
        <div className="flex items-center gap-6">
          <Link to="/" aria-label="SovannDomNour Home" className="shrink-0 transition-transform active:scale-95">
            <Logo />
          </Link>

          {/* Desktop Nav Links (Segmented Navigation) */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-line/60 bg-canvas/80 p-1 shadow-2xs backdrop-blur-sm">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to, link.end);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-brand-700 text-white shadow-xs"
                      : "text-muted hover:text-brand-800 hover:bg-white/70"
                  }`}
                >
                  <Icon
                    name={link.icon}
                    size={14}
                    className={active ? "text-gold-300" : "text-brand-500"}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ================= CENTER: SEARCH BAR ================= */}
        <div ref={searchContainerRef} className="relative hidden md:block flex-1 max-w-xs lg:max-w-sm">
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tours, stays, dining…"
              className={`h-10 w-full rounded-full border bg-canvas/80 pl-9 pr-14 text-xs font-medium text-ink outline-none transition-all duration-200 ${
                searchFocused
                  ? "border-brand-500 bg-white shadow-xs ring-2 ring-brand-500/15"
                  : "border-line/80 hover:border-brand-300 hover:bg-white"
              }`}
            />
            {/* Keyboard shortcut or clear button */}
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <Icon name="x" size={14} />
              </button>
            ) : (
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-muted shadow-2xs">
                ⌘K
              </span>
            )}
          </form>

          {/* Search Suggestions Popover */}
          {searchFocused && (
            <div className="absolute left-0 right-0 top-12 z-50 animate-scalein rounded-2xl border border-line bg-white/95 p-3 shadow-lift backdrop-blur-xl">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted">Trending in Cambodia</p>
              <div className="mt-2 space-y-1">
                {TRENDING_SEARCHES.map((item) => (
                  <button
                    key={item.text}
                    type="button"
                    onClick={() => {
                      navigate(item.to);
                      setSearchFocused(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-brand-900 transition-colors hover:bg-brand-50"
                  >
                    <Icon name="trending-up" size={14} className="text-brand-500 shrink-0" />
                    <span className="truncate">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT: ACTIONS & PROFILE ================= */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Search Icon Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-brand-50 hover:text-brand-800 md:hidden"
          >
            <Icon name="search" size={18} />
          </button>

          {/* Saved Trips / Favorites Button */}
          <button
            type="button"
            onClick={openFavorites}
            aria-label={`Open Saved Trips (${count})`}
            className="group relative flex h-10 items-center gap-1.5 rounded-full border border-line/70 bg-white px-3 text-xs font-bold text-brand-800 shadow-2xs transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-sm active:scale-95"
          >
            <Icon
              name="heart"
              size={16}
              className={`transition-transform group-hover:scale-110 ${
                count > 0 ? "text-rose-500" : "text-muted"
              }`}
              fill={count > 0 ? "currentColor" : "none"}
            />
            <span className="hidden sm:inline">Trips</span>
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-black text-brand-950">
                {count}
              </span>
            )}
          </button>

          {/* Authenticated User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line/80 bg-white p-1 pr-3 shadow-2xs transition-all hover:border-brand-300 hover:shadow-sm active:scale-95"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-amber-500 font-display text-xs font-black text-brand-950 shadow-2xs">
                  {userInitials}
                </span>
                <span className="hidden sm:inline max-w-[100px] truncate text-xs font-bold text-brand-900">
                  {user?.fullname ? user.fullname.split(" ")[0] : user?.username || "Account"}
                </span>
                <Icon
                  name="chevron-down"
                  size={14}
                  className={`text-muted transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Luxury Profile Dropdown */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-64 animate-scalein overflow-hidden rounded-2xl border border-line bg-white/95 p-2 shadow-lift backdrop-blur-xl">
                    {/* User Header */}
                    <div className="rounded-xl bg-gradient-to-r from-brand-900 to-brand-800 p-3 text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-400 font-display text-xs font-black text-brand-950">
                          {userInitials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">
                            {user?.fullname || user?.username || "Traveler"}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-300">
                            <Icon name="badge-check" size={11} /> Gold Explorer
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="mt-1 space-y-0.5">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-brand-50"
                      >
                        <Icon name="user" size={16} className="text-brand-600" />
                        <span>Profile Details</span>
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-brand-50"
                      >
                        <Icon name="luggage" size={16} className="text-brand-600" />
                        <span>My Bookings &amp; Vouchers</span>
                      </Link>

                      {canManager && (
                        <Link
                          to="/manager"
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-brand-50"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon name="grid" size={16} className="text-gold-600" />
                            <span>Management Portal</span>
                          </div>
                          <span className="rounded bg-gold-100 px-1.5 py-0.5 text-[9px] font-extrabold text-gold-800">
                            Staff
                          </span>
                        </Link>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="mt-1 border-t border-line/60 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-danger transition-colors hover:bg-red-50"
                      >
                        <Icon name="logout" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex h-9 items-center rounded-full px-3.5 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-full bg-brand-700 px-4 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-800 hover:shadow-sm active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-brand-900 shadow-2xs transition-colors hover:bg-brand-50 lg:hidden"
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={19} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER / SHEET ================= */}
      {mobileMenuOpen && (
        <div className="border-t border-line bg-white/98 p-4 shadow-lift backdrop-blur-xl lg:hidden animate-slidein">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Angkor, Siem Reap, stays…"
              className="h-11 w-full rounded-full border border-line bg-canvas pl-10 pr-4 text-xs font-medium text-ink outline-none focus:border-brand-500 focus:bg-white"
            />
          </form>

          {/* Navigation Links */}
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to, link.end);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    active
                      ? "bg-brand-700 text-white"
                      : "text-brand-900 hover:bg-brand-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={link.icon}
                      size={18}
                      className={active ? "text-gold-300" : "text-brand-600"}
                    />
                    <span>{link.label}</span>
                  </div>
                  <Icon name="chevron-right" size={16} className={active ? "text-gold-300" : "text-muted"} />
                </Link>
              );
            })}
          </div>

          {/* Divider & Account Links */}
          <div className="mt-4 border-t border-line/80 pt-4">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-50"
                >
                  <Icon name="user" size={16} className="text-brand-600" />
                  <span>Profile &amp; Bookings</span>
                </Link>
                {canManager && (
                  <Link
                    to="/manager"
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-brand-900 hover:bg-brand-50"
                  >
                    <Icon name="grid" size={16} className="text-gold-600" />
                    <span>Management Portal</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-danger hover:bg-red-50"
                >
                  <Icon name="logout" size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  to="/login"
                  className="flex h-11 items-center justify-center rounded-xl border border-line bg-white text-xs font-bold text-brand-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex h-11 items-center justify-center rounded-xl bg-brand-700 text-xs font-bold text-white shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

