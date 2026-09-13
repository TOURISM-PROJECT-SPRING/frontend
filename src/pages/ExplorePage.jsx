import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { SearchInput } from "../components/common/Toolbar";
import ProvinceSidebar, { SidebarContent } from "../components/explore/ProvinceSidebar";
import TourCard from "../components/explore/TourCard";
import HotelCard from "../components/explore/HotelCard";
import TourDetailModal from "../components/explore/TourDetailModal";
import HotelDetailModal from "../components/explore/HotelDetailModal";
import RecommendationSection from "../components/explore/RecommendationSection";
import TripCart, { CartButton } from "../components/explore/TripCart";
import ListingCard from "../components/cards/ListingCard";
import { Drawer } from "../components/ui/Modal";
import { CardGridSkeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useExploreBundle } from "../hooks/useResource";
import { useTripCart } from "../context/TripCartContext";
import { useToast } from "../components/ui/Toast";
import { SECTION_META, applyExploreFilters, uniqueCategories, sameProvince } from "../lib/explore";
import { img } from "../data/site";

const DEFAULT_SECTION = "tours";

export default function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const { items: data, loading, source } = useExploreBundle();
  const { addItem } = useTripCart();
  const toast = useToast();

  const [filters, setFilters] = useState({
    provinceId: "all",
    section: params.get("section") || DEFAULT_SECTION,
    category: "all",
    duration: "any",
    minPrice: "",
    maxPrice: "",
    minRating: "0",
    q: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [hotelOpen, setHotelOpen] = useState(false);

  const provinces = useMemo(() => data.provinces || [], [data]);
  const categories = useMemo(() => {
    const lists = {
      tours: data.tours,
      hotels: data.hotels,
      restaurants: data.restaurants,
      all: [...(data.tours || []), ...(data.hotels || []), ...(data.restaurants || [])],
    }[filters.section] || [];
    return uniqueCategories(lists);
  }, [data, filters.section]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const setSection = (section) => {
    setFilters((f) => ({ ...f, section }));
    setParams({ section }, { replace: true });
  };

  const counts = useMemo(() => {
    const byProvince = {};
    for (const p of provinces) byProvince[p.id] = { tours: 0, hotels: 0, restaurants: 0 };
    for (const t of data.tours || []) { const k = t.provinceId; if (k != null && byProvince[k]) byProvince[k].tours++; }
    for (const h of data.hotels || []) { const k = h.provinceId; if (k != null && byProvince[k]) byProvince[k].hotels++; }
    for (const r of data.restaurants || []) { const k = r.provinceId; if (k != null && byProvince[k]) byProvince[k].restaurants++; }
    const total = (data.tours?.length || 0) + (data.hotels?.length || 0) + (data.restaurants?.length || 0);
    return { total, byProvince };
  }, [data, provinces]);

  const filtered = useMemo(() => {
    return {
      tours: applyExploreFilters(data.tours || [], filters, provinces),
      hotels: applyExploreFilters(data.hotels || [], { ...filters, duration: "any" }, provinces),
      restaurants: applyExploreFilters(data.restaurants || [], { ...filters, duration: "any" }, provinces),
    };
  }, [data, filters, provinces]);

  const selectedProvince = provinces.find((p) => String(p.id) === String(filters.provinceId));
  const sectionMeta = SECTION_META[filters.section] || SECTION_META.tours;
  const headingItems = {
    tours: filtered.tours,
    hotels: filtered.hotels,
    restaurants: filtered.restaurants,
    all: filtered.tours,
  }[filters.section] || [];

  const rec = useMemo(() => {
    if (!selectedTour) return null;
    return {
      hotels: sameProvince(data.hotels || [], selectedTour),
      restaurants: sameProvince(data.restaurants || [], selectedTour),
    };
  }, [selectedTour, data]);

  const addTour = (tour) => {
    addItem({
      kind: "tour",
      id: tour.id,
      ticketId: tour.ticketId || null,
      title: tour.title,
      image: tour.image,
      location: tour.location,
      province: tour.province,
      price: tour.price ?? 0,
      priceUnit: tour.priceUnit,
      qty: 1,
    });
    toast.success(`"${tour.title}" added to your trip.`);
  };
  const addHotel = (hotel) => {
    // Quick add uses the hotel's lowest nightly rate.
    const room = (hotel.rooms || [])[0];
    const price = room ? Number(room.price) : Number(hotel.price ?? 0);
    addItem({
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location,
      province: hotel.province,
      price,
      priceUnit: "/night",
      qty: 1,
      meta: { roomType: room?.roomType || "Standard room", nights: 1 },
    });
    toast.success(`"${hotel.title}" added to your trip.`);
  };

  const reset = () =>
    setFilters({ provinceId: "all", section: filters.section, category: "all", duration: "any", minPrice: "", maxPrice: "", minRating: "0", q: "" });

  const sectionGrid = (list, render) =>
    loading ? (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"><CardGridSkeleton count={6} cols="sm:grid-cols-2 xl:grid-cols-3" /></div>
    ) : list.length ? (
      <div key={`${filters.provinceId}-${filters.category}-${filters.duration}-${filters.minRating}`} className="grid animate-rise gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {list.map(render)}
      </div>
    ) : (
      <EmptyState
        title="Nothing in this view yet"
        message={selectedProvince ? `No ${SECTION_META[filters.section]?.label.toLowerCase()} are listed in ${selectedProvince.title} matching these filters.` : "Pick a province or clear a filter to see more."}
        icon={sectionMeta.icon}
      />
    );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[26px] bg-brand-800 text-white shadow-soft">
        <img src={img("Angkor Wat, reflejo 2.jpg", 1600)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 animate-slowzoom" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-800/70 to-brand-800/30" />
        <div className="khmer-motif absolute inset-0 opacity-30" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-900">Discover Cambodia</span>
            {selectedProvince && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/20 backdrop-blur">
                <Icon name="map-pin" size={13} className="text-gold-300" /> {selectedProvince.title}
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-5xl">Explore {selectedProvince ? selectedProvince.title : "Cambodia"}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            {selectedProvince
              ? `Tours, stays and food in ${selectedProvince.title} — everything you need for the trip, in one place.`
              : "Pick a province to see its tours, recommended hotels in the same province, and local restaurants."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/12 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur">
              <Icon name={sectionMeta.icon} size={17} className="text-gold-300" />
              <span className="text-sm font-bold">{sectionMeta.label}</span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold text-gold-300">{headingItems.length}</span>
            </div>
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/12 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/20 lg:hidden"
            >
              <Icon name="settings" size={16} /> Filters
            </button>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <ProvinceSidebar
              provinces={provinces}
              section={filters.section}
              setSection={setSection}
              filters={filters}
              setFilter={setFilter}
              categories={categories}
              counts={counts}
              onReset={reset}
            />
            {source === "demo" && !loading && <DemoNote className="w-full justify-center" />}
          </div>
        </div>

        {/* Main */}
        <section className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput value={filters.q} onChange={(v) => setFilter("q", v)} placeholder={`Search ${sectionMeta.label.toLowerCase()}…`} />
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <p className="text-sm font-medium text-muted">
                {loading ? "Loading…" : `${headingItems.length} ${headingItems.length === 1 ? "result" : "results"}${selectedProvince ? ` in ${selectedProvince.title}` : ""}`}
              </p>
              <CartButton />
            </div>
          </div>

          {/* Tours */}
          {["tours", "all"].includes(filters.section) && (
            <div className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-800">
                    <Icon name="compass" size={20} className="text-gold-600" /> Tours
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{SECTION_META.tours.blurb}</p>
                </div>
                <span className="text-sm font-bold text-muted">{filtered.tours.length}</span>
              </div>
              {sectionGrid(filtered.tours, (t) => (
                <TourCard
                  key={t.id}
                  tour={t}
                  onSelect={(x) => { setSelectedTour(x); setTourOpen(true); }}
                  onAdd={addTour}
                />
              ))}

              {/* Same-province recommendations for selected tour */}
              {selectedTour && filtered.tours.length > 0 && (
                <RecommendationSection
                  tour={selectedTour}
                  hotels={rec?.hotels || []}
                  restaurants={rec?.restaurants || []}
                  loading={false}
                  onSelectHotel={(h) => { setSelectedHotel(h); setHotelOpen(true); }}
                  onAddHotel={addHotel}
                />
              )}
            </div>
          )}

          {/* Hotels */}
          {["hotels"].includes(filters.section) && (
            <div className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-800">
                    <Icon name="bed" size={20} className="text-gold-600" /> Hotels
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{SECTION_META.hotels.blurb}</p>
                </div>
                <span className="text-sm font-bold text-muted">{filtered.hotels.length}</span>
              </div>
              {sectionGrid(filtered.hotels, (h) => (
                <HotelCard
                  key={h.id}
                  hotel={h}
                  labelled={Boolean(rec && rec.hotels.some((rh) => String(rh.id) === String(h.id)))}
                  onSelect={(x) => { setSelectedHotel(x); setHotelOpen(true); }}
                  onAdd={addHotel}
                />
              ))}
            </div>
          )}

          {/* Restaurants */}
          {["restaurants"].includes(filters.section) && (
            <div className="mt-8">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-800">
                    <Icon name="utensils" size={20} className="text-gold-600" /> Restaurants
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{SECTION_META.restaurants.blurb}</p>
                </div>
                <span className="text-sm font-bold text-muted">{filtered.restaurants.length}</span>
              </div>
              {sectionGrid(filtered.restaurants, (r) => <ListingCard key={r.id} item={r} />)}
            </div>
          )}

          {source === "demo" && !loading && (
            <div className="mt-8 lg:hidden"><DemoNote /></div>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" width="max-w-sm">
        <SidebarContent
          provinces={provinces}
          section={filters.section}
          setSection={setSection}
          filters={filters}
          setFilter={setFilter}
          categories={categories}
          counts={counts}
          onReset={reset}
        />
      </Drawer>

      {/* Detail modals */}
      <TourDetailModal
        tour={selectedTour}
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        onAdd={(item) => { addItem(item); toast.success(`"${item.title}" added to your trip.`); }}
      />
      <HotelDetailModal
        hotel={selectedHotel}
        open={hotelOpen}
        onClose={() => setHotelOpen(false)}
        onAdd={(item) => { addItem(item); toast.success(`"${item.title}" added to your trip.`); }}
      />

      <TripCart />
    </div>
  );
}