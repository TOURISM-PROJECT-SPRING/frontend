import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import { Skeleton, DemoNote } from "../components/ui/feedback";
import { useBookings, useDashboardStats } from "../hooks/useResource";
import { useAuth } from "../context/AuthContext";
import { quickActions, recommended, favorites } from "../data/site";

const KIND_ICON = { tour: "compass", hotel: "bed", restaurant: "utensils" };

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SD";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function statusTone(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("confirm") || s.includes("paid") || s.includes("complete") || s.includes("deliver")) return "bg-success/10 text-success";
  if (s.includes("pend") || s.includes("process") || s.includes("assign") || s.includes("prepar")) return "bg-warning/15 text-warning";
  if (s.includes("cancel") || s.includes("fail") || s.includes("refund")) return "bg-danger/10 text-danger";
  return "bg-brand-50 text-brand-700";
}

const toneBg = {
  green: "bg-brand-50 text-brand-700",
  gold: "bg-gold-50 text-gold-600",
};

function Topbar({ onMenu }) {
  const { user, isDemo } = useAuth();
  const name = user?.fullname || user?.username || "Traveler";
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/85 px-4 py-3.5 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-brand-800 lg:hidden"
      >
        <Icon name="menu" size={20} />
      </button>

      <label className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 sm:max-w-md">
        <Icon name="search" size={18} className="text-muted" />
        <input
          placeholder="Search destinations, hotels or restaurants…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
        />
      </label>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-brand-800 hover:bg-brand-50"
        >
          <Icon name="bell" size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-400 ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white py-1.5 pl-1.5 pr-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-sm font-bold text-gold-400">
            {initials(name)}
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-brand-800">{name}</span>
            <span className="block text-[11px] text-muted">{isDemo ? "Demo traveler" : "Traveler"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {quickActions.map((a) => (
        <a
          key={a.title}
          href="#dashboard"
          className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl border border-line p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
        >
          <img
            src={a.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/45 to-brand-950/10" />
          <div className="relative">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-brand-900">
              <Icon name={a.icon} size={20} />
            </span>
            <h3 className="mt-3 font-display text-lg font-bold text-white">{a.title}</h3>
            <p className="flex items-center gap-1 text-xs text-white/80">
              {a.subtitle}
              <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function Stats() {
  const { items, loading } = useDashboardStats();
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft"
        >
          <span className={`grid h-12 w-12 place-items-center rounded-xl ${toneBg[s.tone]}`}>
            <Icon name={s.icon} size={22} />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-brand-800">{s.value}</p>
            <p className="text-xs font-medium text-muted">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionCard({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Tabs({ items, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-canvas p-1">
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all sm:text-sm ${
            value === t ? "bg-white text-brand-700 shadow-sm" : "text-muted hover:text-brand-700"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function UpcomingBookings() {
  const [tab, setTab] = useState("All");
  const { items, loading, source } = useBookings();
  const kindForTab = { Tours: "tour", Hotels: "hotel", Restaurants: "restaurant" };
  const rows = tab === "All" ? items : items.filter((b) => b.kind === kindForTab[tab]);

  return (
    <SectionCard
      title="Upcoming Bookings"
      action={
        <a href="#dashboard" className="text-sm font-bold text-brand-700 hover:text-brand-800">View All</a>
      }
    >
      <Tabs items={["All", "Tours", "Hotels", "Restaurants"]} value={tab} onChange={setTab} />
      <div className="mt-4 space-y-3">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {!loading && rows.length === 0 && (
          <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-muted">
            No {tab.toLowerCase()} bookings yet.
          </p>
        )}

        {!loading &&
          rows.map((b) => (
            <div
              key={b.key}
              className="flex items-center gap-4 rounded-xl border border-line p-3 transition-colors hover:bg-canvas"
            >
              {b.image ? (
                <SmartImage src={b.image} alt="" className="h-14 w-14 shrink-0 rounded-lg" />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={KIND_ICON[b.kind] || "ticket"} size={22} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-brand-800">{b.title}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                  {b.location && (
                    <span className="flex items-center gap-1"><Icon name="map-pin" size={13} /> {b.location}</span>
                  )}
                  {b.date && (
                    <span className="flex items-center gap-1"><Icon name="calendar" size={13} /> {b.date}</span>
                  )}
                </p>
              </div>
              <span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-flex ${statusTone(b.status)}`}>
                {b.status}
              </span>
              <button className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-800">
                View
              </button>
            </div>
          ))}
      </div>
      {source === "demo" && !loading && <div className="mt-4"><DemoNote /></div>}
    </SectionCard>
  );
}

function Recommended() {
  return (
    <SectionCard
      title="Recommended For You"
      action={<a href="#dashboard" className="text-sm font-bold text-brand-700 hover:text-brand-800">View All</a>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {recommended.map((r) => (
          <a
            key={r.name}
            href="#dashboard"
            className="group overflow-hidden rounded-xl border border-line transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={r.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700 backdrop-blur">
                {r.kind}
              </span>
            </div>
            <div className="p-3.5">
              <p className="truncate text-sm font-bold text-brand-800">{r.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted">{r.meta}</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-ink">
                <Icon name="star" size={13} className="text-gold-400" fill="currentColor" stroke="none" /> {r.rating}
              </p>
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}

function Favorites() {
  const [tab, setTab] = useState("Tours");
  const rows = tab === "Destinations" ? favorites.slice(0, 2) : favorites.filter((f) => f.kind === tab);
  const shown = rows.length ? rows : favorites;
  return (
    <SectionCard
      title="Your Favorites"
      action={<a href="#dashboard" className="text-sm font-bold text-brand-700 hover:text-brand-800">View All</a>}
    >
      <Tabs items={["Tours", "Hotels", "Restaurants", "Destinations"]} value={tab} onChange={setTab} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {shown.map((f) => (
          <div key={f.name} className="group relative overflow-hidden rounded-xl border border-line">
            <img src={f.image} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <button
              aria-label="Remove favorite"
              className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-danger shadow-sm backdrop-blur"
            >
              <Icon name="heart" size={16} fill="currentColor" stroke="none" />
            </button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/90 to-transparent p-3">
              <p className="text-sm font-bold text-white">{f.name}</p>
              <p className="text-[11px] text-white/70">{f.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const firstName = (user?.fullname || user?.username || "Traveler").split(" ")[0];
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-72">
        <Topbar onMenu={() => setOpen(true)} />

        <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
          <header className="animate-rise">
            <h1 className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">
              {greeting()}, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted">Where do you want to go next?</p>
          </header>

          <QuickActions />
          <Stats />
          <UpcomingBookings />
          <Recommended />
          <Favorites />
        </main>
      </div>
    </div>
  );
}
