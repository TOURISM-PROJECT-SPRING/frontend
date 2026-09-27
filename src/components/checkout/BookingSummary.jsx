import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import PromoCodeCard from "./PromoCodeCard";
import { longDate, cancellationInfo } from "./checkoutData";

function CountdownBanner({ seconds, expired }) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold ${expired ? "bg-danger/10 text-danger" : "bg-[#F8D9DE] text-[#8a2740]"}`}>
      <Icon name="clock" size={17} className="shrink-0" />
      <span>{expired ? "Reservation hold expired" : `We'll hold your spot for ${mm}:${String(ss).padStart(2, "0")} minutes`}</span>
    </div>
  );
}

export default function BookingSummary({ booking, money, promo, onApplyPromo, onRemovePromo, onOpenChange, seconds, expired }) {
  const ratingDots = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-4">
      <CountdownBanner seconds={seconds} expired={expired} />

      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        {/* Activity header */}
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold leading-snug text-brand-900">{booking.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-display text-sm font-bold text-brand-800">{Number(booking.rating).toFixed(1)}</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {ratingDots.map((n) => (
                  <span key={n} className={`h-2 w-2 rounded-full ${n <= Math.round(booking.rating) ? "bg-brand-600" : "bg-brand-200"}`} />
                ))}
              </span>
              <span className="text-xs text-muted">({Number(booking.reviews || 0).toLocaleString("en-US")})</span>
            </div>
            <p className="mt-1 text-xs text-muted underline underline-offset-2">By {booking.operator}</p>
          </div>
          <SmartImage src={booking.image} alt={booking.title} ratio="1 / 1" className="h-16 w-16 shrink-0 rounded-lg border border-line" />
        </div>

        {/* Booking info */}
        <div className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
          <p className="flex items-center gap-2.5 text-brand-800"><Icon name="ticket" size={16} className="text-brand-500" /> {booking.subtitle}</p>
          <p className="flex items-center gap-2.5 text-brand-800"><Icon name="calendar" size={16} className="text-brand-500" /> {longDate(booking.date)} • {booking.time}</p>
          <p className="flex items-center justify-between text-brand-800">
            <span className="flex items-center gap-2.5"><Icon name="users" size={16} className="text-brand-500" /> {booking.guests} adult{booking.guests > 1 ? "s" : ""}</span>
            <button type="button" onClick={onOpenChange} className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">Change</button>
          </p>
        </div>

        {/* Cancellation */}
        <div className="mt-4 border-t border-line pt-4">
          <p className="flex items-start gap-2 text-sm font-semibold text-brand-700">
            <Icon name="refresh" size={16} className="mt-0.5 shrink-0" />
            <span>{cancellationInfo({ cancelCutoff: booking.cancelCutoff, freeCancel: booking.freeCancel }).label}</span>
          </p>
        </div>

        <PromoCodeCard promo={promo} onApply={onApplyPromo} onRemove={onRemovePromo} />

        {/* Total */}
        <div className="mt-2 flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
          <span className="font-display text-base font-bold text-brand-800">Total</span>
          <span className="font-display text-xl font-bold text-brand-800">{money.usd(money.total)}</span>
        </div>
        {promo.applied && (
          <p className="mt-1 text-right text-xs font-semibold text-brand-600">You saved {money.usd(money.discount)} with {promo.code}</p>
        )}
      </div>

      {/* Support */}
      <div className="rounded-2xl border border-line bg-white p-5">
        <h4 className="font-display text-base font-bold text-brand-800">24/7 global support</h4>
        <div className="mt-3 space-y-2.5 text-sm">
          <p className="flex items-center gap-2.5 text-brand-700">
            <Icon name="phone" size={16} className="text-brand-500" />
            <a href="tel:+8552755071" className="font-bold underline underline-offset-2">+855 275 5071</a>
          </p>
          <p className="flex items-center gap-2.5 text-brand-700">
            <Icon name="message-circle" size={16} className="text-brand-500" />
            <button type="button" className="font-bold underline underline-offset-2">Chat now</button>
          </p>
        </div>
      </div>
    </div>
  );
}
