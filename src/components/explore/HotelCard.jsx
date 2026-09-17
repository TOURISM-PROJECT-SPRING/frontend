import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

export default function HotelCard({ hotel, favorite, onFavorite }) {
  const price = hotel.price != null ? money(hotel.price) : null;
  const originalPrice = hotel.originalPrice != null ? money(hotel.originalPrice) : null;
  const href = hotel.href || `/hotels/${hotel.id}`;
  const starCount = hotel.stars || 4;

  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Link to={href} className="block h-full w-full">
          <SmartImage
            src={hotel.image}
            alt={hotel.title}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Location Badge */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-950/75 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-2xs">
          <Icon name="map-pin" size={11} className="text-gold-400" />
          <span>{hotel.location || hotel.province || "Siem Reap"}</span>
        </span>

        {/* Floating Heart / Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite?.(hotel);
          }}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-white text-rose-500" : "bg-white/90 text-brand-900 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title & Star Rating */}
        <Link to={href} className="block group-hover:text-brand-700 transition-colors">
          <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-brand-950 sm:text-base">
            {hotel.title}
          </h3>
        </Link>

        {/* Rating Score Badge & Review Count */}
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center rounded-md bg-brand-700 px-1.5 py-0.5 font-bold text-white text-[11px]">
              {hotel.rating || "4.8"}
            </span>
            <span className="text-xs font-semibold text-brand-800">
              {hotel.rating >= 4.7 ? "Excellent" : "Very Good"}
            </span>
            <span className="text-[11px] text-muted">
              ({hotel.reviewsCount || "84"} reviews)
            </span>
          </div>

          <div className="flex items-center text-gold-400">
            {Array.from({ length: starCount }).map((_, i) => (
              <span key={i} className="text-xs">★</span>
            ))}
          </div>
        </div>

        {/* Pricing Info Footer */}
        <div className="mt-auto border-t border-line/60 pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Per night</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-base font-black text-brand-900">{price || "$65"}</span>
              {originalPrice && (
                <span className="text-xs text-muted/70 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>

          <Link
            to={href}
            className="inline-flex items-center gap-1 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-700 hover:text-white"
          >
            <span>View</span>
            <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}