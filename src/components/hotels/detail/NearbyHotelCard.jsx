import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import SmartImage from "../../ui/SmartImage";
import RatingDots from "../RatingDots";
import AwardBadge from "./AwardBadge";
import { money } from "../../../lib/format";

// Compact horizontal-card used in the "You may also like" carousel.
export default function NearbyHotelCard({ hotel: h, favorite, onToggleFavorite }) {
  if (!h) return null;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative">
        <Link to={h.href} aria-label={h.name} className="block overflow-hidden">
          <SmartImage
            src={h.image}
            alt={h.name}
            ratio="4 / 3"
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(h)}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-danger text-white" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
        {h.badge && (
          <AwardBadge award={h.badge} className="absolute bottom-3 left-3" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link to={h.href}>
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-brand-900 decoration-brand-300 underline-offset-4 transition group-hover:underline">
            {h.name}
          </h3>
        </Link>
        <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
          <Icon name="map-pin" size={12} className="shrink-0 text-brand-500" />
          <span className="truncate">{h.location}, Cambodia</span>
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-sm font-bold text-success">{Number(h.rating).toFixed(1)}</span>
          <RatingDots rating={h.rating} size={7} />
          <span className="text-[12px] text-muted">({Number(h.reviews).toLocaleString("en-US")})</span>
        </div>
        <div className="mt-auto pt-3">
          <p className="text-sm text-muted">
            From <span className="font-display text-lg font-bold text-brand-800">{money(h.price)}</span>
          </p>
          <Link
            to={h.href}
            className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-brand-300 bg-white text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
          >
            View hotel
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
