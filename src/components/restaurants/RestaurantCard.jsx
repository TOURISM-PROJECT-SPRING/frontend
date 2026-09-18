import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import RatingDots from "../hotels/RatingDots";
import RestaurantCarousel from "./RestaurantCarousel";
import RestaurantMeta from "./RestaurantMeta";
import ReviewExcerpt from "./ReviewExcerpt";
import AwardBadge from "./AwardBadge";

// Horizontal result row: square photo | editorial info column. Collapses to a
// stacked (image-on-top) layout below the sm breakpoint. No card chrome — just
// whitespace, per the reference.
export default function RestaurantCard({
  restaurant: r,
  favorite,
  onToggleFavorite,
  highlighted = false,
}) {
  return (
    <article
      id={`rest-${r.id}`}
      className={`group flex scroll-mt-[132px] flex-col gap-5 border-b border-line pb-9 sm:flex-row sm:gap-6 ${
        highlighted ? "rounded-2xl ring-2 ring-brand-500 ring-offset-4" : ""
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl sm:aspect-square sm:w-[300px] lg:w-[350px]">
        <RestaurantCarousel images={r.images} alt={r.name} />

        <button
          type="button"
          onClick={() => onToggleFavorite?.(r)}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-white text-rose-500" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={19} fill={favorite ? "currentColor" : "none"} />
        </button>

        <AwardBadge award={r.award} />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <Link to={r.href}>
            <h3 className="font-display text-[21px] font-bold leading-tight text-brand-700 decoration-brand-300 underline-offset-4 transition hover:underline lg:text-2xl">
              {r.rank != null && <span className="text-brand-700">{r.rank}. </span>}
              {r.name}
            </h3>
          </Link>
          {r.location && (
            <p className="mt-0.5 flex items-center gap-1 text-[13px] font-medium text-muted">
              <Icon name="map-pin" size={13} className="shrink-0 text-brand-500" />
              <span className="truncate">{r.location}, Cambodia</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-bold text-ink">{r.rating.toFixed(1)}</span>
          <RatingDots rating={r.rating} size={9} />
          <Link
            to={`${r.href}#reviews`}
            className="text-[15px] font-medium text-ink underline decoration-1 underline-offset-2 transition hover:text-brand-700"
          >
            ({r.reviews.toLocaleString("en-US")} reviews)
          </Link>
        </div>

        <RestaurantMeta restaurant={r} />

        {r.hasMenu && (
          <Link
            to={`${r.href}#menu`}
            className="mt-0.5 inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold text-brand-700 transition hover:text-brand-900"
          >
            <Icon name="menu" size={16} className="text-brand-600" />
            Menu
          </Link>
        )}

        <div className="mt-1 flex flex-col gap-1">
          {r.excerpts?.slice(0, 2).map((e, i) => (
            <ReviewExcerpt key={i} text={e} />
          ))}
        </div>

        {r.sponsored && (
          <span className="mt-2 inline-flex w-fit items-center rounded-md bg-gray-100 px-2.5 py-1 text-[13px] font-medium text-gray-500">
            Sponsored
          </span>
        )}
      </div>
    </article>
  );
}
