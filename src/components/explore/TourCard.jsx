import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import GuideInfo, { GuideFallbackNote } from "./GuideInfo";
import { money } from "../../lib/format";

export default function TourCard({ tour, onSelect, onAdd, guide }) {
  const price = tour.price != null ? money(tour.price) : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift">
      <button
        type="button"
        onClick={() => onSelect(tour)}
        className="relative block w-full text-left"
        aria-label={`View ${tour.title}`}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <SmartImage
            src={tour.image}
            alt={tour.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {tour.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-700 backdrop-blur">
              {tour.category}
            </span>
          )}
          {tour.duration && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[11px] font-bold text-brand-900">
              <Icon name="clock" size={12} />
              {tour.duration}
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-snug text-brand-800">
            {tour.title}
          </h3>
          {tour.rating != null && (
            <Rating value={tour.rating} size="sm" />
          )}
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
          <Icon name="map-pin" size={14} className="shrink-0 text-brand-400" />
          {tour.province || tour.location || "Cambodia"}
          {tour.location && tour.province && tour.location !== tour.province ? ` · ${tour.location}` : ""}
        </p>

        {tour.subtitle && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{tour.subtitle}</p>
        )}

        <div className="mt-4 border-t border-line pt-4">
          {tour.guide || guide ? (
            <GuideInfo guide={tour.guide || guide} compact />
          ) : (
            <GuideFallbackNote />
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            {price ? (
              <>
                <p className="text-[11px] font-semibold uppercase text-muted">From</p>
                <p className="font-display text-xl font-bold text-brand-700">
                  {price}
                  <span className="text-xs font-medium text-muted"> {tour.priceUnit}</span>
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-brand-700">Price on request</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSelect(tour)}
              className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-brand-700 transition-colors duration-500 ease-out hover:bg-brand-50"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onAdd(tour)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400 px-3 py-2 text-xs font-bold text-brand-900 transition-colors duration-500 ease-out hover:bg-gold-300"
            >
              <Icon name="plus" size={14} />
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}