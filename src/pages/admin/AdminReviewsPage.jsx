import { useEffect, useState } from "react";
import { Search, Star } from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const targetTypeLabels = {
  TOUR_PLACE: "Place",
  HOTEL: "Hotel",
  RESTAURANT: "Restaurant",
  TOUR_PACKAGE: "Tour Package",
};

const targetTypeColors = {
  TOUR_PLACE: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  HOTEL: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  RESTAURANT: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  TOUR_PACKAGE: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getReviews();
        setReviews(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const targetTypes = Object.keys(targetTypeLabels);

  const filtered = reviews.filter((r) => {
    const user = r.userName || "";
    const target = r.targetName || "";
    const matchSearch = `${user} ${target}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(r.targetType) === norm(filter);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading reviews from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Customer reviews and ratings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by user or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...targetTypes].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === t ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {targetTypeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{r.userName || "Anonymous"}</h4>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{r.createdAt ? r.createdAt.slice(0, 10) : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${targetTypeColors[norm(r.targetType)] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                  {targetTypeLabels[norm(r.targetType)] || r.targetType || "N/A"}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= (r.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{r.comment || "No comment."}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{r.targetName || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No reviews found.</div>}
    </div>
  );
}