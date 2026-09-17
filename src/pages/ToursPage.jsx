import { useEffect, useMemo, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { EmptyState } from "../components/ui/feedback";
import {
  demoTours,
  decorateTours,
  applyTourFilters,
  sortTours,
  emptyFilters,
  countActiveFilters,
  resultsCountLabel,
} from "../data/tours";
import FilterBar from "../components/tours/FilterBar";
import { provinceLabel } from "../data/restaurants";
import SortControl from "../components/tours/SortControl";
import PromoBanner from "../components/tours/PromoBanner";
import ActivityCard from "../components/tours/ActivityCard";
import AllFiltersDrawer from "../components/tours/AllFiltersDrawer";
import ToursSkeleton from "../components/tours/ToursSkeleton";

const CONTAINER = "mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-[70px]";

export default function ToursPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isSaved, toggle } = useFavorites();
  const toast = useToast();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const all = useMemo(() => decorateTours(demoTours), []);
  const city = filters.location ? provinceLabel(filters.location) || filters.location : "Cambodia";

  useEffect(() => {
    document.title = `Things to do in ${city} | SovannDomNour`;
    return () => {
      document.title = "SovannDomNour";
    };
  }, [city]);
  const visible = useMemo(
    () => sortTours(applyTourFilters(all, filters), sort),
    [all, filters, sort]
  );

  const activeCount = countActiveFilters(filters);
  const isFiltered = activeCount > 0;
  const countLabel = resultsCountLabel(visible.length, { filtered: isFiltered });

  const patch = (p) => setFilters((f) => ({ ...f, ...p }));
  const clearAll = () => setFilters(emptyFilters());

  const toggleFavorite = (a) => {
    const saved = toggle({
      kind: "tour",
      id: a.id,
      title: a.title,
      image: a.images?.[0],
      location: a.location,
      href: a.href,
    });
    toast[saved ? "success" : "info"](
      saved ? `Saved "${a.title}" to My trips.` : `Removed "${a.title}" from My trips.`
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page heading */}
      <div className={CONTAINER}>
        <h1 className="pt-8 pb-5 font-display text-[30px] font-bold leading-tight tracking-tight text-brand-900 sm:text-[38px]">
          Things to do in {city}
        </h1>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <div className={`${CONTAINER} py-3`}>
          <FilterBar filters={filters} onPatch={patch} onOpenAllFilters={() => setDrawerOpen(true)} />
        </div>
      </div>

      {/* Results + sort */}
      <div className={CONTAINER}>
        <div className="flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="text-xl font-bold text-brand-900">{countLabel}</p>
          <SortControl value={sort} onChange={setSort} />
        </div>

        <PromoBanner />

        {/* Grid */}
        {loading ? (
          <div className="py-8">
            <ToursSkeleton count={8} />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16">
            <div className="mx-auto max-w-md">
              <EmptyState
                title="No activities match your filters"
                message={`Try removing a filter or switching location to see more things to do in ${city}.`}
                icon="binoculars"
                action={
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
                  >
                    Clear all filters
                  </button>
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((a, i) => (
              <ActivityCard
                key={a.id}
                activity={a}
                index={i + 1}
                favorite={isSaved("tour", a.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {!loading && visible.length > 0 && (
          <p className="pb-16 text-center text-sm font-medium text-muted">
            You&apos;ve seen all {visible.length.toLocaleString("en-US")} matching activities in {city}
          </p>
        )}
      </div>

      <AllFiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onPatch={patch}
        resultCount={visible.length}
      />
    </div>
  );
}
