import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

const statusStyle = {
  CONFIRMED: "bg-[#edf5f0] text-[#1b3b2b] dark:bg-[#16291e] dark:text-emerald-300 border border-[#1b3b2b]/20",
  PENDING: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/40",
  COMPLETED: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40",
};

export default function RecentBookingsTable() {
  const { data } = useDashboardData();
  const bookings = (data?.allBookings || []).slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-100">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recent Bookings</h3>
        <Link to="/owner/bookings" className="text-xs font-bold text-[#1b3b2b] dark:text-emerald-400 hover:text-[#12281e] flex items-center gap-1 transition">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800">
              {["ID", "Guest", "Property", "Date", "Amount", "Status"].map((h) => (
                <th key={h} className={`text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2.5 ${h === "Property" ? "hidden lg:table-cell" : ""} ${h === "Date" ? "hidden md:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-[#edf5f0]/40 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-2.5 text-[13px] font-medium text-gray-900 dark:text-white">
                  <span className="inline-flex items-center gap-1.5">
                    {b.id}
                    <span className="text-[9px] font-bold text-[#1b3b2b] dark:text-emerald-300 bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20 px-1.5 py-0.5 rounded-md">{b.type}</span>
                  </span>
                </td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 font-medium">{b.guest}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 hidden lg:table-cell">{b.property}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-500 dark:text-gray-400 hidden md:table-cell">{b.date}</td>
                <td className="px-4 py-2.5 text-[13px] font-bold text-gray-900 dark:text-white">{b.amount}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle[b.status] || statusStyle.PENDING}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!bookings.length && (
          <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}