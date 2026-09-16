import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const verificationColors = {
  VERIFIED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
};

const verificationColor = (status) => verificationColors[norm(status)] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getOwners();
        setOwners(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching owners:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = owners.filter((o) => {
    const business = o.businessName || "";
    const owner = o.userName || "";
    return `${business} ${owner}`.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading owners from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Owners / Businesses</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Property owners and business accounts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by business or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Business</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">License No.</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Verification</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Verified At</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{o.businessName || "N/A"}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-600 dark:text-gray-300">{o.businessLicenseNo || "N/A"}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${verificationColor(o.verificationStatus)}`}>{o.verificationStatus || "N/A"}</span></td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{o.verifiedAt ? o.verifiedAt.slice(0, 10) : "—"}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{o.userName || "N/A"}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{o.userEmail || ""}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No owners found.</p></div>}
      </div>
    </div>
  );
}