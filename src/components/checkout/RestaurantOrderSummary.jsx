import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import PromoCodeCard from "./PromoCodeCard";
import { FULFILMENT, pickupLabel, tableLabel } from "./restaurantCheckoutData";

export default function RestaurantOrderSummary({
  order,
  items = [],
  count = 0,
  money,
  promo,
  onApplyPromo,
  onRemovePromo,
  pickupAt,
  fulfilment = FULFILMENT.TAKEAWAY,
  table = null,
  guests = 2,
  returnTo = "/restaurant",
}) {
  const isDineIn = fulfilment === FULFILMENT.DINE_IN;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        {/* Restaurant header */}
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Ordering from</p>
            <h3 className="mt-1 font-display text-base font-bold leading-snug text-brand-900">
              {order?.restaurantName}
            </h3>
            {order?.restaurantAddress && (
              <p className="mt-1 truncate text-xs text-muted">{order.restaurantAddress}</p>
            )}
            {Number(order?.restaurantRating) > 0 && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-700">
                <Icon name="star" size={13} className="text-gold-400" fill="currentColor" />
                {Number(order.restaurantRating).toFixed(1)}
              </p>
            )}
          </div>
          <SmartImage
            src={order?.restaurantImage}
            alt={order?.restaurantName}
            className="h-16 w-16 shrink-0 rounded-lg border border-line"
          />
        </div>

        {/* Fulfilment + item count */}
        <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
          <p className="flex items-center gap-2.5 text-brand-800">
            <Icon name={isDineIn ? "utensils" : "shopping-cart"} size={16} className="shrink-0 text-brand-500" />
            <span className="font-semibold">{isDineIn ? "Dining in" : "Takeaway"}</span>
          </p>
          <p className="flex items-center gap-2.5 text-brand-800">
            <Icon name="clock" size={16} className="shrink-0 text-brand-500" />
            <span className="font-semibold">
              {isDineIn ? "Seated" : "Pickup"} {pickupLabel(pickupAt)}
            </span>
          </p>
          {isDineIn && (
            <p className="flex items-center gap-2.5 text-brand-800">
              <Icon name="grid" size={16} className="shrink-0 text-brand-500" />
              <span className="font-semibold">
                {table ? `${tableLabel(table)} · ${table.area}` : "No table selected"}
                {` · ${guests} ${guests === 1 ? "guest" : "guests"}`}
              </span>
            </p>
          )}
          <p className="flex items-center gap-2.5 text-brand-800">
            <Icon name="shopping-cart" size={16} className="shrink-0 text-brand-500" />
            <span className="font-semibold">
              {count} {count === 1 ? "item" : "items"} {isDineIn ? "to be served" : "for pickup"}
            </span>
          </p>
        </div>

        {/* Line items */}
        <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3">
              <span className="min-w-0 text-brand-800">
                <span className="font-bold text-brand-700">{item.qty}×</span> {item.title}
              </span>
              <span className="shrink-0 font-semibold text-brand-800">
                {money.usd((Number(item.price) || 0) * (Number(item.qty) || 0))}
              </span>
            </li>
          ))}
        </ul>

        <PromoCodeCard promo={promo} onApply={onApplyPromo} onRemove={onRemovePromo} />

        {/* Totals */}
        <div className="mt-2 space-y-1.5 border-t border-line pt-4 text-sm">
          <p className="flex items-center justify-between text-muted">
            <span>Subtotal</span>
            <span className="font-semibold text-brand-800">{money.usd(money.subtotal)}</span>
          </p>
          {money.discount > 0 && (
            <p className="flex items-center justify-between text-brand-600">
              <span>Discount ({promo.code})</span>
              <span className="font-semibold">-{money.usd(money.discount)}</span>
            </p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
          <span className="font-display text-base font-bold text-brand-800">Total</span>
          <span className="font-display text-xl font-bold text-brand-800">{money.usd(money.total)}</span>
        </div>
        {promo.applied && (
          <p className="mt-1 text-right text-xs font-semibold text-brand-600">
            You saved {money.usd(money.discount)} with {promo.code}
          </p>
        )}

        <Link
          to={returnTo}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
        >
          <Icon name="utensils" size={16} /> Back to the menu
        </Link>
      </div>

      {/* Support */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <h4 className="font-display text-base font-bold text-brand-800">Order support</h4>
        <div className="mt-3 space-y-2.5 text-sm">
          {order?.restaurantPhone && (
            <p className="flex items-center gap-2.5 text-brand-700">
              <Icon name="phone" size={16} className="text-brand-500" />
              <a href={`tel:${order.restaurantPhone}`} className="font-bold underline underline-offset-2">
                {order.restaurantPhone}
              </a>
            </p>
          )}
          <p className="flex items-center gap-2.5 text-brand-700">
            <Icon name="message-circle" size={16} className="text-brand-500" />
            <a href="tel:+8552755071" className="font-bold underline underline-offset-2">+855 275 5071</a>
          </p>
        </div>
      </div>
    </div>
  );
}
