import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatusBadge from "../manager/StatusBadge";
import { money } from "../../lib/format";

const KIND = {
  tour: { icon: "binoculars", domain: "Tour", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  hotel: { icon: "bed", domain: "Hotel", color: "bg-amber-50 text-amber-700 border-amber-200" },
  restaurant: { icon: "utensils", domain: "Restaurant", color: "bg-blue-50 text-blue-700 border-blue-200" },
};

function FallbackThumb({ kind }) {
  const meta = KIND[kind] || KIND.tour;
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-900">
      <Icon name={meta.icon} size={28} className="text-gold-400" />
    </div>
  );
}

export default function TripCard({ trip, onSelect }) {
  const meta = KIND[trip.kind] || KIND.tour;
  const amount = money(trip.amount);

  return (
    <article
      onClick={() => onSelect?.(trip)}
      className="group relative flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift sm:flex-row sm:items-center sm:p-5 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl border border-line/60 sm:h-24 sm:w-28">
        {trip.image ? (
          <SmartImage
            src={trip.image}
            alt={trip.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-108"
          />
        ) : (
          <FallbackThumb kind={trip.kind} />
        )}
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-2xs ${meta.color}`}
        >
          <Icon name={meta.icon} size={11} />
          {meta.domain}
        </span>
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {trip.reference && (
            <span className="font-mono text-[11px] font-semibold text-muted">
              {trip.reference}
            </span>
          )}
        </div>
        <h3 className="mt-1 line-clamp-1 font-display text-base font-bold text-brand-900 transition-colors group-hover:text-brand-600 sm:text-lg">
          {trip.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          {trip.location && (
            <span className="flex items-center gap-1.5">
              <Icon name="map-pin" size={13} className="text-brand-500 shrink-0" />
              <span className="truncate">{trip.location}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" size={13} className="text-brand-500 shrink-0" />
            <span>{trip.date || "—"}</span>
          </span>
          {trip.guests && (
            <span className="flex items-center gap-1.5">
              <Icon name="users" size={13} className="text-brand-500 shrink-0" />
              <span>{trip.guests} {trip.guests > 1 ? "guests" : "guest"}</span>
            </span>
          )}
        </div>
      </div>

      {/* Amount & Status Badge */}
      <div className="flex items-center justify-between border-t border-line/50 pt-3 sm:border-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2 shrink-0">
        {amount != null && (
          <span className="font-display text-lg font-extrabold text-brand-800">
            {amount}
          </span>
        )}
        <div className="flex items-center gap-2">
          <StatusBadge status={trip.status} />
          <span className="hidden text-xs font-bold text-brand-700 underline underline-offset-2 sm:inline group-hover:text-brand-900">
            Details
          </span>
        </div>
      </div>
    </article>
  );
}