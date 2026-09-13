import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { SECTION_META, DURATION_OPTIONS, RATING_OPTIONS, PRICE_MAX } from "../../lib/explore";

const SECTIONS = [
  { id: "tours", icon: "compass" },
  { id: "hotels", icon: "bed" },
  { id: "restaurants", icon: "utensils" },
  { id: "all", icon: "layers" },
];

function GroupTitle({ icon, children }) {
  return (
    <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
      <Icon name={icon} size={14} className="text-gold-600" />
      {children}
    </h3>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors duration-300 ${
        active ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-800 hover:bg-brand-100"
      }`}
    >
      {children}
    </button>
  );
}

const priceInputClass =
  "h-10 w-full rounded-lg border border-line bg-white px-2.5 text-sm outline-none focus:border-brand-400";

export function SidebarContent({ provinces, section, setSection, filters, setFilter, categories, counts, onReset }) {
  const selected = provinces.find((p) => String(p.id) === String(filters.provinceId));
  const showDuration = section === "tours" || section === "all";

  return (
    <div className="space-y-6">
      {/* Section */}
      <div>
        <GroupTitle icon="layers">Discover</GroupTitle>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SECTIONS.map((s) => {
            const meta = SECTION_META[s.id];
            const active = section === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors duration-300 ${
                  active
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-line bg-white text-brand-800 hover:border-brand-300/60"
                }`}
              >
                <Icon name={s.icon} size={16} className={active ? "text-gold-400" : "text-brand-500"} />
                {meta?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Province */}
      <div>
        <GroupTitle icon="map-pin">Destination</GroupTitle>
        <div className="mt-2 max-h-72 space-y-1.5 overflow-y-auto pr-1 hide-scrollbar">
          <button
            type="button"
            onClick={() => setFilter("provinceId", "all")}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 transition-colors duration-300 ${
              filters.provinceId === "all"
                ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/15"
                : "border-line bg-white hover:border-brand-300/60"
            }`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-gold-400">
              <Icon name="globe" size={16} />
            </span>
            <span className="flex-1 text-left text-sm font-bold text-brand-800">All provinces</span>
            <span className="text-xs font-bold text-muted">{counts.total || 0}</span>
          </button>

          {provinces.map((p) => {
            const active = String(p.id) === String(filters.provinceId);
            const no = Object.values(counts.byProvince?.[p.id] || {}).reduce((n, c) => n + (c || 0), 0);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setFilter("provinceId", String(p.id))}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors duration-300 ${
                  active
                    ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/15"
                    : "border-line bg-white hover:border-brand-300/60"
                }`}
              >
                <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                  {p.image ? (
                    <SmartImage src={p.image} alt={p.title} className="h-full w-full" imgClassName="object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-brand-100 text-brand-600">
                      <Icon name="map-pin" size={15} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-brand-800">{p.title}</span>
                  <span className="block text-[11px] font-medium text-muted">
                    {p.attractions != null ? `${p.attractions} attractions` : "Province"}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-bold text-muted">{no}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <GroupTitle icon="compass">Category</GroupTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip active={filters.category === "all"} onClick={() => setFilter("category", "all")}>All</Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={filters.category === c.id} onClick={() => setFilter("category", c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* Duration */}
      {showDuration && (
        <div>
          <GroupTitle icon="clock">Tour length</GroupTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((d) => (
              <Chip key={d.id} active={filters.duration === d.id} onClick={() => setFilter("duration", d.id)}>
                {d.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <GroupTitle icon="tag">Price / night</GroupTitle>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={PRICE_MAX}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilter("minPrice", e.target.value)}
            className={priceInputClass}
          />
          <span className="text-sm font-bold text-muted">–</span>
          <input
            type="number"
            min={0}
            max={PRICE_MAX}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className={priceInputClass}
          />
        </div>
        {selected && (
          <p className="mt-1.5 text-[11px] font-medium text-muted">
            Average stay in {selected.title} shown right
          </p>
        )}
      </div>

      {/* Rating */}
      <div>
        <GroupTitle icon="star">Rating</GroupTitle>
        <div className="mt-2 flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <Chip key={r.id} active={filters.minRating === r.id} onClick={() => setFilter("minRating", r.id)}>
              <span className="flex items-center gap-1">
                {r.label}
                {r.id !== "0" && <Icon name="star" size={11} className="fill-current text-gold-400" />}
              </span>
            </Chip>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-bold text-brand-700 transition-colors duration-300 hover:bg-brand-50"
      >
        <Icon name="x" size={16} /> Reset filters
      </button>
    </div>
  );
}

export default function ProvinceSidebar(props) {
  return (
    <aside className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      <SidebarContent {...props} />
    </aside>
  );
}