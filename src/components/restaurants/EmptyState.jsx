import Icon from "../ui/Icon";

// Shown when filters/search return zero restaurants.
export default function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon name="utensils" size={30} />
      </span>
      <h3 className="mt-5 font-display text-2xl font-bold text-brand-800">No restaurants found</h3>
      <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-muted">
        Try adjusting your filters or search criteria.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800"
      >
        Clear all filters
      </button>
    </div>
  );
}
