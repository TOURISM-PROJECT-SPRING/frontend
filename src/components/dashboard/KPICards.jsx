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
          color: "text-[#1b3b2b] dark:text-emerald-300",
          bg: "bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20",
        },
        {
          label: "Total Revenue",
          value: data.revenueText,
          footer: `across ${data.totalChannel} bookings`,
          icon: DollarSign,
          color: "text-amber-800 dark:text-[#f4b938]",
          bg: "bg-amber-50 dark:bg-amber-950/40 border border-[#f4b938]/30",
        },
        {
          label: "Occupancy Rate",
          value: data.occupancyRate == null ? "—" : `${data.occupancyRate}%`,
          footer: `${data.rooms.length} rooms`,
          icon: BedDouble,
          color: "text-[#1b3b2b] dark:text-emerald-400",
          bg: "bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20",
        },
        {
          label: "Average Rating",
          value: data.avgRating ? `${data.avgRating}/5` : "—",
          footer: `${data.tourPlaces.length} places rated`,
          icon: Star,
          color: "text-[#f4b938]",
          bg: "bg-amber-50 dark:bg-amber-950/30 border border-[#f4b938]/30",
        },
        {
          label: "Properties",
          value: String(data.totalHotels),
          footer: `${data.totalRooms} rooms available`,
          icon: Building2,
          color: "text-[#1b3b2b] dark:text-emerald-300",
          bg: "bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20",
        },
      ]
    : [];

  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
          style={{ animationDelay: `${i * 75}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 ${m.bg} rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-2xs`}>
              <m.icon className={`w-4.5 h-4.5 ${m.color}`} />
            </div>
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 leading-tight">{m.label}</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{m.value}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3 text-[#1b3b2b] dark:text-emerald-400" />
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{m.footer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}