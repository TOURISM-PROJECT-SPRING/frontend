import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import Icon from "../ui/Icon";

const TIMES = ["11:00", "11:30", "12:00", "12:30", "13:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

function isoPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ReservationModal({ open, onClose, restaurants = [], initialRestaurantId }) {
  const [restaurantId, setRestaurantId] = useState("");
  const [date, setDate] = useState(isoPlus(1));
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setRestaurantId(initialRestaurantId || restaurants[0]?.id || "");
      setDate(isoPlus(1));
      setTime("19:00");
      setGuests(2);
      setDone(false);
    }
  }, [open, initialRestaurantId, restaurants]);

  const chosen = restaurants.find((r) => r.id === restaurantId) || restaurants[0];

  const fieldClass =
    "h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm font-medium text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10";
  const labelClass = "mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={done ? "Reservation" : "Reserve a table"}
      size="md"
      footer={
        done ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            Done
          </button>
        ) : (
          <button
            type="button"
            disabled={!chosen}
            onClick={() => setDone(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800 disabled:opacity-50"
          >
            <Icon name="search" size={16} />
            Find a table
          </button>
        )
      }
    >
      {done ? (
        <div className="py-2 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/12 text-success">
            <Icon name="check-circle" size={30} />
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-brand-800">Available tables found</h3>
          <p className="mt-1.5 text-sm text-muted">
            We found {guests} {guests === 1 ? "seat" : "seats"} for you. This is a demo — no payment is taken.
          </p>
          <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-line bg-canvas p-4 text-left text-sm">
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted">Restaurant</span>
              <span className="text-right font-bold text-brand-900">{chosen?.name}</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted">Date</span>
              <span className="font-semibold text-ink">{prettyDate(date)}</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted">Time</span>
              <span className="font-semibold text-ink">{time}</span>
            </div>
            <div className="flex justify-between gap-4 py-1">
              <span className="text-muted">Guests</span>
              <span className="font-semibold text-ink">{guests}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <label className="block">
            <span className={labelClass}>
              <Icon name="utensils" size={14} className="text-brand-500" /> Restaurant
            </span>
            <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} className={fieldClass}>
              {restaurants.length === 0 && <option value="">No restaurants</option>}
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                <Icon name="calendar" size={14} className="text-brand-500" /> Date
              </span>
              <input type="date" value={date} min={isoPlus(0)} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
            </label>

            <label className="block">
              <span className={labelClass}>
                <Icon name="clock" size={14} className="text-brand-500" /> Time
              </span>
              <select value={time} onChange={(e) => setTime(e.target.value)} className={fieldClass}>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="block">
            <span className={labelClass}>
              <Icon name="users" size={14} className="text-brand-500" /> Guests
            </span>
            <div className="flex h-11 items-center gap-3 rounded-xl border border-line bg-canvas px-3">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                aria-label="Fewer guests"
                className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition hover:bg-brand-50"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="min-w-[3ch] text-center text-base font-bold text-brand-800">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(20, g + 1))}
                aria-label="More guests"
                className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white transition hover:bg-brand-800"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
