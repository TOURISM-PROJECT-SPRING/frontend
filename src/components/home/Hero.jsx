import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { img } from "../../data/site";
import { useDestinations } from "../../hooks/useResource";

const HERO_IMG = img("Angkor_Wat.jpg", 2000);

const CATEGORIES = [
  { key: "tours", label: "Tours & Activities", icon: "binoculars", to: "/tour" },
  { key: "hotels", label: "Stays & Resorts", icon: "bed", to: "/hotel" },
  { key: "restaurants", label: "Dining & Cuisine", icon: "utensils", to: "/restaurant" },
];

// Curated fallback used only when the backend has no province data.
const STATIC_DESTINATIONS = [
  "All Cambodia",
  "Siem Reap & Angkor",
  "Phnom Penh",
  "Koh Rong & Islands",
  "Kampot & Kep",
  "Battambang",
  "Mondulkiri Highlands",
];

const TRENDING_TAGS = [
  { label: "Angkor Wat Sunrise", to: "/tour?q=Angkor+Sunrise" },
  { label: "Koh Rong Secret Beach", to: "/hotel?q=Koh+Rong" },
  { label: "Kampot River Sunset", to: "/tour?q=Kampot" },
  { label: "Khmer Amok Dining", to: "/restaurant?q=Amok" },
];

