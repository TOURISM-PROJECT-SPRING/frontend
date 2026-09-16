import { useState } from "react";
import Icon from "../../ui/Icon";
import SmartImage from "../../ui/SmartImage";
import AwardBadge from "./AwardBadge";
import GalleryModal from "./GalleryModal";

function Overlay({ label, value, icon }) {
  return (
    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-brand-950/80 to-transparent px-3 py-2 text-left">
      <span className="flex items-center gap-1.5 text-sm font-bold text-white">
        {icon && <Icon name={icon} size={14} className="text-white/90" />}
        {label}
      </span>
      {value != null && <span className="text-xs font-semibold text-white/90">{value}</span>}
    </span>
  );
}

// Desktop: big main image (75%) + 3 stacked tiles (25%). Mobile: hero + scroll strip.
// Any tile opens the fullscreen viewer.
export default function HotelGallery({ images = [], award, title }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const show = (i) => {
    setIdx(i);
    setOpen(true);
  };

  const main = images[0];
  const sides = images.slice(1, 4);
  const strip = images.slice(1);

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden h-[420px] gap-1.5 overflow-hidden rounded-2xl md:grid md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] lg:h-[560px] xl:h-[640px]">
        <button type="button" onClick={() => show(0)} aria-label={`View all photos of ${title}`} className="group relative block min-h-0 overflow-hidden">
          <SmartImage src={main?.url} alt={`${title} — main photo`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.02]" />
          {award && <AwardBadge award={award} size="lg" className="absolute bottom-3 left-3" />}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-sm transition group-hover:bg-white">
            <Icon name="camera" size={14} />
            See all photos
          </span>
        </button>

        <div className="grid min-h-0 grid-rows-3 gap-1.5">
          {sides.map((im, i) => (
            <button key={i} type="button" onClick={() => show(i + 1)} aria-label={`View ${im.category} photos`} className="group relative min-h-0 overflow-hidden">
              <SmartImage src={im.url} alt={`${title} — ${im.category}`} className="h-full w-full" imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]" />
              <Overlay label={im.category} value={im.count != null ? im.count.toLocaleString("en-US") : null} icon={i === 0 ? "camera" : i === 1 ? "bed" : "utensils"} />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button type="button" onClick={() => show(0)} aria-label={`View all photos of ${title}`} className="group relative block h-[300px] w-full overflow-hidden rounded-2xl">
          <SmartImage src={main?.url} alt={`${title} — main photo`} className="h-full w-full" />
          {award && <AwardBadge award={award} size="lg" className="absolute bottom-3 left-3" />}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-800 shadow-sm">
            <Icon name="camera" size={14} />
            All photos
          </span>
        </button>
        <div className="hide-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {strip.map((im, i) => (
            <button key={i} type="button" onClick={() => show(i + 1)} aria-label={`View ${im.category} photos`} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
              <SmartImage src={im.url} alt={im.category} className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>

      {open && <GalleryModal images={images} index={idx} onIndex={setIdx} onClose={() => setOpen(false)} />}
    </>
  );
}
