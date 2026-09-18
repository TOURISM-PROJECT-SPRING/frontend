import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { longDate } from "./checkoutData";

function CancellationNote({ cutoff }) {
  return (
    <p className="flex items-start gap-2 text-sm font-semibold text-brand-700">
      <Icon name="refresh" size={16} className="mt-0.5 shrink-0 text-brand-600" />
      <span>
        Free cancellation before {cutoff}
        <span className="block text-xs font-medium text-muted">(tour local time)</span>
      </span>
    </p>
  );
}

export default function ActivityDetailsCard({ booking, travelerName, onEdit }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">2</span>
        <h2 className="font-display text-2xl font-bold text-brand-800">Activity details</h2>
        <button type="button" onClick={onEdit} className="ml-auto text-sm font-bold text-brand-700 underline underline-offset-4 hover:text-brand-800">
          Edit
        </button>
      </div>

      {/* Activity summary row */}
      <div className="mt-6 flex gap-4">
        <SmartImage src={booking.image} alt={booking.title} ratio="1 / 1" className="h-24 w-24 shrink-0 rounded-xl border border-line sm:h-28 sm:w-28" />
        <div className="min-w-0 flex-1">
          <CancellationNote cutoff={booking.cancelCutoff} />
          <h3 className="mt-3 font-display text-lg font-bold leading-snug text-brand-900">{booking.title}</h3>
          {booking.subtitle && <p className="mt-0.5 text-sm font-semibold text-muted">{booking.subtitle}</p>}
          <p className="mt-2 flex items-center gap-2 text-sm text-brand-800">
            <Icon name="calendar" size={15} className="text-brand-500" />
            {longDate(booking.date)} • {booking.time}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-brand-800">
            <Icon name="users" size={15} className="text-brand-500" />
            {booking.guests} {booking.guests > 1 ? "Adults" : "Adult"}
          </p>
        </div>
      </div>

      {/* Travelers */}
      <h4 className="mt-7 font-display text-base font-bold text-brand-800">Travelers</h4>
      <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-white p-4">
        <div>
          <p className="font-bold text-brand-900">{travelerName || "Lead traveler"}</p>
          <p className="text-sm text-muted">Adult (Lead Traveler)</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Icon name="user" size={18} />
        </span>
      </div>

      {/* Language + pickup */}
      <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        <p className="flex items-center gap-2.5 text-brand-800">
          <Icon name="globe" size={16} className="text-brand-500" />
          <span className="font-semibold">{booking.language || "English - Guide"}</span>
        </p>
        <p className="flex items-center gap-2.5 text-brand-800">
          <Icon name="map-pin" size={16} className="text-brand-500" />
          <span className="font-semibold">{booking.pickup || "I live locally / I'm staying with friends, relatives"}</span>
        </p>
      </div>
    </section>
  );
}
