import { useMemo, useRef, useState } from "react";
import Icon from "../components/ui/Icon";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { useHotels, useDestinations } from "../hooks/useResource";
import {
  decorateHotels,
  demoExtraHotels,
  applyHotelFilters,
  sortHotels,
  emptyFilters,
  countActiveFilters,
  resultsCountLabel,
} from "../data/hotels";
import HotelSearchBar from "../components/hotels/HotelSearchBar";
import DestinationCarousel from "../components/hotels/DestinationCarousel";
import FilterSidebar from "../components/hotels/FilterSidebar";
import FilterChips from "../components/hotels/FilterChips";
import ResultsHeader from "../components/hotels/ResultsHeader";
import HotelListingCard from "../components/hotels/HotelListingCard";
import HotelCardSkeleton from "../components/hotels/HotelCardSkeleton";
import MobileFilterDrawer from "../components/hotels/MobileFilterDrawer";

function isoPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function HotelsPage() {
  const hotels = useHotels();
  const dests = useDestinations();

  const [filters, setFilters] = useState(emptyFilters);
  const [dates, setDates] = useState(() => ({ checkIn: isoPlus(14), checkOut: isoPlus(16) }));
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });
  const [sort, setSort] = useState("best-value");
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapHint, setMapHint] = useState(false);
  const resultsRef = useRef(null);

  const patch = (p) => setFilters((f) => ({ ...f, ...p }));

  // In demo mode we append curated extra stays so the marketplace feels alive;
  // with a seeded backend this is skipped and real data rules.
  const decorated = useMemo(() => {
    const extra = hotels.source === "api" ? [] : demoExtraHotels;
    return decorateHotels([...hotels.items, ...extra]);
  }, [hotels.items, hotels.source]);

  const visible = useMemo(
    () => sortHotels(applyHotelFilters(decorated, filters), sort),
    [decorated, filters, sort]
  );

  const staysByDestination = useMemo(() => {
    const counts = {};
    for (const h of decorated) {
      const loc = (h.location || "").toLowerCase();
      if (!loc) continue;
      counts[loc] = (counts[loc] || 0) + 1;
    }
    return counts;
  }, [decorated]);

  const carouselDests = useMemo(
    () =>
      (dests.items || [])
        .slice(0, 6)
        .map((d) => ({ ...d, count: staysByDestination[d.title.toLowerCase()] || 0 })),
    [dests.items, staysByDestination]
  );

  const selectDestination = (name) =>
    patch({ destination: filters.destination.toLowerCase() === name.toLowerCase() ? "" : name });

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleFavorite = (h) => {
    const saved = toggle({
      kind: "hotel",
      id: h.id,
      title: h.title,
      image: h.image,
      location: h.location,
      href: h.href || `/hotels/${h.id}`,
    });
    toast[saved ? "success" : "info"](saved ? `Saved "${h.title}" to My trips.` : `Removed "${h.title}" from My trips.`);
  };

  const activeCount = countActiveFilters(filters);

  return (
    <div className="animate-fade">
      {/* Header + search */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-12">
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h1 className="max-w-xl font-display text-4xl font-bold tracking-tight text-brand-700 sm:text-5xl">
              Cambodia Hotels and Places to Stay
            </h1>
            <button
              type="button"
              onClick={() => { setSort("best-value"); scrollToResults(); }}
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:text-brand-900"
            >
            </button>
          </div>

          <div className="mt-7">
            <HotelSearchBar
              destination={filters.destination}
              onDestination={(v) => patch({ destination: v })}
              dates={dates}
              onDates={setDates}
              guests={guests}
              onGuests={setGuests}
              onSearch={scrollToResults}
              onMap={() => setMapHint((v) => !v)}
              mapActive={mapHint}
            />
          </div>
        </div>
      </div>

      {/* Destinations carousel */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 font-display text-xl font-bold text-brand-900 sm:text-2xl">
          Destinations in Cambodia
        </h2>
        <DestinationCarousel
          destinations={carouselDests}
          counts={Object.fromEntries(carouselDests.map((d) => [d.title, d.count]))}
          activeName={filters.destination}
          onSelect={selectDestination}
        />
      </section>

      {/* Main: sidebar + results */}
      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:px-8">
        <aside className="hidden w-[300px] shrink-0 lg:block xl:w-[320px]">
          <div className="sticky top-[124px]">
            <FilterSidebar filters={filters} onPatch={patch} />
          </div>
        </aside>

        <div ref={resultsRef} className="min-w-0 flex-1 scroll-mt-[124px]">
          <ResultsHeader
            count={visible.length}
            activeCount={activeCount}
            sort={sort}
            onSort={setSort}
            onOpenFilters={() => setDrawerOpen(true)}
            className="z-30 lg:static lg:top-auto lg:bg-transparent lg:px-0 lg:backdrop-blur-none"
          />

          <div className="hide-scrollbar -mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:mx-[-6px] lg:overflow-visible lg:px-1.5">
            <FilterChips filters={filters} onPatch={patch} className="w-max lg:w-full lg:flex-wrap" />
          </div>

          {mapHint && (
            <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-dashed border-brand-300 bg-brand-50/60 px-4 py-3 text-sm font-semibold text-brand-800">
              <Icon name="map" size={16} className="shrink-0 text-brand-600" />
              Interactive map view is coming soon — for now, results are listed below.
              <button
                type="button"
                onClick={() => setMapHint(false)}
                aria-label="Dismiss map notice"
                className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full text-brand-700 transition hover:bg-brand-100"
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-5">
            {hotels.loading ? (
              Array.from({ length: 4 }).map((_, i) => <HotelCardSkeleton key={i} />)
            ) : hotels.error && hotels.source == null ? (
              <div className="rounded-2xl border border-danger/20 bg-danger/5 p-10 text-center">
                <p className="font-display text-lg font-bold text-brand-900">Unable to load hotels. Please try again.</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-brand-700 px-5 text-sm font-bold text-white transition hover:bg-brand-800"
                >
                  Reload
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon name="bed" size={26} />
                </span>
                <p className="mt-4 font-display text-xl font-bold text-brand-900">No hotels found</p>
                <p className="mt-1 text-sm font-medium text-muted">
                  Try removing a filter or searching a different destination.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters({ ...emptyFilters(), destination: "" })}
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-bold text-white transition hover:bg-brand-800"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              visible.map((h, i) => (
                <HotelListingCard
                  key={h.id}
                  hotel={h}
                  rank={i + 1}
                  favorite={isSaved("hotel", h.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>

          {!hotels.loading && visible.length > 0 && (
            <p className="mt-8 text-center text-sm font-medium text-muted">
              {resultsCountLabel(visible.length, decorated.length, hotels.source)} in Cambodia
              {hotels.source !== "api" && (
                <span className="ml-1 text-xs text-muted/70">· demo data — live prices connect once the backend is seeded</span>
              )}
            </p>
          )}
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onPatch={patch}
        resultCount={visible.length}
      />
    </div>
  );
}
