import { Link } from "react-router-dom";
import StatCard from "../../../components/manager/StatCard";
import QuickActions from "../../../components/manager/QuickActions";
import SectionHeader from "../../../components/manager/SectionHeader";
import DashboardHero from "../../../components/manager/DashboardHero";
import ChartCard from "../../../components/manager/ChartCard";
import DataTable from "../../../components/manager/DataTable";
import ItemCard from "../../../components/manager/ItemCard";
import { LineChart } from "../../../components/manager/Charts";
import { buildColumns } from "../../../components/manager/columns";
import { entityMeta } from "../../../data/managerData";
import { useManager } from "../../../hooks/useManager";
import { useAuth } from "../../../context/AuthContext";
import useDashboardData from "../../../hooks/useDashboardData";
import Icon from "../../../components/ui/Icon";

export default function HotelDashboard() {
  const { user } = useAuth();
  const { items: bookings, loading: bookingsLoading } = useManager("hotel-bookings");
  const { data, loading: dashLoading, refresh } = useDashboardData();
  const first = (user?.fullname || "there").split(" ")[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hotelStats = data?.hotelStats || {};
  const occupancy = hotelStats.occupancy || [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 70 },
    { label: "Wed", value: 66 },
    { label: "Thu", value: 78 },
    { label: "Fri", value: 90 },
    { label: "Sat", value: 96 },
    { label: "Sun", value: 84 },
  ];
  const availability = hotelStats.availability || [
    { label: "Available", value: 86, tone: "bg-success" },
    { label: "Occupied", value: 120, tone: "bg-danger" },
    { label: "Reserved", value: 24, tone: "bg-warning" },
    { label: "Maintenance", value: 12, tone: "bg-brand-300" },
  ];
  const hotels = hotelStats.hotels || [];

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow="Hotel Management"
        title={`Welcome back, ${first}`}
        subtitle="Manage your hotels, room types and reservations — keep occupancy healthy and every stay memorable."
        date={today}
        actions={[
          { label: dashLoading ? "Refreshing..." : "Refresh Hotels", icon: "arrow-right", onClick: refresh },
          { label: "Add Hotel", icon: "plus", to: "/manager/hotel/hotels" },
          { label: "View Reservations", icon: "calendar", to: "/manager/hotel/bookings" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Hotels" value={String(hotelStats.totalHotels || 4)} icon="bed" tone="green" spark={[2, 3, 3, 4, 4, 4]} className="animate-rise" />
        <StatCard label="Total Rooms" value={String(hotelStats.totalRooms || 242)} icon="layers" tone="green" spark={[150, 180, 210, 228, 236, 242]} className="animate-rise delay-100" />
        <StatCard label="Available Rooms" value={String(hotelStats.availableRooms || 86)} icon="check-circle" tone="gold" spark={[64, 70, 74, 80, 83, 86]} className="animate-rise delay-200" />
        <StatCard label="Upcoming Reservations" value={String(hotelStats.upcomingReservations || 54)} icon="calendar" tone="green" delta="+9%" spark={[31, 36, 42, 47, 51, 54]} className="animate-rise delay-300" />
        <StatCard label="Monthly Revenue" value={hotelStats.monthlyRevenue || "$32.5k"} icon="trending-up" tone="gold" delta="+6%" spark={[22, 25, 27, 29, 31, 33]} className="animate-rise delay-300" />
      </div>

      <div className="animate-rise delay-100">
        <SectionHeader eyebrow="Shortcuts" title="Quick actions" subtitle="Frequent tasks, one click away." />
        <QuickActions
          items={[
            { label: "Add Hotel", hint: "Register a property", icon: "bed", to: "/manager/hotel/hotels" },
            { label: "Add Room Type", hint: "Define categories", icon: "grid", to: "/manager/hotel/room-types" },
            { label: "Add Room", hint: "Create a room", icon: "layers", to: "/manager/hotel/rooms" },
            { label: "View Reservations", hint: "Manage bookings", icon: "calendar", to: "/manager/hotel/bookings" },
          ]}
        />
      </div>

      <div className="grid gap-6 animate-rise delay-200 lg:grid-cols-3">
        <ChartCard title="Room Occupancy" subtitle="This week (%)" className="lg:col-span-2">
          <LineChart data={occupancy} />
        </ChartCard>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-brand-800">Availability</h3>
              <p className="mt-0.5 text-sm text-muted">Live room status</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-gold-400">
              <Icon name="check-circle" size={20} />
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {availability.map((s) => (
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

      <div className="animate-rise delay-200">
        <SectionHeader eyebrow="Activity" title="Recent hotel bookings" action="View all" to="/manager/hotel/bookings" />
        <DataTable columns={buildColumns(entityMeta("hotel-bookings").columns)} rows={bookings.slice(0, 5)} loading={bookingsLoading} searchable={false} />
      </div>

      <div className="animate-rise delay-300">
        <SectionHeader eyebrow="Properties" title="Your hotels" action="View all" to="/manager/hotel/hotels" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h) => (
            <ItemCard key={h.id} image={h.image} title={h.name} meta={h.meta} price={h.price} priceUnit="/night" rating={h.rating} actionLabel="Manage" to="/manager/hotel/hotels" />
          ))}
        </div>
      </div>
    </div>
  );
}