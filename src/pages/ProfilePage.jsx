import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../hooks/useResource";
import { useToast } from "../components/ui/Toast";
import Icon from "../components/ui/Icon";
import TripCard from "../components/profile/TripCard";
import { Modal } from "../components/ui/Modal";
import SmartImage from "../components/ui/SmartImage";
import StatusBadge from "../components/manager/StatusBadge";
import { money } from "../lib/format";

const TABS = [
  { key: "profile", label: "Profile Details", icon: "user", badge: "Verified" },
  { key: "trips", label: "My Trips", icon: "luggage" },
  { key: "account", label: "Account Settings", icon: "settings" },
  { key: "security", label: "Security & Privacy", icon: "shield-check" },
  { key: "payments", label: "Payment Methods", icon: "credit-card" },
];

function initials(name) {
  return (name || "Traveler")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isDemo, logout } = useAuth();
  const toast = useToast();
  const { items: bookings, source } = useBookings();

  const [tab, setTab] = useState("profile");
  const [confirming, setConfirming] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripFilter, setTripFilter] = useState("all");

  // Editable Profile state
  const [form, setForm] = useState({
    fullname: user?.fullname || "Sokha Dara",
    username: user?.username || "sokhadara",
    email: user?.email || "sokha.dara@example.com",
    phone: user?.phone || "+855 12 345 678",
    city: "Phnom Penh",
    country: "Cambodia",
    bio: "Passionate traveler exploring the heritage of Angkor, eco-resorts in Koh Rong, and local culinary culture.",
    language: "English (US)",
    currency: "USD ($)",
  });

  const [preferences, setPreferences] = useState({
    dietary: "Vegetarian Friendly",
    travelStyle: "Historical & Eco-Tourism",
    notifications: true,
    smsAlerts: false,
    specialAssistance: "None",
  });

  const setFormField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Stats calculation
  const stats = useMemo(() => {
    const upcomingKinds = ["Confirmed", "Pending", "Used", "Preparing", "Ready", "Reserved", "Paid"];
    const upcoming = bookings.filter((b) => upcomingKinds.includes(b.status));
    const spent = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    return {
      total: bookings.length,
      upcoming: upcoming.length,
      completed: Math.max(0, bookings.length - upcoming.length),
      spent,
      points: Math.max(120, bookings.length * 150 + 240),
      byKind: {
        tour: bookings.filter((b) => b.kind === "tour").length,
        hotel: bookings.filter((b) => b.kind === "hotel").length,
        restaurant: bookings.filter((b) => b.kind === "restaurant").length,
      },
    };
  }, [bookings]);

  // Trips filtering
  const filteredTrips = useMemo(() => {
    const activeStatuses = ["Confirmed", "Pending", "Used", "Preparing", "Ready", "Reserved", "Paid"];
    if (tripFilter === "upcoming") {
      return bookings.filter((b) => activeStatuses.includes(b.status));
    }
    if (tripFilter === "completed") {
      return bookings.filter((b) => !activeStatuses.includes(b.status) && b.status !== "Cancelled");
    }
    if (tripFilter === "cancelled") {
      return bookings.filter((b) => b.status === "Cancelled");
    }
    return bookings;
  }, [bookings, tripFilter]);

  const saveAccount = () => {
    if (!form.fullname.trim() || !form.email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }
    try {
      const stored = localStorage.getItem("sdn.user");
      const parsed = stored ? JSON.parse(stored) : {};
      const updated = { ...parsed, fullname: form.fullname, email: form.email, phone: form.phone, username: form.username };
      localStorage.setItem("sdn.user", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success("Profile & account information updated successfully.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] font-sans antialiased text-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* ======================= HERO BANNER ======================= */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-[#012a1c] via-[#02462e] to-[#013724] text-white shadow-lift">
          {/* Ambient Starlight & Khmer Motif Pattern */}
          <div className="absolute inset-0 -z-10 opacity-15 bg-[radial-gradient(#FEC700_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-brand-400/10 blur-2xl pointer-events-none" />

          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              
              {/* Profile Avatar & Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <span className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-500 font-display text-3xl font-extrabold text-brand-950 shadow-md ring-4 ring-white/20">
                    {initials(form.fullname || user?.username)}
                  </span>
                  <button
                    type="button"
                    title="Change profile photo"
                    onClick={() => toast.info("Photo upload is enabled in live storage.")}
                    className="absolute -bottom-1.5 -right-1.5 grid h-8 w-8 place-items-center rounded-full bg-white text-brand-800 shadow-md ring-2 ring-brand-700 transition-transform hover:scale-110"
                  >
                    <Icon name="camera" size={15} />
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-0.5 text-xs font-bold text-gold-300 ring-1 ring-gold-400/30 backdrop-blur">
                      <Icon name="badge-check" size={13} className="text-gold-300" />
                      Kingdom Gold Explorer
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-200 ring-1 ring-white/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active Traveler
                    </span>
                  </div>

                  <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {form.fullname || user?.username || "Traveler"}
                  </h1>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-emerald-100/80">
                    <span className="flex items-center gap-1.5">
                      <Icon name="at-sign" size={14} className="text-gold-400" />
                      @{form.username || "traveler"}
                    </span>
                    <span className="hidden sm:inline text-emerald-400">•</span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="mail" size={14} className="text-gold-400" />
                      {form.email}
                    </span>
                    <span className="hidden sm:inline text-emerald-400">•</span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="map-pin" size={14} className="text-gold-400" />
                      {form.city}, {form.country}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
                <button
                  type="button"
                  onClick={() => setTab("account")}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white shadow-sm backdrop-blur transition-all hover:bg-white/20 active:scale-95"
                >
                  <Icon name="settings" size={15} />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/explore")}
                  className="flex items-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-xs font-bold text-brand-950 shadow-md transition-all hover:bg-gold-300 active:scale-95"
                >
                  <Icon name="compass" size={15} />
                  <span>Book a Trip</span>
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-md">
                <div className="flex items-center justify-between text-emerald-200">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Trips</span>
                  <Icon name="luggage" size={16} />
                </div>
                <p className="mt-2 font-display text-2xl font-black text-white">{stats.total}</p>
                <span className="text-[11px] text-emerald-300/80">Tours, hotels &amp; dining</span>
              </div>

              <div className="rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-md">
                <div className="flex items-center justify-between text-gold-300">
                  <span className="text-xs font-semibold uppercase tracking-wider">Upcoming</span>
                  <Icon name="calendar" size={16} />
                </div>
                <p className="mt-2 font-display text-2xl font-black text-gold-300">{stats.upcoming}</p>
                <span className="text-[11px] text-emerald-300/80">Ready for departure</span>
              </div>

              <div className="rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-md">
                <div className="flex items-center justify-between text-emerald-200">
                  <span className="text-xs font-semibold uppercase tracking-wider">Explorer Points</span>
                  <Icon name="award" size={16} />
                </div>
                <p className="mt-2 font-display text-2xl font-black text-white">{stats.points}</p>
                <span className="text-[11px] text-emerald-300/80">Tier reward balance</span>
              </div>

              <div className="rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-md">
                <div className="flex items-center justify-between text-emerald-200">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Spent</span>
                  <Icon name="trending-up" size={16} />
                </div>
                <p className="mt-2 font-display text-2xl font-black text-white">${stats.spent.toFixed(2)}</p>
                <span className="text-[11px] text-emerald-300/80">Confirmed bookings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Horizontal Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden hide-scrollbar">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-brand-700 text-white shadow-md shadow-brand-900/10"
                    : "border border-line bg-white text-muted hover:bg-brand-50/50 hover:text-ink"
                }`}
              >
                <Icon name={t.icon} size={15} />
                <span>{t.label}</span>
                {t.badge && (
                  <span className="rounded-full bg-gold-400/20 px-1.5 py-0.2 text-[10px] font-extrabold text-gold-700">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ======================= MAIN CONTENT GRID ======================= */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden self-start lg:block space-y-5">
            <nav className="flex flex-col gap-1.5 rounded-2xl border border-line bg-white p-3 shadow-soft">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                      active
                        ? "bg-brand-700 text-white shadow-md shadow-brand-900/15"
                        : "text-muted hover:bg-brand-50 hover:text-brand-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        name={t.icon}
                        size={18}
                        className={`transition-colors ${active ? "text-gold-300" : "text-brand-500 group-hover:text-brand-700"}`}
                      />
                      <span>{t.label}</span>
                    </div>
                    {active ? (
                      <Icon name="chevron-right" size={16} className="text-gold-300" />
                    ) : t.badge ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {t.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <div className="my-1.5 h-px bg-line/80" />

              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-danger transition-colors hover:bg-red-50"
              >
                <Icon name="logout" size={18} />
                <span>Sign Out</span>
              </button>
            </nav>

            {/* Membership Loyalty Card Widget */}
            <div className="overflow-hidden rounded-2xl border border-gold-200/80 bg-gradient-to-br from-gold-50 via-cream to-amber-50/60 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-gold-400 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-brand-950">
                  <Icon name="award" size={13} /> Tier Status
                </span>
                <span className="font-display text-xs font-bold text-brand-900">Level 2 of 4</span>
              </div>
              <h4 className="mt-3 font-display text-base font-bold text-brand-900">Gold Explorer</h4>
              <p className="mt-1 text-xs text-muted">Enjoy 10% dining discounts and priority tour pickup.</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-[11px] font-bold text-brand-800">
                  <span>Progress to Platinum</span>
                  <span>{stats.total} / 5 trips</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gold-200">
                  <div
                    className="h-full rounded-full bg-brand-700 transition-all duration-500"
                    style={{ width: `${Math.min(100, (stats.total / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Support Card */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-brand-900">
                <Icon name="phone" size={16} className="text-brand-600" />
                <span>24/7 Dedicated Support</span>
              </div>
              <p className="mt-1.5 text-xs text-muted">Need to modify an active reservation? Our local travel desk is here for you.</p>
              <a
                href="tel:+8552755071"
                className="mt-3 block rounded-xl border border-line bg-canvas py-2 text-center text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                +855 275 5071
              </a>
            </div>
          </aside>

          {/* Main Section Content */}
          <main className="min-w-0">
            
            {/* ======================= TAB: PROFILE DETAILS ======================= */}
            {tab === "profile" && (
              <div className="space-y-6">
                
                {/* 1. Verified Identity Status Banner */}
                <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/90 to-teal-50/70 p-5 shadow-2xs">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                        <Icon name="badge-check" size={22} />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-emerald-950">Verified Traveler Profile</h3>
                        <p className="text-xs text-emerald-800/80">Your identity and payment credentials meet international tourism safety standards.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-2xs">
                        <Icon name="check" size={12} className="text-emerald-600" /> Email Verified
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-2xs">
                        <Icon name="check" size={12} className="text-emerald-600" /> Phone Verified
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-2xs">
                        <Icon name="shield-check" size={12} className="text-emerald-600" /> ID Confirmed
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Personal Information Card */}
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-brand-900">Personal Information</h2>
                      <p className="text-xs text-muted">Essential details used for booking tickets, hotel check-ins, and tour pickups.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTab("account")}
                      className="flex items-center gap-1.5 text-xs font-bold text-brand-700 underline underline-offset-4 hover:text-brand-900"
                    >
                      <Icon name="pencil" size={14} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { label: "Full Legal Name", value: form.fullname, icon: "user" },
                      { label: "Email Address", value: form.email, icon: "mail" },
                      { label: "Phone Number", value: form.phone, icon: "phone" },
                      { label: "Username Handle", value: `@${form.username}`, icon: "at-sign" },
                      { label: "City & Country", value: `${form.city}, ${form.country}`, icon: "map-pin" },
                      { label: "Preferred Language", value: form.language, icon: "globe" },
                      { label: "Preferred Currency", value: form.currency, icon: "credit-card" },
                      { label: "Member Since", value: "September 2025", icon: "calendar" },
                      { label: "Account Role", value: Array.isArray(user?.roles) ? user.roles.join(", ") : user?.roles || "Traveler", icon: "award" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 rounded-xl border border-line/60 bg-canvas/60 p-3.5 transition-colors hover:bg-brand-50/40">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-brand-700 shadow-2xs border border-line/50">
                          <Icon name={item.icon} size={16} />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted">{item.label}</dt>
                          <dd className="truncate text-sm font-bold text-brand-900 mt-0.5">{item.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  {/* Bio statement */}
                  <div className="mt-6 rounded-xl border border-line/70 bg-canvas/40 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted">About Traveler</span>
                    <p className="mt-1 text-sm leading-relaxed text-ink/90">{form.bio}</p>
                  </div>
                </div>

                {/* 3. Travel Preferences Card */}
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                  <div className="border-b border-line pb-4">
                    <h2 className="font-display text-lg font-bold text-brand-900">Travel &amp; Itinerary Preferences</h2>
                    <p className="text-xs text-muted">Customizing your Cambodian travel experience with personalized accommodations.</p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-line/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-800">
                        <Icon name="utensils" size={16} className="text-brand-600" />
                        <span>Dietary Preferences</span>
                      </div>
                      <p className="mt-2 text-xs text-muted">Applied automatically to curated dining bookings &amp; temple lunch boxes.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200">
                          {preferences.dietary}
                        </span>
                        <span className="rounded-lg bg-canvas px-2.5 py-1 text-xs font-medium text-muted">
                          Nut-free options
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-line/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-800">
                        <Icon name="compass" size={16} className="text-brand-600" />
                        <span>Travel Style</span>
                      </div>
                      <p className="mt-2 text-xs text-muted">Helps our guides tailor the pace and focus of guided excursions.</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-gold-50 px-2.5 py-1 text-xs font-bold text-gold-800 ring-1 ring-gold-200">
                          {preferences.travelStyle}
                        </span>
                        <span className="rounded-lg bg-canvas px-2.5 py-1 text-xs font-medium text-muted">
                          Sunrise Photography
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests & Emergency Contact */}
                  <div className="mt-4 rounded-xl border border-line/70 bg-canvas/30 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
                        <Icon name="shield" size={15} className="text-brand-600" />
                        <span>Emergency Travel Contact:</span>
                        <span className="font-normal text-muted">Family Contact • +855 98 765 432</span>
                      </div>
                      <span className="text-[11px] font-semibold text-brand-700">Encrypted in booking records</span>
                    </div>
                  </div>
                </div>

                {/* 4. Activity Breakdown Summary */}
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                  <h2 className="font-display text-lg font-bold text-brand-900">Exploration Summary</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-xl border border-line bg-canvas p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                          <Icon name="binoculars" size={18} />
                        </span>
                        <div>
                          <p className="text-xs text-muted font-medium">Guided Tours</p>
                          <p className="font-display text-lg font-bold text-brand-900">{stats.byKind.tour} Bookings</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-line bg-canvas p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
                          <Icon name="bed" size={18} />
                        </span>
                        <div>
                          <p className="text-xs text-muted font-medium">Resorts &amp; Hotels</p>
                          <p className="font-display text-lg font-bold text-brand-900">{stats.byKind.hotel} Stays</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-line bg-canvas p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                          <Icon name="utensils" size={18} />
                        </span>
                        <div>
                          <p className="text-xs text-muted font-medium">Dining &amp; Tables</p>
                          <p className="font-display text-lg font-bold text-brand-900">{stats.byKind.restaurant} Tables</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ======================= TAB: MY TRIPS ======================= */}
            {tab === "trips" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-brand-900">My Trips &amp; Bookings</h2>
                    <p className="text-xs text-muted">Review, inspect vouchers, or manage your upcoming Cambodian adventures.</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white p-1 shadow-2xs">
                    {[
                      { key: "all", label: "All" },
                      { key: "upcoming", label: "Upcoming" },
                      { key: "completed", label: "History" },
                      { key: "cancelled", label: "Cancelled" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setTripFilter(f.key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          tripFilter === f.key
                            ? "bg-brand-700 text-white shadow-xs"
                            : "text-muted hover:text-brand-800"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredTrips.length ? (
                  <div className="space-y-3.5">
                    {filteredTrips.map((b) => (
                      <TripCard key={b.key || b.id} trip={b} onSelect={setSelectedTrip} />
                    ))}
                  </div>
                ) : (
                  <div className="grid place-items-center rounded-3xl border-2 border-dashed border-line bg-white p-12 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon name="luggage" size={28} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-brand-900">No {tripFilter !== "all" ? tripFilter : ""} bookings found</h3>
                    <p className="mt-1 max-w-sm text-xs text-muted leading-relaxed">
                      Explore our handpicked sunrise Angkor tours, riverside luxury boutique hotels, and authentic Khmer cuisine.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/explore")}
                      className="mt-5 rounded-xl bg-brand-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-brand-800"
                    >
                      Start Exploring Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ======================= TAB: ACCOUNT SETTINGS ======================= */}
            {tab === "account" && (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-brand-900">Account Settings</h2>
                    <p className="text-xs text-muted">Update your personal contact details and travel preferences.</p>
                  </div>
                  {isDemo && (
                    <span className="rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                      Demo Environment
                    </span>
                  )}
                </div>

                <form
                  className="mt-6 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveAccount();
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Full Name
                      </span>
                      <input
                        type="text"
                        value={form.fullname}
                        onChange={setFormField("fullname")}
                        className="h-12 w-full rounded-xl border border-line bg-canvas/60 px-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Username Handle
                      </span>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm font-bold">@</span>
                        <input
                          type="text"
                          value={form.username}
                          onChange={setFormField("username")}
                          className="h-12 w-full rounded-xl border border-line bg-canvas/60 pl-8 pr-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Email Address
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={setFormField("email")}
                        className="h-12 w-full rounded-xl border border-line bg-canvas/60 px-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Phone Number
                      </span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={setFormField("phone")}
                        className="h-12 w-full rounded-xl border border-line bg-canvas/60 px-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Home City
                      </span>
                      <input
                        type="text"
                        value={form.city}
                        onChange={setFormField("city")}
                        className="h-12 w-full rounded-xl border border-line bg-canvas/60 px-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                        Country
                      </span>
                      <input
                        type="text"
                        value={form.country}
                        onChange={setFormField("country")}
                        className="h-12 w-full rounded-xl border border-line bg-canvas/60 px-4 text-sm font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                      Traveler Bio
                    </span>
                    <textarea
                      rows={3}
                      value={form.bio}
                      onChange={setFormField("bio")}
                      className="w-full rounded-xl border border-line bg-canvas/60 p-4 text-sm font-medium text-ink outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/15"
                    />
                  </label>

                  <div className="flex items-center justify-between border-t border-line pt-6">
                    <p className="text-xs text-muted">All updates synchronize instantly with your reservation vouchers.</p>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 font-display text-sm font-bold text-white shadow-md transition-all hover:bg-brand-800 active:scale-95"
                    >
                      <Icon name="check" size={16} className="text-gold-400" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ======================= TAB: SECURITY & PRIVACY ======================= */}
            {tab === "security" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                  <div className="border-b border-line pb-4">
                    <h2 className="font-display text-xl font-bold text-brand-900">Security &amp; Login Credentials</h2>
                    <p className="text-xs text-muted">Manage your password, authentication protection, and active login sessions.</p>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-line/80 p-4">
                      <div>
                        <p className="text-sm font-bold text-brand-900">Account Password</p>
                        <p className="text-xs text-muted">Last modified 30 days ago. A strong password keeps your vouchers secure.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info("Password change verification email has been sent.")}
                        className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-50"
                      >
                        Change Password
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-line/80 p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-brand-900">Two-Factor Authentication (2FA)</p>
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Active</span>
                        </div>
                        <p className="text-xs text-muted">Protects booking checkout and profile changes via authenticator verification.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success("2FA preferences updated.")}
                        className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-50"
                      >
                        Manage 2FA
                      </button>
                    </div>

                    <div className="rounded-xl border border-line/80 p-4">
                      <p className="text-sm font-bold text-brand-900">Active Devices &amp; Sessions</p>
                      <div className="mt-3 flex items-center justify-between border-t border-line/50 pt-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <Icon name="smartphone" size={16} className="text-brand-600" />
                          <div>
                            <p className="font-bold text-brand-900">Current Session • Web Browser</p>
                            <p className="text-muted">Phnom Penh, Cambodia • Active Now</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600">This Device</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================= TAB: PAYMENT METHODS ======================= */}
            {tab === "payments" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-brand-900">Saved Payment Methods</h2>
                      <p className="text-xs text-muted">Securely stored card tokens and mobile payment wallets for 1-click booking.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.info("To add a new card, use the secure payment card at checkout.")}
                      className="rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-800"
                    >
                      + Add Method
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {/* Card 1: Visa */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-brand-600 bg-gradient-to-br from-brand-900 to-brand-950 p-5 text-white shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-widest text-gold-400">VISA</span>
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">Primary</span>
                      </div>
                      <p className="mt-6 font-mono text-lg tracking-widest">•••• •••• •••• 4242</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-emerald-200">
                        <span>Expires 08/28</span>
                        <span>{form.fullname}</span>
                      </div>
                    </div>

                    {/* Card 2: ABA KHQR */}
                    <div className="flex flex-col justify-between rounded-2xl border border-line bg-canvas p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-600 font-black text-white text-xs">
                            KH
                          </span>
                          <span className="font-display text-sm font-bold text-brand-900">KHQR / ABA Pay</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">Linked</span>
                      </div>
                      <p className="mt-4 text-xs text-muted">Direct mobile banking authorization for nationwide Cambodian payments.</p>
                      <div className="mt-4 border-t border-line/60 pt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toast.success("Payment preferences updated.")}
                          className="text-xs font-bold text-brand-700 underline underline-offset-2"
                        >
                          Manage Connection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* ======================= TRIP VOUCHER DETAIL MODAL ======================= */}
        <Modal
          open={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
          title="Reservation Voucher & Details"
          size="lg"
        >
          {selectedTrip && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-line bg-canvas p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line sm:h-24 sm:w-24">
                  {selectedTrip.image ? (
                    <SmartImage src={selectedTrip.image} alt={selectedTrip.title} className="h-full w-full" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-brand-800 text-gold-400">
                      <Icon name="luggage" size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedTrip.status} />
                    <span className="text-xs font-mono font-bold text-muted">
                      SDN-{selectedTrip.id || "2026-89"}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-brand-900 sm:text-lg">
                    {selectedTrip.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted flex items-center gap-1.5">
                    <Icon name="map-pin" size={13} className="text-brand-500" />
                    <span>{selectedTrip.location || "Siem Reap, Cambodia"}</span>
                  </p>
                </div>
                <div className="text-right sm:self-center">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">Total Paid</span>
                  <span className="font-display text-xl font-black text-brand-800">
                    {money(selectedTrip.amount)}
                  </span>
                </div>
              </div>

              {/* Booking specifications */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-xl border border-line p-3">
                  <span className="text-[10px] font-bold uppercase text-muted">Scheduled Date</span>
                  <p className="font-bold text-brand-900 mt-0.5">{selectedTrip.date || "September 25, 2026"}</p>
                </div>
                <div className="rounded-xl border border-line p-3">
                  <span className="text-[10px] font-bold uppercase text-muted">Travelers</span>
                  <p className="font-bold text-brand-900 mt-0.5">{selectedTrip.guests || 1} Adult(s)</p>
                </div>
                <div className="rounded-xl border border-line p-3">
                  <span className="text-[10px] font-bold uppercase text-muted">Service Type</span>
                  <p className="font-bold text-brand-900 mt-0.5 capitalize">{selectedTrip.kind || "Tour"}</p>
                </div>
                <div className="rounded-xl border border-line p-3">
                  <span className="text-[10px] font-bold uppercase text-muted">Confirmation</span>
                  <p className="font-bold text-emerald-700 mt-0.5">Instant Digital Voucher</p>
                </div>
              </div>

              {/* Digital Check-in Code Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-5 text-center sm:text-left">
                <div>
                  <h4 className="font-display text-sm font-bold text-brand-900">Show to Tour Operator / Hotel Desk</h4>
                  <p className="text-xs text-muted mt-0.5">Present this code upon arrival for instant check-in. No paper printout required.</p>
                  <p className="mt-2 font-mono text-base font-black tracking-widest text-brand-800">
                    SDN-VOUCHER-{selectedTrip.id || "883"}-CONFIRMED
                  </p>
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-white border border-brand-200 shadow-2xs">
                  <Icon name="grid" size={32} className="text-brand-800" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Voucher downloaded as PDF.");
                    setSelectedTrip(null);
                  }}
                  className="flex-1 rounded-xl border border-line bg-canvas py-3 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-50"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTrip(null)}
                  className="flex-1 rounded-xl bg-brand-700 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-brand-800"
                >
                  Close Voucher
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* ======================= MODAL: SIGN OUT CONFIRMATION ======================= */}
        {confirming && (
          <div
            className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/60 p-4 backdrop-blur-sm animate-fade"
            onClick={() => setConfirming(false)}
          >
            <div
              className="w-full max-w-sm rounded-3xl border border-line bg-white p-6 shadow-lift animate-scalein"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
                <Icon name="logout" size={24} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-brand-950">Sign out of profile?</h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                You will need to sign back in to review your bookings, vouchers, and member rewards.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-muted transition-colors hover:bg-brand-50"
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
                  className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700 active:scale-95"
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