import { useState } from "react";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

// Square image carousel. Left arrow is a translucent white circle, right arrow
// a solid dark-green circle (per reference). Dot pagination sits bottom-center.
export default function RestaurantCarousel({ images = [], alt = "" }) {
  const [i, setI] = useState(0);
  const count = images.length || 1;
  const go = (d) => setI((p) => (p + d + count) % count);

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-100">
      {images.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          <SmartImage src={src} alt={idx === i ? alt : ""} className="h-full w-full" />
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-brand-800 shadow-sm backdrop-blur-sm transition hover:bg-white active:scale-95"
          >
            <Icon name="chevron-left" size={18} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-brand-700 text-white shadow-md transition hover:bg-brand-800 active:scale-95"
          >
            <Icon name="chevron-right" size={18} strokeWidth={2.4} />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                aria-current={idx === i}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  idx === i ? "w-2 bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
