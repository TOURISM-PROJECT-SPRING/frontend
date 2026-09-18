import { Link } from "react-router-dom";
import { MapPin, Hotel, Tag, Bell, BarChart3, Users } from "lucide-react";

const ACTIONS = [
  { to: "/admin/places", label: "Add Place", icon: MapPin, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { to: "/admin/hotels", label: "Add Hotel", icon: Hotel, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { to: "/admin/promotions", label: "New Promotion", icon: Tag, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10" },
  { to: "/admin/notifications", label: "Broadcast", icon: Bell, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { to: "/admin/users", label: "Manage Users", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { to: "/admin/reports", label: "View Reports", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
];

export default function AdminQuickActions() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 animate-fade-in-up delay-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center gap-2.5 rounded-lg border border-gray-100 dark:border-gray-800 px-2.5 py-2 hover:border-primary/40 hover:bg-primary/5 transition"
          >
            <span className={`w-8 h-8 ${action.bg} rounded-lg flex items-center justify-center shrink-0`}>
              <action.icon className={`w-4 h-4 ${action.color}`} />
            </span>
            <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200 leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
