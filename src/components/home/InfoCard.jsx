import { useState } from "react";
import SmartImage from "../ui/SmartImage";
import Icon from "../ui/Icon";
import { useTripCart } from "../../context/TripCartContext";
import { useToast } from "../ui/Toast";

// Rich TripAdvisor-style card: image carousel, save-to-trip (heart),
// rating bubbles and a category type. Reuses the trip cart as the
// "saved trip" store, toggled by the heart.
export default function InfoCard({ item, kind = "tour", fill = false }) {
  const { items, addItem, removeItem } = useTripCart();
  const toast = useToast();
  const images = item.images?.length ? item.images : [item.image];
  const [idx, setIdx] = useState(0);
  const key = `${kind}-${item.id}`;
  const saved = items.some((i) => i.key === key);

  const go = (d) => setIdx((n) => (n + d + images.length) % images.length);

  const toggle = () => {
    if (saved) {
      removeItem(key);
      toast.info(`Removed "${item.name}" from your trip.`);
    } else {
      addItem(
        { kind, id: item.id, key, title: item.name, image: images[0], location: item.location || item.category, price: 0, priceUnit: "" },
        1
      );
      toast.success(`Saved "${item.name}" to your trip.`);
    }
  };

  const reviews = typeof item.reviews === "number" ? item.reviews.toLocaleString() : item.reviews;

  return (
    <article className={`group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-sm mt-3 ${fill ? "w-full" : "w-[262px] shrink-0 snap-start sm:w-[300px]"}`}>
      <div className="relative aspect-[4/4] overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            <SmartImage key={i} src={src} alt={item.name} className="h-full w-full shrink-0" />
          ))}
        </div>

        {/* Save / favorite */}
        <button
          type="button"
          onClick={toggle}
          aria-label={saved ? "Remove from trip" : "Save to trip"}
          aria-pressed={saved}
          className={`absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur transition-colors ${
            saved ? "bg-white text-rose-500" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={18} fill={saved ? "currentColor" : "none"} />
        </button>

        {/* Badge */}
        {item.badge && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-lg bg-gold-400 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-brand-900 shadow">
            <Icon name="shield" size={12} /> {item.badge}
          </span>
        )}

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand-900/70 text-white opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-brand-900 group-hover:opacity-100"
            >
              <Icon name="chevron-right" size={16} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-brand-900/70 text-white opacity-0 backdrop-blur transition-opacity duration-200 hover:bg-brand-900 group-hover:opacity-100"
            >
              <Icon name="chevron-right" size={16} />
            </button>
            <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-display text-base font-bold text-brand-800">{item.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="text-sm font-bold text-brand-800">{item.rating}</span>
          <span className="flex items-center gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`h-2 w-2 rounded-full ${n <= Math.round(item.rating) ? "bg-brand-600" : "bg-brand-200"}`} />
            ))}
          </span>
          {reviews && <span className="text-xs text-muted">({reviews})</span>}
        </div>
        {(item.category || item.location) && (
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-muted">
            <Icon name="landmark" size={12} className="text-brand-400" /> {item.category || item.location}
          </p>
        )}
      </div>
    </article>
  );
}
