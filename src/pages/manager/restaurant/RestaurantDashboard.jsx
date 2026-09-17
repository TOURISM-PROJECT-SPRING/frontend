import { Link } from "react-router-dom";
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
import Icon from "../../../components/ui/Icon";

const ordersTrend = [
  { label: "Mon", value: 42 },
  { label: "Tue", value: 55 },
  { label: "Wed", value: 48 },
  { label: "Thu", value: 63 },
  { label: "Fri", value: 88 },
  { label: "Sat", value: 104 },
  { label: "Sun", value: 76 },
];

const dishes = [
  { id: 1, name: "Fish Amok", meta: "Main", price: 6.5, image: img("Amok trey.jpg", 600) },
  { id: 2, name: "Beef Lok Lak", meta: "Main", price: 7, image: img("Beef Lok Lak.jpg", 600) },
  { id: 3, name: "Num Banh Chok", meta: "Noodles", price: 3.5, image: img("Num Banh Chok Somlar Kari.jpg", 600) },
  { id: 4, name: "Nom Koma", meta: "Dessert", price: 2.5, image: img("Chek ktis.jpg", 600) },
];

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const { items: orders, loading } = useManager("food-orders");
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
        eyebrow="Restaurant Management"
        title={`Welcome back, ${first}`}
        subtitle="Manage your menu, orders and restaurant operations — from kitchen board to guest table."
        date={today}
        actions={[
          { label: "Add Food", icon: "plus", to: "/manager/restaurant/foods" },
          { label: "Open Kitchen Board", icon: "grid", to: "/manager/restaurant/kitchen" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Today's Orders" value="38" icon="ticket" tone="green" delta="+14%" spark={[22, 26, 28, 31, 34, 38]} className="animate-rise" />
        <StatCard label="Pending Orders" value="6" icon="clock" tone="gold" spark={[9, 8, 7, 7, 6, 6]} className="animate-rise delay-100" />
        <StatCard label="Total Food Items" value="42" icon="utensils" tone="green" spark={[30, 34, 36, 38, 40, 42]} className="animate-rise delay-200" />
        <StatCard label="Active Tables" value="12" icon="layers" tone="gold" spark={[8, 9, 10, 11, 11, 12]} className="animate-rise delay-300" />
        <StatCard label="Today's Revenue" value="$1.2k" icon="trending-up" tone="green" delta="+9%" spark={[0.7, 0.85, 0.9, 1, 1.1, 1.2]} className="animate-rise delay-300" />
      </div>

      <div className="animate-rise delay-100">
        <SectionHeader eyebrow="Shortcuts" title="Quick actions" subtitle="Frequent tasks, one click away." />
        <QuickActions
          items={[
            { label: "Add Food", hint: "Create a menu item", icon: "utensils", to: "/manager/restaurant/foods" },
            { label: "Add Food Category", hint: "Group your menu", icon: "grid", to: "/manager/restaurant/categories" },
            { label: "View Orders", hint: "Kitchen & front", icon: "ticket", to: "/manager/restaurant/orders" },
            { label: "Manage Tables", hint: "Floor plan", icon: "layers", to: "/manager/restaurant/tables" },
          ]}
        />
      </div>

      <div className="grid gap-6 animate-rise delay-200 lg:grid-cols-3">
        <ChartCard title="Orders Overview" subtitle="Orders per day · this week" className="lg:col-span-2">
          <BarChart data={ordersTrend} />
        </ChartCard>
        <div className="relative flex flex-col overflow-hidden rounded-2xl bg-brand-800 p-5 text-white shadow-soft">
          <div className="khmer-motif absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400 text-brand-900">
              <Icon name="grid" size={22} />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold">Kitchen Board</h3>
            <p className="mt-1 flex-1 text-sm text-white/75">Track orders from Pending to Completed on a live Kanban board.</p>
            <Link to="/manager/restaurant/kitchen" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gold-400 py-2.5 text-sm font-bold text-brand-900 hover:bg-gold-300">
              Open board <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>

      <div className="animate-rise delay-200">
        <SectionHeader eyebrow="Activity" title="Recent orders" action="View all" to="/manager/restaurant/orders" />
        <DataTable columns={buildColumns(entityMeta("food-orders").columns)} rows={orders.slice(0, 5)} loading={loading} searchable={false} />
      </div>

      <div className="animate-rise delay-300">
        <SectionHeader eyebrow="Best sellers" title="Popular dishes" action="Manage menu" to="/manager/restaurant/foods" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((d) => (
            <ItemCard key={d.id} image={d.image} title={d.name} meta={d.meta} price={d.price} actionLabel="Edit" to="/manager/restaurant/foods" />
          ))}
        </div>
      </div>
    </div>
  );
}