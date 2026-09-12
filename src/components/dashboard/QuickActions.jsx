import {
  Plus,
  Tag,
  CalendarDays,
  Calendar,
  Download,
} from "lucide-react";

const actions = [
  { icon: Plus, text: "Add New Property", path: "/owner/properties" },
  { icon: Plus, text: "Manage & Add Rooms", path: "/owner/rooms" },
  { icon: Calendar, text: "Manage Reservations", path: "/owner/bookings" },
  { icon: Tag, text: "Create Promotion", path: "/owner/promotions" },
  { icon: CalendarDays, text: "Update Availability", path: "/owner/pricing" },
  { icon: Download, text: "Download Reports", path: "/owner/reports" },
];

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h3>
      <div className="space-y-1.5">
        {actions.map((a, i) => (
          <a
            key={a.text}
            href={a.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-all duration-200 animate-slide-right"
            style={{ animationDelay: `${i * 60 + 300}ms` }}
          >
            <a.icon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            {a.text}
          </a>
        ))}
      </div>
    </div>
  );
}
