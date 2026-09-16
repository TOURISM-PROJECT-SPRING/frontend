import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const typeConfig = {
  promotion: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  booking: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  system: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
};

const typeColor = (type) => typeConfig[norm(type)] || typeConfig.system;

const typeLabel = (t) => {
  const n = norm(t);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return iso.slice(0, 10);
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getNotifications();
        setNotifications(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = notifications
    .filter((n) => readFilter === "All" || (readFilter === "Unread" ? !n.isRead : n.isRead))
    .filter((n) => `${n.title || ""} ${n.message || ""}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading notifications from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">System notifications and alerts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by title or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Unread", "Read"].map((s) => (
            <button
              key={s}
              onClick={() => setReadFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${readFilter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Message</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!n.isRead ? "bg-primary/[0.02]" : ""}`}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${typeColor(n.type)}`}>{typeLabel(n.type)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${!n.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{n.title || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{n.userName || "N/A"}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400">{formatWhen(n.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`block w-2 h-2 rounded-full ${n.isRead ? "bg-gray-300" : "bg-primary"}`} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No notifications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}