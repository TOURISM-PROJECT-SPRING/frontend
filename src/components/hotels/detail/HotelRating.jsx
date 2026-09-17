import RatingDots from "../RatingDots";

// "4.8 ● ● ● ● ● (999 reviews)" — the review count is a clickable jump-to-reviews.
export default function HotelRating({ rating, reviews, onReviewsClick, className = "", dotsClassName = "" }) {
  const r = Number(rating);
  if (Number.isNaN(r)) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-lg font-bold text-brand-800">{r.toFixed(1)}</span>
      <RatingDots rating={r} size={9} className={dotsClassName} />
      {reviews != null && (
        <button
          type="button"
          onClick={onReviewsClick}
          className="text-sm font-medium text-muted underline decoration-brand-200 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-400"
        >
          ({Number(reviews).toLocaleString("en-US")} reviews)
        </button>
      )}
    </div>
  );
}
