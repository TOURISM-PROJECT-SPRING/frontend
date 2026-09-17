import { useState } from "react";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import ImageLightbox from "../restaurants/detail/ImageLightbox";

// Editorial gallery: large hero + thumbnail grid (desktop), hero + strip (mobile).
export default function ActivityGallery({ images = [], title = "experience" }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;
  const show = (i) => {
    setIdx(i);
    setOpen(true);
  };
  const main = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className="hidden h-[360px] gap-2 overflow-hidden rounded-2xl md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:h-[440px]">
        <button type="button" onClick={() => show(0)} aria-label={`View all photos of ${title}`} className="group relative block min-h-0 overflow-hidden">
          <SmartImage src={main.url} alt={`${title} — main photo`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.03]" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-sm transition group-hover:bg-white">
            <Icon name="camera" size={14} /> See all photos
          </span>
        </button>
        <div className="grid min-h-0 grid-rows-2 gap-2">
          {thumbs.slice(0, 4).map((im, i) => (
            <button key={i} type="button" onClick={() => show(i + 1)} aria-label={`View photo ${i + 2}`} className="group relative min-h-0 overflow-hidden">
              <SmartImage src={im.url} alt={`${title} — photo ${i + 2}`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]" />
              {i === 3 && thumbs.length > 4 && (
                <span className="absolute inset-0 grid place-items-center bg-brand-950/45 text-sm font-bold text-white">+{thumbs.length - 4}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden">
        <button type="button" onClick={() => show(0)} aria-label={`View all photos of ${title}`} className="relative block h-[260px] w-full overflow-hidden rounded-2xl">
          <SmartImage src={main.url} alt={`${title} — main photo`} className="h-full w-full" />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-sm">
            <Icon name="camera" size={14} /> {images.length} photos
          </span>
        </button>
        <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {images.slice(1).map((im, i) => (
            <button key={i} type="button" onClick={() => show(i + 1)} aria-label={`View photo ${i + 2}`} className="h-16 w-24 shrink-0 overflow-hidden rounded-lg">
              <SmartImage src={im.url} alt={`photo ${i + 2}`} className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>

      {open && <ImageLightbox images={images} index={idx} onIndex={setIdx} onClose={() => setOpen(false)} title={title} />}
    </>
  );
}
