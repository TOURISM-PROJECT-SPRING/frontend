import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import RatingDots from "./RatingDots";
import AmenityList from "./AmenityList";
import { money } from "../../lib/format";
import { PROPERTY_TYPES } from "../../data/hotels";

// Horizontal result card: image | info | price column.
// Collapses to vertical (image on top) below the sm breakpoint.
export default function HotelListingCard({ hotel: h, rank, favorite, onToggleFavorite }) {
  const price = h.price != null ? money(h.price) : null;
  const typeLabel = PROPERTY_TYPES.find((t) => t.key === h.propertyType)?.label;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-initial transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift sm:flex-row">
      {/* Image */}
      <Link to={h.href} aria-label={h.title} className="relative block shrink-0 overflow-hidden sm:w-[300px] lg:w-[330px]">
        <SmartImage
          src={h.image}
          alt={h.title}
          className="h-52 w-full sm:h-full"
          imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        {h.breakfastIncluded && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-brand-800 shadow-sm backdrop-blur-sm">
            Breakfast included
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(h);
          }}
          aria-label={favorite ? `Remove ${h.title} from favorites` : `Save ${h.title} to favorites`}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-danger text-white" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
        {(h.bestOfBest || h.travelersChoice) && (
          <span
            className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${
              h.bestOfBest ? "bg-gold-400 text-brand-900" : "bg-white/95 text-brand-800"
            }`}
          >
            <Icon name="award" size={12} />
            {h.bestOfBest ? "Best of the Best" : "Travelers' Choice"}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 lg:p-5">
        {h.bestValue && (
          <p className="text-xs font-bold text-gold-600">
            #{rank} Best Value stay in Cambodia
          </p>
        )}
        <div>
          <Link to={h.href}>
            <h3 className="font-display text-lg font-bold leading-snug text-brand-900 decoration-brand-300 underline-offset-4 transition group-hover:underline lg:text-xl">
              {h.title}
            </h3>
          </Link>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] font-medium text-muted">
            <Icon name="map-pin" size={13} className="shrink-0 text-brand-500" />
            <span className="truncate">{h.location || "Cambodia"}, Cambodia</span>
            {typeLabel && <span className="text-muted/60">· {typeLabel}</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-success">{h.rating.toFixed(1)}</span>
          <RatingDots rating={h.rating} size={7} />
          <span className="text-[13px] font-medium text-muted">({h.reviews.toLocaleString("en-US")} reviews)</span>
        </div>

        <AmenityList amenities={h.amenities} max={4} className="mt-auto pt-1" />
      </div>

      {/* Price column */}
      <div className="flex items-end justify-between gap-3 border-t border-line p-4 sm:w-52 sm:flex-col sm:items-stretch sm:justify-start sm:border-l sm:border-t-0 sm:p-5 lg:w-56">
        <div>
          <p className="text-right font-display text-2xl font-bold text-brand-900 sm:text-left">
            {price ?? "On request"}
            {price && <span className="text-sm font-semibold text-muted"> /night</span>}
          </p>
          <ul className="mt-3 hidden flex-col gap-1.5 sm:flex">
            {h.refundable && (
              <li className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <Icon name="check-circle" size={13} className="shrink-0" /> Fully refundable
              </li>
            )}
            {h.noPrepay && (
              <li className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <Icon name="wallet" size={13} className="shrink-0" /> No prepayment needed
              </li>
            )}
          </ul>
        </div>
        <Link
          to={h.href}
          className="mt-24 inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-green-700 px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-[#4ecd54] hover:shadow-md active:translate-y-0 sm:w-full"
        >
          View prices
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </article>
  );
}
