import ChartCard from "../../components/manager/ChartCard";
import { BarChart, LineChart, Donut } from "../../components/manager/Charts";
import StatCard from "../../components/manager/StatCard";
import { DemoNote } from "../../components/ui/feedback";

const bookingsByMonth = [
  { label: "Nov", value: 120 },
  { label: "Dec", value: 168 },
  { label: "Jan", value: 142 },
  { label: "Feb", value: 190 },
  { label: "Mar", value: 232 },
  { label: "Apr", value: 276 },
];
const revenue = [
  { label: "W1", value: 4200 },
  { label: "W2", value: 5100 },
  { label: "W3", value: 4700 },
  { label: "W4", value: 6300 },
  { label: "W5", value: 7100 },
];
const segments = [
  { label: "Tours", value: 46, color: "#02462e" },
  { label: "Hotels", value: 33, color: "#fec700" },
  { label: "Restaurants", value: 21, color: "#4f8d70" },
];

export default function AnalyticsPage({ title = "Analytics", subtitle = "Operational insights across your workspace." }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bookings" value="1,284" icon="calendar" tone="green" delta="+12%" />
        <StatCard label="Revenue" value="$48.2k" icon="trending-up" tone="gold" delta="+8%" />
        <StatCard label="Conversion" value="3.9%" icon="trending-up" tone="sky" delta="+0.4%" />
        <StatCard label="Active Listings" value="312" icon="layers" tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Bookings Overview" subtitle="Last 6 months" className="lg:col-span-2">
          <BarChart data={bookingsByMonth} />
        </ChartCard>
        <ChartCard title="Mix by Business">
          <Donut segments={segments} centerValue="100%" centerLabel="total" />
        </ChartCard>
      </div>

      <ChartCard title="Revenue Trend" subtitle="Weekly">
        <LineChart data={revenue} />
      </ChartCard>

      <DemoNote />
    </div>
  );
}
