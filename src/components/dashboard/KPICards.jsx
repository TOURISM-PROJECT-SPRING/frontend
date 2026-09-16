import { CalendarCheck, DollarSign, BedDouble, Star, TrendingUp, Building2 } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

export default function KPICards() {
  const { data, loading } = useDashboardData();

  const metrics = data
    ? [
        {
          label: "Total Bookings",
          value: String(data.totalBookings),
          footer: data.bookingsDelta == null ? "real-time" : `${data.bookingsDelta >= 0 ? "+" : ""}${data.bookingsDelta}% vs last week`,
          icon: CalendarCheck,
          color: "text-blue-500",
          bg: "bg-blue-50 dark:bg-blue-500/10",
        },
        {
          label: "Total Revenue",
          value: data.revenueText,
          footer: `across ${data.totalChannel} bookings`,
          icon: DollarSign,
          color: "text-green-500",
          bg: "bg-green-50 dark:bg-green-500/10",
        },
        {
          label: "Occupancy Rate",
          value: data.occupancyRate == null ? "—" : `${data.occupancyRate}%`,
          footer: `${data.rooms.length} rooms`,
          icon: BedDouble,
          color: "text-orange-500",
          bg: "bg-orange-50 dark:bg-orange-500/10",
        },
        {
          label: "Average Rating",
          value: data.avgRating ? `${data.avgRating}/5` : "—",
          footer: `${data.tourPlaces.length} places rated`,
          icon: Star,
          color: "text-yellow-500",
          bg: "bg-yellow-50 dark:bg-yellow-500/10",
        },
        {
          label: "Properties",
          value: String(data.totalHotels),
          footer: `${data.totalRooms} rooms available`,
          icon: Building2,
          color: "text-purple-500",
          bg: "bg-purple-50 dark:bg-purple-500/10",
        },
      ]
    : [];

  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 ${m.bg} rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
              <m.icon className={`w-4.5 h-4.5 ${m.color}`} />
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">{m.label}</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{m.value}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{m.footer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}