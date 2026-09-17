import Icon from "../../ui/Icon";
import RestaurantRating from "./RestaurantRating";
import ActionButtons from "./ActionButtons";

// Restaurant title block: name + Claimed, actions, rating row, ranking, cuisine.
export default function RestaurantHeader({
  restaurant: r,
  favorite,
  onToggleFavorite,
  onReview,
  onJumpReviews,
}) {
  return (
    <header className="mt-4 sm:mt-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="font-display text-[32px] font-bold leading-[1.1] tracking-tight text-brand-900 sm:text-5xl lg:text-[52px]">
              {r.title}
            </h1>
            {r.claimed && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700" title="This business is claimed by its owner">
                <Icon name="badge-check" size={18} className="text-success" />
                Claimed
              </span>
            )}
          </div>

          <div className="mt-3">
            <RestaurantRating rating={r.rating} reviews={r.reviews} onReviewsClick={onJumpReviews} />
          </div>

          {r.ranking != null && r.totalRestaurantsInCity != null && (
            <p className="mt-2 text-[15px] font-medium text-ink/80">
              <button
                type="button"
                onClick={onJumpReviews}
                className="underline decoration-brand-200 underline-offset-4 transition hover:text-brand-700 hover:decoration-brand-400"
              >
                #{r.ranking} of {r.totalRestaurantsInCity.toLocaleString("en-US")} Restaurants in {r.city}
              </button>
            </p>
          )}

          {r.cuisineLabel && (
            <p className="mt-1.5 text-[15px] font-medium text-ink/80">
              <span className="cursor-pointer underline decoration-brand-200 underline-offset-4 transition hover:text-brand-700 hover:decoration-brand-400">
                {r.cuisineLabel}
              </span>
            </p>
          )}
        </div>

        <ActionButtons favorite={favorite} onSave={onToggleFavorite} onReview={onReview} className="lg:justify-end" />
      </div>
    </header>
  );
}
