import { useState } from "react";
import { Search, AlertTriangle, Info, XCircle } from "lucide-react";

const levelConfig = {
  INFO: { icon: Info, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
  WARNING: { icon: AlertTriangle, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400" },
  ERROR: { icon: XCircle, color: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
};

const initialLogs = [
  { id: 1, timestamp: "2026-08-27 14:32:15", level: "INFO", module: "Auth", action: "User login", details: "Admin user 'admin@tourism.com' logged in successfully", ip: "192.168.1.45" },
  { id: 2, timestamp: "2026-08-27 14:28:03", level: "INFO", module: "Booking", action: "Booking created", details: "New booking #1234 for Angkor Wat Villa by user ID 582", ip: "10.0.0.23" },
  { id: 3, timestamp: "2026-08-27 14:15:42", level: "WARNING", module: "Payment", action: "Payment delay", details: "Payment gateway response exceeded 5s threshold for booking #1230", ip: "10.0.0.12" },
  { id: 4, timestamp: "2026-08-27 13:58:11", level: "ERROR", module: "System", action: "Service outage", details: "Email service unreachable - SMTP connection timed out after 3 retries", ip: "10.0.0.1" },
  { id: 5, timestamp: "2026-08-27 13:45:29", level: "INFO", module: "User", action: "User registered", details: "New user 'john.doe@email.com' registered via Google OAuth", ip: "172.16.0.88" },
  { id: 6, timestamp: "2026-08-27 13:30:55", level: "WARNING", module: "Auth", action: "Failed login", details: "3 failed login attempts for 'admin@tourism.com' from IP 45.33.12.98", ip: "45.33.12.98" },
  { id: 7, timestamp: "2026-08-27 12:18:40", level: "INFO", module: "Booking", action: "Booking cancelled", details: "Booking #1215 cancelled by user. Refund of $320 initiated.", ip: "10.0.0.45" },
  { id: 8, timestamp: "2026-08-27 11:52:08", level: "ERROR", module: "Payment", action: "Payment failed", details: "Payment processing failed for booking #1228 - insufficient funds", ip: "10.0.0.12" },
  { id: 9, timestamp: "2026-08-27 10:40:33", level: "INFO", module: "System", action: "Backup completed", details: "Daily database backup completed successfully. Size: 2.4GB", ip: "10.0.0.1" },
  { id: 10, timestamp: "2026-08-27 09:15:22", level: "WARNING", module: "System", action: "High CPU usage", details: "CPU usage exceeded 85% threshold on web-server-02 for 15 minutes", ip: "10.0.0.5" },
];

export default function AdminLogsPage() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");

  const filtered = logs
    .filter((l) => levelFilter === "All" || l.level === levelFilter)
    .filter((l) => l.action.toLowerCase().includes(search.toLowerCase()) || l.module.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Monitor system activity and audit trail</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by action or module..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        {["All", "INFO", "WARNING", "ERROR"].map((l) => (
          <button key={l} onClick={() => setLevelFilter(l)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${levelFilter === l ? (l === "ERROR" ? "bg-red-500 text-white" : l === "WARNING" ? "bg-yellow-500 text-white dark:bg-yellow-500/15 dark:text-yellow-400" : l === "INFO" ? "bg-blue-500 text-white" : "bg-primary text-white") : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{l}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Timestamp", "Level", "Module", "Action", "Details", "IP Address"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const cfg = levelConfig[l.level];
                const Icon = cfg.icon;
                return (
                  <tr key={l.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap">{l.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {l.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{l.module}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{l.action}</td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate">{l.details}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 font-mono">{l.ip}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No log entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">Showing 1-{filtered.length} of {logs.length} entries</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition">2</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition">3</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
