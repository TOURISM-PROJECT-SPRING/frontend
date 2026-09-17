import Icon from "../ui/Icon";
import SortDropdown from "./SortDropdown";

// Sticky bar above the results: "1,222 results" on the left, Filters (mobile)
// and the Sort control on the right.
export default function ResultsHeader({ countLabel, activeCount = 0, sort, onSort, onOpenFilters, className = "" }) {
  return (
    <div
      className={`sticky top-16 z-30 -mx-1 border-b border-line bg-canvas/95 px-1 py-3 backdrop-blur-sm lg:top-[112px] ${className}`}
    >
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        <p className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">{countLabel}</p>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50 lg:hidden"
          >
            <Icon name="filter" size={14} />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-700 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          <SortDropdown value={sort} onChange={onSort} />
        </div>
      </div>
    </div>
  );
}
