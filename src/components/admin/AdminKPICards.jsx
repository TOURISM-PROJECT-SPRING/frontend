import {
  Users,
  Building2,
  MapPin,
  CalendarCheck,
  Wallet,
  Star,
  TrendingUp,
} from "lucide-react";

const metrics = [
  { label: "Total Users", value: "2,568", change: "+12.5%", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { label: "Total Owners", value: "356", change: "+8.3%", icon: Building2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { label: "Total Places", value: "1,245", change: "+15.7%", icon: MapPin, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { label: "Total Bookings", value: "4,789", change: "+18.6%", icon: CalendarCheck, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Revenue", value: "$48,965", change: "+22.4%", icon: Wallet, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { label: "Total Reviews", value: "1,356", change: "+10.2%", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
];

export default function AdminKPICards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
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
          <p className="text-lg font-bold text-gray-900 dark:text-white animate-count-up" style={{ animationDelay: `${i * 75 + 200}ms` }}>{m.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-medium text-green-600">{m.change}</span>
            <span className="text-[9px] text-gray-300 dark:text-gray-600">vs last week</span>
          </div>
        </div>
      ))}
    </div>
  );
}