export default function Hero() {
  const navigate = useNavigate();
  const { items: destinations, loading } = useDestinations();
  const [activeCategory, setActiveCategory] = useState("tours");
  const [selectedDest, setSelectedDest] = useState("All Cambodia");
  const [date, setDate] = useState("2026-09-25");
  const [guests, setGuests] = useState(2);

  // Live province list from the backend; curated list when unavailable.
  const DESTINATIONS = useMemo(() => {
    const fromApi = Array.from(new Set((destinations || []).map((d) => d.title).filter(Boolean)));
    return fromApi.length ? ["All Cambodia", ...fromApi] : STATIC_DESTINATIONS;
  }, [destinations]);

  const handleSearch = (e) => {
    e.preventDefault();
    const cat = CATEGORIES.find((c) => c.key === activeCategory);
    const basePath = cat ? cat.to : "/tour";
    const cleanDest = selectedDest === "All Cambodia" ? "" : selectedDest.split("&")[0].trim();
    const query = cleanDest ? `?q=${encodeURIComponent(cleanDest)}` : "";
    navigate(`${basePath}${query}`);
  };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background Image with Cinematic Luxury Gradients */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMG}
          alt="Angkor Wat at sunrise, Cambodia"
          className="h-full w-full origin-center object-cover animate-slowzoom"
        />
        {/* Multistage contrast gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-900/40 to-canvas" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/70 via-brand-950/30 to-transparent" />
        {/* Subtle ambient gold radial glows */}
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-brand-400/10 blur-2xl pointer-events-none" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8 lg:pb-32 lg:pt-24">
        
        {/* Main Content Area */}
        <div className="max-w-3xl animate-rise">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-md shadow-2xs">
            <Icon name="sparkles" size={14} className="text-gold-400" />
            <span>The Kingdom of Wonder • Official Travel Hub</span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl drop-shadow-sm">
            Experience Cambodia,{" "}
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-amber-300 bg-clip-text text-transparent">
              Curated &amp; Unforgettable.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/90 font-medium">
            From the mystical sunrise over Angkor Wat to pristine island resorts and authentic Khmer flavours, plan and book your perfect Cambodian journey.
          </p>

          {/* Trust Indicators */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-emerald-100">
            <span className="flex items-center gap-1.5">
              <span className="flex text-gold-400">
                <Icon name="star" size={14} fill="currentColor" />
              </span>
              <span>4.9 / 5.0 Rating (12,000+ Reviews)</span>
            </span>
            <span className="hidden sm:inline text-emerald-300/50">•</span>
            <span className="flex items-center gap-1.5">
              <Icon name="badge-check" size={15} className="text-gold-400" />
              <span>Verified Local Guides</span>
            </span>
            <span className="hidden sm:inline text-emerald-300/50">•</span>
            <span className="flex items-center gap-1.5">
              <Icon name="shield-check" size={15} className="text-emerald-400" />
              <span>Free 24h Cancellation</span>
            </span>
          </div>
        </div>

        {/* ================= FLOATING TRIP SEARCH CONSOLE ================= */}
        <div className="mt-10 max-w-4xl animate-rise">
          <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/95 p-3 shadow-lift backdrop-blur-xl sm:p-4">
            
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 border-b border-line/60 pb-3">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-brand-700 text-white shadow-xs"
                        : "text-muted hover:bg-brand-50 hover:text-brand-800"
                    }`}
                  >
                    <Icon
                      name={cat.icon}
                      size={15}
                      className={isSelected ? "text-gold-300" : "text-brand-600"}
                    />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Filter Fields Grid */}
            <form onSubmit={handleSearch} className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
              
              {/* Destination Dropdown */}
              <div className="relative rounded-2xl border border-line bg-canvas/60 p-2.5 transition-colors hover:border-brand-300 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                  {loading ? "Loading destinations" : "Destination"}
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <Icon name="map-pin" size={16} className="text-brand-600 shrink-0" />
                  <select
                    value={selectedDest}
                    onChange={(e) => setSelectedDest(e.target.value)}
                    className="w-full cursor-pointer bg-transparent text-xs font-bold text-ink outline-none"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Input */}
              <div className="relative rounded-2xl border border-line bg-canvas/60 p-2.5 transition-colors hover:border-brand-300 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Trip Date</span>
                <div className="mt-0.5 flex items-center gap-2">
                  <Icon name="calendar" size={16} className="text-brand-600 shrink-0" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-ink outline-none"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div className="relative rounded-2xl border border-line bg-canvas/60 p-2.5 transition-colors hover:border-brand-300 focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">Travelers</span>
                <div className="mt-0.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="users" size={16} className="text-brand-600 shrink-0" />
                    <span className="text-xs font-bold text-ink">{guests} {guests > 1 ? "Guests" : "Guest"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="grid h-6 w-6 place-items-center rounded-md bg-white border border-line text-xs font-bold text-muted hover:text-ink shadow-2xs"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(12, g + 1))}
                      className="grid h-6 w-6 place-items-center rounded-md bg-brand-700 text-xs font-bold text-white shadow-2xs hover:bg-brand-800"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-700 px-7 font-display text-sm font-bold text-white shadow-md transition-all hover:bg-brand-800 hover:shadow-lg active:scale-95 sm:self-center"
              >
                <Icon name="search" size={17} className="transition-transform group-hover:scale-110" />
                <span>Search</span>
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-t border-line/50 pt-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Trending:</span>
              {TRENDING_TAGS.map((tag) => (
                <Link
                  key={tag.label}
                  to={tag.to}
                  className="rounded-full border border-line bg-canvas/80 px-2.5 py-0.5 text-[11px] font-bold text-brand-800 transition-colors hover:border-brand-400 hover:bg-white"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Service Nav Badges (Tours / Hotels / Dining) */}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs">
          <Link
            to="/tour"
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-brand-950/60 px-4 py-2.5 font-bold text-white backdrop-blur-md transition-all hover:bg-brand-950/80 hover:-translate-y-0.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-gold-400 text-brand-950 font-black">
              <Icon name="binoculars" size={14} />
            </span>
            <div>
              <p className="leading-tight">500+ Curated Tours</p>
              <span className="text-[10px] text-gold-300 font-medium">Sunrise, history &amp; rivers</span>
            </div>
          </Link>

          <Link
            to="/hotel"
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-brand-950/60 px-4 py-2.5 font-bold text-white backdrop-blur-md transition-all hover:bg-brand-950/80 hover:-translate-y-0.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-500 text-white font-black">
              <Icon name="bed" size={14} />
            </span>
            <div>
              <p className="leading-tight">Luxury &amp; Boutique Stays</p>
              <span className="text-[10px] text-emerald-200 font-medium">Siem Reap, Phnom Penh &amp; Islands</span>
            </div>
          </Link>

          <Link
            to="/restaurant"
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-brand-950/60 px-4 py-2.5 font-bold text-white backdrop-blur-md transition-all hover:bg-brand-950/80 hover:-translate-y-0.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-xl bg-amber-500 text-brand-950 font-black">
              <Icon name="utensils" size={14} />
            </span>
            <div>
              <p className="leading-tight">Authentic Khmer Dining</p>
              <span className="text-[10px] text-amber-200 font-medium">Fine dining &amp; street flavours</span>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}

