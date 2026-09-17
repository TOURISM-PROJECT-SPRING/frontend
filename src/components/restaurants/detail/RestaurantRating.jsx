import Icon from "../../ui/Icon";
import RatingDots from "../../hotels/RatingDots";

// "★ 4.9 ● ● ● ● ● (1,259 reviews)" — review count is a clickable jump-to-reviews.
export default function RestaurantRating({ rating, reviews, onReviewsClick, className = "" }) {
  const r = Number(rating);
  if (Number.isNaN(r)) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Icon name="star" size={18} className="text-gold-400" fill="currentColor" stroke="none" />
      <span className="text-lg font-bold text-brand-900">{r.toFixed(1)}</span>
      <RatingDots rating={r} size={9} />
      {reviews != null && (
        <button
          type="button"
          onClick={onReviewsClick}
          className="text-[15px] font-medium text-ink/75 underline decoration-brand-200 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-400"
        >
          ({Number(reviews).toLocaleString("en-US")} reviews)
        </button>
      )}
    </div>
  );
}
