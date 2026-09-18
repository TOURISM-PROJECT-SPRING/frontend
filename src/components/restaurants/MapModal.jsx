import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import RatingDots from "../hotels/RatingDots";

// Stylized, API-free map surface: soft terrain, a river, a couple of roads and
// numbered markers positioned from each restaurant's mock coordinates.
function MockMap({ restaurants, selected, onSelect }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eaf1e7]">
      {/* terrain blocks */}
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[12%] h-24 w-32 rounded-lg bg-brand-200/40" />
        <div className="absolute right-[10%] top-[20%] h-28 w-40 rounded-lg bg-brand-200/30" />
        <div className="absolute bottom-[16%] left-[18%] h-28 w-36 rounded-lg bg-brand-200/30" />
        <div className="absolute bottom-[10%] right-[16%] h-24 w-28 rounded-lg bg-gold-200/30" />
      </div>
      {/* river + roads */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* stylised Cambodia landmass */}
        <polygon
          points="30,8 62,12 82,20 88,40 80,58 66,70 60,86 44,92 30,84 20,66 12,48 16,26"
          fill="#f3f7ef"
          stroke="#9db8a4"
          strokeWidth="0.8"
          strokeLinejoin="round"
          opacity="0.9"
        />
        {/* Tonle Sap lake */}
        <ellipse cx="36" cy="38" rx="12" ry="6" fill="#bfe0e6" opacity="0.85" transform="rotate(-18 36 38)" />
        {/* Mekong river */}
        <path d="M60,14 C56,34 48,44 47,60 S44,80 40,90" fill="none" stroke="#9fd0d8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* roads */}
        <path d="M47,60 L33,30" stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />
        <path d="M47,60 L41,80" stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />
        <path d="M47,60 L80,46" stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />
      </svg>

      {/* markers */}
      {restaurants.map((r, i) => {
        const n = r.rank ?? i + 1;
        const active = selected === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            aria-label={`${n}. ${r.name}`}
            style={{ left: `${r.marker?.x ?? 50}%`, top: `${r.marker?.y ?? 50}%` }}
            className={`absolute z-10 grid -translate-x-1/2 -translate-y-full place-items-center rounded-full text-xs font-black shadow-md transition-all duration-200 ${
              active
                ? "h-9 w-9 scale-110 bg-brand-800 text-white ring-4 ring-brand-300/60"
                : "h-8 w-8 bg-brand-700 text-white hover:bg-brand-800"
            }`}
          >
            {n}
          </button>
        );
      })}

      <span className="absolute bottom-3 right-3 rounded-md bg-white/80 px-2 py-1 text-[11px] font-semibold text-muted backdrop-blur-sm">
        SovannDomNour map · illustrative
      </span>
    </div>
  );
}

export default function MapModal({ open, onClose, restaurants, title = "Restaurants in Cambodia" }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setSelected(restaurants[0]?.id ?? null);
  }, [open, restaurants]);

  if (!open) return null;

  const select = (id) => {
    setSelected(id);
    document.getElementById(`map-row-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative flex h-[86vh] w-full max-w-6xl animate-scalein flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
            <Icon name="map" size={18} className="text-brand-600" />
            Map · {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close map"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-brand-50 hover:text-brand-700"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[minmax(0,360px)_1fr]">
          {/* results list */}
          <div className="max-h-[40vh] overflow-y-auto border-b border-line md:max-h-none md:border-b-0 md:border-r">
            {restaurants.map((r, i) => {
              const n = r.rank ?? i + 1;
              const active = selected === r.id;
              return (
                <button
                  key={r.id}
                  id={`map-row-${r.id}`}
                  type="button"
                  onClick={() => setSelected(r.id)}
                  className={`flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition ${
                    active ? "bg-brand-50" : "hover:bg-canvas"
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-700 text-[11px] font-black text-white">
                    {n}
                  </span>
                  <SmartImage src={r.image} alt={r.name} className="h-12 w-12 shrink-0 rounded-lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-brand-900">{r.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink">{r.rating.toFixed(1)}</span>
                      <RatingDots rating={r.rating} size={6} />
                      <span className="text-xs text-muted">· {r.priceLabel}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* map */}
          <div className="min-h-0">
            <MockMap restaurants={restaurants} selected={selected} onSelect={select} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
