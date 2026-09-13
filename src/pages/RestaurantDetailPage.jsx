import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import { OpenBadge } from "../components/ui/StatusBadge";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useRestaurant } from "../hooks/useResource";
import { money } from "../lib/format";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { items, loading, source } = useRestaurant(id);
  const r = items[0];

  const grouped = useMemo(() => {
    const map = {};
    for (const f of r?.menu || []) {
      const key = f.category || "Menu";
      (map[key] ||= []).push(f);
    }
    return map;
  }, [r]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 aspect-[16/9] w-full" />
        <Skeleton className="mt-6 h-10 w-2/3" />
      </div>
    );
  }

  if (!r) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Restaurant not found" message="This place may no longer be listed." icon="utensils" />
        <div className="mt-6 text-center"><Link to="/restaurants" className="font-bold text-brand-700 hover:text-brand-800">← Back to restaurants</Link></div>
      </div>
    );
  }

  const gallery = r.images?.length ? r.images : [r.image].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <Icon name="chevron-right" size={14} />
        <Link to="/restaurants" className="hover:text-brand-700">Restaurants</Link>
        <Icon name="chevron-right" size={14} />
        <span className="font-semibold text-brand-700">{r.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-[24px] border border-line shadow-soft">
            <SmartImage src={gallery[0]} alt={r.title} className="aspect-[16/10] w-full" />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <OpenBadge open={r.open} label={r.openLabel} />
            {r.rating != null && <Rating value={r.rating} reviews={r.reviews} />}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-brand-800 sm:text-4xl">{r.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="map-pin" size={16} className="text-brand-400" /> {r.location || "Cambodia"}
          </p>
          {r.description && <p className="mt-4 leading-relaxed text-muted">{r.description}</p>}

          <div className="mt-8">
            <h2 className="font-display text-xl font-bold text-brand-800">Menu</h2>
            {Object.keys(grouped).length ? (
              <div className="mt-4 space-y-6">
                {Object.entries(grouped).map(([cat, foods]) => (
                  <div key={cat}>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-gold-600">{cat}</h3>
                    <div className="mt-2 divide-y divide-line rounded-xl border border-line bg-white">
                      {foods.map((f) => (
                        <div key={f.id} className="flex items-center gap-4 p-3">
                          <SmartImage src={f.image} alt={f.title} className="h-14 w-14 shrink-0 rounded-lg" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-brand-800">{f.title}</p>
                            {!f.available && <p className="text-xs text-danger">Sold out</p>}
                          </div>
                          <span className="text-sm font-bold text-brand-700">{money(f.price)}</span>
                          <button
                            disabled={!f.available}
                            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white disabled:opacity-40 hover:bg-brand-800"
                            aria-label={`Add ${f.title}`}
                          >
                            <Icon name="arrow-right" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-line py-8 text-center text-sm text-muted">
                Menu coming soon.
              </p>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[22px] border border-line bg-white p-6 shadow-soft">
            <h3 className="font-display text-lg font-bold text-brand-800">Visit {r.title}</h3>
            <div className="mt-4 space-y-3 text-sm text-muted">
              {r.openLabel && <p className="flex items-center gap-2"><Icon name="clock" size={16} className="text-brand-400" /> {r.openLabel}</p>}
              {r.location && <p className="flex items-center gap-2"><Icon name="map-pin" size={16} className="text-brand-400" /> {r.location}</p>}
              {r.category && <p className="flex items-center gap-2"><Icon name="utensils" size={16} className="text-brand-400" /> {r.category}</p>}
            </div>
            <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 text-sm font-bold text-brand-900 hover:bg-gold-300">
              <Icon name="ticket" size={18} /> Book a Table
            </button>
            <button className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-line text-sm font-bold text-brand-700 hover:bg-brand-50">
              <Icon name="heart" size={17} /> Save
            </button>
          </div>
          {source === "demo" && <div className="mt-4"><DemoNote /></div>}
        </aside>
      </div>
    </div>
  );
}
