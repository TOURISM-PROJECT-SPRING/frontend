import { useState } from "react";
import Icon from "../ui/Icon";
import { SORT_OPTIONS } from "../../data/hotels";

// "Sort by: [ Best Value ▼ ]" — small popover menu.
export default function SortDropdown({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.key === value) || SORT_OPTIONS[0];

  return (
    <div className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="ml-2 inline-flex py-3 items-center gap-2 rounded-full border border-line bg-white px-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-300 hover:bg-brand-50"
      >
        {current.label}
        <Icon name="chevron-down" size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <button aria-label="Close sort menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 animate-scalein rounded-2xl border border-line bg-white p-2 shadow-lift">
            {SORT_OPTIONS.map((o) => {
              const on = o.key === value;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => {
                    onChange(o.key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    on ? "bg-brand-50 text-brand-800" : "text-ink hover:bg-brand-50/60"
                  }`}
                >
                  {o.label}
                  {on && <Icon name="check" size={14} className="text-brand-600" strokeWidth={2.6} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
