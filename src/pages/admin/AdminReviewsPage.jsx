import { useState } from "react";
import { Search, Star, MessageSquare, EyeOff, Eye, Flag, Trash2 } from "lucide-react";

const statusColors = {
  Published: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Hidden: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500",
  Flagged: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const initialReviews = [
  { id: 1, customer: "Sarah Johnson", avatar: "SJ", property: "Green Park Resort", rating: 5, comment: "Absolutely amazing stay! The staff were incredibly friendly and the facilities were top-notch. Will definitely come back again.", date: "2026-08-25", status: "Published", reply: "" },
  { id: 2, customer: "Michael Chen", avatar: "MC", property: "Paradise Hotel", rating: 4, comment: "Great location and clean rooms. The pool area was lovely. Only minor issue was slow WiFi in the evenings.", date: "2026-08-22", status: "Published", reply: "Thank you for your feedback! We are working on improving our WiFi coverage." },
  { id: 3, customer: "Emma Wilson", avatar: "EW", property: "Angkor Wat Villa", rating: 5, comment: "Perfect private villa experience! The view from the terrace was breathtaking. Highly recommend for couples.", date: "2026-08-20", status: "Published", reply: "" },
  { id: 4, customer: "James Park", avatar: "JP", property: "Riverside Lodge", rating: 2, comment: "Disappointing experience. Room was not clean upon arrival and the AC was broken. Staff took too long to respond.", date: "2026-08-18", status: "Flagged", reply: "" },
  { id: 5, customer: "Lisa Nguyen", avatar: "LN", property: "Green Park Resort", rating: 4, comment: "Comfortable rooms and great breakfast buffet. Would have liked a spa on-site. Overall a pleasant stay.", date: "2026-08-15", status: "Hidden", reply: "We appreciate your stay and feedback about our spa!" },
  { id: 6, customer: "Tom Brown", avatar: "TB", property: "Koh Rong Beach Resort", rating: 3, comment: "Beautiful beach but the resort needs some maintenance. Food was average for the price paid.", date: "2026-08-12", status: "Published", reply: "" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [replyTarget, setReplyTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = reviews.filter((r) => {
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase()) || r.property.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const totalPublished = reviews.filter((r) => r.status === "Published").length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    pct: (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  const handleReply = (e) => {
    e.preventDefault();
    const text = Object.fromEntries(new FormData(e.target)).reply;
    if (text) {
      setReviews((prev) => prev.map((r) => r.id === replyTarget.id ? { ...r, reply: text } : r));
      setReplyTarget(null);
    }
  };

  const toggleHide = (review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status: r.status === "Hidden" ? "Published" : "Hidden" } : r));
  };

  const toggleFlag = (review) => {
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, status: r.status === "Flagged" ? "Published" : "Flagged" } : r));
  };

  const handleDelete = () => {
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage customer reviews and ratings</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="text-center md:border-r md:border-gray-100 dark:border-gray-800 md:pr-8">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{avg}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avg)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{reviews.length} reviews · {totalPublished} published</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6 text-right">{d.stars} <Star className="w-3 h-3 inline text-yellow-400 fill-yellow-400" /></span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by customer or property..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Published", "Hidden", "Flagged"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{r.avatar}</div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{r.customer}</h4>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">{r.property} · {r.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[r.status]}`}>{r.status}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{r.comment}</p>
            {r.reply && (
              <div className="bg-primary/5 rounded-lg p-3 mb-3">
                <p className="text-[11px] font-bold text-primary mb-1">Owner Reply</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{r.reply}</p>
              </div>
            )}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
              {!r.reply && (
                <button onClick={() => setReplyTarget(r)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
                  <MessageSquare className="w-3.5 h-3.5" /> Reply
                </button>
              )}
              <button onClick={() => toggleHide(r)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                {r.status === "Hidden" ? <><Eye className="w-3.5 h-3.5" /> Show</> : <><EyeOff className="w-3.5 h-3.5" /> Hide</>}
              </button>
              <button onClick={() => toggleFlag(r)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${r.status === "Flagged" ? "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600" : "text-red-600 bg-red-50 hover:bg-red-100"}`}>
                <Flag className="w-3.5 h-3.5" /> {r.status === "Flagged" ? "Unflag" : "Flag"}
              </button>
              <button onClick={() => setDeleteTarget(r)} className="ml-auto p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No reviews found.</div>}

      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReplyTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to {replyTarget.customer}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{replyTarget.comment}</p>
            <form onSubmit={handleReply} className="mt-4">
              <textarea name="reply" rows={4} required defaultValue={replyTarget.reply || ""} placeholder="Write your reply..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setReplyTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{replyTarget.reply ? "Update Reply" : "Send Reply"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Review</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete this review from <strong>{deleteTarget.customer}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
