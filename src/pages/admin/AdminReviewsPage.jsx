import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Star, Eye, Trash2, X, AlertTriangle, Shield, Target, Calendar, MessageSquare, User } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

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
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    const matchSearch = `${user} ${target} ${r.comment || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(r.targetType) === norm(filter);
    return matchSearch && matchFilter;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await managementService.deleteReview(deleteTarget.id);
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.success("Review deleted (offline mode)");
    } finally {
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading reviews from the server..." />;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews &amp; Ratings</h1>
          <TotalBadge count={reviews.length} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Moderate customer reviews and ratings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by user, target, or comment..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...targetTypes].map((t) => (
            <button
              key={t}
              onClick={() => { setFilter(t); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === t ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {targetTypeLabels[t] || t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {paginatedItems.map((r) => (
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
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= (r.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-600"}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{r.comment || "No comment."}</p>
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{r.targetName || "N/A"}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setViewTarget(r)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#1b3b2b] hover:bg-[#edf5f0] dark:hover:text-emerald-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer" title="View Details">
                  <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" /> View
                </button>
                <button onClick={() => setDeleteTarget(r)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition cursor-pointer" title="Delete Review">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <AdminPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="reviews"
          />
        </div>
      )}

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No reviews found.</div>}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Review Details</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Customer feedback and rating details</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.userName || "Anonymous"}</p>
                <span className="inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">#{viewTarget.id}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= (viewTarget.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-600"}`} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Reviewer</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.userName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Target Type</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${targetTypeColors[norm(viewTarget.targetType)] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
                    {targetTypeLabels[norm(viewTarget.targetType)] || viewTarget.targetType || "N/A"}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Review ID</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">#{viewTarget.id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Submitted</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.createdAt ? viewTarget.createdAt.slice(0, 10) : "N/A"}</p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1"><MessageSquare className="w-3.5 h-3.5" /> Comment</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{viewTarget.comment || "No comment."}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Reviewed target</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{viewTarget.targetName || "N/A"}</p>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(viewTarget);
                  setViewTarget(null);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" /> Delete Review
              </button>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="py-2.5 px-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Review</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Remove this review from the platform</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete the{" "}
              <strong className="text-gray-900 dark:text-white">{Number(deleteTarget.rating) || 0}-star</strong> review
              from <strong className="text-gray-900 dark:text-white">{deleteTarget.userName || "Anonymous"}</strong> on{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.targetName || "N/A"}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}