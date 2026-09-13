import { Link } from "react-router-dom";
import StatCard from "../../../components/manager/StatCard";
import QuickActions from "../../../components/manager/QuickActions";
import SectionHeader from "../../../components/manager/SectionHeader";
import DashboardHero from "../../../components/manager/DashboardHero";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import ItemCard from "../../../components/manager/ItemCard";
import Icon from "../../../components/ui/Icon";
import { LineChart, BarChart, Donut, ProgressRing } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import { img } from "../../../data/site";
import { DemoNote } from "../../../components/ui/feedback";

/* ---------------------------------- data --------------------------------- */

// Consolidated revenue across the owner's whole portfolio (last 6 months).
const revenueTrend = [
  { label: "Nov", value: 34200 },
  { label: "Dec", value: 39800 },
  { label: "Jan", value: 37100 },
  { label: "Feb", value: 44600 },
  { label: "Mar", value: 51200 },
  { label: "Apr", value: 58400 },
];

const monthlyRevenue = [
  { label: "Nov", value: 34.2 },
  { label: "Dec", value: 39.8 },
  { label: "Jan", value: 37.1 },
  { label: "Feb", value: 44.6 },
  { label: "Mar", value: 51.2 },
  { label: "Apr", value: 58.4 },
];

const revenueMix = [
  { label: "Hotels", value: 121.6, color: "#02462e" },
  { label: "Restaurants", value: 66.4, color: "#4f8d70" },
];

// Owned businesses — the portfolio the owner oversees (owner manages hotels
// and restaurants only; tour operations are handled elsewhere).
const BUSINESSES = [
  {
    key: "hotel",
    name: "Sovann Heritage Hotels",
    kind: "Boutique hotels · 3 properties",
    icon: "bed",
    to: "/manager/hotel",
    revenue: "$121.6k",
    bookings: 340,
    growth: "+8%",
    metricLabel: "Avg. occupancy",
    metric: 84,
    tone: "#02462e",
  },
  {
    key: "restaurant",
    name: "Khmer Table Restaurants",
    kind: "Dining · 4 outlets",
    icon: "utensils",
    to: "/manager/restaurant",
    revenue: "$66.4k",
    bookings: 1240,
    growth: "+14%",
    metricLabel: "Table turnover",
    metric: 71,
    tone: "#4f8d70",
  },
];

const gauges = [
  { label: "Annual revenue goal", sub: "$1.8M target", value: 74, color: "#02462e" },
  { label: "Repeat-customer rate", sub: "Across portfolio", value: 62, color: "#fec700" },
  { label: "5-star reviews", sub: "Share of 1,914", value: 68, color: "#4f8d70" },
  { label: "Capacity utilisation", sub: "Rooms · tables · seats", value: 79, color: "#b98a00" },
];

// Average rating by business — small inline bar list.
const ratings = [
  { label: "Hotels", value: 4.7, pct: 94 },
  { label: "Restaurants", value: 4.5, pct: 90 },
];

// Payouts & approvals awaiting the owner.
const payouts = [
  { label: "Q2 partner commission", detail: "Due Apr 30 · Hotels", amount: "$18,400", status: "Scheduled", tone: "warning" },
  { label: "Restaurant supplier batch", detail: "12 invoices · March", amount: "$9,120", status: "Review", tone: "gold" },
  { label: "Housekeeping payroll", detail: "Cleared Apr 15", amount: "$6,540", status: "Paid", tone: "success" },
];

const topPerformers = [
  { id: 1, name: "Sofitel Angkor Phokeethra", meta: "Siem Reap · Hotel", price: 120, priceUnit: "/night", rating: 4.8, image: img("Palm Paradise Pool.jpg", 600), badge: "Top earner" },
  { id: 2, name: "Khmer Kitchen", meta: "Phnom Penh · Restaurant", price: 18.5, priceUnit: "/order", rating: 4.8, image: img("Fish Amok.jpg", 600), badge: "Most ordered" },
  { id: 3, name: "The Royal Sands", meta: "Sihanoukville · Hotel", price: 95, priceUnit: "/night", rating: 4.6, image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 600), badge: "Rising stay" },
];

