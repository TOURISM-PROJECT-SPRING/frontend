import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../ui/Icon";

// Compact, polished faux map (no API key). Shows Siem Reap grid + river + marker.
// Swap <Surface/> for a Mapbox/Google embed later; controls & popup stay.
function Surface({ zoom, label }) {
  return (
    <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={`${label} location map`}>
      <defs>
        <pattern id="restmapgrid" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M34 0H0V34" fill="none" stroke="#e4ece5" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="420" fill="#eef4ee" />
      <rect width="640" height="420" fill="url(#restmapgrid)" />
      <g transform={`translate(320 210) scale(${zoom}) translate(-320 -210)`}>
        {/* green areas */}
        <path d="M40 250 q70 -50 150 -18 q34 52 -36 92 q-104 26 -114 -74Z" fill="#d6e7dd" opacity="0.85" />
        <path d="M470 60 q110 -18 148 70 q-36 80 -138 54 q-56 -62 -10 -124Z" fill="#d6e7dd" opacity="0.7" />
        {/* Siem Reap river */}
        <path d="M-20 130 C140 210 250 180 360 250 C480 330 560 330 700 400" fill="none" stroke="#bfe0ef" strokeWidth="40" strokeLinecap="round" />
        <path d="M-20 130 C140 210 250 180 360 250 C480 330 560 330 700 400" fill="none" stroke="#d7ecf5" strokeWidth="26" strokeLinecap="round" />
        {/* streets */}
        <g stroke="#ffffff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M40 40 L600 380" />
          <path d="M120 400 L560 30" />
          <path d="M320 0 L320 420" />
          <path d="M0 210 L640 210" />
        </g>
        <g stroke="#f0c86a" strokeWidth="3.5" fill="none" opacity="0.55" strokeDasharray="2 9" strokeLinecap="round">
          <path d="M320 0 L320 420" />
          <path d="M0 210 L640 210" />
        </g>
        {/* blocks */}
        <g fill="#f7faf5" stroke="#e0e8e1">
          {[
            [60, 60, 96, 70], [200, 90, 80, 60], [400, 70, 100, 70],
            [470, 230, 100, 66], [180, 280, 92, 66], [400, 270, 84, 70],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" />
          ))}
        </g>
      </g>
    </svg>
  );
}

function Pin() {
  return (
    <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
      <svg width="34" height="44" viewBox="0 0 38 50" className="drop-shadow-lg">
        <path d="M19 49 C19 49 3 30 3 18 A16 16 0 0 1 35 18 C35 30 19 49 19 49Z" fill="#02462e" stroke="#fff" strokeWidth="2" />
        <circle cx="19" cy="18" r="7" fill="#fec700" />
      </svg>
      <span className="absolute -bottom-1 left-1/2 h-2 w-6 -translate-x-1/2 rounded-full bg-brand-950/20 blur-[2px]" />
    </span>
  );
}

export default function MapCard({ label = "Siem Reap", mapsUrl, className = "" }) {
  const [zoom, setZoom] = useState(1);
  const [fs, setFs] = useState(false);

  const card = (full) => (
    <div className={`relative overflow-hidden bg-[#eef4ee] ${full ? "h-full w-full" : `h-[240px] w-full rounded-2xl border border-line shadow-soft ${className}`}`}>
      <Surface zoom={zoom} label={label} />
      <Pin />
      <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-muted backdrop-blur">
        Map preview · {label}
      </span>
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
        <button type="button" onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.3).toFixed(2)))} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
          <Icon name="plus" size={15} />
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.3).toFixed(2)))} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
          <Icon name="minus" size={15} />
        </button>
        <button type="button" onClick={() => setFs((v) => !v)} aria-label={full ? "Exit fullscreen map" : "View fullscreen map"} className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
          <Icon name={full ? "minimize" : "maximize"} size={15} />
        </button>
      </div>
      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-800">
          <Icon name="map-pin" size={13} /> Open in Maps
        </a>
      )}
    </div>
  );

  return (
    <>
      {card(false)}
      {fs &&
        createPortal(
          <div className="fixed inset-0 z-[120] bg-brand-950/90 p-3 sm:p-6 animate-fade" role="dialog" aria-modal="true" aria-label="Fullscreen map">
            <button type="button" onClick={() => setFs(false)} aria-label="Close fullscreen map" className="absolute right-5 top-5 z-30 grid h-10 w-10 place-items-center rounded-full bg-white text-brand-800 shadow-md transition hover:bg-brand-50">
              <Icon name="x" size={20} />
            </button>
            <div className="h-full w-full overflow-hidden rounded-2xl">{card(true)}</div>
          </div>,
          document.body
        )}
    </>
  );
}
