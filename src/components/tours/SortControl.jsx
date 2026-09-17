import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";
import { SORT_OPTIONS } from "../../data/tours";

// "Sort: Featured ▼  ⓘ" — inline dropdown that reorders the grid.
export default function SortControl({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = SORT_OPTIONS.find((o) => o.key === value) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <span className="text-[16px] text-ink/70">Sort:</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className="inline-flex items-center gap-1 text-[16px] font-bold text-brand-900 underline decoration-brand-300 underline-offset-4 transition hover:decoration-brand-500"
        >
          {current.label}
          <Icon name="chevron-down" size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute right-0 z-40 mt-2 w-56 origin-top-right rounded-2xl border border-line bg-white p-1.5 shadow-lift animate-scalein"
          >
            {SORT_OPTIONS.map((o) => (
              <li key={o.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.key === value}
                  onClick={() => {
                    onChange(o.key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[15px] transition-colors hover:bg-brand-50 ${
                    o.key === value ? "font-bold text-brand-800" : "text-ink/80"
                  }`}
                >
                  {o.label}
                  {o.key === value && <Icon name="check" size={16} className="text-success" strokeWidth={2.6} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <span title="Sort results by your preferences" className="text-muted">
        <Icon name="info" size={17} />
      </span>
    </div>
  );
}