const KPI = [
  { label: "Portfolio revenue", value: "$188k", icon: "wallet", tone: "green", delta: "+8.4%", spark: [34, 40, 37, 45, 51, 58] },
  { label: "Total bookings", value: "1,580", icon: "calendar", tone: "gold", delta: "+9%", spark: [280, 320, 300, 360, 410, 500] },
  { label: "Net profit margin", value: "31.6%", icon: "trending-up", tone: "green", delta: "+2.1%", spark: [27, 28, 29, 30, 31, 32] },
  { label: "Active customers", value: "4,820", icon: "users", tone: "gold", delta: "+5%", spark: [4100, 4280, 4420, 4550, 4700, 4820] },
  { label: "Avg. review score", value: "4.6", icon: "star", tone: "green", hint: "1,914 reviews across 2 brands", spark: [4.3, 4.4, 4.4, 4.5, 4.6, 4.6] },
];

const DELAYS = ["", "delay-100", "delay-200", "delay-300", "delay-300"];

/* ------------------------------- sub-components ------------------------------ */

const PAYOUT_TONE = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  gold: "bg-gold-100 text-gold-700",
};

function BusinessCard({ biz, className = "" }) {
  return (
    <Link
      to={biz.to}
      className={`group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-gold-400 shadow-sm">
          <Icon name={biz.icon} size={22} />
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
            String(biz.growth).startsWith("-") ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
          }`}
        >
          <Icon name="trending-up" size={12} className={String(biz.growth).startsWith("-") ? "rotate-180" : ""} />
          {biz.growth}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold leading-tight text-brand-800">{biz.name}</h3>
      <p className="mt-0.5 text-xs text-muted">{biz.kind}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-brand-800">{biz.revenue}</p>
          <p className="text-xs font-medium text-muted">revenue · {biz.bookings.toLocaleString()} bookings</p>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors group-hover:bg-gold-400 group-hover:text-brand-900">
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
          <span>{biz.metricLabel}</span>
          <span className="text-brand-700">{biz.metric}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-50">
          <div
            className="h-full rounded-full transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${biz.metric}%`, background: biz.tone }}
          />
        </div>
      </div>
    </Link>
  );
}

