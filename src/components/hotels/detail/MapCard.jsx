import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import { money } from "../../../lib/format";

/* Faux but polished map surface — no API key required. Swap <MapSurface/> for a
   Mapbox/Google embed later; the surrounding controls & popup stay the same. */
function MapSurface({ zoom }) {
  return (
    <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Hotel location map">
      <defs>
        <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#e4ece5" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="560" fill="#eef4ee" />
      <rect width="800" height="560" fill="url(#mapgrid)" />
      <g transform={`translate(400 280) scale(${zoom}) translate(-400 -280)`}>
        {/* parks */}
        <path d="M60 380 q80 -60 170 -20 q40 60 -40 110 q-120 30 -130 -90Z" fill="#d6e7dd" opacity="0.8" />
        <path d="M600 90 q120 -20 160 80 q-40 90 -150 60 q-60 -70 -10 -140Z" fill="#d6e7dd" opacity="0.7" />
        {/* river Tonle Sap/Bassac */}
        <path d="M-20 120 C160 200 260 160 360 240 C520 360 640 340 860 470" fill="none" stroke="#bfe0ef" strokeWidth="46" strokeLinecap="round" />
        <path d="M-20 120 C160 200 260 160 360 240 C520 360 640 340 860 470" fill="none" stroke="#d7ecf5" strokeWidth="30" strokeLinecap="round" />
        {/* roads */}
        <g stroke="#ffffff" strokeWidth="12" fill="none" strokeLinecap="round">
          <path d="M40 60 L760 520" />
          <path d="M120 540 L720 40" />
          <path d="M400 0 L400 560" />
          <path d="M0 280 L800 280" />
        </g>
        <g stroke="#f0c86a" strokeWidth="4" fill="none" opacity="0.55" strokeDasharray="2 10" strokeLinecap="round">
          <path d="M400 0 L400 560" />
          <path d="M0 280 L800 280" />
        </g>
        {/* blocks */}
        <g fill="#f7faf5" stroke="#e0e8e1">
          {[
            [70, 70, 120, 90], [230, 120, 90, 70], [470, 90, 120, 90],
            [620, 300, 120, 80], [210, 380, 110, 80], [470, 360, 100, 90],
            [300, 220, 70, 60], [520, 210, 80, 60],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="6" />
          ))}
        </g>
      </g>
    </svg>
  );
}

function Pin({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Hotel marker"
      className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 focus:outline-none"
    >
      <svg width="38" height="50" viewBox="0 0 38 50" className="drop-shadow-lg">
        <path d="M19 49 C19 49 3 30 3 18 A16 16 0 0 1 35 18 C35 30 19 49 19 49Z" fill="#02462e" stroke="#fff" strokeWidth="2" />
        <circle cx="19" cy="18" r="7" fill="#fec700" />
      </svg>
      <span className="absolute -bottom-1 left-1/2 h-2.5 w-6 -translate-x-1/2 rounded-full bg-brand-950/20 blur-[2px]" />
    </button>
  );
}

function Popup({ name, rating, price, href }) {
  return (
    <div className="absolute left-1/2 top-1/2 z-20 w-56 -translate-x-1/2 -translate-y-[calc(100%+58px)] animate-scalein rounded-xl border border-line bg-white p-3 shadow-lift">
      <p className="line-clamp-2 font-display text-sm font-bold text-brand-900">{name}</p>
      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-success">
        <Icon name="star" size={12} className="text-gold-400" fill="currentColor" stroke="none" />
        {Number(rating).toFixed(1)}
      </p>
      <p className="mt-1 text-xs text-muted">
        From <span className="font-bold text-brand-800">{money(price)}</span>
      </p>
      <Link to={href} className="mt-2.5 flex h-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white transition-colors hover:bg-brand-800">
        View hotel
      </Link>
    </div>
  );
}

function Controls({ setZoom, onFullscreen, fullscreen }) {
  return (
    <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
      <button type="button" onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.3).toFixed(2)))} aria-label="Zoom in" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
        <Icon name="plus" size={16} />
      </button>
      <button type="button" onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.3).toFixed(2)))} aria-label="Zoom out" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
        <Icon name="minus" size={16} />
      </button>
      <button type="button" onClick={onFullscreen} aria-label={fullscreen ? "Exit fullscreen map" : "View fullscreen map"} className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-brand-800 shadow-sm transition hover:bg-brand-50">
        <Icon name={fullscreen ? "minimize" : "maximize"} size={16} />
      </button>
    </div>
  );
}

export default function MapCard({ name, rating, price, href = "/hotel" }) {
  const [zoom, setZoom] = useState(1);
  const [popup, setPopup] = useState(false);
  const [fs, setFs] = useState(false);

  const card = (full) => (
    <div className={`relative overflow-hidden bg-[#eef4ee] ${full ? "h-full w-full" : "h-[300px] w-full rounded-2xl border border-line shadow-soft sm:h-[400px] lg:h-[520px]"}`}>
      <MapSurface zoom={zoom} />
      <Pin onClick={() => setPopup((v) => !v)} />
      {popup && <Popup name={name} rating={rating} price={price} href={href} />}
      <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-muted backdrop-blur">
        Map preview · Phnom Penh
      </span>
      <Controls setZoom={setZoom} fullscreen={full} onFullscreen={() => setFs((v) => !v)} />
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
