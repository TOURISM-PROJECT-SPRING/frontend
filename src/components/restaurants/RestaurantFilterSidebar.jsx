import { useState } from "react";
import { FilterSection, CheckRow, ShowMore } from "./FilterSection";
import RatingDots from "../hotels/RatingDots";
import {
  PROVINCES,
  ESTABLISHMENT_TYPES,
  MORE_ESTABLISHMENT_TYPES,
  MEAL_TYPES,
  CUISINES,
  MORE_CUISINES,
  DISHES,
  MORE_DISHES,
  AWARDS,
  PRICE_TIERS,
  ONLINE_OPTIONS,
  TRAVELER_RATINGS,
  DISTANCE_OPTIONS,
  DIETARY_OPTIONS,
  FEATURES,
} from "../../data/restaurants";

// Generic multi-select toggle for a list-of-keys filter field.
function useToggleList(onPatch, filters) {
  return (field, key) => {
    const cur = filters[field];
    onPatch({ [field]: cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key] });
  };
}

export default function RestaurantFilterSidebar({ filters, onPatch }) {
  const toggle = useToggleList(onPatch, filters);
  const [moreEst, setMoreEst] = useState(false);
  const [allCuisine, setAllCuisine] = useState(false);
  const [allDish, setAllDish] = useState(false);

  const estOptions = moreEst ? [...ESTABLISHMENT_TYPES, ...MORE_ESTABLISHMENT_TYPES] : ESTABLISHMENT_TYPES;
  const cuisineOptions = allCuisine ? [...CUISINES, ...MORE_CUISINES] : CUISINES;
  const dishOptions = allDish ? [...DISHES, ...MORE_DISHES] : DISHES;

  return (
    <div>
      <FilterSection title="Location">
        <CheckRow
          label="All of Cambodia"
          checked={filters.province === ""}
          onChange={() => onPatch({ province: "" })}
        />
        {PROVINCES.map((p) => (
          <CheckRow
            key={p.key}
            label={p.label}
            icon="map-pin"
            checked={filters.province === p.key}
            onChange={(v) => onPatch({ province: v ? p.key : "" })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Establishment type">
        {estOptions.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            icon={o.icon}
            checked={filters.establishments.includes(o.key)}
            onChange={() => toggle("establishments", o.key)}
          />
        ))}
        <ShowMore expanded={moreEst} onToggle={() => setMoreEst((v) => !v)} labelMore="Show more" />
      </FilterSection>

      <FilterSection title="Meal type">
        {MEAL_TYPES.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.meals.includes(o.key)}
            onChange={() => toggle("meals", o.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Cuisines">
        {cuisineOptions.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.cuisines.includes(o.key)}
            onChange={() => toggle("cuisines", o.key)}
          />
        ))}
        <ShowMore expanded={allCuisine} onToggle={() => setAllCuisine((v) => !v)} labelMore="Show all" />
      </FilterSection>

      <FilterSection title="Dishes">
        {dishOptions.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.dishes.includes(o.key)}
            onChange={() => toggle("dishes", o.key)}
          />
        ))}
        <ShowMore expanded={allDish} onToggle={() => setAllDish((v) => !v)} labelMore="Show all" />
      </FilterSection>

      <FilterSection title="Awards" info="Recognition from the SovannDomNour traveler community">
        {AWARDS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            icon={o.icon}
            checked={filters.awards.includes(o.key)}
            onChange={() => toggle("awards", o.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Price">
        {PRICE_TIERS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.prices.includes(o.key)}
            onChange={() => toggle("prices", o.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Online options & offers">
        {ONLINE_OPTIONS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.online.includes(o.key)}
            onChange={() => toggle("online", o.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Traveler rating">
        {TRAVELER_RATINGS.map((o) => (
          <CheckRow
            key={o.key}
            label={`${o.label}`}
            checked={filters.rating === o.min}
            onChange={(v) => onPatch({ rating: v ? o.min : null })}
            right={<RatingDots rating={o.min} size={8} />}
          />
        ))}
      </FilterSection>

      <FilterSection title="Distance" defaultOpen={false}>
        {DISTANCE_OPTIONS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.distance === o.km}
            onChange={(v) => onPatch({ distance: v ? o.km : null })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Dietary requirements" defaultOpen={false}>
        {DIETARY_OPTIONS.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            checked={filters.dietary.includes(o.key)}
            onChange={() => toggle("dietary", o.key)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Features" defaultOpen={false}>
        {FEATURES.map((o) => (
          <CheckRow
            key={o.key}
            label={o.label}
            icon={o.icon}
            checked={filters.features.includes(o.key)}
            onChange={() => toggle("features", o.key)}
          />
        ))}
      </FilterSection>
    </div>
  );
}
