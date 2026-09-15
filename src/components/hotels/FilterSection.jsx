import { useState } from "react";
import Icon from "../ui/Icon";

// Collapsible filter section used inside the sidebar.
export function FilterSection({ title, children, defaultOpen = true, action }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold uppercase tracking-[0.12em] text-brand-800">{title}</h3>
        <div className="flex items-center gap-1">
          {action}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            className="grid h-6 w-6 place-items-center rounded-md text-muted transition hover:bg-brand-50 hover:text-brand-700"
          >
            <Icon name="chevron-down" size={15} className={`transition-transform duration-200 ${open ? "" : "-rotate-90"}`} />
          </button>
        </div>
      </div>
      {open && <div className="mt-3 flex flex-col gap-2.5">{children}</div>}
    </section>
  );
}

// Custom checkbox row (label + optional leading icon + optional info hint).
export function CheckRow({ checked, onChange, label, icon, info, right }) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-ink transition hover:text-brand-800">
      <span className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`grid h-[18px] w-[18px] place-items-center rounded-md border transition ${
            checked ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-transparent group-hover:border-brand-400"
          }`}
        >
          <Icon name="check" size={12} strokeWidth={3} />
        </span>
      </span>
      {icon && <Icon name={icon} size={15} className={checked ? "text-brand-700" : "text-muted"} />}
      <span className={`font-medium ${checked ? "text-brand-800" : ""}`}>{label}</span>
      {info && (
        <span className="text-muted/60" title={info}>
          <Icon name="info" size={13} />
        </span>
      )}
      {right && <span className="ml-auto">{right}</span>}
    </label>
  );
}
