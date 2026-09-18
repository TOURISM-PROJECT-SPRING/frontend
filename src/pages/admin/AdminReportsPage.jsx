import AdminLoading from "../../components/admin/AdminLoading";
import { DollarSign, BedDouble, Star, TrendingUp, RefreshCw, Download } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";
import { useToast } from "../../components/ui/Toast";

const money = (v) =>
  `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function AdminReportsPage() {
  const toast = useToast();
  const { data, loading, refresh } = useDashboardData();

  if (loading) return <AdminLoading message="Loading reports from the server..." />;

  const handleExport = () => {
    const d = data || {};
    const rows = [];
    rows.push(["Report", "Value"]);
    rows.push(["Total Revenue", d.revenueText || money(d.totalRevenue)]);
    rows.push(["Total Bookings", d.totalBookings || 0]);
    rows.push(["Total Users", d.totalUsers || 0]);
    rows.push(["Avg. Rating", d.avgRating || "—"]);
    rows.push(["Occupancy Rate", d.occupancyRate != null ? `${d.occupancyRate}%` : "—"]);
    rows.push([]);
    (d.topProperties || []).forEach((p) => rows.push(["Top Property", `${p.rank}. ${p.name} — ${p.bookings} bookings — ${p.revenueText || "$0"}`]));
    rows.push([]);
    (d.topPlaces || []).forEach((p) => rows.push(["Top Place", `${p.rank}. ${p.name} — ${p.rating ? `★${p.rating}` : "no rating"} — ${p.bookings} bookings`]));
    rows.push([]);
    (d.bookingsByType || []).forEach((bt) => rows.push([`Bookings: ${bt.name}`, bt.value]));
    rows.push([]);
    (d.revenueByMonth || []).forEach((m) => rows.push([`Revenue: ${m.month}`, money(m.revenue)]));

    const csv = rows
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Report exported to CSV");
  };

  const handleRefresh = async () => {
    await refresh();
    toast.success("Report data refreshed");
  };

  const d = data || {};
  const totalChannel = d.totalChannel || 0;
  const months = d.revenueByMonth || [];
  const maxRevenue = Math.max(...months.map((m) => m.revenue || 0), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Platform-wide performance insights</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/15 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white">{d.revenueText || "$0"}</p><p className="text-xs text-gray-400 dark:text-gray-500">Total Revenue</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center"><BedDouble className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white">{(d.totalBookings || 0).toLocaleString()}</p><p className="text-xs text-gray-400 dark:text-gray-500">Total Bookings</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/15 rounded-lg flex items-center justify-center"><Star className="w-5 h-5 text-yellow-600" /></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white">{d.avgRating || "—"}</p><p className="text-xs text-gray-400 dark:text-gray-500">Avg. Rating</p></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/15 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-orange-600" /></div>
            <div><p className="text-lg font-bold text-gray-900 dark:text-white">{d.occupancyRate != null ? `${d.occupancyRate}%` : "—"}</p><p className="text-xs text-gray-400 dark:text-gray-500">Occupancy</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Bookings by Type</h3>
          <div className="space-y-4">
            {(d.bookingsByType || []).map((bt) => (
              <div key={bt.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-300">{bt.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bt.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${totalChannel ? (bt.value / totalChannel) * 100 : 0}%`, backgroundColor: bt.color || "#3b82f6" }} />
                </div>
              </div>
            ))}
            {(d.bookingsByType || []).length === 0 && <p className="text-sm text-gray-400">No booking data.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
          <div className="flex items-end gap-2 h-52">
            {months.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                <span className="text-[9px] text-gray-400">{money(m.revenue).replace(/\.00$/, "")}</span>
                <div className="w-full bg-primary/80 rounded-t-md" style={{ height: `${Math.max(((m.revenue || 0) / maxRevenue) * 80, 3)}%` }} />
                <span className="text-[10px] text-gray-400">{m.month}</span>
              </div>
            ))}
            {months.length === 0 && <p className="text-sm text-gray-400">No revenue data.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Properties by Revenue</h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Top 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  {["Rank", "Property", "Bookings", "Revenue", "Popularity"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(d.topProperties || []).map((p) => (
                  <tr key={p.name} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-5 py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${p.rank <= 3 ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{p.rank}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{(p.bookings || 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-primary">{p.revenueText || "$0"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${p.popularity || 0}%` }} /></div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">{p.popularity || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(d.topProperties || []).length === 0 && <div className="text-center py-10 text-sm text-gray-400">No property data.</div>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Places</h3>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Top 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  {["Rank", "Place", "Location", "Rating", "Bookings", "Revenue"].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(d.topPlaces || []).map((p) => (
                  <tr key={p.name} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-5 py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${p.rank <= 3 ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>{p.rank}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                    <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{p.location || "N/A"}</td>
                    <td className="px-5 py-3 text-sm text-yellow-500">{p.rating ? `★ ${Number(p.rating).toFixed(1)}` : "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{(p.bookings || 0).toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-primary">{p.revenueText || "$0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(d.topPlaces || []).length === 0 && <div className="text-center py-10 text-sm text-gray-400">No place data.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}