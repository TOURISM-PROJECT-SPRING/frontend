import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

const rankColors = {
  1: "bg-[#f4b938] text-gray-950 font-black shadow-xs",
  2: "bg-[#edf5f0] text-[#1b3b2b] dark:bg-[#16291e] dark:text-emerald-300 font-bold border border-[#1b3b2b]/20",
  3: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-bold",
};

export default function TopPropertiesTable() {
  const { data } = useDashboardData();
  const properties = data?.topProperties || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-150">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Top Properties</h3>
        <Link to="/owner/properties" className="text-xs font-bold text-[#1b3b2b] dark:text-emerald-400 hover:text-[#12281e] flex items-center gap-1 transition">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800">
              {["#", "Property", "Bookings", "Revenue", "Popularity"].map((h) => (
                <th key={h} className={`text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2.5 ${h === "Bookings" ? "hidden md:table-cell" : ""} ${h === "Revenue" ? "hidden lg:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.rank} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-[#edf5f0]/40 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-2.5">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] ${rankColors[p.rank] || "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500 font-semibold"}`}>
                    {p.rank}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[13px] font-bold text-gray-900 dark:text-white">{p.name}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 hidden md:table-cell font-medium">{p.bookings}</td>
                <td className="px-4 py-2.5 text-[13px] font-bold text-gray-900 dark:text-white hidden lg:table-cell">{p.revenueText}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${p.popularity >= 70 ? "bg-[#1b3b2b] dark:bg-emerald-400" : p.popularity >= 50 ? "bg-[#f4b938]" : "bg-amber-600"}`}
                        style={{ width: `${p.popularity}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{p.popularity}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!properties.length && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No room bookings yet.</div>
        )}
      </div>
    </div>
  );
}