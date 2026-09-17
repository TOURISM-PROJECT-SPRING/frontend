import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import { OpenBadge } from "../ui/StatusBadge";
import { money } from "../../lib/format";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../ui/Toast";

export default function ListingCard({ item }) {
  const { t } = useTranslation();
  const priceLabel = item.price != null ? money(item.price) : null;
  const isRestaurant = item.kind === "restaurant";
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();
  const saved = isSaved(item.kind, item.id);

  const onToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggle({
      kind: item.kind,
      id: item.id,
      title: item.title,
      image: item.image,
      location: item.location || item.subtitle,
      href: item.href,
    });
    toast[nowSaved ? "success" : "info"](nowSaved ? `Saved "${item.title}" to My trips.` : `Removed "${item.title}" from My trips.`);
  };

  const CTA = {
    tour: t("listingCard.ctaTour"),
    hotel: t("listingCard.ctaHotel"),
    restaurant: t("listingCard.ctaRestaurant"),
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <Link to={item.href} className="relative block aspect-[4/3] overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.title}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
        {/* Hover overlay prompt */}
        <div className="absolute inset-0 flex items-end justify-end bg-brand-950/0 opacity-0 transition-all duration-500 ease-out group-hover:bg-brand-950/20 group-hover:opacity-100">
          <span className="m-4 inline-flex translate-y-2 items-center gap-1.5 rounded-xl bg-gold-400 px-4 py-2 text-xs font-bold text-brand-900 opacity-0 shadow-lg transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <Icon name="eye" size={14} /> View Details
          </span>
        </div>
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
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={saved ? (t("common.removeFromFavorites") || "Remove from My trips") : (t("common.saveFavorites") || "Save to My trips")}
          aria-pressed={saved}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 active:scale-95 ${
            saved ? "bg-white text-danger" : "bg-white/90 text-brand-700 hover:bg-white"
          }`}
        >
          <Icon name="heart" size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={item.href}>
          <h3 className="group-hover:text-brand-600 font-display text-lg font-bold leading-snug text-brand-800">
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
                {item.kind === "tour" && <span className="mr-1">{t("common.from")}</span>}
                <span className="text-lg font-bold text-brand-700">{priceLabel}</span>
                {item.priceUnit && <span className="text-muted">{item.priceUnit}</span>}
              </>
            ) : (
              <span className="text-sm font-semibold text-brand-700">
                {isRestaurant ? t("listingCard.localDining") : item.kind === "hotel" ? t("listingCard.viewRates") : t("listingCard.explore")}
              </span>
            )}
          </p>
          <Link
            to={item.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-700/15 bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-700 transition-colors duration-500 ease-out hover:bg-brand-700 hover:text-white"
          >
            {CTA[item.kind] || t("listingCard.ctaDefault") || "View"}
            <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}