import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Star, Ticket } from "lucide-react";
import useDashboardData from "../hooks/useDashboardData";

const rankColors = {
  1: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  2: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

export default function AdminTopPlaces() {
  const { data } = useDashboardData();
  const places = data?.topPlaces || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-250">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Places</h3>
        <Link to="/admin/places" className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {places.map((p) => (
          <div key={p.rank} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 ${rankColors[p.rank] || "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"}`}>
              {p.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> {p.location || "—"}
                {p.rating != null && (
                  <span className="flex items-center gap-0.5 ml-1 text-yellow-500">
                    <Star className="w-2.5 h-2.5 fill-current" /> {p.rating}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
              <Ticket className="w-3 h-3" />
              {p.bookings}
            </div>
          </div>
        ))}
        {!places.length && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No ticket bookings yet.</div>
        )}
      </div>
    </div>
  );
}