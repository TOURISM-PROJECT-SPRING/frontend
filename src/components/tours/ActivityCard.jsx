import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import RatingDots from "../hotels/RatingDots";

function CircleButton({ dir, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand-800/85 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-brand-900 active:scale-95"
      style={dir === "left" ? { left: 12 } : { right: 12 }}
    >
      <Icon name={dir === "left" ? "arrow-left" : "arrow-right"} size={20} strokeWidth={2.2} />
    </button>
  );
}

export default function ActivityCard({ activity: a, index, favorite, onToggleFavorite }) {
  const [idx, setIdx] = useState(0);
  const images = a.images?.length ? a.images : [a.image];
  const n = images.length;
  const step = (d) => setIdx((i) => (i + d + n) % n);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border transition-shadow duration-300 hover:shadow-soft ${
        a.featured ? "border-[#DDF5D8] bg-[#F3FBF1]" : "border-line bg-white"
      }`}
    >
      {/* Image carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SmartImage src={images[idx]} alt={`${a.title} — photo ${idx + 1} of ${n}`} className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-[1.03]" />

        {/* Favorite */}
        <button
          type="button"
          onClick={() => onToggleFavorite?.(a)}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            favorite ? "bg-white text-rose-500" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={19} fill={favorite ? "currentColor" : "none"} />
        </button>

        {/* Arrows */}
        {n > 1 && (
          <>
            <CircleButton dir="left" onClick={() => step(-1)} label="Previous photo" />
            <CircleButton dir="right" onClick={() => step(1)} label="Next photo" />
          </>
        )}

        {/* Award badge */}
        {a.awardTier && (
          <span className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2 py-1 shadow-sm">
            <Icon name="award" size={16} className="text-gold-500" />
            <span className="text-[12px] font-bold text-brand-900">
              {a.awardTier === "winner" ? "Award Winner" : "Travelers’ Choice"} · 2026
            </span>
          </span>
        )}

        {/* Dots */}
        {n > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Go to photo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/activity/${a.id}`} className="block">
          <h3 className="line-clamp-3 min-h-[72px] font-display text-[19px] font-bold leading-[1.25] text-brand-900 transition-colors hover:text-brand-700">
            {index}. {a.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-ink">{a.rating.toFixed(1)}</span>
          <RatingDots rating={a.rating} size={14} />
          <span className="text-[15px] text-ink/60">({a.reviews.toLocaleString("en-US")})</span>
        </div>

        <p className="text-[16px] text-ink/70">{a.recommend}% Recommend</p>

        <p className="flex items-center gap-2 text-[16px] text-ink/80">
          <Icon name="clock" size={16} className="text-brand-600" />
          {a.duration}
        </p>

        {a.freeCancel && (
          <p className="flex items-center gap-2 text-[16px] text-brand-800">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DDF5D8] text-success">
              <Icon name="refresh" size={14} strokeWidth={2.2} />
            </span>
            Free cancellation
          </p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="leading-tight">
            <p className="text-[13px] text-ink/60">from</p>
            <p className="font-display text-[22px] font-bold text-brand-900">${a.price}</p>
            <p className="text-[13px] text-ink/60">per adult</p>
          </div>
          <Link
            to={`/activity/${a.id}`}
            className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#3F9148] px-5 text-[15px] font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#357a3c] active:scale-[0.98]"
          >
            Check dates
          </Link>
        </div>
      </div>
    </article>
  );
}
