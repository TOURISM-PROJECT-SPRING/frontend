import { Link } from "react-router-dom";
import {
  Plus,
  Tag,
  CalendarDays,
  Calendar,
  Download,
  UtensilsCrossed,
  Compass,
  Lock,
} from "lucide-react";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";

const actions = [
  { icon: Plus, text: "Add New Property", path: "/owner/properties", biz: "hotel" },
  { icon: Plus, text: "Manage & Add Rooms", path: "/owner/rooms", biz: "hotel" },
  { icon: Calendar, text: "Room Reservations", path: "/owner/bookings", biz: "hotel" },
  { icon: UtensilsCrossed, text: "Manage Food Menu", path: "/owner/menu", biz: "restaurant" },
  { icon: Compass, text: "Manage Tour Places", path: "/owner/tours", biz: "tour" },
  { icon: Tag, text: "Create Promotion", path: "/owner/promotions" },
  { icon: CalendarDays, text: "Update Availability", path: "/owner/pricing", biz: "hotel" },
  { icon: Download, text: "Download Reports", path: "/owner/reports" },
];

export default function QuickActions() {
  const { isBusinessLocked } = useOwnerBusiness();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-200">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
        Quick Actions
      </h3>
      <div className="space-y-1.5">
        {actions.map((a, i) => {
          const isLocked = a.biz ? isBusinessLocked(a.biz) : false;

          return (
            <Link
              key={a.text}
              to={a.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 animate-slide-right group ${
                isLocked
                  ? "text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  : "text-gray-700 dark:text-gray-300 hover:bg-[#edf5f0] hover:text-[#1b3b2b] dark:hover:bg-[#16291e] dark:hover:text-emerald-300"
              }`}
              style={{ animationDelay: `${i * 60 + 300}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <a.icon className="w-4 h-4 text-gray-400 group-hover:text-[#1b3b2b] dark:group-hover:text-emerald-300 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="truncate">{a.text}</span>
              </div>
              {isLocked && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-900 dark:text-amber-300 shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 px-2 py-0.5 rounded-md">
                  <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                  <span>Locked</span>
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
