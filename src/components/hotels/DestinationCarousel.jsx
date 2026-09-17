import { useRef, useState, useEffect } from "react";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";

// "Destinations in Cambodia" — horizontal snap carousel with arrow buttons.
export default function DestinationCarousel({ destinations = [], counts = {}, activeName, onSelect }) {
  const trackRef = useRef(null);
  const [atEnd, setAtEnd] = useState(true);
  const [atStart, setAtStart] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [destinations.length]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 312, behavior: "smooth" });
  };

  if (!destinations.length) return null;

  return (
    <section aria-label="Destinations in Cambodia" className="relative">
      <div
        ref={trackRef}
        className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 pt-1 "
      >
        {destinations.map((d) => {
          const active = activeName === d.title;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect?.(d.title)}
              className={`group relative h-[170px] w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl text-left ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-brand-500 ${
                active ? "ring-2 ring-brand-600" : "ring-1 ring-line"
              }`}
            >
              <span className="absolute inset-0">
                <SmartImage
                  src={d.image}
                  alt={d.title}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-brand-950/75 via-brand-950/15 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <span>
                  <span className="block font-display text-lg font-bold text-white drop-shadow">{d.title}</span>
                  {counts[d.title] != null && (
                    <span className="text-xs font-medium text-white/80">{counts[d.title]} stays</span>
                  )}
                </span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm transition group-hover:bg-gold-400 group-hover:text-brand-900">
                  <Icon name="arrow-right" size={14} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Prev / next controls */}
      {!atStart && (
        <button
          type="button"
          aria-label="Scroll destinations left"
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-md transition hover:scale-105 hover:bg-brand-50 md:grid"
        >
          <Icon name="chevron-left" size={18} />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          aria-label="Scroll destinations right"
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-md transition hover:scale-105 hover:bg-brand-50 md:grid"
        >
          <Icon name="chevron-right" size={18} />
        </button>
      )}
    </section>
  );
}
