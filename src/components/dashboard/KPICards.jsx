import {
  CalendarCheck,
  DollarSign,
  BedDouble,
  Star,
  Eye,
  TrendingUp,
} from "lucide-react";

const metrics = [
  { label: "Total Bookings", value: "128", change: "+18.6%", icon: CalendarCheck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { label: "Total Revenue", value: "$48,965", change: "+22.4%", icon: DollarSign, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { label: "Occupancy Rate", value: "68.5%", change: "+6.3%", icon: BedDouble, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { label: "Average Rating", value: "4.6/5", change: "+0.2", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  { label: "Property Views", value: "2,356", change: "+15.2%", icon: Eye, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
];

export default function KPICards() {
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
          <p className="text-xl font-bold text-gray-900 dark:text-white animate-count-up" style={{ animationDelay: `${i * 75 + 200}ms` }}>{m.value}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-[11px] font-medium text-green-600">{m.change}</span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600">vs last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
