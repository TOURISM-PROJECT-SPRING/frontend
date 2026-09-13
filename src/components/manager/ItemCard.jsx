import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

export default function ItemCard({ image, title, meta, price, priceUnit, rating, badge, to = "#", actionLabel = "Manage" }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage src={image} alt={title} className="h-full w-full" imgClassName="transition-transform duration-700 ease-out group-hover:scale-110" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="font-display text-base font-bold leading-snug text-brand-800">{title}</h4>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <Icon name="map-pin" size={13} className="text-brand-400" /> {meta}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="flex items-center gap-2 text-sm">
            {price != null && (
              <span className="font-bold text-brand-700">
                {money(price)}
                {priceUnit && <span className="text-xs font-medium text-muted">{priceUnit}</span>}
              </span>
            )}
            {rating != null && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
                <Icon name="star" size={12} className="text-gold-400" fill="currentColor" stroke="none" />
                {Number(rating).toFixed(1)}
              </span>
            )}
          </span>
          <Link to={to} className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50">
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
