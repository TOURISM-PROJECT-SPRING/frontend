import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Trash2 } from "lucide-react";

const initialReviews = [
  { id: 1, guest: "Sarah Johnson", property: "Green Park Resort", rating: 5, date: "2026-08-25", comment: "Absolutely amazing stay! The staff were incredibly friendly and the facilities were top-notch. Will definitely come back again.", helpful: 12, replied: false },
  { id: 2, guest: "Michael Chen", property: "Paradise Hotel", rating: 4, date: "2026-08-22", comment: "Great location and clean rooms. The pool area was lovely. Only minor issue was slow WiFi.", helpful: 8, replied: true },
  { id: 3, guest: "Emma Wilson", property: "Angkor Wat Villa", rating: 5, date: "2026-08-20", comment: "Perfect private villa experience! The view from the terrace was breathtaking. Highly recommend for couples.", helpful: 15, replied: false },
  { id: 4, guest: "James Park", property: "Riverside Lodge", rating: 3, date: "2026-08-18", comment: "Nice place but a bit far from the city center. Breakfast options were limited. Staff were helpful though.", helpful: 5, replied: false },
  { id: 5, guest: "Lisa Nguyen", property: "Green Park Resort", rating: 4, date: "2026-08-15", comment: "Comfortable rooms and great breakfast buffet. Would have liked a spa on-site.", helpful: 7, replied: true },
];

export default function OwnerReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [replyTarget, setReplyTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    pct: (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100,
  }));

  const handleReply = (e) => {
    e.preventDefault();
    const text = Object.fromEntries(new FormData(e.target)).reply;
    if (text) {
      setReviews((prev) => prev.map((r) => r.id === replyTarget.id ? { ...r, replied: true } : r));
      setReplyTarget(null);
    }
  };

  const handleDelete = () => {
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Guest feedback and ratings</p>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="text-center md:border-r md:border-gray-100 dark:border-gray-800 md:pr-8">
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{avg}</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avg)) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6 text-right">{d.stars} <Star className="w-3 h-3 inline text-yellow-400 fill-yellow-400" /></span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{r.guest}</h4>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">{r.property} · {r.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{r.comment}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-primary transition">
                <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({r.helpful})
              </button>
              {r.replied ? (
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/15 px-2 py-0.5 rounded">Replied</span>
              ) : (
                <button onClick={() => setReplyTarget(r)} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <MessageSquare className="w-3.5 h-3.5" /> Reply
                </button>
              )}
              <button onClick={() => setDeleteTarget(r)} className="ml-auto p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReplyTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reply to {replyTarget.guest}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{replyTarget.comment}</p>
            <form onSubmit={handleReply} className="mt-4">
              <textarea name="reply" rows={4} required placeholder="Write your reply..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setReplyTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Send Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/15 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Review</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Delete this review from <strong>{deleteTarget.guest}</strong>?</p>
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
