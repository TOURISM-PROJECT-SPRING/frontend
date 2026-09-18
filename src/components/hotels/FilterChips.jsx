import { useState } from "react";
import Icon from "../ui/Icon";
import RatingDots from "./RatingDots";
import { ALL_AMENITIES } from "../../data/hotels";

// Horizontal scrollable chips mirroring the popular filters (single source
// of truth: same state as the sidebar).
function Chip({ active, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-all duration-200 ${
        active
          ? "border-brand-600 bg-brand-700 text-white shadow-sm"
          : "border-line bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function FilterChips({ filters, onPatch, className = "" }) {
  const [amenOpen, setAmenOpen] = useState(false);
  const toggleAmenity = (a) =>
    onPatch({
      amenities: filters.amenities.includes(a) ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a],
    });

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      {/* Amenities dropdown */}
      <div className="relative shrink-0">
        <Chip active={filters.amenities.length > 0} onClick={() => setAmenOpen((v) => !v)}>
          <Icon name="filter" size={13} />
          Amenities
          {filters.amenities.length > 0 && (
            <span className="grid h-4 w-4 place-items-center rounded-full bg-gold-400 text-[10px] font-bold text-brand-900">
              {filters.amenities.length}
            </span>
          )}
          <Icon name="chevron-down" size={13} className={`transition-transform ${amenOpen ? "rotate-180" : ""}`} />
        </Chip>
        {amenOpen && (
          <>
            <button aria-label="Close amenities picker" className="fixed inset-0 z-40 cursor-default" onClick={() => setAmenOpen(false)} />
            <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-56 animate-scalein rounded-2xl border border-line bg-white p-2 shadow-lift">
              {ALL_AMENITIES.map((a) => {
                const on = filters.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      on ? "bg-brand-50 text-brand-800" : "text-ink hover:bg-brand-50/60"
                    }`}
                  >
                    <span className={`grid h-4 w-4 place-items-center rounded border ${on ? "border-brand-700 bg-brand-700 text-white" : "border-line text-transparent"}`}>
                      <Icon name="check" size={10} strokeWidth={3} />
                    </span>
                    {a}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Chip active={filters.pets} onClick={() => onPatch({ pets: !filters.pets })}>
         Pets Allowed
      </Chip>
      <Chip active={filters.fiveStar} onClick={() => onPatch({ fiveStar: !filters.fiveStar })}>
        <Icon name="star" size={13} /> 5 Star
      </Chip>
      <Chip active={filters.rating4} onClick={() => onPatch({ rating4: !filters.rating4 })}>
        <RatingDots rating={4} size={6} /> 4.0+
      </Chip>
      <Chip active={filters.luxury} onClick={() => onPatch({ luxury: !filters.luxury })}>
        <Icon name="sparkles" size={13} /> Luxury
      </Chip>
      <Chip active={filters.travelersChoice} onClick={() => onPatch({ travelersChoice: !filters.travelersChoice })}>
        <Icon name="award" size={13} /> Travelers' Choice
      </Chip>
    </div>
  );
}
