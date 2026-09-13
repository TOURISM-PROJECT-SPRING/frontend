import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import StatusBadge from "../manager/StatusBadge";
import { money } from "../../lib/format";

const KIND = {
  tour: { icon: "luggage", domain: "Tour" },
  hotel: { icon: "bed", domain: "Hotel" },
  restaurant: { icon: "utensils", domain: "Restaurant" },
};

function FallbackThumb({ kind }) {
  const meta = KIND[kind] || KIND.tour;
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-800">
      <Icon name={meta.icon} size={26} className="text-gold-400" />
    </div>
  );
}

export default function TripCard({ trip }) {
  const meta = KIND[trip.kind] || KIND.tour;
  const amount = money(trip.amount);

  return (
    <article className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-brand-300/50 hover:shadow-lift sm:p-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        {trip.image ? (
          <SmartImage
            src={trip.image}
            alt={trip.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        ) : (
          <FallbackThumb kind={trip.kind} />
        )}
        <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-700 backdrop-blur">
          {meta.domain}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-bold text-brand-800 sm:text-lg">
          {trip.title}
        </h3>
        {trip.location && (
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted">
            <Icon name="map-pin" size={13} className="shrink-0 text-brand-400" />
            <span className="truncate">{trip.location}</span>
          </p>
        )}
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Icon name="calendar" size={13} className="shrink-0 text-brand-400" />
          {trip.date || "—"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {amount != null && (
          <span className="font-display text-lg font-bold text-brand-700">{amount}</span>
        )}
        <StatusBadge status={trip.status} />
      </div>
    </article>
  );
}