import { Link } from "react-router-dom";
import StatCard from "../../../components/manager/StatCard";
import QuickActions from "../../../components/manager/QuickActions";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import ItemCard from "../../../components/manager/ItemCard";
import { BarChart } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import { img } from "../../../data/site";
import Icon from "../../../components/ui/Icon";

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

export default function TourDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading } = useManager("tour-bookings");
  const first = (user?.fullname || "there").split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">Welcome back, {first}</h1>
        <p className="mt-1 text-sm text-muted">Manage your destinations, experiences, and tour bookings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Tour Packages" value="5" icon="ticket" tone="green" />
        <StatCard label="Active Tours" value="4" icon="compass" tone="green" delta="+2" />
        <StatCard label="Upcoming Bookings" value="128" icon="calendar" tone="gold" delta="+12%" />
        <StatCard label="Total Revenue" value="$48.2k" icon="trending-up" tone="gold" delta="+8%" />
        <StatCard label="Available Guides" value="3" icon="user" tone="green" />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-brand-800">Quick actions</h2>
        <QuickActions
          items={[
            { label: "Add Tour Package", hint: "Create a new experience", icon: "ticket", to: "/manager/tour/packages" },
            { label: "Add Tourist Place", hint: "Register a destination", icon: "landmark", to: "/manager/tour/places" },
            { label: "Add Tour Guide", hint: "Onboard a guide", icon: "user", to: "/manager/tour/guides" },
            { label: "View Bookings", hint: "Manage reservations", icon: "calendar", to: "/manager/tour/bookings" },
          ]}
        />
      </div>

      <ChartCard title="Tour Bookings Overview" subtitle="Bookings per month">
        <BarChart data={bookingsTrend} />
      </ChartCard>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-800">Recent tour bookings</h2>
          <Link to="/manager/tour/bookings" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            View all <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <DataTable columns={buildColumns(entityMeta("tour-bookings").columns)} rows={bookings.slice(0, 5)} loading={loading} searchable={false} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-800">Popular tour packages</h2>
          <Link to="/manager/tour/packages" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            View all <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <ItemCard key={p.id} image={p.image} title={p.name} meta={p.meta} price={p.price} priceUnit="/person" rating={p.rating} actionLabel="Edit" to="/manager/tour/packages" />
          ))}
        </div>
      </div>
    </div>
  );
}
