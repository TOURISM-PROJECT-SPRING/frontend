import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const statusColors = {
  ACTIVE: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  INACTIVE: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  EXPIRED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const statusColor = (status) => statusColors[norm(status)] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";

const statusLabel = (s) => {
  const n = norm(s);
  if (n === "ACTIVE") return "Active";
  if (n === "INACTIVE") return "Inactive";
  if (n === "EXPIRED") return "Expired";
  return s || "N/A";
};

const discountText = (p) =>
  norm(p.discountType) === "PERCENT" ? `${p.discountValue}% OFF` : p.discountType === "FIXED" ? `$${p.discountValue} OFF` : `$${p.discountValue} OFF`;

const discountBadge = (p) =>
  norm(p.discountType) === "PERCENT"
    ? "bg-primary/5 text-primary"
    : "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400";

const targetOf = (p) => p.hotelName || p.restaurantName || p.tourPackageName || "N/A";

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getPromotions();
        setPromotions(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statuses = [...new Set(promotions.map((p) => p.status).filter(Boolean))];

  const filtered = promotions.filter((p) => {
    const name = p.name || "";
    const code = p.code || "";
    const matchSearch = `${name} ${code}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(p.status) === norm(filter);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading promotions from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Discount codes and special offers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Code</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Discount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Target</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date Range</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">{p.code || "N/A"}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${discountBadge(p)}`}>{discountText(p)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{targetOf(p)}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400">
                    {p.startAt ? p.startAt.slice(0, 10) : "—"} to {p.endAt ? p.endAt.slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(p.status)}`}>{statusLabel(p.status)}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No promotions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}