import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import ListingCard from "../components/cards/ListingCard";
import { Pill } from "../components/ui/StatusBadge";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useTour, useTourRecommendations } from "../hooks/useResource";
import { money } from "../lib/format";

export default function TourDetailPage() {
  const { id } = useParams();
  const { items, loading, source } = useTour(id);
  const tour = items[0];
  const [active, setActive] = useState(0);
  const rec = useTourRecommendations(tour);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 aspect-[16/9] w-full" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-1/2" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Tour not found" message="This experience may no longer be available." icon="compass" />
        <div className="mt-6 text-center">
          <Link to="/tours" className="font-bold text-brand-700 hover:text-brand-800">← Back to all tours</Link>
        </div>
      </div>
    );
  }

  const gallery = tour.images?.length ? tour.images : [tour.image].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <Icon name="chevron-right" size={14} />
        <Link to="/tours" className="hover:text-brand-700">Tours</Link>
        <Icon name="chevron-right" size={14} />
        <span className="font-semibold text-brand-700">{tour.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[24px] border border-line shadow-soft">
            <SmartImage src={gallery[active] || gallery[0]} alt={tour.title} className="aspect-[16/10] w-full" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${i === active ? "border-brand-600" : "border-transparent opacity-80 hover:opacity-100"}`}
                >
                  <SmartImage src={g} alt="" className="h-full w-full" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {tour.category && <Pill tone="neutral">{tour.category}</Pill>}
            {tour.status && <Pill tone="success">{tour.status}</Pill>}
            {tour.rating != null && <Rating value={tour.rating} reviews={tour.reviews} />}
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold text-brand-800 sm:text-4xl">{tour.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="map-pin" size={16} className="text-brand-400" /> {tour.location || tour.address || "Cambodia"}
          </p>

          {tour.description && (
            <div className="mt-6">
              <h2 className="font-display text-xl font-bold text-brand-800">About this experience</h2>
              <p className="mt-2 leading-relaxed text-muted">{tour.description}</p>
            </div>
          )}

          {tour.tickets?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-brand-800">Tickets & pricing</h2>
              <div className="mt-3 space-y-3">
                {tour.tickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl border border-line bg-white p-4">
                    <div>
                      <p className="text-sm font-bold text-brand-800">{t.name}</p>
                      {t.description && <p className="text-xs text-muted">{t.description}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-brand-700">{money(t.price)}</span>
                      <button className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] border border-line bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted">From</p>
                <p className="font-display text-3xl font-bold text-brand-700">
                  {tour.price != null ? money(tour.price) : "—"}
                  {tour.price != null && <span className="text-sm font-medium text-muted"> {tour.priceUnit}</span>}
                </p>
              </div>
              {tour.rating != null && <Rating value={tour.rating} />}
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Date</span>
                <input type="date" className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Guests</span>
                <select className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15">
                  <option>1 Adult</option><option>2 Adults</option><option>3 Adults</option><option>Family (2+2)</option>
                </select>
              </label>
            </div>

            <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 text-sm font-bold text-brand-900 transition-colors hover:bg-gold-300">
              <Icon name="ticket" size={18} /> Reserve now
            </button>
            <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line text-sm font-bold text-brand-700 hover:bg-brand-50">
              <Icon name="heart" size={17} /> Save
            </button>

            <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-muted">
              <li className="flex items-center gap-2"><Icon name="check" size={16} className="text-success" /> Free cancellation up to 24h</li>
              <li className="flex items-center gap-2"><Icon name="check" size={16} className="text-success" /> Licensed local guides</li>
              <li className="flex items-center gap-2"><Icon name="shield" size={16} className="text-success" /> Secure payment</li>
            </ul>
          </div>
          {source === "demo" && <div className="mt-4"><DemoNote /></div>}
        </aside>
      </div>

      {/* Same-province recommendations */}
      <section className="mt-14 border-t border-line pt-10">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-gold-400" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
            Complete your {tour.location || tour.province || "trip"} trip
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold text-brand-800 sm:text-3xl">
          Stay &amp; eat near this experience
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Handpicked hotels and restaurants in {tour.province || tour.location || "the same province"},
          so everything in your journey is close by.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
              <Icon name="bed" size={20} className="text-brand-500" /> Hotels nearby
            </h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {rec.loading
                ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
                : rec.hotels.map((h) => <ListingCard key={h.id} item={h} />)}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
              <Icon name="utensils" size={20} className="text-brand-500" /> Restaurants nearby
            </h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {rec.loading
                ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)
                : rec.restaurants.map((r) => <ListingCard key={r.id} item={r} />)}
            </div>
          </div>
        </div>
        {rec.source === "demo" && !rec.loading && <div className="mt-6"><DemoNote /></div>}
      </section>
    </div>
  );
}
