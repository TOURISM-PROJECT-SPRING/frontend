import { Link } from "react-router-dom";
import StatCard from "../../../components/manager/StatCard";
import QuickActions from "../../../components/manager/QuickActions";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import ItemCard from "../../../components/manager/ItemCard";
import { LineChart } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import { img } from "../../../data/site";
import Icon from "../../../components/ui/Icon";

const occupancy = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 70 },
  { label: "Wed", value: 66 },
  { label: "Thu", value: 78 },
  { label: "Fri", value: 90 },
  { label: "Sat", value: 96 },
  { label: "Sun", value: 84 },
];

const hotels = [
  { id: 1, name: "Sofitel Angkor Phokeethra", meta: "Siem Reap", price: 120, rating: 4.8, image: img("Palm Paradise Pool.jpg", 600) },
  { id: 2, name: "The Royal Sands", meta: "Sihanoukville", price: 85, rating: 4.6, image: img("Swimming pool and Makuti-thatched villa in Malindi.jpg", 600) },
  { id: 3, name: "Kampot Riverside Villa", meta: "Kampot", price: 60, rating: 4.7, image: img("Main swimming pool at Paradisus by Meliá Bali.jpg", 600) },
  { id: 4, name: "Kep Garden Resort", meta: "Kep", price: 55, rating: 4.5, image: img("Negombo Beach resort pool (Unsplash).jpg", 600) },
];

export default function HotelDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading } = useManager("hotel-bookings");
  const first = (user?.fullname || "there").split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">Welcome back, {first}</h1>
        <p className="mt-1 text-sm text-muted">Manage your hotel, rooms, and reservations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Hotels" value="4" icon="bed" tone="green" />
        <StatCard label="Total Rooms" value="242" icon="layers" tone="green" />
        <StatCard label="Available Rooms" value="86" icon="check-circle" tone="gold" />
        <StatCard label="Upcoming Reservations" value="54" icon="calendar" tone="green" delta="+9%" />
        <StatCard label="Monthly Revenue" value="$32.5k" icon="trending-up" tone="gold" delta="+6%" />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-brand-800">Quick actions</h2>
        <QuickActions
          items={[
            { label: "Add Hotel", hint: "Register a property", icon: "bed", to: "/manager/hotel/hotels" },
            { label: "Add Room Type", hint: "Define categories", icon: "grid", to: "/manager/hotel/room-types" },
            { label: "Add Room", hint: "Create a room", icon: "layers", to: "/manager/hotel/rooms" },
            { label: "View Reservations", hint: "Manage bookings", icon: "calendar", to: "/manager/hotel/bookings" },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Room Occupancy" subtitle="This week (%)" className="lg:col-span-2">
          <LineChart data={occupancy} />
        </ChartCard>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <h3 className="font-display text-lg font-bold text-brand-800">Availability</h3>
          <p className="mt-0.5 text-sm text-muted">Live room status</p>
          <div className="mt-4 space-y-2">
            {[
              { label: "Available", value: 86, tone: "bg-success" },
              { label: "Occupied", value: 120, tone: "bg-danger" },
              { label: "Reserved", value: 24, tone: "bg-warning" },
              { label: "Maintenance", value: 12, tone: "bg-brand-300" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${s.tone}`} />
                <span className="text-sm text-muted">{s.label}</span>
                <span className="ml-auto text-sm font-bold text-brand-800">{s.value}</span>
              </div>
            ))}
          </div>
          <Link to="/manager/hotel/availability" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-700 py-2.5 text-sm font-bold text-white hover:bg-brand-800">
            Manage availability <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-800">Recent hotel bookings</h2>
          <Link to="/manager/hotel/bookings" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            View all <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <DataTable columns={buildColumns(entityMeta("hotel-bookings").columns)} rows={bookings.slice(0, 5)} loading={loading} searchable={false} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-800">Your hotels</h2>
          <Link to="/manager/hotel/hotels" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            View all <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <ItemCard key={h.id} image={h.image} title={h.name} meta={h.meta} price={h.price} priceUnit="/night" rating={h.rating} actionLabel="Manage" to="/manager/hotel/hotels" />
          ))}
        </div>
      </div>
    </div>
  );
}
