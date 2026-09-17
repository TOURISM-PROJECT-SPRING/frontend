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

function initials(name) {
  return (name || "Traveler")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SectorChip({ className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all ${className}`}>
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
    <div className="group grid place-items-center rounded-3xl border border-dashed border-emerald-900/15 bg-emerald-50/30 px-6 py-16 text-center transition-all duration-300 hover:border-emerald-900/30 hover:bg-emerald-50/50">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100/80 text-[#02462E] shadow-sm transition-transform duration-300 group-hover:scale-110">
        <Icon name="luggage" size={30} />
      </span>
      <h3 className="mt-5 font-display text-lg font-bold text-[#02462E]">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-slate-500 leading-relaxed">{copy}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans antialiased text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden rounded bg-[#02462E] text-white shadow-xl shadow-emerald-950/10">
          {/* Subtle Khmer-inspired Decorative Motif Overlay */}
          <div className="absolute inset-0 -z-10 opacity-15 bg-[radial-gradient(#FEC700_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#FEC700]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-6 p-6 sm:p-10 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
              <span className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-full bg-gradient-to-br from-[#FEC700] to-amber-500 font-bold text-2xl sm:text-3xl font-extrabold text-[#02462E] ">
                {initials(user?.fullname || user?.username)}
              </span>
              
            </div>

            {/* Profile Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FEC700]">
                  Kingdom of Wonder
                </span>
                <span className="h-1 w-1 rounded-full bg-[#FEC700]/60" />
                <span className="text-xs font-medium text-emerald-200/80">Traveler Profile</span>
              </div>
              <h1 className="mt-1 from-neutral-700 text-2xl sm:text-3xl font- tracking-tight text-white">
                {user?.fullname || user?.username || "Traveler"}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-emerald-100/80">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="mail" size={14} className="text-[#FEC700]" /> {user?.email || "—"}
                </span>
                <span className="hidden sm:inline text-emerald-500">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" size={14} className="text-[#FEC700]" /> Member since 2025
                </span>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/10 p-2.5 px-4 ring-1 ring-white/15 backdrop-blur-md">
              <div className="text-center px-2">
                <p className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-medium">Total</p>
                <p className="text-lg font-bold text-white">{stats.total} Trips</p>
              </div>
              <span className="h-8 w-px bg-white/15" />
              <div className="text-center px-2">
                <p className="text-[10px] uppercase tracking-wider text-[#FEC700] font-semibold">Upcoming</p>
                <p className="text-lg font-bold text-[#FEC700]">{stats.upcoming}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Tab Nav */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:hidden no-scrollbar">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#02462E] text-[#FEC700] shadow-md shadow-emerald-950/10"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-emerald-50/50"
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-rose-200/60 bg-rose-50/50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100/80 transition-all"
          >
            <Icon name="logout" size={15} />
            Sign Out
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          
          {/* Desktop Sidebar Nav */}
          <aside className="hidden self-start lg:block space-y-4">
            <nav className="flex flex-col gap-1.5 rounded border border-slate-200/80 bg-white p-3 shadow-sm">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`group flex items-center gap-3 rounded px-4 py-3 text-sm font-bold transition-all duration-200 ${
                      active
                        ? "bg-[#02462E] text-white shadow-md shadow-emerald-950/10"
                        : "text-slate-600 hover:bg-emerald-50/60 hover:text-[#02462E]"
                    }`}
                  >
                    <Icon
                      name={t.icon}
                      size={18}
                      className={`transition-transform duration-200 group-hover:scale-110 ${
                        active ? "text-[#FEC700]" : "text-slate-400 group-hover:text-[#02462E]"
                      }`}
                    />
                    {t.label}
                    {active && <Icon name="chevron-right" size={16} className="ml-auto text-[#FEC700]" />}
                  </button>
                );
              })}
              
              <div className="my-1 h-px bg-slate-100" />
              
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-3 rounded px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <Icon name="logout" size={18} />
                Sign Out
              </button>
            </nav>

            {/* Sidebar Activity Breakdown */}
            <div className="rounded border border-slate-200/80 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#02462E]/70">
                Activity Breakdown
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-slate-500 font-medium">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-[#02462E]">
                      <Icon name="luggage" size={14} />
                    </span>
                    Tours
                  </span>
                  <span className="font-bold text-slate-800">{stats.byKind.tour}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-slate-500 font-medium">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-50 text-amber-600">
                      <Icon name="bed" size={14} />
                    </span>
                    Hotels
                  </span>
                  <span className="font-bold text-slate-800">{stats.byKind.hotel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 text-slate-500 font-medium">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-[#02462E]">
                      <Icon name="utensils" size={14} />
                    </span>
                    Dining
                  </span>
                  <span className="font-bold text-slate-800">{stats.byKind.restaurant}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="min-w-0">
            
            {/* ---- TAB: TRIPS ---- */}
            {tab === "trips" && (
              <div className="space-y-8">
                {/* Upcoming Trips */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="from-neutral-600 text-xl font-bold text-[#02462E]">Upcoming Trips</h2>
                      {source === "demo" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-800">
                          Demo Data
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-100/60 px-3 py-0.5 text-xs font-bold text-[#02462E]">
                      {upcomingTrips.length}
                    </span>
                  </div>
                  {upcomingTrips.length ? (
                    <div className="space-y-3">
                      {upcomingTrips.map((b) => (
                        <TripCard key={b.key} trip={b} />
                      ))}
                    </div>
                  ) : (
                    emptyState("No upcoming adventures", "Book a tour, hotel stay, or restaurant reservation to start your Cambodian journey.")
                  )}
                </div>

                {/* Past Trips */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="from-neutral-600 text-xl font-bold text-[#02462E]">Trip History</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600">
                      {pastTrips.length}
                    </span>
                  </div>
                  {pastTrips.length ? (
                    <div className="space-y-3">
                      {pastTrips.map((b) => (
                        <TripCard key={b.key} trip={b} />
                      ))}
                    </div>
                  ) : (
                    emptyState("No trip history yet", "Completed and canceled bookings will be safely stored here for your reference.")
                  )}
                </div>
              </div>
            )}

            {/* ---- TAB: PROFILE ---- */}
            {tab === "profile" && (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="rounded border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center gap-5">
                    <span className="grid h-20 w-20 place-items-center rounded-2xl bg-[#02462E] from-neutral-600 text-2xl font-black text-[#FEC700] shadow-md">
                      {initials(user?.fullname || user?.username)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="from-neutral-600 text-2xl font-bold text-[#02462E]">
                        {user?.fullname || user?.username || "Traveler"}
                      </h2>
                      <p className="text-sm font-medium text-slate-400">@{user?.username || "traveler"}</p>
                    </div>
                    <SectorChip className="bg-amber-50 text-amber-700 ring-1 ring-amber-200/60">
                      {Array.isArray(user?.roles) ? user.roles.join(", ") : user?.roles || "Explorer Member"}
                    </SectorChip>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { label: "Total Trips", value: stats.total, icon: "luggage" },
                      { label: "Upcoming", value: stats.upcoming, icon: "calendar" },
                      { label: "Tours Booked", value: stats.byKind.tour, icon: "landmark" },
                      { label: "Total Spent", value: `$${stats.spent}`, icon: "trending-up" },
                    ].map((s) => (
                      <div key={s.label} className="rounded border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-emerald-50/30">
                        <Icon name={s.icon} size={18} className="text-[#02462E]" />
                        <p className="mt-3 from-neutral-600 text-2xl font-bold text-slate-800">{s.value}</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Details Grid */}
                <div className="rounded border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                  <h3 className="from-neutral-600 text-lg font-bold text-[#02462E]">Personal Details</h3>
                  <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full Name", value: user?.fullname || "—", icon: "user" },
                      { label: "Email Address", value: user?.email || "—", icon: "mail" },
                      { label: "Username", value: `@${user?.username || "—"}`, icon: "at-sign" },
                      { label: "Member Since", value: "2025", icon: "calendar" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100/60 text-[#02462E]">
                          <Icon name={row.icon} size={18} />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{row.label}</dt>
                          <dd className="truncate text-sm font-bold text-slate-800">{row.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* ---- TAB: BOOKINGS ---- */}
            {tab === "bookings" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="from-neutral-600 text-xl font-bold text-[#02462E]">All Bookings</h2>
                  <span className="rounded-full bg-emerald-100/60 px-3 py-0.5 text-xs font-bold text-[#02462E]">
                    {bookings.length}
                  </span>
                </div>
                {bookings.length ? (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <TripCard key={b.key} trip={b} />
                    ))}
                  </div>
                ) : (
                  emptyState("No bookings found", "Your tour reservations, hotel stays, and food orders will show up here.")
                )}
              </div>
            )}

            {/* ---- TAB: ACCOUNT INFO ---- */}
            {tab === "account" && (
              <div className="rounded border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="from-neutral-600 text-xl font-bold text-[#02462E]">Account Settings</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your personal credentials and contact preferences.</p>
                  </div>
                  {isDemo && (
                    <SectorChip className="bg-amber-100 text-amber-800 font-bold">Demo Mode Active</SectorChip>
                  )}
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveAccount();
                  }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { key: "fullname", label: "Full Name", type: "text", placeholder: "Your full name" },
                      { key: "username", label: "Username", type: "text", placeholder: "username" },
                      { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                      { key: "phone", label: "Phone Number", type: "tel", placeholder: "+855 ..." },
                    ].map((field) => (
                      <label key={field.key} className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                          {field.label}
                        </span>
                        <input
                          type={field.type}
                          value={form[field.key]}
                          onChange={set(field.key)}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-[#02462E] focus:bg-white focus:ring-2 focus:ring-[#02462E]/10"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                    <p className="text-xs text-slate-400">Updates sync in real-time across devices.</p>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#02462E] px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-950/10 transition-all hover:bg-[#013523] active:scale-95"
                    >
                      <Icon name="check" size={16} className="text-[#FEC700]" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>

        {/* Modal: Sign Out Confirmation */}
        {confirming && (
          <div
            className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={() => setConfirming(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                <Icon name="logout" size={24} />
              </span>
              <h3 className="mt-4 from-neutral-600 text-xl font-bold text-slate-800">Sign out of profile?</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                You will need to sign in again to manage your trips and view travel vouchers.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
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
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}