import Icon from "../ui/Icon";
import Dropdown, { OptionRow } from "./Dropdown";
import {
  AWARD_OPTIONS,
  LANGUAGE_OPTIONS,
  TIME_OPTIONS,
  PRICE_OPTIONS,
  getLocationOptions,
} from "../../data/tours";

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function CheckGroup({ options, selected, onToggle }) {
  return (
    <div className="max-h-[300px] overflow-y-auto">
      {options.map((o) => {
        const key = typeof o === "string" ? o : o.key;
        const label = typeof o === "string" ? o : o.label;
        return (
          <OptionRow key={key} checked={selected.includes(key)} onChange={() => onToggle(key)}>
            {label}
          </OptionRow>
        );
      })}
    </div>
  );
}

export default function FilterBar({ filters, onPatch, onOpenAllFilters }) {
  const patch = (p) => onPatch(p);
  const locationOptions = getLocationOptions();
  const locLabel = locationOptions.find((o) => o.key === filters.location)?.label || "Siem Reap";

  return (
    <div className="hide-scrollbar -mx-1 flex items-center gap-2.5 overflow-x-auto px-1 py-1">
      {/* Location / province */}
      <Dropdown
        key={filters.location}
        label={locLabel}
        icon="map-pin"
        active
        panelClassName="w-60"
      >
        <div className="max-h-[340px] overflow-y-auto">
          {locationOptions.map((o) => (
            <button
              key={o.key || "all"}
              type="button"
              onClick={() => patch({ location: o.key })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[15px] transition-colors hover:bg-brand-50/60 ${
                o.key === filters.location ? "font-bold text-brand-800" : "text-ink/80"
              }`}
            >
              {o.label}
              {o.key === filters.location && <Icon name="check" size={16} className="text-success" strokeWidth={2.6} />}
            </button>
          ))}
        </div>
      </Dropdown>

      {/* Select dates */}
      <Dropdown
        label={filters.dates.from || filters.dates.to ? `${filters.dates.from || "From"} – ${filters.dates.to || "To"}` : "Select dates"}
        icon="calendar"
        chevron={false}
        active={!!(filters.dates.from || filters.dates.to)}
      >
        <div className="space-y-3 p-1">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Start date</span>
            <input
              type="date"
              value={filters.dates.from}
              onChange={(e) => patch({ dates: { ...filters.dates, from: e.target.value } })}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">End date</span>
            <input
              type="date"
              value={filters.dates.to}
              onChange={(e) => patch({ dates: { ...filters.dates, to: e.target.value } })}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400"
            />
          </label>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => patch({ dates: { from: "", to: "" } })}
              className="flex-1 rounded-xl border border-line px-3 py-2 text-sm font-bold text-brand-800 hover:bg-brand-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => patch({ dates: { from: new Date().toISOString().slice(0, 10), to: filters.dates.to } })}
              className="flex-1 rounded-xl bg-brand-700 px-3 py-2 text-sm font-bold text-white hover:bg-brand-800"
            >
              Today
            </button>
          </div>
        </div>
      </Dropdown>

      {/* Awards */}
      <Dropdown label="Awards" icon={null} count={filters.awards.length} active={filters.awards.length > 0}>
        <CheckGroup
          options={AWARD_OPTIONS}
          selected={filters.awards}
          onToggle={(k) => patch({ awards: toggle(filters.awards, k) })}
        />
      </Dropdown>

      {/* Languages */}
      <Dropdown label="Languages" icon={null} count={filters.languages.length} active={filters.languages.length > 0}>
        <CheckGroup
          options={LANGUAGE_OPTIONS}
          selected={filters.languages}
          onToggle={(k) => patch({ languages: toggle(filters.languages, k) })}
        />
      </Dropdown>

      {/* Time of Day */}
      <Dropdown label="Time of Day" icon={null} count={filters.timeOfDay.length} active={filters.timeOfDay.length > 0}>
        <CheckGroup
          options={TIME_OPTIONS}
          selected={filters.timeOfDay}
          onToggle={(k) => patch({ timeOfDay: toggle(filters.timeOfDay, k) })}
        />
      </Dropdown>

      {/* Price */}
      <Dropdown label="Price" icon={null} count={filters.price.length} active={filters.price.length > 0}>
        <CheckGroup
          options={PRICE_OPTIONS}
          selected={filters.price}
          onToggle={(k) => patch({ price: toggle(filters.price, k) })}
        />
      </Dropdown>

      {/* All filters — blue outline */}
      <button
        type="button"
        onClick={onOpenAllFilters}
        className="inline-flex h-[52px] shrink-0 items-center gap-2 rounded-full border-2 border-[#3438FF] bg-white px-5 text-[15px] font-semibold text-brand-900 transition-colors hover:bg-[#3438FF]/5"
      >
        <Icon name="sliders-horizontal" size={18} className="text-[#3438FF]" />
        All filters
      </button>
    </div>
  );
}
