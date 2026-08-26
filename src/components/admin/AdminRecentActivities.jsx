import { UserPlus, Hotel, CalendarCheck, Wallet, Star, Building2 } from "lucide-react";

const activities = [
  { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", text: "New user registered", detail: "sarah@email.com", time: "2 minutes ago" },
  { icon: Hotel, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10", text: "New hotel added", detail: "Grand Palace Hotel", time: "15 minutes ago" },
  { icon: CalendarCheck, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", text: "New booking received", detail: "BK-4821", time: "25 minutes ago" },
  { icon: Wallet, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10", text: "Payment received", detail: "$320.00", time: "35 minutes ago" },
  { icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "New review submitted", detail: "5 stars", time: "1 hour ago" },
  { icon: Building2, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", text: "New owner registered", detail: "Riverside Lodge", time: "2 hours ago" },
];

export default function AdminRecentActivities() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Activities</h3>
      <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
        {activities.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 min-w-[200px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-300 cursor-default animate-slide-right"
            style={{ animationDelay: `${i * 100 + 300}ms` }}
          >
            <div className={`w-8 h-8 ${a.bg} rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110`}>
              <a.icon className={`w-4 h-4 ${a.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-gray-900 dark:text-white truncate">{a.text}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{a.detail}</p>
              <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
