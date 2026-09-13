import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../hooks/useResource";
import { useToast } from "../components/ui/Toast";
import Icon from "../components/ui/Icon";
import TripCard from "../components/profile/TripCard";

const TABS = [
  { key: "trips", label: "My Trips", icon: "luggage" },
  { key: "profile", label: "Profile", icon: "user" },
  { key: "bookings", label: "Bookings", icon: "calendar" },
  { key: "account", label: "Account Info", icon: "settings" },
];

const TOAST = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  neutral: "bg-brand-50 text-brand-700",
};

function initials(name) {
  return (name || "Traveler").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function SectorChip({ className = TOAST.neutral, children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isDemo, logout } = useAuth();
  const toast = useToast();
  const { items: bookings, source } = useBookings();

  const [tab, setTab] = useState("trips");
  const [confirming, setConfirming] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || user?.username || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const stats = useMemo(() => {
    const upcomingKinds = ["Confirmed", "Pending", "Used", "Preparing", "Ready", "Reserved", "Paid"];
    const upcoming = bookings.filter((b) => upcomingKinds.includes(b.status));
    const spent = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      spent,
      byKind: {
        tour: bookings.filter((b) => b.kind === "tour").length,
        hotel: bookings.filter((b) => b.kind === "hotel").length,
        restaurant: bookings.filter((b) => b.kind === "restaurant").length,
      },
    };
  }, [bookings]);

  const upcomingTrips = useMemo(
    () => bookings.filter((b) => ["Confirmed", "Pending", "Used", "Preparing", "Ready", "Reserved", "Paid"].includes(b.status)),
    [bookings]
  );
  const pastTrips = useMemo(
    () => bookings.filter((b) => !["Confirmed", "Pending", "Used", "Preparing", "Ready", "Reserved", "Paid"].includes(b.status)),
    [bookings]
  );

  const saveAccount = () => {
    if (!form.fullname.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    if (isDemo) {
      toast.info("You're in demo mode — account changes aren't saved to the server.");
      return;
    }
    toast.success("Account info updated.");
  };

  const emptyState = (title, copy) => (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-400">
        <Icon name="luggage" size={26} />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-brand-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{copy}</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[26px] bg-brand-800 text-white shadow-soft">
        <div className="khmer-motif absolute inset-0 -z-10 opacity-40" />
        <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
          <div className="relative">
            <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gold-400 font-display text-2xl font-bold text-brand-900 shadow-md ring-4 ring-white/10">
              {initials(user?.fullname || user?.username)}
            </span>
            {isDemo && (
              <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand-800 shadow-md ring-2 ring-brand-800">
                DEMO
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">My Travel Profile</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
              {user?.fullname || user?.username || "Traveler"}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="mail" size={14} /> {user?.email || "—"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={14} /> Member since 2025
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15 backdrop-blur">
            <SectorChip className="font-bold text-white">{stats.total} Trips</SectorChip>
            <span className="h-7 w-px bg-white/15" />
            <SectorChip className="bg-gold-400 font-bold text-brand-900">{stats.upcoming} Upcoming</SectorChip>
          </div>
        </div>
      </section>

      {/* Mobile tab chips */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              tab === t.key
                ? "border-brand-700 bg-brand-700 text-white"
                : "border-line bg-white text-brand-800 hover:bg-brand-50"
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-danger/30 bg-danger/5 px-4 py-2 text-sm font-bold text-danger hover:bg-danger/10"
        >
          <Icon name="logout" size={15} />
          Sign Out
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden self-start lg:block">
          <nav className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-3 shadow-soft">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    active
                      ? "bg-brand-700 text-white"
                      : "text-brand-800 hover:bg-brand-50"
                  }`}
                >
                  <Icon name={t.icon} size={18} className={active ? "text-gold-400" : "text-brand-500"} />
                  {t.label}
                  {active && <Icon name="chevron-right" size={15} className="ml-auto text-gold-400" />}
                </button>
              );
            })}
            <div className="my-1 h-px bg-line" />
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
            >
              <Icon name="logout" size={18} />
              Sign Out
            </button>
          </nav>

          <div className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">Activity</p>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Icon name="luggage" size={15} className="text-brand-500" /> Tour trips
                </span>
                <span className="font-bold text-brand-800">{stats.byKind.tour}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Icon name="bed" size={15} className="text-brand-500" /> Hotel stays
                </span>
                <span className="font-bold text-brand-800">{stats.byKind.hotel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <Icon name="utensils" size={15} className="text-brand-500" /> Food orders
                </span>
                <span className="font-bold text-brand-800">{stats.byKind.restaurant}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="min-w-0">
          {/* ---- MY TRIPS ---- */}
          {tab === "trips" && (
            <div className="space-y-8">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-brand-800">
                    Upcoming Trips
                    {source === "demo" && (
                      <span className="ml-2 align-middle text-[11px] font-bold uppercase tracking-wide text-gold-600">Demo</span>
                    )}
                  </h2>
                  <span className="text-sm font-bold text-muted">{upcomingTrips.length}</span>
                </div>
                {upcomingTrips.length ? (
                  <div className="space-y-3">
                    {upcomingTrips.map((b) => (
                      <TripCard key={b.key} trip={b} />
                    ))}
                  </div>
                ) : (
                  emptyState("No upcoming trips", "Book a tour, hotel or restaurant to see your next adventures here.")
                )}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-brand-800">Trip History</h2>
                  <span className="text-sm font-bold text-muted">{pastTrips.length}</span>
                </div>
                {pastTrips.length ? (
                  <div className="space-y-3">
                    {pastTrips.map((b) => (
                      <TripCard key={b.key} trip={b} />
                    ))}
                  </div>
                ) : (
                  emptyState("No past trips yet", "Completed and cancelled bookings will appear here.")
                )}
              </div>
            </div>
          )}

          {/* ---- PROFILE ---- */}
          {tab === "profile" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
                <div className="flex flex-wrap items-center gap-5">
                  <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-700 font-display text-2xl font-bold text-gold-400">
                    {initials(user?.fullname || user?.username)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-bold text-brand-800">
                      {user?.fullname || user?.username || "Traveler"}
                    </h2>
                    <p className="text-sm text-muted">@{user?.username || "traveler"}</p>
                  </div>
                  <SectorChip className="bg-gold-100 text-gold-700">
                    {Array.isArray(user?.roles) ? user.roles.join(", ") : user?.roles || "Member"}
                  </SectorChip>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total Trips", value: stats.total, icon: "luggage" },
                    { label: "Upcoming", value: stats.upcoming, icon: "calendar" },
                    { label: "Tour Places", value: stats.byKind.tour, icon: "landmark" },
                    { label: "Spent", value: `$${stats.spent}`, icon: "trending-up" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-line bg-canvas p-3.5">
                      <Icon name={s.icon} size={16} className="text-gold-600" />
                      <p className="mt-2 font-display text-xl font-bold text-brand-800">{s.value}</p>
                      <p className="text-xs font-medium text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
                <h3 className="font-display text-lg font-bold text-brand-800">Personal details</h3>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: "Full name", value: user?.fullname || "—", icon: "user" },
                    { label: "Email", value: user?.email || "—", icon: "mail" },
                    { label: "Username", value: `@${user?.username || "—"}`, icon: "at-sign" },
                    { label: "Member since", value: "2025", icon: "calendar" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                      <Icon name={row.icon} size={17} className="text-brand-500" />
                      <div className="min-w-0">
                        <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">{row.label}</dt>
                        <dd className="truncate text-sm font-bold text-brand-800">{row.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* ---- BOOKINGS ---- */}
          {tab === "bookings" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-brand-800">All Bookings</h2>
                <span className="text-sm font-bold text-muted">{bookings.length}</span>
              </div>
              {bookings.length ? (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <TripCard key={b.key} trip={b} />
                  ))}
                </div>
              ) : (
                emptyState("No bookings", "Your tours, hotels and restaurant orders will appear here.")
              )}
            </div>
          )}

          {/* ---- ACCOUNT INFO ---- */}
          {tab === "account" && (
            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-800">Account information</h2>
                  <p className="text-sm text-muted">Manage the details used across your account.</p>
                </div>
                {isDemo && (
                  <SectorChip className="bg-warning/15 text-warning">Demo mode</SectorChip>
                )}
              </div>

              <form
                className="mt-6 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveAccount();
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { key: "fullname", label: "Full name", type: "text", placeholder: "Your full name" },
                    { key: "username", label: "Username", type: "text", placeholder: "username" },
                    { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
                    { key: "phone", label: "Phone number", type: "tel", placeholder: "+855 ..." },
                  ].map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-1.5 block text-sm font-bold text-brand-800">{field.label}</span>
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={set(field.key)}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink outline-none transition-colors focus:border-brand-400 focus:bg-white"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
                  <p className="text-xs text-muted">Last updated: just now</p>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-brand-800"
                  >
                    <Icon name="check" size={16} />
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>

      {/* Sign out confirm */}
      {confirming && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm"
          onClick={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger/10 text-danger">
              <Icon name="logout" size={22} />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-brand-800">Sign out?</h3>
            <p className="mt-1 text-sm text-muted">
              You'll need to sign in again to view your trips and bookings.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  logout();
                  navigate("/");
                }}
                className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-danger/90"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}