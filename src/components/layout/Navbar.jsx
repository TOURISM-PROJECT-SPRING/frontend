import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import { navLinks } from "../../data/site";
import { useAuth } from "../../context/AuthContext";

const PROFILE_MENU = [
  { key: "trips", label: "My Trips", icon: "luggage" },
  { key: "profile", label: "Profile", icon: "user" },
  { key: "bookings", label: "Bookings", icon: "calendar" },
  { key: "account", label: "Account Info", icon: "settings" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isActive = (href) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => setProfileOpen(false), [location.pathname]);

  const linkClass = (active) =>
    `relative py-1.5 text-sm font-semibold transition-colors ${
      active ? "text-brand-700" : "text-ink/70 hover:text-brand-700"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur ${
        scrolled ? "border-line shadow-[0_4px_20px_rgba(20,32,26,0.06)]" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" aria-label="SovannDomNour home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.label}>
                <Link to={l.href} className={linkClass(active)}>
                  {l.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-gold-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-xl text-ink/70 hover:bg-brand-50 hover:text-brand-700"
          >
            <Icon name="search" size={19} />
          </button>
          <button className="flex h-10 items-center gap-1 rounded-xl px-2.5 text-sm font-semibold text-ink/70 hover:bg-brand-50 hover:text-brand-700">
            EN <Icon name="chevron-down" size={15} />
          </button>
          {isAuthenticated ? (
            <div className="relative ml-1 flex items-center gap-2">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Open profile menu"
                className="group grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-xs font-bold text-gold-400 transition-colors hover:bg-brand-800"
              >
                {(user?.fullname || user?.username || "SD").slice(0, 2).toUpperCase()}
              </button>
              {profileOpen && (
                <>
                  <button
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-56 animate-scalein overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-lift">
                    <div className="border-b border-line px-3 py-2.5">
                      <p className="truncate text-sm font-bold text-brand-800">
                        {user?.fullname || user?.username || "Traveler"}
                      </p>
                      <p className="truncate text-xs text-muted">{user?.email || "@" + (user?.username || "traveler")}</p>
                    </div>
                    {PROFILE_MENU.map((m) => (
                      <Link
                        key={m.key}
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
                      >
                        <Icon name={m.icon} size={18} className="text-brand-500" />
                        {m.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate("/");
                      }}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-line px-3 py-2.5 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
                    >
                      <Icon name="logout" size={18} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm" className="ml-1">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="grid h-11 w-11 place-items-center rounded-xl border border-line text-brand-800 lg:hidden"
        >
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-base font-semibold ${
                    isActive(l.href) ? "bg-brand-50 text-brand-700" : "text-ink/80"
                  }`}
                >
                  {l.label}
                  <Icon name="chevron-right" size={18} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            {isAuthenticated ? (
              <div className="w-full">
                <div className="flex w-full items-center gap-3 rounded-xl bg-brand-50 px-3 py-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-xs font-bold text-gold-400">
                    {(user?.fullname || user?.username || "SD").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate text-sm font-semibold text-brand-800">Welcome, {user?.fullname || user?.username || "Traveler"}</span>
                </div>
                <Link
                  to="/profile"
                  className="mt-2 flex w-full items-center gap-3 rounded-xl border border-line px-3 py-3 text-sm font-bold text-brand-800"
                >
                  <Icon name="user" size={18} className="text-brand-500" />
                  My Profile
                  <Icon name="chevron-right" size={18} className="ml-auto text-muted" />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex-1">
                  <Button variant="secondary" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="flex-1">
                  <Button variant="primary" className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
