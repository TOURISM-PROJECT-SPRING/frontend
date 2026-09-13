import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import ListingCard from "../components/cards/ListingCard";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useDestinations, useTours } from "../hooks/useResource";

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { items: dests, loading: ld } = useDestinations();
  const { items: tours, loading: lt, source } = useTours();
  const dest = dests.find((d) => String(d.id) === String(id));

  const related = useMemo(() => {
    if (!dest) return [];
    const name = dest.title.toLowerCase();
    const hits = tours.filter((t) =>
      [t.location, t.address, t.title].join(" ").toLowerCase().includes(name)
    );
    return hits.length ? hits : tours.slice(0, 4);
  }, [dest, tours]);

  if (ld) {
    return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><Skeleton className="aspect-[3/1] w-full" /><Skeleton className="mt-6 h-10 w-1/3" /></div>;
  }

  if (!dest) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Destination not found" message="Try another destination." icon="map-pin" />
        <div className="mt-6 text-center"><Link to="/destinations" className="font-bold text-brand-700 hover:text-brand-800">← All destinations</Link></div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative isolate">
        <SmartImage src={dest.image} alt={dest.title} className="h-[46vh] min-h-[320px] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <Icon name="chevron-right" size={14} />
              <Link to="/destinations" className="hover:text-white">Destinations</Link>
            </nav>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{dest.title}</h1>
            {dest.attractions != null && (
              <p className="mt-2 text-white/80">{dest.attractions} attractions to explore</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-brand-800">Experiences in {dest.title}</h2>
          <Link to="/tours" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">
            All tours <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {lt ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {related.map((t) => <ListingCard key={t.id} item={t} />)}
            </div>
            {source === "demo" && <div className="mt-8"><DemoNote /></div>}
          </>
        )}
      </div>
    </div>
  );
}
