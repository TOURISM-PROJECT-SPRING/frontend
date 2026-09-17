import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";
import NearbyHotelCard from "./NearbyHotelCard";

// "You may also like" — popular nearby stays.
export default function NearbyHotels({ hotels = [], isFavorite, onToggleFavorite }) {
  if (!hotels.length) return null;
  return (
    <section aria-labelledby="nearby-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="nearby-heading" className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">You may also like</h2>
          <p className="mt-1 text-sm font-semibold text-muted">Popular Nearby</p>
        </div>
        <Link to="/hotel" className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900 hover:decoration-brand-400">
          See all
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>

      <div className="hide-scrollbar mt-5 flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
        {hotels.map((h) => (
          <div key={h.id} className="w-[80vw] shrink-0 snap-start sm:w-[45%] lg:w-auto lg:shrink">
            <NearbyHotelCard hotel={h} favorite={isFavorite?.(h.id)} onToggleFavorite={onToggleFavorite} />
          </div>
        ))}
      </div>
    </section>
  );
}
