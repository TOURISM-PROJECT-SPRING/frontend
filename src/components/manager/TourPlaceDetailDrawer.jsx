import { useEffect } from "react";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatusBadge from "./StatusBadge";

export default function TourPlaceDetailDrawer({ place, onClose, onEdit, onDelete }) {
  useEffect(() => {
    if (!place) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [place, onClose]);

  if (!place) return null;
  const rating = place.rating != null && place.rating !== "—" ? Number(place.rating).toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-lift animate-rise sm:rounded-l-[24px]">
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
          <SmartImage src={place._image} alt={place.name} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-brand-800 shadow-sm backdrop-blur transition-colors hover:bg-white"
          >
            <Icon name="x" size={20} />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur">
                {place.category}
              </span>
              <span className="rounded-full bg-white/90 px-1 py-0.5 backdrop-blur">
                <StatusBadge status={place.status} />
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-sm font-bold text-brand-900 shadow-md">
              <Icon name="star" size={14} fill="currentColor" stroke="none" />
              {rating ?? "—"}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6 p-6 sm:p-7">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight text-brand-800">{place.name}</h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <Icon name="map-pin" size={15} className="text-brand-400" />
              {place.district}
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-line bg-canvas p-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Category</p>
              <p className="mt-0.5 text-sm font-semibold text-brand-800">{place.category}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">District</p>
              <p className="mt-0.5 text-sm font-semibold text-brand-800">{place.district}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Status</p>
              <p className="mt-0.5">
                <StatusBadge status={place.status} />
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-1 font-display text-base font-bold text-brand-800">About this place</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              {place.description || "No description yet — add one to help travelers discover this destination."}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line p-5 sm:p-6">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-danger/25 px-4 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
          >
            <Icon name="trash" size={16} /> Delete
          </button>
          <div className="flex flex-1 justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-4 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
            >
              <Icon name="pencil" size={16} /> Edit
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}