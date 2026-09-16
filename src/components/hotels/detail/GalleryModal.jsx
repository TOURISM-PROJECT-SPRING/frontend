import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../../ui/Icon";

// Fullscreen, keyboard-navigable gallery viewer.
export default function GalleryModal({ images, index, onClose, onIndex }) {
  const count = images.length;
  const go = useCallback(
    (next) => onIndex(((next % count) + count) % count),
    [count, onIndex]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, go, onClose]);

  if (!count) return null;
  const active = images[index] || images[0];

  return createPortal(
    <div className="fixed inset-0 z-[120] flex flex-col bg-brand-950/95 backdrop-blur-sm animate-fade" role="dialog" aria-modal="true" aria-label="Hotel photo gallery">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <div className="text-sm font-semibold">
          {index + 1} <span className="text-white/50">/ {count}</span>
          {active?.category && <span className="ml-3 hidden text-white/70 sm:inline">· {active.category}</span>}
        </div>
        <button type="button" onClick={onClose} aria-label="Close gallery" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
          <Icon name="x" size={20} />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center px-2 sm:px-4">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-800 shadow-md transition-all hover:scale-105 hover:bg-white sm:left-5">
          <Icon name="arrow-left" size={20} />
        </button>
        <img key={active?.url} src={active?.url} alt={active?.category || "Hotel photo"} className="max-h-full max-w-full animate-fade rounded-lg object-contain" />
        <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-800 shadow-md transition-all hover:scale-105 hover:bg-white sm:right-5">
          <Icon name="arrow-right" size={20} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="hide-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6">
        {images.map((im, i) => (
          <button
            key={`${im.url}-${i}`}
            type="button"
            onClick={() => onIndex(i)}
            aria-label={`View ${im.category || "photo"} ${i + 1}`}
            aria-current={i === index}
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition ${
              i === index ? "ring-gold-400 opacity-100" : "ring-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={im.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
