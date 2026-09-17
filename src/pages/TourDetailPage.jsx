import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useToast } from "../components/ui/Toast";
import { useTours } from "../hooks/useResource";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../lib/format";
import GuideInfo from "../components/explore/GuideInfo";

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: tours, loading, source } = useTours();
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");

  const tour = tours.find((t) => String(t.id) === String(id));
  const price = tour?.price != null ? money(tour.price) : null;
  const total = tour?.price != null ? tour.price * guests : 0;
  const gallery = tour?.images?.length ? tour.images : [tour?.image].filter(Boolean);
  const saved = tour ? isSaved("tour", tour.id) : false;

  const handleToggleSave = () => {
    if (!tour) return;
    const nowSaved = toggle({
      kind: "tour",
      id: tour.id,
      title: tour.title,
      image: tour.image,
      location: tour.location || tour.province,
      href: `/tours/${id}`,
    });
    toast[nowSaved ? "success" : "info"](nowSaved ? `Saved "${tour.title}" to My trips.` : `Removed "${tour.title}" from My trips.`);
  };

  const handleBookNow = () => {
    if (!tour) return;
    if (!isAuthenticated) {
      toast.info("Please sign in to book this tour.");
      navigate("/login", { state: { from: `/tours/${id}` } });
      return;
    }
    const isoPlus = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
    navigate("/checkout", {
      state: {
        kind: "tour",
        id: tour.id,
        title: tour.title,
        subtitle: tour.category || "Guided tour",
        image: tour.image,
        operator: tour.operator || "SovannDomNour partner",
        rating: tour.rating ?? 4.8,
        reviews: tour.reviewsCount ?? tour.reviews ?? 0,
        date: date || isoPlus(7),
        time: "9:00 AM",
        guests,
        price: Number(tour.price) || 0,
        priceUnit: tour.priceUnit || "/adult",
        language: "English - Guide",
        pickup: "I live locally / I'm staying with friends, relatives",
        cancelCutoff: "24 hours before the tour start",
      },
    });
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

  if (!tour) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Tour not found" message="This tour may have been removed or is unavailable." icon="compass" />
        <div className="mt-6 text-center">
          <Link to="/tour" className="font-bold text-brand-700 hover:text-brand-800">
            ← Back to tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Image Gallery */}
      <div className="relative isolate">
        {gallery.length > 0 ? (
          <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
            <SmartImage src={gallery[0]} alt={tour.title} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[50vh] min-h-[360px] w-full bg-gradient-to-br from-brand-700 to-brand-500" />
        )}

        {/* Breadcrumb */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <Icon name="chevron-right" size={14} />
              <Link to="/tour" className="hover:text-white">Tours</Link>
              <Icon name="chevron-right" size={14} />
              <span className="font-semibold text-white">{tour.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {tour.category && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur ring-1 ring-white/20">
                  {tour.category}
                </span>
              )}
              {tour.badge && (
                <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-brand-900">
                  {tour.badge}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{tour.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {tour.rating != null && <Rating value={tour.rating} reviews={tour.reviews} light />}
              {tour.location && (
                <span className="flex items-center gap-1.5">
                  <Icon name="map-pin" size={15} className="text-gold-300" />
                  {tour.location}
                </span>
              )}
              {tour.duration && (
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" size={15} className="text-gold-300" />
                  {tour.duration}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            {tour.description && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">About this experience</h2>
                <p className="mt-3 leading-relaxed text-muted">{tour.description}</p>
              </section>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap gap-3">
              {tour.duration && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="clock" size={16} /> {tour.duration}
                </span>
              )}
              {tour.location && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="map-pin" size={16} /> {tour.location}
                </span>
              )}
              {tour.address && (
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                  <Icon name="landmark" size={16} /> {tour.address}
                </span>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary?.length > 0 && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">Itinerary</h2>
                <ol className="mt-4 space-y-0">
                  {tour.itinerary.map((step, i) => (
                    <li key={i} className="relative flex gap-4 pb-6 pl-1 last:pb-0">
                      {i < tour.itinerary.length - 1 && (
                        <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-brand-200" />
                      )}
                      <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-xs font-bold text-gold-400">
                        {i + 1}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed text-muted">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* What's included */}
            {tour.includes?.length > 0 && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">What&apos;s included</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tour.includes.map((inc) => (
                    <li key={inc} className="flex items-center gap-2.5 text-sm text-muted">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/10">
                        <Icon name="check" size={14} className="text-success" />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Guide */}
            {tour.guide && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">Meet your guide</h2>
                <div className="mt-4">
                  <GuideInfo guide={tour.guide} />
                </div>
              </section>
            )}

            {source === "demo" && <DemoNote />}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gold-300 bg-white p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Price per person</p>
                  <p className="font-display text-3xl font-bold text-brand-800">
                    {price || "On request"}
                    {price && <span className="text-sm font-medium text-muted"> {tour.priceUnit}</span>}
                  </p>
                </div>
                {tour.rating != null && (
                  <div className="flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5">
                    <Icon name="star" size={14} className="text-gold-500" fill="currentColor" stroke="none" />
                    <span className="text-sm font-bold text-brand-800">{Number(tour.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="calendar" size={14} className="text-brand-500" /> Visit date
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="users" size={14} className="text-brand-500" /> Guests
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50"
                    >
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="min-w-[3ch] text-center text-lg font-bold text-brand-800">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(20, g + 1))}
                      className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800"
                    >
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </label>
              </div>

              {price && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                  <span className="text-sm font-semibold text-brand-800">Total</span>
                  <span className="font-display text-xl font-bold text-brand-800">
                    {money(total)}
                    <span className="text-xs font-medium text-muted"> for {guests}</span>
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleBookNow}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md"
              >
                <Icon name="ticket" size={18} />
                Book Now
              </button>

              <button
                type="button"
                onClick={handleToggleSave}
                aria-pressed={saved}
                className={`mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-bold transition-colors ${
                  saved
                    ? "border-danger/40 bg-danger/5 text-danger"
                    : "border-gold-300 bg-gold-50 text-brand-800 hover:bg-gold-100"
                }`}
              >
                <Icon name="heart" size={17} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved to My trips" : "Save to My trips"}
              </button>

              <div className="mt-4 space-y-1.5 text-[11px] font-medium text-muted">
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Free cancellation up to 24h
                </p>
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Secure payment
                </p>
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Licensed local guides
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

