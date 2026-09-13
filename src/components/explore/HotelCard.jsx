import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import { money } from "../../lib/format";

export default function HotelCard({ hotel, onSelect, onAdd, labelled = false }) {
  const price = hotel.price != null ? money(hotel.price) : null;
  const roomsAvailable = Array.isArray(hotel.rooms)
    ? hotel.rooms.reduce((n, r) => n + (Number(r.total) || 0), 0)
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <button
        type="button"
        onClick={() => onSelect(hotel)}
        className="relative block w-full text-left"
        aria-label={`View ${hotel.title}`}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <SmartImage
            src={hotel.image}
            alt={hotel.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {hotel.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur">
              {hotel.badge}
            </span>
          )}
        </div>
      </button>

      {labelled && (
        <span className="inline-flex items-center gap-1.5 self-start rounded-br-xl bg-brand-700 px-3 py-1.5 text-[11px] font-bold text-gold-400">
          <Icon name="check-circle" size={12} />
          Recommended for your tour
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-brand-800">{hotel.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Icon name="map-pin" size={14} className="shrink-0 text-brand-400" />
          {hotel.location || hotel.province || "Cambodia"}
        </p>
        {hotel.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{hotel.description}</p>}

        <div className="mt-3 flex items-center gap-3">
          {hotel.rating != null && <Rating value={hotel.rating} size="sm" />}
          {roomsAvailable != null && (
            <span className="flex items-center gap-1 text-xs font-semibold text-muted">
              <Icon name="bed" size={13} className="text-brand-400" /> {roomsAvailable} rooms open
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            {price ? (
              <p className="font-display text-xl font-bold text-brand-700">
                {price}
                <span className="text-xs font-medium text-muted"> {hotel.priceUnit}</span>
              </p>
            ) : (
              <p className="text-sm font-semibold text-brand-700">View rates</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelect(hotel)}
              className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-brand-700 transition-colors duration-500 ease-out hover:bg-brand-50"
            >
              Rooms
            </button>
            <button
              type="button"
              onClick={() => onAdd(hotel)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400 px-3 py-2 text-xs font-bold text-brand-900 transition-colors duration-500 ease-out hover:bg-gold-300"
            >
              <Icon name="plus" size={14} />
              Add hotel
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}