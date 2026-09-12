import { MapPin, Building2, CalendarCheck, UtensilsCrossed, Ticket as TicketIcon } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

export default function AdminSystemStats() {
  const { data } = useDashboardData();

  const stats = data
    ? [
        { label: "Tour Places", value: data.totalPlaces, icon: MapPin, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
        { label: "Hotels", value: data.totalHotels, icon: Building2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
        { label: "Rooms", value: data.totalRooms, icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: "Restaurants", value: data.totalRestaurants, icon: UtensilsCrossed, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
        { label: "Ticket Types", value: data.totalTickets, icon: TicketIcon, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
      ]
    : [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-300">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">System Statistics</h3>
      <div className="space-y-2.5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-2 -mx-2 transition-all duration-200 animate-slide-left"
            style={{ animationDelay: `${i * 80 + 400}ms` }}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className="text-[13px] text-gray-600 dark:text-gray-300">{s.label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}