import { useState } from "react";
import Icon from "../ui/Icon";

// Collapsible filter section. Matches the reference: bold dark-green title on
// the left, a chevron on the right that points up when expanded.
export function FilterSection({ title, children, defaultOpen = true, action, info }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 font-display text-[17px] font-bold text-brand-800">
          {title}
          {info && (
            <span className="text-muted/60" title={info}>
      
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="grid h-6 w-6 place-items-center rounded-md text-brand-700 transition hover:bg-brand-50"
          >
            <Icon name="chevron-down" size={16} strokeWidth={2.4} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
      {open && <div className="mt-3 flex flex-col gap-2.5">{children}</div>}
    </section>
  );
}

// Custom square checkbox row — 21px box, 2px muted-green border, dark-green
// fill + white check when selected. Keyboard accessible (sr-only native input).
export function CheckRow({ checked, onChange, label, icon, right }) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 text-[15px] text-ink transition hover:text-brand-800">
      <span className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`grid h-[21px] w-[21px] place-items-center rounded-[4px] border-2 transition ${
            checked
              ? "border-brand-700 bg-brand-700 text-white"
              : "border-brand-300/70 bg-white text-transparent group-hover:border-brand-500"
          }`}
        >
          <Icon name="check" size={13} strokeWidth={3.2} />
        </span>
      </span>
      {icon && <Icon name={icon} size={16} className={checked ? "text-brand-700" : "text-muted"} />}
      <span className={`font-medium ${checked ? "text-brand-800" : ""}`}>{label}</span>
      {right && <span className="ml-auto flex items-center">{right}</span>}
    </label>
  );
}

// "Show more / Show all" underlined expander used at the bottom of a section.
export function ShowMore({ expanded, onToggle, labelMore = "Show more", labelLess = "Show less" }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-1 inline-flex items-center gap-1 self-start text-[15px] font-bold text-brand-700 underline underline-offset-2 transition hover:text-brand-900"
    >
      {expanded ? labelLess : labelMore}
      <Icon name="chevron-down" size={14} strokeWidth={2.4} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
  );
}
