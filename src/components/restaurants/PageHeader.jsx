import Icon from "../ui/Icon";
import Breadcrumb from "./Breadcrumb";

// Top of the page: breadcrumb bar, oversized title, a location selector and the
// two action pills. Title/subtitle/location are driven by the selected province.
export default function PageHeader({
  title,
  subtitle,
  province = "",
  provinces = [],
  onProvince,
  onReserve,
  onMap,
}) {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto max-w-[1320px] px-5 pb-6 pt-5 sm:px-8 lg:px-12">
        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <h1 className="w-full max-w-xl break-words font-display text-[20px] font-extrabold leading-[1.08] tracking-tight text-brand-700 sm:w-auto sm:text-[52px] lg:text-[60px]">
            {title}
          </h1>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {/* Location / province selector */}
            <label className="relative inline-flex h-12 items-center">
              <span className="pointer-events-none absolute left-4 text-brand-700">
                <Icon name="map-pin" size={18} />
              </span>
              <span className="sr-only">Choose a province</span>
              <select
                value={province}
                onChange={(e) => onProvince?.(e.target.value)}
                className="h-12 appearance-none rounded-full border-2 border-brand-700 bg-white pl-11 pr-9 text-[15px] font-bold text-brand-800 outline-none transition hover:bg-brand-50 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="">All of Cambodia</option>
                {provinces.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 text-brand-700">
                <Icon name="chevron-down" size={16} strokeWidth={2.4} />
              </span>
            </label>

            <button
              type="button"
              onClick={onReserve}
              className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-brand-700 bg-white px-5 text-[15px] font-bold text-brand-800 transition hover:bg-brand-50 active:scale-[0.98]"
            >
              <Icon name="calendar" size={18} className="text-brand-700" />
              Reserve a table
            </button>
            <button
              type="button"
              onClick={onMap}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-[15px] font-bold text-white shadow-sm transition hover:bg-brand-800 active:scale-[0.98]"
            >
              <Icon name="map-pin" size={18} className="text-gold-300" />
              Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
