import { useRef } from "react";
import Icon from "../../ui/Icon";
import RestaurantRating from "./RestaurantRating";
import RatingBar from "../../hotels/detail/RatingBar";
import ReviewCard from "../../hotels/detail/ReviewCard";

// "Why travelers love it" — rating summary + breakdown + review carousel.
export default function ReviewsSection({
  title = "",
  rating,
  reviews,
  ratingBreakdown = [],
  reviewList = [],
  onReviewsClick,
}) {
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };
  const verdict = rating >= 4.7 ? "Excellent" : rating >= 4.3 ? "Very good" : "Good";

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 id="reviews-heading" className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          Why travelers love {title}
        </h2>
        <RestaurantRating rating={rating} reviews={reviews} onReviewsClick={onReviewsClick} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Rating summary + breakdown */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold leading-none text-brand-800">{Number(rating).toFixed(1)}</span>
            <div className="pb-1">
              <p className="text-sm font-bold text-success">{verdict}</p>
              <RestaurantRating rating={rating} className="mt-1" />
            </div>
          </div>
          <div className="mt-5 space-y-2.5 border-t border-line pt-5">
            {ratingBreakdown.map((b) => (
              <RatingBar key={b.label} label={b.label} score={b.score} />
            ))}
          </div>
        </div>

        {/* Review carousel */}
        <div className="relative">
          <div ref={trackRef} className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2">
            {reviewList.map((r) => (
              <div key={r.id} className="w-[80vw] shrink-0 snap-start sm:w-[calc(50%-8px)]">
                <ReviewCard review={r} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous reviews" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-brand-700 shadow-sm transition-all hover:scale-105 hover:border-brand-300 hover:text-brand-900 active:scale-95">
              <Icon name="arrow-left" size={18} />
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="Next reviews" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-brand-700 shadow-sm transition-all hover:scale-105 hover:border-brand-300 hover:text-brand-900 active:scale-95">
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
