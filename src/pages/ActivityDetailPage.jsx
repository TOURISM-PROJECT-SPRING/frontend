import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { demoTours, decorateTours, buildActivityDetail, getActivitiesForSimilar } from "../data/tours";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import { EmptyState } from "../components/ui/feedback";
import { money } from "../lib/format";
import Icon from "../components/ui/Icon";
import RatingDots from "../components/hotels/RatingDots";
import ReviewCard from "../components/hotels/detail/ReviewCard";
import RatingBar from "../components/hotels/detail/RatingBar";
import ActivityGallery from "../components/tours/ActivityGallery";

function isoPlus(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="font-display text-2xl font-bold text-brand-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useFavorites();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const activity = useMemo(() => {
    const card = decorateTours(demoTours).find((x) => String(x.id) === String(id));
    return buildActivityDetail(card);
  }, [id]);
  const similar = useMemo(() => getActivitiesForSimilar(id, 3), [id]);

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!activity) return;
    document.title = `${activity.title} | SovannDomNour`;
    return () => {
      document.title = "SovannDomNour";
    };
  }, [activity]);

  if (!activity) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20">
        <EmptyState
          title="Activity not found"
          message="This experience may have been removed or is unavailable."
          icon="binoculars"
          action={
            <Link to="/tour" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800">
              ← Back to things to do
            </Link>
          }
        />
      </div>
    );
  }

  const saved = isSaved("tour", activity.id);
  const price = activity.price != null ? money(activity.price) : null;
  const total = activity.price != null ? activity.price * guests : 0;

  const onToggleSave = () => {
    const nowSaved = toggle({
      kind: "tour",
      id: activity.id,
      title: activity.title,
      image: activity.images?.[0],
      location: activity.location,
      href: `/activity/${id}`,
    });
    toast[nowSaved ? "success" : "info"](nowSaved ? `Saved "${activity.title}" to My trips.` : `Removed "${activity.title}" from My trips.`);
  };

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.info("Could not copy the link.");
    }
  };

  const onReserve = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to book this experience.");
      navigate("/login", { state: { from: `/activity/${id}` } });
      return;
    }
    navigate("/checkout", {
      state: {
        kind: "tour",
        id: activity.id,
        ticketId: activity.ticketId ?? null,
        title: activity.title,
        subtitle: "Guided experience",
        image: activity.images?.[0],
        operator: "SovannDomNour partner",
        rating: activity.rating,
        reviews: activity.reviews,
        date: date || isoPlus(7),
        time: "9:00 AM",
        guests,
        price: Number(activity.price) || 0,
        priceUnit: "/adult",
        language: "English - Guide",
        pickup: `Hotel pickup in ${activity.location}`,
        cancelCutoff: activity.freeCancel ? "Free cancellation up to 24h before" : "Non-refundable",
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hide-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap px-1 py-5 text-sm text-muted">
          <Link to="/tour" className="font-medium underline decoration-brand-200 underline-offset-4 hover:text-brand-700">Things to do in {activity.location}</Link>
          <Icon name="chevron-right" size={13} className="text-muted/60" />
          <span className="font-semibold text-brand-800" aria-current="page">{activity.title}</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            {activity.awardTier && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-brand-900">
                <Icon name="award" size={14} /> {activity.awardTier === "winner" ? "Award Winner 2026" : "Travelers’ Choice 2026"}
              </span>
            )}
            <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight text-brand-900 sm:text-[40px]">
              {activity.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-2">
                <span className="text-lg font-bold text-brand-900">{activity.rating.toFixed(1)}</span>
                <RatingDots rating={activity.rating} size={11} />
                <a href="#reviews" className="text-[15px] font-medium text-ink/70 underline decoration-brand-200 underline-offset-4 hover:text-brand-700">
                  ({activity.reviews.toLocaleString("en-US")} reviews)
                </a>
              </span>
              <span className="flex items-center gap-1.5 text-[15px] text-ink/75">
                <Icon name="heart" size={15} className="text-success" /> {activity.recommend}% recommend
              </span>
              <span className="flex items-center gap-1.5 text-[15px] text-ink/75">
                <Icon name="map-pin" size={15} className="text-brand-600" /> {activity.location}, Cambodia
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              aria-pressed={saved}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
                saved ? "border-rose-300 bg-rose-50 text-rose-600" : "border-brand-300 bg-white text-brand-800 hover:bg-brand-50"
              }`}
            >
              <Icon name="heart" size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              onClick={onShare}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-300 bg-white px-4 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
            >
              <Icon name="arrow-up-right" size={16} />
              Share
            </button>
          </div>
        </header>

        {/* Gallery */}
        <div className="mt-6">
          <ActivityGallery images={activity.galleryImages} title={activity.title} />
        </div>

        {/* Body */}
        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-10">
            <Section id="highlights" title="Highlights">
              <ul className="space-y-3">
                {activity.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink/85">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#DDF5D8] text-success">
                      <Icon name="check" size={14} strokeWidth={2.6} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="overview" title="What you'll experience">
              <p className="max-w-[760px] text-[17px] leading-relaxed text-ink/80">{activity.longDescription}</p>
            </Section>

            <Section id="included" title="What's included & not included">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-brand-700">Included</h3>
                  <ul className="space-y-2.5">
                    {activity.includes.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-[15px] text-ink/85">
                        <Icon name="check-circle" size={17} className="mt-0.5 shrink-0 text-success" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Not included</h3>
                  <ul className="space-y-2.5">
                    {activity.excludes.map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-[15px] text-ink/70">
                        <Icon name="x-circle" size={17} className="mt-0.5 shrink-0 text-danger" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <Section id="itinerary" title="Itinerary">
              <ol className="space-y-0">
                {activity.itinerary.map((step, i) => (
                  <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < activity.itinerary.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-brand-200" />}
                    <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">{i + 1}</span>
                    <p className="pt-1 text-[15px] leading-relaxed text-ink/80">{step}</p>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="good-to-know" title="Good to know">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon="users" label="Group size" value={activity.groupSize} />
                <InfoRow icon="clock" label="Duration" value={activity.duration} />
                <InfoRow icon="globe" label="Languages" value={activity.languagesSpoken.join(", ")} />
                <InfoRow icon="map-pin" label="Meeting point" value={activity.meetingPoint} />
                <InfoRow icon="refresh" label="Cancellation" value={activity.cancellation} />
                <InfoRow icon="check-circle" label="Confirmation" value={activity.instantConfirm ? "Instant confirmation — reserve now, pay later" : "By request"} />
              </div>
            </Section>

            <Section id="reviews" title="Traveler reviews">
              <div className="grid gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
                <div className="rounded-2xl border border-line bg-white p-5 shadow-soft">
                  <div className="flex items-end gap-2">
                    <span className="font-display text-4xl font-bold text-brand-800">{activity.rating.toFixed(1)}</span>
                    <div className="pb-1">
                      <RatingDots rating={activity.rating} size={9} />
                      <p className="mt-1 text-xs text-muted">{activity.reviews.toLocaleString("en-US")} reviews</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-line pt-4">
                    {activity.ratingBreakdown.map((b) => (
                      <RatingBar key={b.label} label={b.label} score={b.score} />
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activity.reviewsList.slice(0, 4).map((r) => (
                    <ReviewCard key={r.id} review={r} />
                  ))}
                </div>
              </div>
            </Section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-[104px] lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-lift">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[13px] text-muted">from</p>
                  <p className="font-display text-3xl font-bold text-brand-900">{price || "On request"}</p>
                  <p className="text-[13px] text-muted">per adult</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5">
                  <Icon name="star" size={14} className="text-gold-500" fill="currentColor" stroke="none" />
                  <span className="text-sm font-bold text-brand-800">{activity.rating.toFixed(1)}</span>
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="calendar" size={14} className="text-brand-500" /> Date
                  </span>
                  <input
                    type="date"
                    value={date}
                    min={isoPlus(0)}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                  />
                </label>
                <div>
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Icon name="users" size={14} className="text-brand-500" /> Guests
                  </span>
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-3">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50">
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="min-w-[3ch] text-center text-lg font-bold text-brand-800">{guests}</span>
                    <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="More guests" className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800">
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {price && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                  <span className="text-sm font-semibold text-brand-800">Total</span>
                  <span className="font-display text-xl font-bold text-brand-800">{money(total)} <span className="text-xs font-medium text-muted">for {guests}</span></span>
                </div>
              )}

              <button
                type="button"
                onClick={onReserve}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md active:scale-[0.99]"
              >
                <Icon name="ticket" size={18} /> Reserve
              </button>
              <p className="mt-2 text-center text-[12px] text-muted">You won&apos;t be charged yet</p>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-[13px] text-ink/75">
                <p className="flex items-center gap-2"><Icon name="refresh" size={15} className="text-success" /> {activity.cancellation}</p>
                <p className="flex items-center gap-2"><Icon name="check-circle" size={15} className="text-success" /> Instant confirmation</p>
                <p className="flex items-center gap-2"><Icon name="shield-check" size={15} className="text-success" /> Secure payment</p>
              </div>
            </div>
          </aside>
        </div>

        {/* More experiences */}
        {similar.length > 0 && (
          <div className="border-t border-line py-12">
            <h2 className="font-display text-2xl font-bold text-brand-900">More experiences in {activity.location}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <Link key={s.id} to={`/activity/${s.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-soft">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img src={s.images?.[0]} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 font-display text-[16px] font-bold leading-snug text-brand-900">{s.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">{s.rating.toFixed(1)}</span>
                      <RatingDots rating={s.rating} size={9} />
                      <span className="text-sm text-muted">({s.reviews.toLocaleString("en-US")})</span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/70"><Icon name="clock" size={14} className="text-brand-500" /> {s.duration}</p>
                    <p className="mt-auto pt-3 text-sm text-ink/70">from <span className="font-display text-base font-bold text-brand-900">${s.price}</span> / adult</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon name={icon} size={17} />
      </span>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
        <p className="text-[15px] font-medium text-brand-900">{value}</p>
      </div>
    </div>
  );
}
