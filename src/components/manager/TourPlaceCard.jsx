import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatusBadge from "./StatusBadge";

export default function TourPlaceCard({ place, onView, onEdit, onDelete }) {
  const rating = place.rating != null && place.rating !== "—" ? Number(place.rating).toFixed(1) : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <button
        type="button"
        onClick={onView}
        className="relative block w-full cursor-pointer overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
        aria-label={`View ${place.name}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <SmartImage
            src={place._image}
            alt={place.name}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur">
              {place.category}
            </span>
            <span className="rounded-full bg-white/90 px-1 py-0.5 backdrop-blur">
              <StatusBadge status={place.status} />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-950/50 to-transparent" />
        </div>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <button
          type="button"
          onClick={onView}
          className="cursor-pointer text-left focus-visible:outline-none"
        >
          <h3 className="font-display text-lg font-bold leading-snug text-brand-800 transition-colors group-hover:text-brand-700">
            {place.name}
          </h3>
        </button>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <Icon name="map-pin" size={13} className="shrink-0 text-brand-400" />
          <span className="truncate">{place.district}</span>
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800">
            <Icon name="star" size={14} className="text-gold-400" fill="currentColor" stroke="none" />
            {rating ?? "—"}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={onEdit}
              title="Edit"
              aria-label="Edit"
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-brand-700 transition-colors hover:bg-brand-50"
            >
              <Icon name="pencil" size={15} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Delete"
              aria-label="Delete"
              className="grid h-8 w-8 place-items-center rounded-lg border border-line text-danger transition-colors hover:border-danger/30 hover:bg-danger/10"
            >
              <Icon name="trash" size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}