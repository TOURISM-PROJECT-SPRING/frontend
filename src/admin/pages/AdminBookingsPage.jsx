import { useState } from "react";
import { Search } from "lucide-react";
import useDashboardData from "../hooks/useDashboardData";

const norm = (s) => String(s || "").toUpperCase();

const typeColors = {
  Room: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  Ticket: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const statusColors = {
  CONFIRMED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  COMPLETED: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  CANCELLED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const statusLabel = (s) => {
  const n = norm(s);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

export default function AdminBookingsPage() {
  const { data, loading } = useDashboardData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const bookings = data?.allBookings || [];

  const filtered = bookings.filter((b) => {
    const guest = b.guest || "";
    const property = b.property || "";
    const id = String(b.id || "");
    const matchSearch = `${guest} ${property} ${id}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || norm(b.status) === norm(filterStatus);
    return matchSearch && matchStatus;
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading bookings from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All reservations across rooms, tickets, and food</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by guest, property, or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-3.5 font-mono font-semibold text-primary">{b.id}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[b.type] || "bg-gray-100 text-gray-600"}`}>{b.type || "N/A"}</span></td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{b.guest || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{b.property || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{b.date || "N/A"}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{b.amount || "$0"}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[norm(b.status)] || "bg-gray-100 text-gray-600"}`}>{statusLabel(b.status)}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}