import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money as formatMoney } from "../../lib/format";
import { FULFILMENT, pickupLabel, tableLabel } from "./restaurantCheckoutData";

function QtyStepper({ item, onSetQty }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-canvas p-1">
      <button
        type="button"
        aria-label={`Remove one ${item.title}`}
        onClick={() => onSetQty(item.id, item.qty - 1)}
        className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition-colors hover:bg-white"
      >
        <Icon name="minus" size={15} />
      </button>
      <span className="min-w-[2ch] text-center text-sm font-bold text-brand-800">{item.qty}</span>
      <button
        type="button"
        aria-label={`Add one ${item.title}`}
        onClick={() => onSetQty(item.id, item.qty + 1)}
        className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white transition-colors hover:bg-brand-800"
      >
        <Icon name="plus" size={15} />
      </button>
    </div>
  );
}

function LineItem({ item, onSetQty, onRemove }) {
  const line = (Number(item.price) || 0) * (Number(item.qty) || 0);
  return (
    <li className="flex gap-3.5 rounded-2xl border border-line bg-white p-3">
      <SmartImage src={item.image} alt={item.title} className="h-20 w-20 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 font-display text-sm font-bold leading-snug text-brand-800">{item.title}</p>
          <span className="shrink-0 font-display text-sm font-bold text-brand-800">{formatMoney(line, { digits: 2 })}</span>
        </div>
        <p className="mt-0.5 text-xs font-semibold text-muted">{formatMoney(item.price, { digits: 2 })} each</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <QtyStepper item={item} onSetQty={onSetQty} />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.title} from order`}
            className="inline-flex items-center gap-1 text-xs font-bold text-muted transition-colors hover:text-danger"
          >
            <Icon name="trash" size={13} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export default function RestaurantOrderCard({
  order,
  items = [],
  count = 0,
  slots = [],
  pickupAt,
  onSetPickupTime,
  fulfilment = FULFILMENT.TAKEAWAY,
  onSetFulfilment,
  guests = 2,
  onSetGuests,
  tableNumber = "",
  onSetTable,
  tableOptions = [],
  onSetQty,
  onRemove,
  travelerName,
  contactPhone,
  dialCode = "+855",
}) {
  const isDineIn = fulfilment === FULFILMENT.DINE_IN;
  return (
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">2</span>
        <h2 className="font-display text-2xl font-bold text-brand-800">Order details</h2>
        <span className="ml-auto rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Restaurant header */}
      <div className="mt-6 flex gap-4 rounded-2xl border border-line/70 bg-canvas p-4">
        <SmartImage
          src={order?.restaurantImage}
          alt={order?.restaurantName}
          className="h-20 w-20 shrink-0 rounded-xl border border-line"
        />
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-0.5 text-[11px] font-bold text-gold-700">
            <Icon name={isDineIn ? "utensils" : "shopping-cart"} size={12} />
            {isDineIn ? "Dine-in order" : "Pickup order"}
          </span>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-brand-900">
            {order?.restaurantName}
          </h3>
          {order?.restaurantAddress && (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
              <Icon name="map-pin" size={14} className="shrink-0" />
              <span className="truncate">{order.restaurantAddress}</span>
            </p>
          )}
          {Number(order?.restaurantRating) > 0 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-700">
              <Icon name="star" size={13} className="text-gold-400" fill="currentColor" />
              {Number(order.restaurantRating).toFixed(1)}
            </p>
          )}
        </div>
      </div>

      {/* Line items */}
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <LineItem key={item.id} item={item} onSetQty={onSetQty} onRemove={onRemove} />
        ))}
      </ul>

      {/* Fulfilment: Takeaway or Dine in */}
      <div className="mt-6 border-t border-line pt-5">
        <span className="flex items-center gap-2 text-sm font-bold text-brand-800">
          <Icon name="grid" size={16} className="text-brand-500" />
          How would you like your order?
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Order fulfilment">
          {[
            { value: FULFILMENT.TAKEAWAY, label: "Takeaway", hint: "Collect at the counter", icon: "shopping-cart" },
            { value: FULFILMENT.DINE_IN, label: "Dine in", hint: "Choose a table", icon: "utensils" },
          ].map((opt) => {
            const active = fulfilment === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSetFulfilment?.(opt.value)}
                className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
                  active
                    ? "border-brand-700 bg-brand-50 shadow-soft"
                    : "border-line bg-white hover:border-brand-300 hover:bg-brand-50/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon name={opt.icon} size={17} className={active ? "text-brand-700" : "text-muted"} />
                  <span className={`font-display text-base font-bold ${active ? "text-brand-900" : "text-brand-800"}`}>
                    {opt.label}
                  </span>
                </span>
                <span className="text-xs font-semibold text-muted">{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dine-in: party size + table */}
      {isDineIn && (
        <div className="mt-6 space-y-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
          <div>
            <label htmlFor="dine-in-guests" className="flex items-center gap-2 text-sm font-bold text-brand-800">
              <Icon name="users" size={16} className="text-brand-500" />
              Party size
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSetGuests?.(Math.max(1, guests - 1))}
                aria-label="Fewer guests"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-brand-700 transition-colors hover:bg-brand-50"
              >
                <Icon name="minus" size={16} />
              </button>
              <span className="min-w-[3ch] text-center font-display text-lg font-bold text-brand-800">
                {guests} {guests === 1 ? "guest" : "guests"}
              </span>
              <button
                type="button"
                onClick={() => onSetGuests?.(Math.min(12, guests + 1))}
                aria-label="More guests"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-700 text-white transition-colors hover:bg-brand-800"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="dine-in-table" className="flex items-center gap-2 text-sm font-bold text-brand-800">
              <Icon name="utensils" size={16} className="text-brand-500" />
              Choose your table
            </label>
            <select
              id="dine-in-table"
              value={tableNumber}
              onChange={(e) => onSetTable?.(e.target.value)}
              className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-line bg-white px-3.5 text-[15px] font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            >
              <option value="">Select a table…</option>
              {tableOptions.map((t) => (
                <option key={t.id} value={t.number}>{tableLabel(t)} — {t.area}</option>
              ))}
            </select>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
              <Icon name="info" size={13} className="mt-0.5 shrink-0" />
              Tables shown fit {guests} {guests === 1 ? "guest" : "guests"}. The host will seat you on arrival — table numbers are
              saved with your order on this device only.
            </p>
          </div>
        </div>
      )}

      {/* Pickup window */}
      <div className="mt-6 border-t border-line pt-5">
        <label htmlFor="pickup-slot" className="flex items-center gap-2 text-sm font-bold text-brand-800">
          <Icon name="clock" size={16} className="text-brand-500" />
          {isDineIn ? "Seated at" : "Pickup time"}
        </label>
        <select
          id="pickup-slot"
          value={pickupAt}
          onChange={(e) => onSetPickupTime(e.target.value)}
          className="mt-2 h-12 w-full cursor-pointer rounded-xl border border-line bg-white px-3.5 text-[15px] font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        >
          {slots.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <Icon name="info" size={13} className="shrink-0" />
          {isDineIn
            ? "We'll have the table ready and your dishes plated for this time."
            : "The kitchen starts cooking as soon as you order, so most dishes are ready in about 20 minutes."}
        </p>
      </div>

      {/* Collection contact */}
      <div className="mt-6 space-y-3 border-t border-line pt-5">
        <h4 className="font-display text-base font-bold text-brand-800">Collected by</h4>
        <div className="flex items-center justify-between rounded-xl border border-line bg-white p-4">
          <div className="min-w-0">
            <p className="truncate font-bold text-brand-900">{travelerName || "Guest"}</p>
            <p className="truncate text-sm text-muted">
              {contactPhone ? `${dialCode} ${contactPhone}` : "Add a phone number above"}
            </p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Icon name="user" size={18} />
          </span>
        </div>
        {order?.restaurantPhone && (
          <p className="flex items-center gap-2.5 text-sm text-brand-800">
            <Icon name="phone" size={16} className="text-brand-500" />
            <span className="font-semibold">
              We'll call {order.restaurantName} to confirm. Kitchen line: {order.restaurantPhone}
            </span>
          </p>
        )}
        <p className="flex items-center gap-2.5 text-sm text-brand-800">
          <Icon name={isDineIn ? "utensils" : "shopping-cart"} size={16} className="text-brand-500" />
          <span className="font-semibold">
            {isDineIn
              ? `Table ${tableNumber || "—"} · ${guests} ${guests === 1 ? "guest" : "guests"} · seated at ${pickupLabel(pickupAt)}.`
              : `Takeaway — collect at the counter at ${pickupLabel(pickupAt)}.`}
          </span>
        </p>
      </div>
    </section>
  );
}
