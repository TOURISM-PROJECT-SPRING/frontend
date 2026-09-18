import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Info, RefreshCw, Download } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const levelConfig = {
  INFO: { icon: Info, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
};

const formatTimestamp = (iso) => String(iso || "").replace("T", " ").slice(0, 19);

export default function AdminLogsPage() {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchLogs = async () => {
    try {
      const notifications = await managementService.getNotifications();
      setLogs(
        (notifications || []).map((n) => ({
          id: n.id,
          timestamp: n.createdAt,
          level: "INFO",
          module: String(n.type || "").toUpperCase(),
          action: n.title,
          details: n.message,
          actor: n.userName || "-",
        }))
      );
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchLogs();
    toast.success("Logs refreshed");
  };

  const handleExport = () => {
    const headers = ["Timestamp", "Level", "Module", "Action", "Details", "Actor"];
    const rows = filtered.map((l) =>
      [l.timestamp, l.level, l.module, l.action, l.details, l.actor]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Logs exported to CSV");
  };

  const filtered = logs
    .filter((l) => String(l.action || "").toLowerCase().includes(search.toLowerCase()) || String(l.module || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <AdminLoading message="Loading logs from the server..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
            <TotalBadge count={logs.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">System activity and audit trail</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by action or module..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Timestamp", "Level", "Module", "Action", "Details", "Actor"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((l) => {
                const cfg = levelConfig[l.level] || levelConfig.INFO;
                const Icon = cfg.icon;
                return (
                  <tr key={l.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">{formatTimestamp(l.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {l.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{l.module || "N/A"}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{l.action || "N/A"}</td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{l.details || "N/A"}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 font-mono">{l.actor}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No log entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <AdminPagination currentPage={currentPage} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} itemLabel="log entries" />
        )}
      </div>
    </div>
  );
}