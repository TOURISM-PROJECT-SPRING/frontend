import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import { Pill } from "../components/ui/StatusBadge";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useHotel } from "../hooks/useResource";
import { money } from "../lib/format";

export default function HotelDetailPage() {
  const { id } = useParams();
  const { items, loading, source } = useHotel(id);
  const hotel = items[0];

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 aspect-[16/9] w-full" />
        <Skeleton className="mt-6 h-10 w-2/3" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Hotel not found" message="This stay may no longer be listed." icon="bed" />
        <div className="mt-6 text-center"><Link to="/hotels" className="font-bold text-brand-700 hover:text-brand-800">← Back to hotels</Link></div>
      </div>
    );
  }

  const gallery = hotel.images?.length ? hotel.images : [hotel.image].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <Icon name="chevron-right" size={14} />
        <Link to="/hotels" className="hover:text-brand-700">Hotels</Link>
        <Icon name="chevron-right" size={14} />
        <span className="font-semibold text-brand-700">{hotel.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[24px] border border-line shadow-soft">
            <SmartImage src={gallery[0]} alt={hotel.title} className="aspect-[16/10] w-full" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {hotel.badge && <Pill tone="neutral">{hotel.badge}</Pill>}
            {hotel.rating != null && <Rating value={hotel.rating} reviews={hotel.reviews} />}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-brand-800 sm:text-4xl">{hotel.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="map-pin" size={16} className="text-brand-400" /> {hotel.location || "Cambodia"}
          </p>
          {hotel.description && <p className="mt-4 leading-relaxed text-muted">{hotel.description}</p>}

          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-brand-800">Rooms & rates</h2>
            {hotel.rooms?.length ? (
              <div className="mt-3 space-y-3">
                {hotel.rooms.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl border border-line bg-white p-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700"><Icon name="bed" size={20} /></span>
                      <div>
                        <p className="text-sm font-bold text-brand-800">{r.roomType}</p>
                        <p className="text-xs text-muted">
                          {r.capacity ? `${r.capacity} guests` : "Sleeps guests"}
                          {r.total != null ? ` · ${r.total} available` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-brand-700">{money(r.price)}<span className="text-xs font-medium text-muted">/night</span></span>
                      <button className="rounded-lg bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800">Book</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-line py-8 text-center text-sm text-muted">
                Room rates are available when you enquire.
              </p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] border border-line bg-white p-6 shadow-soft">
            <p className="text-xs text-muted">Starting from</p>
            <p className="font-display text-3xl font-bold text-brand-700">
              {hotel.price != null ? money(hotel.price) : "—"}
              {hotel.price != null && <span className="text-sm font-medium text-muted"> /night</span>}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Check-in</span>
                <input type="date" className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Check-out</span>
                <input type="date" className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
              </label>
            </div>

            <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 text-sm font-bold text-brand-900 hover:bg-gold-300">
              <Icon name="bed" size={18} /> Check availability
            </button>

            <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm text-muted">
              {hotel.phone && <li className="flex items-center gap-2"><Icon name="phone" size={16} className="text-brand-400" /> {hotel.phone}</li>}
              {hotel.email && <li className="flex items-center gap-2"><Icon name="mail" size={16} className="text-brand-400" /> {hotel.email}</li>}
              <li className="flex items-center gap-2"><Icon name="check" size={16} className="text-success" /> Best-price guarantee</li>
            </ul>
          </div>
          {source === "demo" && <div className="mt-4"><DemoNote /></div>}
        </aside>
      </div>
    </div>
  );
}
