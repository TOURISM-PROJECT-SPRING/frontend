import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

export default function TourCard({ tour, onFavorite, favorite }) {
  const price = tour.price != null ? money(tour.price) : null;
  const originalPrice = tour.originalPrice != null ? money(tour.originalPrice) : null;
  const href = tour.href || `/tours/${tour.id}`;
  
  // Render star ratings as small inline yellow stars
  const starCount = tour.stars || 4;

  return (
    <article className="group flex flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <Link to={href} className="block h-full w-full">
          <SmartImage
            src={tour.image}
            alt={tour.title}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Heart / Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite?.(tour);
          }}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full shadow transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-white text-danger" : "bg-white/90 text-slate-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Destination Sub-header */}
        <p className="text-[11px] text-slate-500">
          {tour.province || tour.location || "Siem Reap"}
        </p>

        {/* Title & Star Rating */}
        <Link to={href} className="mt-0.5">
          <h3 className="inline font-bold text-slate-900 text-sm leading-snug hover:underline">
            {tour.title}{" "}
          </h3>
          <span className="inline-flex items-center gap-0.5 align-middle">
            {Array.from({ length: starCount }).map((_, i) => (
              <span key={i} className="text-amber-400 text-xs">★</span>
            ))}
          </span>
        </Link>

        {/* Rating Score Badge & Review Count */}
        {tour.rating != null && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="rounded bg-blue-700 px-1.5 py-0.5 font-bold text-white text-[11px]">
              {tour.rating}/10
            </span>
            <span className="text-[11px] text-slate-500">
              {tour.reviewsCount || "139"} reviews
            </span>
          </div>
        )}

        {/* Pricing Info Footer */}
        <div className="mt-auto pt-4">
          {price ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-slate-900">From</span>
              <span className="text-sm font-bold text-slate-900">{price}</span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-900">Price on request</span>
          )}
        </div>
      </div>
    </article>
  );
}