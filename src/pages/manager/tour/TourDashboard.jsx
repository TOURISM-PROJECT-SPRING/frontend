import StatCard from "../../../components/manager/StatCard";
import QuickActions from "../../../components/manager/QuickActions";
import SectionHeader from "../../../components/manager/SectionHeader";
import DashboardHero from "../../../components/manager/DashboardHero";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import ItemCard from "../../../components/manager/ItemCard";
import { BarChart } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import { img } from "../../../data/site";

const bookingsTrend = [
  { label: "Nov", value: 82 },
  { label: "Dec", value: 110 },
  { label: "Jan", value: 95 },
  { label: "Feb", value: 128 },
  { label: "Mar", value: 150 },
  { label: "Apr", value: 176 },
];

const packages = [
  { id: 1, name: "Angkor Sunrise Explorer", meta: "Siem Reap", price: 45, rating: 4.9, image: img("Angkor Wat, reflejo 2.jpg", 600) },
  { id: 2, name: "Island Escape — Koh Rong", meta: "Sihanoukville", price: 120, rating: 4.8, image: img("Koh_Rong_island.jpg", 600) },
  { id: 3, name: "Mondulkiri Elephant Trek", meta: "Mondulkiri", price: 95, rating: 4.9, image: img("Elephant conservation and indigenous experiences in Cambodia Project.jpg", 600) },
  { id: 4, name: "Phnom Penh Highlights", meta: "Phnom Penh", price: 35, rating: 4.7, image: img("Royal Palace, Phnom Penh Cambodia 1.jpg", 600) },
];

const DELAYS = ["", "delay-100", "delay-200", "delay-300", "delay-300"];

export default function TourDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading } = useManager("tour-bookings");
  const first = (user?.fullname || "there").split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Tour Management"
        title={`Welcome back, ${first}`}
        subtitle="Manage your destinations, experiences and tour bookings — keep your packages fresh and your calendar full."
        date={today}
        actions={[
          { label: "Add Tour Package", icon: "plus", to: "/manager/tour/packages" },
          { label: "View Bookings", icon: "calendar", to: "/manager/tour/bookings" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Tour Packages" value="5" icon="ticket" tone="green" spark={[1, 2, 3, 4, 5, 5]} className={`animate-rise ${DELAYS[0]}`} />
        <StatCard label="Active Tours" value="4" icon="compass" tone="green" delta="+2" spark={[2, 3, 3, 4, 4, 4]} className={`animate-rise ${DELAYS[1]}`} />
        <StatCard label="Upcoming Bookings" value="128" icon="calendar" tone="gold" delta="+12%" spark={[88, 95, 102, 110, 118, 128]} className={`animate-rise ${DELAYS[2]}`} />
        <StatCard label="Total Revenue" value="$48.2k" icon="trending-up" tone="gold" delta="+8%" spark={[32, 36, 39, 42, 46, 48]} className={`animate-rise ${DELAYS[3]}`} />
        <StatCard label="Available Guides" value="3" icon="user" tone="green" spark={[1, 2, 2, 3, 3, 3]} className={`animate-rise ${DELAYS[4]}`} />
      </div>

      <div className="animate-rise delay-100">
        <SectionHeader eyebrow="Shortcuts" title="Quick actions" subtitle="Frequent tasks, one click away." />
        <QuickActions
          items={[
            { label: "Add Tour Package", hint: "Create a new experience", icon: "ticket", to: "/manager/tour/packages" },
            { label: "Add Tourist Place", hint: "Register a destination", icon: "landmark", to: "/manager/tour/places" },
            { label: "Add Tour Guide", hint: "Onboard a guide", icon: "user", to: "/manager/tour/guides" },
            { label: "View Bookings", hint: "Manage reservations", icon: "calendar", to: "/manager/tour/bookings" },
          ]}
        />
      </div>

      <ChartCard title="Tour Bookings Overview" subtitle="Bookings per month · last 6 months" className="animate-rise delay-200">
        <BarChart data={bookingsTrend} />
      </ChartCard>

      <div className="animate-rise delay-200">
        <SectionHeader eyebrow="Activity" title="Recent tour bookings" action="View all" to="/manager/tour/bookings" />
        <DataTable columns={buildColumns(entityMeta("tour-bookings").columns)} rows={bookings.slice(0, 5)} loading={loading} searchable={false} />
      </div>

      <div className="animate-rise delay-300">
        <SectionHeader eyebrow="Top sellers" title="Popular tour packages" action="View all" to="/manager/tour/packages" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <ItemCard key={p.id} image={p.image} title={p.name} meta={p.meta} price={p.price} priceUnit="/person" rating={p.rating} actionLabel="Edit" to="/manager/tour/packages" />
          ))}
        </div>
      </div>
    </div>
  );
}