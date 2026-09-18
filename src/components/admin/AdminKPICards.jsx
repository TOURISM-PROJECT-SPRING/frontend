import { Users, Building2, BedDouble, CalendarCheck, Wallet, UtensilsCrossed, Compass, TrendingUp } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

export default function AdminKPICards() {
  const { data } = useDashboardData();

  const metrics = data
    ? [
        { label: "Total Users", value: String(data.totalUsers ?? 0), footer: "registered accounts", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
        { label: "Total Tours", value: String(data.totalTours ?? 0), footer: "tours & attractions", icon: Compass, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
        { label: "Total Hotels", value: String(data.totalHotels), footer: `${data.totalRooms} rooms`, icon: Building2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
        { label: "Total Restaurants", value: String(data.totalRestaurants), footer: `${data.totalFoods} dishes`, icon: UtensilsCrossed, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
        { label: "Total Bookings", value: String(data.totalBookings), footer: `${data.roomBookings.length} rooms / ${data.ticketBookings.length} tickets / ${data.foodOrders.length} food`, icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: "Total Revenue", value: data.revenueText, footer: "across all channels", icon: Wallet, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
        { label: "Avg Rating", value: data.avgRating ? `${data.avgRating}/5` : "—", footer: `${data.totalPlaces} places rated`, icon: BedDouble, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
      ]
    : [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className={`w-8 h-8 ${m.bg} rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">{m.label}</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{m.footer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}