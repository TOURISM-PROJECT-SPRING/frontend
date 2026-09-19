import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { useRestaurants } from "../hooks/useResource";
import {
  decorateRestaurants,
  decorateMarketplaceRestaurant,
  buildProvinceOptions,
  applyRestaurantFilters,
  sortRestaurants,
  emptyFilters,
  countActiveFilters,
  resultsCountLabel,
  provinceLabel,
} from "../data/restaurants";
import PageHeader from "../components/restaurants/PageHeader";
import RestaurantFilterSidebar from "../components/restaurants/RestaurantFilterSidebar";
import ResultsHeader from "../components/restaurants/ResultsHeader";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import RestaurantCardSkeleton from "../components/restaurants/RestaurantCardSkeleton";
import EmptyState from "../components/restaurants/EmptyState";
import MobileFilterDrawer from "../components/restaurants/MobileFilterDrawer";
import MapModal from "../components/restaurants/MapModal";
import ReservationModal from "../components/restaurants/ReservationModal";
import FloatingTripCart from "../components/home/FloatingTripCart";

export default function RestaurantSearchPage() {
  const restaurants = useRestaurants();
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("featured");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  const { isSaved, toggle } = useFavorites();
  const toast = useToast();

  const marketplace = useMemo(
    () => restaurants.items.map(decorateMarketplaceRestaurant),
    [restaurants.items]
  );
  const all = useMemo(() => decorateRestaurants(marketplace), [marketplace]);
  const provinces = useMemo(() => buildProvinceOptions(marketplace), [marketplace]);
  const visible = useMemo(
    () => sortRestaurants(applyRestaurantFilters(all, filters), sort),
    [all, filters, sort]
  );

  const activeCount = countActiveFilters(filters);
  const isFiltered = activeCount > 0 || filters.search.trim() !== "";
  const countLabel = resultsCountLabel(visible.length, { filtered: isFiltered, total: all.length });

  const provinceName = filters.province ? provinceLabel(filters.province) : "";
  const areaLabel = provinceName || "Cambodia";
  const title = `Restaurants in ${areaLabel}`;
  const subtitle = `The 10 Best Restaurants in ${areaLabel}`;

  const patch = (p) => setFilters((f) => ({ ...f, ...p }));
  const clearAll = () => setFilters(emptyFilters());

  const toggleFavorite = (r) => {
    const saved = toggle({
      kind: "restaurant",
      id: r.id,
      title: r.name,
      image: r.image || r.images?.[0],
      location: r.location,
      href: r.href,
    });
    toast[saved ? "success" : "info"](
      saved ? `Saved "${r.name}" to My trips.` : `Removed "${r.name}" from My trips.`
    );
  };

  return (
    <div className="animate-fade">
      <PageHeader
        title={title}
        subtitle={subtitle}
        province={filters.province}
        provinces={provinces}
        onProvince={(v) => patch({ province: v })}
        onReserve={() => setReserveOpen(true)}
        onMap={() => setMapOpen(true)}
      />

      <div className="mx-auto flex max-w-[1320px] gap-12 px-5 py-8 sm:px-8 lg:px-12">
        {/* Left column: back link + sticky filters */}
        <aside className="hidden w-[280px] shrink-0 lg:block xl:w-[300px]">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-700 transition hover:text-brand-900"
          >
            <Icon name="chevron-left" size={16} strokeWidth={2.4} />
            {provinceName ? `${provinceName} restaurants` : "All Cambodia restaurants"}
          </Link>

          <div className="sticky top-[124px] max-h-[calc(100vh-140px)] overflow-y-auto pb-6 pr-1 hide-scrollbar">
            <label className="mb-4 block">
              <span className="sr-only">Search restaurants</span>
              <span className="relative block">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="search" size={17} />
                </span>
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) => patch({ search: e.target.value })}
                  placeholder="Restaurants, cafés, cuisines"
                  className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm font-medium text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                />
              </span>
            </label>

            <RestaurantFilterSidebar filters={filters} onPatch={patch} provinces={provinces} />
          </div>
        </aside>

        {/* Right column: results */}
        <div className="min-w-0 flex-1">
          <ResultsHeader
            countLabel={countLabel}
            activeCount={activeCount}
            sort={sort}
            onSort={setSort}
            onOpenFilters={() => setDrawerOpen(true)}
          />

          {/* Mobile search */}
          <label className="mt-4 block lg:hidden">
            <span className="sr-only">Search restaurants</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="search" size={17} />
              </span>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => patch({ search: e.target.value })}
                placeholder="Restaurants, cafés, cuisines"
                className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm font-medium text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
              />
            </span>
          </label>

          <div className="mt-5 flex flex-col gap-8">
            {restaurants.loading ? (
              Array.from({ length: 4 }).map((_, i) => <RestaurantCardSkeleton key={i} />)
            ) : visible.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              visible.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  favorite={isSaved("restaurant", r.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </div>

          {!restaurants.loading && visible.length > 0 && (
            <p className="mt-8 text-center text-sm font-medium text-muted">
              You&apos;ve seen all {visible.length.toLocaleString("en-US")} matching restaurants in {areaLabel}
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
        provinces={provinces}
      />
      <MapModal open={mapOpen} onClose={() => setMapOpen(false)} restaurants={visible} title={title} />
      <ReservationModal
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        restaurants={visible.length ? visible : all}
      />
      <FloatingTripCart />
    </div>
  );
}
