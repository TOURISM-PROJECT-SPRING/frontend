import { useRef } from "react";
import Icon from "../../ui/Icon";
import ReviewCard from "./ReviewCard";
import HotelRating from "./HotelRating";

// "Why guests love this hotel" — horizontal, snap-scrolling review carousel.
export default function ReviewHighlights({ reviews = [], rating, reviewCount, onSeeAll }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 id="reviews-heading" className="flex items-center gap-2 font-display text-2xl font-bold text-brand-800 sm:text-3xl">
          Why guests love this hotel
          <span className="text-brand-400" title="Verified guest reviews"><Icon name="info" size={18} /></span>
        </h2>
        <HotelRating rating={rating} reviews={reviewCount} onReviewsClick={onSeeAll} />
      </div>

      <div className="relative mt-6">
        <div
          ref={trackRef}
          className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
        >
          {reviews.map((r) => (
            <div key={r.id} className="w-[82vw] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(25%-18px)]">
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
    </section>
  );
}