function PayoutRow({ item }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${PAYOUT_TONE[item.tone] || PAYOUT_TONE.gold}`}>
        {item.status}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-brand-800">{item.label}</p>
        <p className="truncate text-xs text-muted">{item.detail}</p>
      </div>
      <span className="shrink-0 text-sm font-bold text-brand-700">{item.amount}</span>
    </div>
  );
}

/* ----------------------------------- page ---------------------------------- */

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading, source } = useManager("all-bookings");
  const first = (user?.fullname || "Partner").split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Owner · Portfolio Overview"
        title={`Good day, ${first}`}
        subtitle="Your consolidated performance across hotels and restaurants — revenue, profitability and guest sentiment at executive level."
        date={today}
        actions={[
          { label: "Revenue report", icon: "trending-up", to: "/manager/owner/revenue" },
          { label: "All bookings", icon: "calendar", to: "/manager/owner/bookings" },
        ]}
      />

      {/* Portfolio KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPI.map((s, i) => (
          <StatCard key={s.label} {...s} className={`animate-rise ${DELAYS[i] || ""}`} />
        ))}
      </div>

      {/* Revenue narrative */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Consolidated revenue"
          subtitle="All owned businesses · last 6 months"
          className="animate-rise delay-100 lg:col-span-2"
        >
          <LineChart data={revenueTrend} />
        </ChartCard>
        <ChartCard title="Revenue by business" subtitle="Share of $188k">
          <div className="flex flex-col gap-4">
            <Donut segments={revenueMix} centerValue="$188k" centerLabel="total" />
            <div className="grid grid-cols-2 gap-3 border-t border-line/70 pt-4">
              {BUSINESSES.slice(0, 2).map((b) => (
                <div key={b.key} className="text-center">
                  <p className="font-display text-lg font-bold text-brand-800">{b.revenue}</p>
                  <p className="text-[11px] font-medium text-muted">{b.kind.split(" ·")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Owned businesses */}
      <div className="animate-rise delay-100">
        <SectionHeader
          eyebrow="Portfolio"
          title="Your businesses"
          subtitle="Performance of each brand you own — open a workspace for operational detail."
          action="Open console"
          to="/manager"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {BUSINESSES.map((b, i) => (
            <BusinessCard key={b.key} biz={b} className={`animate-rise ${DELAYS[i] || ""}`} />
          ))}
        </div>
      </div>

      {/* Goals + sentiment */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Portfolio goals" subtitle="Progress against annual targets" className="animate-rise delay-100 lg:col-span-2">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {gauges.map((g) => (
              <ProgressRing key={g.label} value={g.value} color={g.color} label={g.label} sub={g.sub} size={96} />
            ))}
          </div>
        </ChartCard>

        <section className="animate-rise delay-200 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-800">Guest sentiment</h3>
              <p className="mt-0.5 text-sm text-muted">Average rating by business</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-brand-900">
              <Icon name="star" size={20} fill="currentColor" stroke="none" />
            </span>
          </div>
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink/80">{r.label}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-brand-800">
                    <Icon name="star" size={13} className="text-gold-400" fill="currentColor" stroke="none" />
                    {r.value.toFixed(1)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-50">
                  <div
                    className="h-full rounded-full bg-brand-700 transition-[width] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/manager/owner/reviews"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Read all reviews <Icon name="arrow-right" size={15} />
          </Link>
        </section>
      </div>

      {/* Monthly bars + payouts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Monthly revenue" subtitle="USD · thousands" className="animate-rise delay-100 lg:col-span-2">
          <BarChart data={monthlyRevenue} />
        </ChartCard>

        <section className="animate-rise delay-200 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-800">Payouts & approvals</h3>
              <p className="mt-0.5 text-sm text-muted">Awaiting your attention</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-gold-400">
              <Icon name="receipt" size={20} />
            </span>
          </div>
          <div className="divide-y divide-line/70">
            {payouts.map((p) => (
              <PayoutRow key={p.label} item={p} />
            ))}
          </div>
          <Link
            to="/manager/owner/payments"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            Manage payments <Icon name="arrow-right" size={15} />
          </Link>
        </section>
      </div>

      {/* Quick actions */}
      <div className="animate-rise delay-100">
        <SectionHeader eyebrow="Shortcuts" title="Owner actions" subtitle="Jump straight to the decisions you make most." />
        <QuickActions
          items={[
            { label: "Revenue & P&L", hint: "Financial overview", icon: "wallet", to: "/manager/owner/revenue" },
            { label: "All bookings", hint: "Across every brand", icon: "calendar", to: "/manager/owner/bookings" },
            { label: "Customers", hint: "4,820 guests", icon: "users", to: "/manager/owner/customers" },
            { label: "Payments", hint: "Settlements & payouts", icon: "receipt", to: "/manager/owner/payments" },
          ]}
        />
      </div>

      {/* Top performers */}
      <div className="animate-rise delay-200">
        <SectionHeader eyebrow="Highlights" title="Top performers" subtitle="Your strongest offerings this quarter, brand by brand." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topPerformers.map((t) => (
            <ItemCard
              key={t.id}
              image={t.image}
              title={t.name}
              meta={t.meta}
              price={t.price}
              priceUnit={t.priceUnit}
              rating={t.rating}
              badge={t.badge}
              actionLabel="Open"
              to="/manager"
            />
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="animate-rise delay-300">
        <SectionHeader
          eyebrow="Activity"
          title="Latest bookings across the portfolio"
          action="View all"
          to="/manager/owner/bookings"
        />
        <DataTable
          columns={buildColumns(entityMeta("all-bookings").columns)}
          rows={bookings.slice(0, 8)}
          loading={loading}
          searchable={false}
        />
      </div>

      {source === "demo" && !loading && <DemoNote className="animate-fade" />}
    </div>
  );
}
