import { Link } from "react-router-dom";
import StatCard from "../../../components/manager/StatCard";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import { BarChart, Donut } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import Icon from "../../../components/ui/Icon";
import { WORKSPACES } from "../../../data/managerConfig";
import { DemoNote } from "../../../components/ui/feedback";

const revenue = [
  { label: "Jan", value: 38000 },
  { label: "Feb", value: 42000 },
  { label: "Mar", value: 47000 },
  { label: "Apr", value: 52000 },
  { label: "May", value: 49000 },
  { label: "Jun", value: 58000 },
];
const mix = [
  { label: "Tours", value: 46, color: "#02462e" },
  { label: "Hotels", value: 33, color: "#fec700" },
  { label: "Restaurants", value: 21, color: "#4f8d70" },
];

const SWITCHERS = ["tour", "hotel", "restaurant"];

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading } = useManager("all-bookings");
  const first = (user?.fullname || "there").split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">Platform Overview</h1>
        <p className="mt-1 text-sm text-muted">Welcome, {first} — full oversight across every business line.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value="4,820" icon="users" tone="green" delta="+12%" />
        <StatCard label="Tour Packages" value="5" icon="compass" tone="green" />
        <StatCard label="Hotels" value="4" icon="bed" tone="gold" />
        <StatCard label="Restaurants" value="4" icon="utensils" tone="gold" />
        <StatCard label="Total Bookings" value="1,284" icon="calendar" tone="green" delta="+9%" />
        <StatCard label="Total Revenue" value="$286k" icon="trending-up" tone="gold" delta="+8%" />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-brand-800">Manage workspaces</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {SWITCHERS.map((key) => {
            const w = WORKSPACES[key];
            return (
              <Link
                key={key}
                to={w.base}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-700 text-gold-400">
                  <Icon name={w.icon} size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-base font-bold text-brand-800">{w.name}</p>
                  <p className="truncate text-xs text-muted">{w.subtitle}</p>
                </div>
                <Icon name="arrow-right" size={18} className="text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Revenue Overview" subtitle="Last 6 months" className="lg:col-span-2">
          <BarChart data={revenue} />
        </ChartCard>
        <ChartCard title="Bookings by Business">
          <Donut segments={mix} centerValue="1,284" centerLabel="total" />
        </ChartCard>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-800">Recent bookings</h2>
          <Link to="/manager/admin/bookings" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            View all <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <DataTable columns={buildColumns(entityMeta("all-bookings").columns)} rows={bookings.slice(0, 6)} loading={loading} searchable={false} />
      </div>

      <DemoNote />
    </div>
  );
}
