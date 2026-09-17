import Icon from "../ui/Icon";

export function SearchInput({ value, onChange, placeholder = "Search…" }) {
  return (
    <label className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-line bg-white px-4 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 sm:max-w-sm">
      <Icon name="search" size={18} className="text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear" className="text-muted hover:text-brand-700">
          <Icon name="x" size={16} />
        </button>
      )}
    </label>
  );
}

export function Chips({ options = [], value, onChange }) {
  if (!options.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
              on
                ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                : "border-line bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            {o.name}
          </button>
        );
      })}
    </div>
  );
}
