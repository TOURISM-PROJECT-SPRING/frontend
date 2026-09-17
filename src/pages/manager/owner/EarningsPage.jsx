import ChartCard from "../../../components/manager/ChartCard";
import StatCard from "../../../components/manager/StatCard";
import DataTable from "../../../components/manager/DataTable";
import Icon from "../../../components/ui/Icon";
import { LineChart, BarChart } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import { DemoNote } from "../../../components/ui/feedback";

const revenueTrend = [
  { label: "Nov", value: 34.2 },
  { label: "Dec", value: 39.8 },
  { label: "Jan", value: 37.1 },
  { label: "Feb", value: 44.6 },
  { label: "Mar", value: 51.2 },
  { label: "Apr", value: 58.4 },
];

const monthlyBookings = [
  { label: "Nov", value: 340 },
  { label: "Dec", value: 410 },
  { label: "Jan", value: 380 },
  { label: "Feb", value: 460 },
  { label: "Mar", value: 520 },
  { label: "Apr", value: 610 },
];

const payouts = [
  { label: "Q2 partner commission", detail: "Due Apr 30 · Hotels", amount: "$18,400", status: "Scheduled", tone: "warning" },
  { label: "Restaurant supplier batch", detail: "12 invoices · March", amount: "$9,120", status: "Review", tone: "gold" },
  { label: "Tour guide payroll", detail: "Cleared Apr 15", amount: "$6,540", status: "Paid", tone: "success" },
];

const PAYOUT_TONE = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  gold: "bg-gold-100 text-gold-700",
};

const KPIS = [
  { label: "Net revenue", value: "$188k", icon: "wallet", tone: "green", delta: "+8.6%" },
  { label: "Gross profit", value: "$59.5k", icon: "trending-up", tone: "gold", delta: "+7.1%" },
  { label: "Pending payouts", value: "$27.5k", icon: "receipt", tone: "green", delta: "2 batches" },
  { label: "Avg. order value", value: "$128", icon: "ticket", tone: "gold", delta: "+3.4%" },
];

export default function EarningsPage() {
  const { user } = useAuth();
  const { items: payments, loading, source } = useManager("payments");
  const first = (user?.fullname || "Partner").split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-500">
            Portfolio · Earnings
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-700">
              <Icon name="shield" size={10} /> Owner
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-brand-800">Revenue &amp; earnings</h1>
          <p className="mt-1 text-sm text-muted">Financial overview for {first} across hotels and restaurants.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800">
          <Icon name="trending-up" size={16} /> Revenue report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((s, i) => (
          <StatCard key={s.label} {...s} className={`animate-rise ${i ? `delay-${i}00` : ""}`} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Revenue by month"
          subtitle="Hotels + restaurants · USD thousands"
          className="animate-rise delay-100 lg:col-span-2"
        >
          <LineChart data={revenueTrend} />
        </ChartCard>

        <section className="animate-rise delay-200 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-800">Payouts &amp; approvals</h3>
              <p className="mt-0.5 text-sm text-muted">Awaiting your attention</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-gold-400">
              <Icon name="receipt" size={20} />
            </span>
          </div>
          <div className="divide-y divide-line/70">
            {payouts.map((p) => (
              <div key={p.label} className="flex items-center gap-3 py-3">
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${PAYOUT_TONE[p.tone] || PAYOUT_TONE.gold}`}>
                  {p.status}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-800">{p.label}</p>
                  <p className="truncate text-xs text-muted">{p.detail}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-700">{p.amount}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ChartCard title="Bookings volume" subtitle="All owned businesses · last 6 months">
        <BarChart data={monthlyBookings} />
      </ChartCard>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-brand-800">Payment transactions</h2>
        <DataTable
          columns={buildColumns(entityMeta("payments").columns)}
          rows={payments}
          loading={loading}
        />
      </div>

      {source === "demo" && !loading && <DemoNote className="animate-fade" />}
    </div>
  );
}