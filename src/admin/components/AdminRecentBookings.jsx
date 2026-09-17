import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import useDashboardData from "../hooks/useDashboardData";

const statusStyle = {
  CONFIRMED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  COMPLETED: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  CANCELLED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const typeStyle = {
  Room: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Ticket: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Food: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

export default function AdminRecentBookings() {
  const { data } = useDashboardData();
  const bookings = (data?.allBookings || []).slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-200">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
        <Link to="/admin/bookings" className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800">
              {["ID", "Type", "Customer", "Date", "Amount", "Status"].map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-2.5 text-[13px] font-medium text-gray-900 dark:text-white">{b.id}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${typeStyle[b.type] || typeStyle.Room}`}>{b.type}</span>
                </td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300">{b.guest}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-500 dark:text-gray-400">{b.date}</td>
                <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900 dark:text-white">{b.amount}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle[b.status] || statusStyle.PENDING}`}>{b.status}</span>
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