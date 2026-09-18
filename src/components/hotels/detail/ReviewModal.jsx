import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../ui/Icon";

// Lightweight but real review composer — submits an in-session guest review.
export default function ReviewModal({ open, onClose, author, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({
      id: `me-${Date.now()}`,
      author: author || "You",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      rating,
      text: (title.trim() ? `${title.trim()} — ` : "") + text.trim(),
    });
    setTitle("");
    setText("");
    setRating(5);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Write a review">
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="w-full max-w-md animate-scalein rounded-2xl border border-line bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-brand-800">Write a review</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="mt-4">
          <span className="text-sm font-semibold text-brand-800">Your rating</span>
          <div className="mt-1.5 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="p-0.5">
                <Icon name="star" size={26} className={(hover || rating) >= n ? "text-gold-400" : "text-line"} fill={(hover || rating) >= n ? "currentColor" : "none"} stroke={(hover || rating) >= n ? "none" : "currentColor"} />
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-brand-800">Summary (optional)</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lovely stay near the riverfront" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400" />
        </label>

        <label className="mt-3 block">
          <span className="text-sm font-semibold text-brand-800">Your review</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={4} placeholder="Tell other travelers about the room, staff, location…" className="mt-1.5 w-full resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm outline-none focus:border-brand-400" />
        </label>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50">Cancel</button>
          <button type="submit" disabled={!text.trim()} className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50">Submit review</button>
        </div>
      </form>
    </div>,
    document.body
  );
}
