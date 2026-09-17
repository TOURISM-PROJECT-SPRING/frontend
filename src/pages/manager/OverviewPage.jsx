import ChartCard from "../../components/manager/ChartCard";
import StatCard from "../../components/manager/StatCard";
import SectionHeader from "../../components/manager/SectionHeader";
import DashboardHero from "../../components/manager/DashboardHero";
import DataTable from "../../components/manager/DataTable";
import WorkspaceCard from "../../components/manager/WorkspaceCard";
import { BarChart, Donut } from "../../components/manager/Charts";
import { buildColumns } from "../../components/manager/columns";
import { entityMeta } from "../../data/managerData";
import { PICKER } from "../../data/managerConfig";
import { useManager } from "../../hooks/useManager";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import { DemoNote } from "../../components/ui/feedback";

const DEFAULT_BOOKINGS_TREND = [
  { label: "Nov", value: 120 },
  { label: "Dec", value: 158 },
  { label: "Jan", value: 142 },
  { label: "Feb", value: 190 },
  { label: "Mar", value: 232 },
  { label: "Apr", value: 276 },
];

const DEFAULT_MIX = [
  { label: "Tours", value: 46, color: "#02462e" },
  { label: "Hotels", value: 33, color: "#fec700" },
  { label: "Restaurants", value: 21, color: "#4f8d70" },
];

const BIZ = ["tour", "hotel", "restaurant", "admin"];
const DELAYS = ["", "delay-100", "delay-200", "delay-300"];

export default function OverviewPage() {
  const { user } = useAuth();
  const { items: bookings, loading: bookingsLoading, source } = useManager("all-bookings");
  const { data, loading: dashLoading, refresh } = useDashboardData();
  const first = (user?.fullname || "there").split(" ")[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalBookingsVal = data?.totalBookings ? Number(data.totalBookings).toLocaleString() : "1,284";
  const totalRevenueVal = data?.revenueText || "$286k";
  const activeListingsVal = data?.activeListings ? String(data.activeListings) : "312";
  const totalCustomersVal = data?.totalCustomers ? Number(data.totalCustomers).toLocaleString() : "4,820";

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookingsVal,
      icon: "calendar",
      tone: "green",
      delta: "+9%",
      spark: [120, 158, 142, 190, 232, 276],
    },
    {
      label: "Total Revenue",
      value: totalRevenueVal,
      icon: "trending-up",
      tone: "gold",
      delta: "+8%",
      spark: [40, 52, 48, 63, 71, 86],
    },
    {
      label: "Active Listings",
      value: activeListingsVal,
      icon: "layers",
      tone: "green",
      delta: "+12%",
      spark: [255, 268, 271, 290, 298, 312],
    },
    {
      label: "Total Customers",
      value: totalCustomersVal,
      icon: "users",
      tone: "gold",
      delta: "+5%",
      spark: [4100, 4280, 4420, 4550, 4700, 4820],
    },
  ];

  const trendData = data?.bookingsTrend && data.bookingsTrend.length ? data.bookingsTrend : DEFAULT_BOOKINGS_TREND;
  const mixData = data?.mix && data.mix.length ? data.mix : DEFAULT_MIX;

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Management Overview"
        title={`Welcome back, ${first}`}
        subtitle="Here's what's happening across your tours, hotels and restaurants — bookings, revenue and activity fetched directly from live business APIs."
        date={today}
        actions={[
          { label: dashLoading ? "Refreshing..." : "Refresh Stats", icon: "arrow-right", onClick: refresh },
          { label: "Add Tour Package", icon: "plus", to: "/manager/tour/packages" },
          { label: "View Bookings", icon: "calendar", to: "/manager/tour/bookings" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} className={`animate-rise ${DELAYS[i] || ""}`} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Bookings Overview" subtitle="All businesses · 6-month live trend" className="animate-rise delay-100 lg:col-span-2">
          <BarChart data={trendData} />
        </ChartCard>
        <ChartCard title="Mix by Business" subtitle="Share of bookings" className="animate-rise delay-200">
          <Donut segments={mixData} centerValue={totalBookingsVal} centerLabel="total" />
        </ChartCard>
      </div>

      <div className="animate-rise delay-200">
        <SectionHeader eyebrow="Workspaces" title="Your businesses" subtitle="Jump into a workspace to manage operations in detail." />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {BIZ.map((key, i) => (
            <WorkspaceCard key={key} workspace={PICKER[key]} number={i + 1} />
          ))}
        </div>
      </div>

      <div className="animate-rise delay-300">
        <SectionHeader
          eyebrow="Activity"
          title="Recent bookings"
          subtitle="Latest activity across tours, hotels and restaurants."
          action="View all"
          to="/manager/tour/bookings"
        />
        <DataTable
          columns={buildColumns(entityMeta("all-bookings").columns)}
          rows={bookings.slice(0, 6)}
          loading={bookingsLoading}
          searchable={false}
        />
      </div>

      {source === "demo" && !bookingsLoading && <DemoNote className="animate-fade" />}
    </div>
  );
}