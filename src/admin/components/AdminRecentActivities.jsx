import { BedDouble, Ticket, UtensilsCrossed } from "lucide-react";
import useDashboardData from "../hooks/useDashboardData";

const typeConfig = {
  Room: { icon: BedDouble, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  Ticket: { icon: Ticket, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  Food: { icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
};

function timeAgo(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.max(1, Math.floor(diff / 60000));
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function AdminRecentActivities() {
  const { data } = useDashboardData();
  const activities = (data?.allBookings || []).slice(0, 6).map((b) => {
    const cfg = typeConfig[b.type] || typeConfig.Room;
    return {
      ...cfg,
      text: `New ${b.type.toLowerCase()} booking`,
      detail: `${b.id} — ${b.guest}`,
      time: timeAgo(b.createdAt),
    };
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Activities</h3>
      {activities.length ? (
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
      ) : (
        <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No recent activity.</div>
      )}
    </div>
  );
}