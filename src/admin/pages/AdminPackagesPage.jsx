import { useEffect, useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { managementService } from "../../services/managementService";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getTourPackages();
        setPackages(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = packages.filter((p) => {
    const name = p.name || "";
    const location = p.locationName || "";
    const guide = p.tourGuideName || "";
    return `${name} ${location} ${guide}`.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading packages from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tour Packages</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tour packages and experiences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{p.name || "N/A"}</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" /> {p.locationName || "N/A"}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 mb-3">{p.description || "No description."}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full">{p.durationDays} days</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full">Max {p.maxPeople} people</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
              <div>
                <p className="text-lg font-bold text-primary">${p.price}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Guide: {p.tourGuideName || "N/A"}</p>
              </div>
              <div className="text-right">
                {p.avgRating ? (
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{Number(p.avgRating).toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">({p.reviewCount || 0})</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">No reviews</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No packages found.</div>}
    </div>
  );
}