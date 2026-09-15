import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useToast } from "../components/ui/Toast";
import { useRestaurants } from "../hooks/useResource";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { items: restaurants, loading, source } = useRestaurants();
  const toast = useToast();

  const [showReservePrompt, setShowReservePrompt] = useState(false);
  const [reserveDate, setReserveDate] = useState("");
  const [reserveTime, setReserveTime] = useState("");
  const [reserveGuests, setReserveGuests] = useState(2);

  const restaurant = restaurants.find((r) => String(r.id) === String(id));

  const handleReserve = () => {
    setShowReservePrompt(true);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="aspect-[3/1] w-full" />
        <Skeleton className="mt-6 h-10 w-1/3" />
        <Skeleton className="mt-4 h-6 w-2/3" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Restaurant not found" message="This restaurant may have been removed or is unavailable." icon="utensils" />
        <div className="mt-6 text-center">
          <Link to="/restaurant" className="font-bold text-brand-700 hover:text-brand-800">
            ← Back to restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="relative isolate">
        {restaurant.image ? (
          <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
            <SmartImage src={restaurant.image} alt={restaurant.title} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[50vh] min-h-[360px] w-full bg-gradient-to-br from-brand-700 to-brand-500" />
        )}

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <Icon name="chevron-right" size={14} />
              <Link to="/restaurant" className="hover:text-white">Restaurants</Link>
              <Icon name="chevron-right" size={14} />
              <span className="font-semibold text-white">{restaurant.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {restaurant.open != null && (
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  restaurant.open
                    ? "bg-success/90 text-white"
                    : "bg-white/15 text-white/80 backdrop-blur ring-1 ring-white/20"
                }`}>
                  {restaurant.open ? "Open Now" : "Closed"}
                </span>
              )}
              {restaurant.category && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur ring-1 ring-white/20">
                  {restaurant.category}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{restaurant.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {restaurant.rating != null && <Rating value={restaurant.rating} reviews={restaurant.reviews} light />}
              {restaurant.location && (
                <span className="flex items-center gap-1.5">
                  <Icon name="map-pin" size={15} className="text-gold-300" />
                  {restaurant.location}
                </span>
              )}
              {restaurant.openLabel && (
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" size={15} className="text-gold-300" />
                  {restaurant.openLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Description */}
            {restaurant.description && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">About this restaurant</h2>
                <p className="mt-3 leading-relaxed text-muted">{restaurant.description}</p>
              </section>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap gap-3">
              {restaurant.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="utensils" size={16} /> {restaurant.category}
                </span>
              )}
              {restaurant.location && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="map-pin" size={16} /> {restaurant.location}
                </span>
              )}
              {restaurant.openLabel && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="clock" size={16} /> {restaurant.openLabel}
                </span>
              )}
            </div>

            {/* Contact Info */}
            <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold text-brand-800">Contact information</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {restaurant.phone && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="phone" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Phone</p>
                      <p className="text-sm font-semibold text-brand-800">{restaurant.phone}</p>
                    </div>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="mail" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Email</p>
                      <p className="text-sm font-semibold text-brand-800">{restaurant.email}</p>
                    </div>
                  </div>
                )}
                {restaurant.location && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="map-pin" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Location</p>
                      <p className="text-sm font-semibold text-brand-800">{restaurant.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {source === "demo" && <DemoNote />}
          </div>

          {/* Reservation Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gold-300 bg-white p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Reserve a table</p>
                  <p className="font-display text-xl font-bold text-brand-800">
                    {restaurant.open != null ? (restaurant.open ? "Open now" : "Currently closed") : "Reserve"}
                  </p>
                </div>
                {restaurant.rating != null && (
                  <div className="flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5">
                    <Icon name="star" size={14} className="text-gold-500" fill="currentColor" stroke="none" />
                    <span className="text-sm font-bold text-brand-800">{Number(restaurant.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="calendar" size={14} className="text-brand-500" /> Date
                  </span>
                  <input
                    type="date"
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="clock" size={14} className="text-brand-500" /> Time
                  </span>
                  <select
                    value={reserveTime}
                    onChange={(e) => setReserveTime(e.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                  >
                    <option value="">Select time</option>
                    {["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="users" size={14} className="text-brand-500" /> Guests
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-3">
                    <button
                      type="button"
                      onClick={() => setReserveGuests((g) => Math.max(1, g - 1))}
                      className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50"
                    >
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="min-w-[3ch] text-center text-lg font-bold text-brand-800">{reserveGuests}</span>
                    <button
                      type="button"
                      onClick={() => setReserveGuests((g) => Math.min(20, g + 1))}
                      className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800"
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md"
              >
                <Icon name="utensils" size={18} />
                Reserve Table
              </button>

              <div className="mt-4 space-y-1.5 text-[11px] font-medium text-muted">
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Instant confirmation
                </p>
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> No pre-payment required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Prompt Modal */}
      {showReservePrompt && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowReservePrompt(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lift animate-scalein"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name="utensils" size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-brand-800">Reserve a table?</h3>
            <p className="mt-2 text-sm text-muted">
              You&apos;re reserving a table at <strong>{restaurant.title}</strong> for {reserveGuests} guest{reserveGuests > 1 ? "s" : ""}
              {reserveDate ? ` on ${new Date(reserveDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` : ""}
              {reserveTime ? ` at ${reserveTime}` : ""}.
            </p>
            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-brand-800">
                <Icon name="check-circle" size={16} className="text-success" />
                <span className="font-semibold">Reservation is free — no payment required</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowReservePrompt(false)}
                className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReservePrompt(false);
                  toast.success(`Table reserved at ${restaurant.title}!`);
                }}
                className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
