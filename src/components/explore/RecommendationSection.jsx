import Icon from "../ui/Icon";
import HotelCard from "./HotelCard";
import ListingCard from "../cards/ListingCard";
import { EmptyState } from "../ui/feedback";

export default function RecommendationSection({ tour, hotels, restaurants, loading, onAddHotel }) {
  if (!tour) return null;

  const province = tour.province || tour.location || "your destination";

  return (
    <section className="mt-4 animate-rise" key={tour.id}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-400 text-brand-900">
          <Icon name="map-pin" size={18} />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">Same province</p>
          <h2 className="font-display text-xl font-bold text-brand-800 sm:text-2xl">
            Hotels &amp; food recommended for your tour
          </h2>
          <p className="mt-1 text-sm text-muted">
            Everything shown below is in <strong className="text-brand-700">{province}</strong> — stay close to your experience.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-brand-800">
          <Icon name="bed" size={18} className="text-brand-500" /> Staying in {province}
        </h3>
        {loading ? (
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-[20px] border border-line bg-brand-100/50" />
            ))}
          </div>
        ) : hotels.length ? (
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} labelled onAdd={onAddHotel} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="No hotels in this province yet"
              message="New stays are added by local hosts all the time — check back soon."
              icon="bed"
            />
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-brand-800">
          <Icon name="utensils" size={18} className="text-brand-500" /> Eating in {province}
        </h3>
        {restaurants.length ? (
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <ListingCard key={r.id} item={r} />
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            No restaurants listed in {province} yet.
          </p>
        )}
      </div>
    </section>
  );
}