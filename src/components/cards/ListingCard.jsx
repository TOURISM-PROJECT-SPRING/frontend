import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import { OpenBadge } from "../ui/StatusBadge";
import { money } from "../../lib/format";

const CTA = {
  tour: "View Tour",
  hotel: "View",
  restaurant: "Book a Table",
};

export default function ListingCard({ item }) {
  const priceLabel = item.price != null ? money(item.price) : null;
  const isRestaurant = item.kind === "restaurant";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <Link to={item.href} className="relative block aspect-[4/3] overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.title}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/25 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
        {isRestaurant ? (
          <span className="absolute left-3 top-3">
            <OpenBadge open={item.open} />
          </span>
        ) : (
          item.badge && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${
                item.badgeTone === "gold" ? "bg-gold-400 text-brand-900" : "bg-white/90 text-brand-700 backdrop-blur"
              }`}
            >
              {item.badge}
            </span>
          )
        )}
        {item.kind === "hotel" && (
          <button
            aria-label="Save to favorites"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-700 shadow-sm backdrop-blur transition-colors duration-500 ease-out hover:bg-gold-400 hover:text-brand-900"
          >
            <Icon name="heart" size={17} />
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={item.href}>
          <h3 className="font-display text-lg font-bold leading-snug text-brand-800 hover:text-brand-600">
            {item.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
          {item.location && (
            <span className="flex items-center gap-1">
              <Icon name="map-pin" size={14} className="text-brand-400" /> {item.location}
            </span>
          )}
          {item.duration && (
            <span className="flex items-center gap-1">
              <Icon name="clock" size={14} className="text-brand-400" /> {item.duration}
            </span>
          )}
          {isRestaurant && item.category && (
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
              {item.category}
            </span>
          )}
        </div>

        {item.rating != null && (
          <div className="mt-3">
            <Rating value={item.rating} reviews={item.reviews} />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line pt-4">
          <p className="text-xs text-muted">
            {priceLabel ? (
              <>
                {item.kind === "tour" && <span className="mr-1">From</span>}
                <span className="text-lg font-bold text-brand-700">{priceLabel}</span>
                {item.priceUnit && <span className="text-muted">{item.priceUnit}</span>}
              </>
            ) : (
              <span className="text-sm font-semibold text-brand-700">
                {isRestaurant ? "Local dining" : item.kind === "hotel" ? "View rates" : "Explore"}
              </span>
            )}
          </p>
          <Link
            to={item.href}
            className={
              item.kind === "hotel"
                ? "rounded-lg border border-line px-3.5 py-2 text-xs font-bold text-brand-700 transition-colors duration-500 ease-out hover:bg-brand-50"
                : "rounded-lg bg-brand-700 px-3.5 py-2 text-xs font-bold text-white transition-colors duration-500 ease-out hover:bg-brand-800"
            }
          >
            {CTA[item.kind] || "View"}
          </Link>
        </div>
      </div>
    </article>
  );
}
