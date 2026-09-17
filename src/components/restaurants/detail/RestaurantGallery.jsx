import { useState } from "react";
import Icon from "../../ui/Icon";
import SmartImage from "../../ui/SmartImage";
import AwardBadge from "./AwardBadge";
import ImageLightbox from "./ImageLightbox";

function TileOverlay({ label, value }) {
  return (
    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-brand-950/80 to-transparent px-3 py-2 text-left">
      <span className="text-sm font-bold text-white">{label}</span>
      {value != null && <span className="text-xs font-semibold text-white/90">{Number(value).toLocaleString("en-US")}</span>}
    </span>
  );
}

// Desktop: large main image (≈70%) + 3 stacked category tiles (≈30%).
// A dark-green arrow cycles the main photo; tapping any image opens the lightbox.
// Mobile: prominent hero + swipeable thumbnail strip + photo counter.
export default function RestaurantGallery({ images = [], award, title = "restaurant" }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [mainIdx, setMainIdx] = useState(0);

  if (!images.length) return null;
  const show = (i) => {
    setIdx(i);
    setOpen(true);
  };
  const main = images[mainIdx % images.length];
  const tiles = images.slice(1, 4);

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden h-[340px] gap-1.5 overflow-hidden rounded-2xl md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:h-[440px]">
        <button type="button" onClick={() => show(mainIdx % images.length)} aria-label={`View all photos of ${title}`} className="group relative block min-h-0 overflow-hidden">
          <SmartImage src={main?.url} alt={`${title} — main photo`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]" />
          {/* circular dark-green nav arrow near right edge */}
          <span
            role="button"
            tabIndex={0}
            aria-label="Next main photo"
            onClick={(e) => {
              e.stopPropagation();
              setMainIdx((i) => (i + 1) % images.length);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setMainIdx((i) => (i + 1) % images.length);
              }
            }}
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand-700/90 text-white shadow-md transition hover:bg-brand-800 hover:scale-105"
          >
            <Icon name="chevron-right" size={20} strokeWidth={2.4} />
          </span>
        </button>

        <div className="grid min-h-0 grid-rows-3 gap-1.5">
          {tiles.map((im, i) => (
            <button key={i} type="button" onClick={() => show(i + 1)} aria-label={`View ${im.category} photos`} className="group relative min-h-0 overflow-hidden">
              <SmartImage src={im.url} alt={`${title} — ${im.category}`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]" />
              <TileOverlay label={im.category} value={im.count} />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button type="button" onClick={() => show(mainIdx % images.length)} aria-label={`View all photos of ${title}`} className="group relative block h-[220px] w-full overflow-hidden rounded-2xl">
          <SmartImage src={main?.url} alt={`${title} — main photo`} className="h-full w-full" />
          <span
            role="button"
            tabIndex={0}
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              setMainIdx((i) => (i + 1) % images.length);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setMainIdx((i) => (i + 1) % images.length);
              }
            }}
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand-700/90 text-white shadow-md"
          >
            <Icon name="chevron-right" size={20} strokeWidth={2.4} />
          </span>
        </button>
        <div className="hide-scrollbar mt-2 flex snap-x gap-2 overflow-x-auto">
          {images.map((im, i) => (
            <button key={i} type="button" onClick={() => show(i)} aria-label={`View ${im.category || "photo"}`} className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-lg ${i === mainIdx ? "ring-2 ring-brand-500" : ""}`}>
              <SmartImage src={im.url} alt={im.category || "photo"} className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>

      {open && <ImageLightbox images={images} index={idx} onIndex={setIdx} onClose={() => setOpen(false)} title={title} />}
    </>
  );
}
