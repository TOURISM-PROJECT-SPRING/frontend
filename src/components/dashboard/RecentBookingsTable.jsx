import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const bookings = [
  { id: "BK-2841", guest: "Sarah Johnson", property: "Green Park Resort", checkin: "Aug 26", amount: "$320", status: "Confirmed" },
  { id: "BK-2840", guest: "Michael Chen", property: "Paradise Hotel", checkin: "Aug 27", amount: "$185", status: "Pending" },
  { id: "BK-2839", guest: "Emma Williams", property: "Angkor Wat Villa", checkin: "Aug 25", amount: "$450", status: "Confirmed" },
  { id: "BK-2838", guest: "David Kim", property: "Riverside Lodge", checkin: "Aug 24", amount: "$210", status: "Completed" },
  { id: "BK-2837", guest: "Lisa Anderson", property: "Green Park Resort", checkin: "Aug 23", amount: "$320", status: "Completed" },
];

const statusStyle = {
  Confirmed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Completed: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
};

export default function RecentBookingsTable() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-fade-in-up delay-100">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
        <Link to="/owner/bookings" className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition">
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-800">
              {["ID", "Guest", "Property", "Check-in", "Amount", "Status"].map((h) => (
                <th key={h} className={`text-left text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-2.5 ${h === "Property" ? "hidden lg:table-cell" : ""} ${h === "Check-in" ? "hidden md:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                <td className="px-4 py-2.5 text-[13px] font-medium text-gray-900 dark:text-white">{b.id}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300">{b.guest}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 hidden lg:table-cell">{b.property}</td>
                <td className="px-4 py-2.5 text-[13px] text-gray-500 dark:text-gray-400 hidden md:table-cell">{b.checkin}</td>
                <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900 dark:text-white">{b.amount}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle[b.status]}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
