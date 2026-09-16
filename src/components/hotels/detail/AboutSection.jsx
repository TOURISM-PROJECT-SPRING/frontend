import { useState } from "react";
import Icon from "../../ui/Icon";
import RatingBar from "./RatingBar";
import RatingDots from "../RatingDots";

const AMENITY_PREVIEW = 8;

function AmenityItem({ item }) {
  return (
    <li className="flex items-center gap-3 py-1.5 text-[15px] text-ink/85">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon name={item.icon || "check"} size={16} />
      </span>
      {item.name}
    </li>
  );
}

function FeatureChip({ item }) {
  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm font-medium text-brand-900">
      <Icon name={item.icon || "check"} size={16} className="shrink-0 text-brand-500" />
      {item.name}
    </li>
  );
}

// "About" — rating summary + property amenities + room features.
export default function AboutSection({ rating, reviews, ranking, totalHotels, city, ratingBreakdown = [], amenities = [], roomFeatures = [], onReviewsClick }) {
  const [showAll, setShowAll] = useState(false);
  const list = showAll ? amenities : amenities.slice(0, AMENITY_PREVIEW);
  const hasMore = amenities.length > AMENITY_PREVIEW;
  const verdict = rating >= 4.7 ? "Excellent" : rating >= 4.3 ? "Very good" : "Good";

  return (
    <section aria-labelledby="about-heading" className="scroll-mt-28">
      <h2 id="about-heading" className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">About</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Rating summary */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-bold leading-none text-brand-800">{Number(rating).toFixed(1)}</span>
            <div className="pb-1">
              <p className="text-sm font-bold text-success">{verdict}</p>
              <RatingDots rating={rating} size={9} className="mt-1" />
            </div>
          </div>
          <button type="button" onClick={onReviewsClick} className="mt-2 text-sm font-medium text-muted underline decoration-brand-200 underline-offset-4 hover:text-brand-700">
            ({Number(reviews).toLocaleString("en-US")} reviews)
          </button>
          {ranking != null && totalHotels != null && (
            <p className="mt-3 text-sm font-semibold text-brand-800">#{ranking} of {totalHotels.toLocaleString("en-US")} hotels in {city || "Phnom Penh"}</p>
          )}
          <div className="mt-5 space-y-2.5 border-t border-line pt-5">
            {ratingBreakdown.map((b) => (
              <RatingBar key={b.label} label={b.label} score={b.score} />
            ))}
          </div>
        </div>

        {/* Property amenities */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <h3 className="font-display text-xl font-bold text-brand-800">Property amenities</h3>
          <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
            {list.map((a) => (
              <AmenityItem key={a.name} item={a} />
            ))}
          </ul>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
              aria-expanded={showAll}
            >
              {showAll ? "Show less" : "Show more"}
              <Icon name="chevron-down" size={16} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>

      {/* Room features */}
      {roomFeatures.length > 0 && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6 shadow-soft">
          <h3 className="font-display text-xl font-bold text-brand-800">Room features</h3>
          <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {roomFeatures.map((f) => (
              <FeatureChip key={f.name} item={f} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
