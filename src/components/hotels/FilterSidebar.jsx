import { FilterSection, CheckRow } from "./FilterSection";
import RatingDots from "./RatingDots";
import { PROPERTY_TYPES, emptyFilters, countActiveFilters } from "../../data/hotels";

const PRICE_MIN = 20;
const PRICE_MAX = 200;

// Left filter rail: Popular / Deals / Awards / Property types / Price.
// Purely controlled — the page owns filter state so chips and drawer share it.
export default function FilterSidebar({ filters, onPatch }) {
  const activeCount = countActiveFilters(filters);
  const toggleType = (key) =>
    onPatch({
      types: filters.types.includes(key) ? filters.types.filter((t) => t !== key) : [...filters.types, key],
    });

  return (
    <div className="">
      <FilterSection title="Popular">
        <CheckRow label="Pets Allowed" checked={filters.pets} onChange={(v) => onPatch({ pets: v })} />
        <CheckRow label="5 Star" checked={filters.fiveStar} onChange={(v) => onPatch({ fiveStar: v })} />
        <CheckRow
          label="4.0+"
          checked={filters.rating4}
          onChange={(v) => onPatch({ rating4: v })}
          right={<RatingDots rating={4} size={7} />}
        />
        <CheckRow label="Luxury" checked={filters.luxury} onChange={(v) => onPatch({ luxury: v })} />
      </FilterSection>

      <FilterSection title="Deals">
        <CheckRow
          label="Fully refundable"
          checked={filters.refundable}
          onChange={(v) => onPatch({ refundable: v })}
          info="Free cancellation up to 24h before check-in"
        />
        <CheckRow
          label="No prepayment needed"
          checked={filters.noPrepay}
          onChange={(v) => onPatch({ noPrepay: v })}
          info="Pay at the property, not at booking time"
        />
        <CheckRow
          label="Properties with special offers"
          checked={filters.offers}
          onChange={(v) => onPatch({ offers: v })}
         
          info="Discounts from our hotel partners"
        />
      </FilterSection>

      <FilterSection title="Awards">
        <CheckRow
          label="Travelers' Choice Best of the Best"
          checked={filters.bestOfBest}
          onChange={(v) => onPatch({ bestOfBest: v })}
          icon="award"
        />
        <CheckRow
          label="Travelers' Choice"
          checked={filters.travelersChoice}
          onChange={(v) => onPatch({ travelersChoice: v })}
          icon="badge-check"
        />
      </FilterSection>

      <FilterSection
        title="Property Types"
        action={
          filters.types.length > 0 && (
            <button
              type="button"
              onClick={() => onPatch({ types: [] })}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-800"
            >
              Show all
            </button>
          )
        }
      >
        {PROPERTY_TYPES.map((t) => (
          <CheckRow
            key={t.key}
            label={t.label}
            icon={t.icon}
            checked={filters.types.includes(t.key)}
            onChange={() => toggleType(t.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Max Price">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted">
            {filters.maxPrice == null ? "Any price" : `Up to $${filters.maxPrice}`}
          </span>
          {filters.maxPrice != null && (
            <button
              type="button"
              onClick={() => onPatch({ maxPrice: null })}
              className="text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              Reset
            </button>
          )}
        </div>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          aria-label="Maximum price per night"
          value={filters.maxPrice ?? PRICE_MAX}
          onChange={(e) => {
            const v = Number(e.target.value);
            onPatch({ maxPrice: v >= PRICE_MAX ? null : v });
          }}
          className="w-full accent-brand-600"
        />
        <div className="flex justify-between text-[11px] font-medium text-muted">
          <span>${PRICE_MIN}</span>
          <span>${PRICE_MAX}+</span>
        </div>
      </FilterSection>
    </div>
  );
}
