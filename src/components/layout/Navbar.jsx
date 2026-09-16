import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

const PROFILE_MENU = [
  { key: "trips", label: "My Trips", icon: "luggage", to: "/profile" },
  { key: "bookings", label: "My Bookings", icon: "calendar", to: "/profile" },
  { key: "profile", label: "My Profile", icon: "user", to: "/profile" },
];

// Second-row category tabs. "Cambodia" replaces the old Home link.
const TABS = [
  { label: "Cambodia", to: "/", icon: "map-pin-house", end: true },
  { label: "Tour", to: "/tour", icon: "binoculars" },
  { label: "Hotel", to: "/hotel", icon: "bed" },
  { label: "Restaurant", to: "/restaurant", icon: "utensils" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, canUseManager: canManager } = useAuth();
  const { count, openFavorites } = useFavorites();

  const isTabActive = (to, end) =>
    end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
    setMobileSearch(false);
  }, [location.pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/tour?q=${encodeURIComponent(q)}` : "/tour");
    setSearchQuery("");
    setMobileSearch(false);
  };

  const tabClass = (active) =>
    `relative inline-flex items-center gap-1.5 px-3 py-3.5 text-sm font-bold transition-colors ${
      active ? "text-brand-800" : "text-ink/60 hover:text-brand-700"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full animate-navbarfly border-b backdrop-blur-lg transition-colors duration-300 ${
        scrolled
          ? "border-line bg-white/85 shadow-[0_4px_20px_rgba(20,32,26,0.08)]"
          : "border-transparent bg-white/60"
      }`}
    >
      {/* Row 1 — logo, search, actions */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="SovannDomNour home" className="shrink-0">
          <Logo />
        </Link>

        {/* Search pill (desktop) */}
        <form onSubmit={submitSearch} className="relative ml-1 hidden min-w-0 max-w-md flex-1 md:block">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" size={17} />
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours, hotels, food…"
            aria-label="Search"
            className="h-11 w-full rounded-full border border-line bg-white/80 pl-11 pr-4 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
          />
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearch((v) => !v)}
            aria-label="Search"
            className={`grid h-10 w-10 place-items-center rounded-full transition-colors md:hidden ${
              mobileSearch ? "bg-brand-700 text-white" : "text-ink/70 hover:bg-brand-100 hover:text-brand-700"
            }`}
          >
            <Icon name="search" size={19} />
          </button>

          {/* Favorites / My trips */}
          <button
            type="button"
            onClick={openFavorites}
            aria-label={`Open My trips, ${count} saved`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-all duration-200 hover:-translate-y-px hover:bg-brand-100 hover:text-brand-700 hover:shadow-sm"
          >
            <Icon name="heart" size={19} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-brand-900 ring-2 ring-white">
                {count}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative ml-1 hidden items-center lg:flex">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Open profile menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-xs font-bold text-gold-400 shadow-sm ring-2 ring-white/60 transition-all duration-200 hover:-translate-y-px hover:bg-brand-800 hover:ring-gold-400/60"
              >
                {(user?.fullname || user?.username || "SD").slice(0, 2).toUpperCase()}
              </button>
              {profileOpen && (
                <>
                  <button aria-label="Close profile menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-60 animate-scalein overflow-hidden rounded-2xl border border-line bg-white/95 p-2 shadow-lift backdrop-blur-xl">
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-sm font-bold text-brand-800">{user?.fullname || user?.username || "Traveler"}</p>
                      <p className="truncate text-xs text-muted">{user?.email || "@" + (user?.username || "traveler")}</p>
                    </div>
                    {PROFILE_MENU.map((m) => (
                      <Link key={m.key} to={m.to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50">
                        <Icon name={m.icon} size={18} className="text-brand-500" />
                        {m.label}
                        <Icon name="chevron-right" size={14} className="ml-auto text-muted/50" />
                      </Link>
                    ))}
                    {canManager && (
                      <Link to="/manager" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50">
                        <Icon name="grid" size={18} className="text-gold-600" />
                        Management
                        <Icon name="chevron-right" size={14} className="ml-auto text-muted/50" />
                      </Link>
                    )}
                    <button
                      onClick={() => { setProfileOpen(false); logout(); navigate("/"); }}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-line px-3 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                    >
                      <Icon name="logout" size={18} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/login">
                <span className="inline-flex h-10 items-center rounded-full border border-line bg-white/70 px-4 text-sm font-semibold text-brand-800 transition-all duration-200 hover:-translate-y-px hover:border-brand-300 hover:bg-white hover:shadow-sm">
                  Login
                </span>
              </Link>
              <Link to="/register">
                <span className="inline-flex h-10 items-center rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md">
                  Register
                </span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white/70 text-brand-800 transition-colors hover:bg-brand-50 lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile search row */}
      {mobileSearch && (
        <div className="border-t border-line/60 px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" size={17} />
            </span>
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tours, hotels, food…"
              className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm font-medium text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
            />
          </form>
        </div>
      )}

      {/* Row 2 — category sub-nav (desktop) */}
      <div className="hidden border-t border-line/60 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {TABS.map((t) => {
            const active = isTabActive(t.to, t.end);
            return (
              <Link key={t.to} to={t.to} className={tabClass(active)}>
                <Icon name={t.icon} size={17} className={active ? "text-brand-700" : "text-brand-500"} />
                {t.label}
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-700" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mx-3 mb-3 mt-1 animate-scalein rounded-2xl border border-line/80 bg-white/95 p-3 shadow-lift backdrop-blur-xl sm:mx-4 lg:hidden">
          <ul className="flex flex-col">
            {TABS.map((t) => {
              const active = isTabActive(t.to, t.end);
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors ${
                      active ? "bg-brand-700 text-white" : "text-ink/80 hover:bg-brand-50"
                    }`}
                  >
                    <Icon name={t.icon} size={18} className={active ? "text-gold-400" : "text-brand-500"} />
                    {t.label}
                    <Icon name="chevron-right" size={18} className="ml-auto text-muted" />
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => { setOpen(false); openFavorites(); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-ink/80 transition-colors hover:bg-brand-50"
              >
                <Icon name="heart" size={18} className="text-brand-500" />
                My Trips <span className="text-sm">{count > 0 && `(${count})`}</span>
              </button>
            </li>
          </ul>
          <div className="mt-3 border-t border-line pt-3">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/profile" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50">
                  <Icon name="user" size={18} className="text-brand-500" /> My Profile
                </Link>
                {canManager && (
                  <Link to="/manager" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50">
                    <Icon name="grid" size={18} className="text-gold-600" /> Management
                  </Link>
                )}
                <button
                  onClick={() => { setOpen(false); logout(); navigate("/"); }}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-danger hover:bg-danger/10"
                >
                  <Icon name="logout" size={18} /> Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="flex-1">
                  <span className="flex h-11 w-full items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-brand-800">Login</span>
                </Link>
                <Link to="/register" className="flex-1">
                  <span className="flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-sm font-bold text-white">Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
