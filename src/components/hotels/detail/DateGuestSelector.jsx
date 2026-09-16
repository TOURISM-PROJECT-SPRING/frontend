import { useEffect, useRef, useState } from "react";
import Icon from "../../ui/Icon";

/* ---------------- date helpers (ISO yyyy-mm-dd <-> Date at local midnight) -------- */
function parseISO(s) {
  if (!s) return null;
  const [y, m, d] = String(s).split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}
function toISO(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function shortLabel(s) {
  const d = parseISO(s);
  if (!d) return "Add date";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ---------------- outside-click popover wrapper ---------------- */
function Popover({ open, onClose, children, align = "left", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute top-full z-30 mt-2 rounded-2xl border border-line bg-white p-4 shadow-lift animate-scalein ${
        align === "right" ? "right-0" : "left-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- month calendar ---------------- */
function Calendar({ view, onView, checkIn, checkOut, onPick }) {
  const first = startOfMonth(view);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const min = today();
  const ci = parseISO(checkIn);
  const co = parseISO(checkOut);
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  return (
    <div className="w-[248px]">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onView(addMonths(view, -1))}
          disabled={addMonths(view, -1) < startOfMonth(min)}
          className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition hover:bg-brand-50 disabled:opacity-30"
        >
          <Icon name="chevron-left" size={16} />
        </button>
        <span className="text-sm font-bold text-brand-900">
          {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button type="button" aria-label="Next month" onClick={() => onView(addMonths(view, 1))} className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition hover:bg-brand-50">
          <Icon name="chevron-right" size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] font-semibold text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-1">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <span key={`e${i}`} />;
          const disabled = date < min;
          const inRange = ci && co && date > ci && date < co;
          const isEdge = sameDay(date, ci) || sameDay(date, co);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onPick(toISO(date))}
              aria-label={date.toDateString()}
              className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                disabled
                  ? "cursor-not-allowed text-muted/40"
                  : isEdge
                    ? "bg-brand-700 text-white"
                    : inRange
                      ? "bg-brand-100 text-brand-800"
                      : "text-brand-900 hover:bg-brand-50"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- number stepper ---------------- */
function Stepper({ label, value, min = 0, max = 20, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-7 w-7 place-items-center rounded-full border border-brand-300 text-brand-700 transition hover:bg-brand-50 disabled:opacity-40"
        >
          <Icon name="minus" size={14} />
        </button>
        <span className="w-5 text-center text-sm font-bold text-brand-900">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-7 w-7 place-items-center rounded-full border border-brand-300 text-brand-700 transition hover:bg-brand-50 disabled:opacity-40"
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- public component ---------------- */
export default function DateGuestSelector({ value, onChange }) {
  const { checkIn, checkOut, adults, children, rooms } = value;
  const [dateOpen, setDateOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [view, setView] = useState(() => startOfMonth(parseISO(checkIn) || today()));

  const set = (patch) => onChange(patch);

  const pickDate = (iso) => {
    const d = parseISO(iso);
    const ci = parseISO(checkIn);
    const co = parseISO(checkOut);
    if (!ci || (ci && co)) {
      set({ checkIn: iso, checkOut: "" });
      setView(startOfMonth(d));
    } else if (d <= ci) {
      set({ checkIn: iso, checkOut: "" });
    } else {
      set({ checkOut: iso });
      setDateOpen(false);
    }
  };

  const totalGuests = adults + children;
  const guestLabel = `${rooms} Room${rooms > 1 ? "s" : ""}, ${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {/* Dates */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setDateOpen((v) => !v); setGuestOpen(false); }}
          aria-expanded={dateOpen}
          aria-haspopup="dialog"
          className={`flex h-full w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-colors ${
            dateOpen ? "border-brand-500 ring-2 ring-brand-500/15" : "border-line hover:border-brand-300"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon name="calendar-days" size={18} /></span>
          <span className="flex flex-1 items-center justify-between gap-2">
            <span className="flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">Check In</span>
              <span className="block text-sm font-semibold text-brand-900">{shortLabel(checkIn)}</span>
            </span>
            <span className="h-8 w-px bg-line" />
            <span className="flex-1 text-right">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">Check Out</span>
              <span className="block text-sm font-semibold text-brand-900">{shortLabel(checkOut)}</span>
            </span>
          </span>
        </button>
        <Popover open={dateOpen} onClose={() => setDateOpen(false)} className="w-auto p-3">
          <Calendar view={view} onView={setView} checkIn={checkIn} checkOut={checkOut} onPick={pickDate} />
        </Popover>
      </div>

      {/* Guests */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setGuestOpen((v) => !v); setDateOpen(false); }}
          aria-expanded={guestOpen}
          aria-haspopup="dialog"
          className={`flex h-full w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-colors ${
            guestOpen ? "border-brand-500 ring-2 ring-brand-500/15" : "border-line hover:border-brand-300"
          }`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon name="users-round" size={18} /></span>
          <span className="flex-1">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">Rooms / Guests</span>
            <span className="block text-sm font-semibold text-brand-900">{guestLabel}</span>
          </span>
          <Icon name="chevron-down" size={16} className={`text-muted transition-transform ${guestOpen ? "rotate-180" : ""}`} />
        </button>
        <Popover open={guestOpen} onClose={() => setGuestOpen(false)} align="right" className="w-[260px]">
          <div className="divide-y divide-line">
            <Stepper label="Adults" value={adults} min={1} onChange={(v) => set({ adults: v })} />
            <Stepper label="Children" value={children} min={0} onChange={(v) => set({ children: v })} />
            <Stepper label="Rooms" value={rooms} min={1} max={8} onChange={(v) => set({ rooms: v })} />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-muted">Maximum 8 guests per room. Rates may vary by occupancy.</p>
        </Popover>
      </div>
    </div>
  );
}
