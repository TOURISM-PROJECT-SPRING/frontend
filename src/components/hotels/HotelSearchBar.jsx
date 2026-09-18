import { useState } from "react";
import Icon from "../ui/Icon";

// Horizontal booking search bar: Destination / Dates / Rooms & Guests + Search + Map.
// All values are controlled by the page so results can react live.

function fmtDayLabel(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function FieldShell({ icon, label, children, className = "" }) {
  return (
    <label className={`group relative flex min-w-0 cursor-pointer flex-col rounded-xl border border-line bg-white px-4 py-2.5 text-left transition hover:border-brand-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 ${className}`}>
      <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-muted">
        <Icon name={icon} size={14} className="text-brand-500" />
        {label}
      </span>
      {children}
    </label>
  );
}

function Stepper({ label, hint, value, min, max, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-bold text-ink">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-8 w-8 place-items-center rounded-full border border-line text-brand-700 transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-40"
        >
          <Icon name="minus" size={14} />
        </button>
        <span className="w-5 text-center text-sm font-bold text-ink">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-8 w-8 place-items-center rounded-full border border-line text-brand-700 transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-40"
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}

export default function HotelSearchBar({
  destination,
  onDestination,
  dates,
  onDates,
  guests,
  onGuests,
  onSearch,
  onMap,
  mapActive = false,
}) {
  const [guestsOpen, setGuestsOpen] = useState(false);
  const totalGuests = guests.adults + guests.children;

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      {/* Destination */}
      <FieldShell icon="map-pin" label="Destination" className="w-full sm:w-auto sm:min-w-[240px] sm:flex-1 lg:max-w-sm lg:flex-none">
        <input
          value={destination}
          onChange={(e) => onDestination(e.target.value)}
          placeholder="Where are you going?"
          aria-label="Destination"
          className="bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-medium placeholder:text-muted/70"
        />
      </FieldShell>

      {/* Dates */}
      <FieldShell icon="calendar-days" label="Dates" className="w-full sm:w-auto sm:min-w-[260px] sm:flex-1">
        <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <input
            type="date"
            value={dates.checkIn}
            aria-label="Check-in date"
            onChange={(e) => onDates({ ...dates, checkIn: e.target.value })}
            className="w-1/2 min-w-0 bg-transparent text-[14px] font-semibold text-ink outline-none [color-scheme:light]"
          />
          <span className="text-muted">→</span>
          <input
            type="date"
            value={dates.checkOut}
            min={dates.checkIn || undefined}
            aria-label="Check-out date"
            onChange={(e) => onDates({ ...dates, checkOut: e.target.value })}
            className="w-1/2 min-w-0 bg-transparent text-[14px] font-semibold text-ink outline-none [color-scheme:light]"
          />
        </span>
        <span className="sr-only">{fmtDayLabel(dates.checkIn)} to {fmtDayLabel(dates.checkOut)}</span>
      </FieldShell>

      {/* Rooms / Guests */}
      <div className="relative flex w-full sm:w-auto sm:min-w-[220px] sm:flex-1 lg:max-w-xs lg:flex-none">
        <FieldShell icon="users-round" label="Rooms/Guests" className="w-full">
          <button
            type="button"
            onClick={() => setGuestsOpen((v) => !v)}
            className="w-full truncate bg-transparent text-left text-[15px] font-semibold text-ink"
            aria-expanded={guestsOpen}
          >
            {guests.rooms} Room{guests.rooms > 1 ? "s" : ""}, {totalGuests} Guest{totalGuests !== 1 ? "s" : ""}
          </button>
        </FieldShell>
        {guestsOpen && (
          <>
            <button aria-label="Close guests picker" className="fixed inset-0 z-40 cursor-default" onClick={() => setGuestsOpen(false)} />
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 animate-scalein rounded-2xl border border-line bg-white p-4 shadow-lift">
              <Stepper label="Rooms" value={guests.rooms} min={1} max={8} onChange={(v) => onGuests({ ...guests, rooms: v })} />
              <Stepper label="Adults" hint="16 years or older" value={guests.adults} min={1} max={10} onChange={(v) => onGuests({ ...guests, adults: v })} />
              <Stepper label="Children" hint="Ages 0 – 17" value={guests.children} min={0} max={6} onChange={(v) => onGuests({ ...guests, children: v })} />
              <button
                type="button"
                onClick={() => setGuestsOpen(false)}
                className="mt-2 h-10 w-full rounded-full bg-brand-700 text-sm font-bold text-white transition hover:bg-brand-800"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>

      {/* Actions — anchored to the right */}
      <div className="ml-auto flex w-full items-stretch gap-2 sm:w-auto sm:gap-3">
        <button
          type="button"
          onClick={onMap}
          aria-pressed={mapActive}
          className={`inline-flex h-full min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border px-6 text-base font-bold transition-all duration-200 hover:-translate-y-px hover:shadow-sm active:translate-y-0 sm:flex-none ${
            mapActive
              ? "border-brand-600 bg-brand-50 text-brand-800"
              : "border-line bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50"
          }`}
        >
          <Icon name="map-pin" size={18} className="text-brand-600" />
          Map
        </button>
        <button
          type="button"
          onClick={onSearch}
          className="inline-flex h-full min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-8 text-base font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md active:translate-y-0 sm:flex-none"
        >
          <Icon name="search" size={18} />
          Search
        </button>
      </div>
    </div>
  );
}
