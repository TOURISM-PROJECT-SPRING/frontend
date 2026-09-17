import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "../ui/Icon";
import { OptionRow } from "./Dropdown";
import {
  AWARD_OPTIONS,
  LANGUAGE_OPTIONS,
  TIME_OPTIONS,
  PRICE_OPTIONS,
  CATEGORY_OPTIONS,
} from "../../data/tours";

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Section({ title, children }) {
  return (
    <div className="border-b border-line py-5 first:pt-0">
      <h3 className="mb-2 font-display text-base font-bold text-brand-900">{title}</h3>
      {children}
    </div>
  );
}

function Group({ options, selected, onToggle }) {
  return (
    <div>
      {options.map((o) => {
        const key = typeof o === "string" ? o : o.key;
        const label = typeof o === "string" ? o : o.label;
        return (
          <OptionRow key={key} checked={selected.includes(key)} onChange={() => onToggle(key)}>
            {label}
          </OptionRow>
        );
      })}
    </div>
  );
}

export default function AllFiltersDrawer({ open, onClose, filters, onPatch, resultCount }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const patch = onPatch;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex justify-end" role="dialog" aria-modal="true" aria-label="All filters">
      <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md animate-slidein flex-col bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-brand-900">
            <Icon name="sliders-horizontal" size={20} className="text-brand-600" /> All filters
          </h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          <Section title="Categories">
            <Group options={CATEGORY_OPTIONS} selected={filters.categories} onToggle={(k) => patch({ categories: toggle(filters.categories, k) })} />
          </Section>

          <Section title="Awards">
            <Group options={AWARD_OPTIONS} selected={filters.awards} onToggle={(k) => patch({ awards: toggle(filters.awards, k) })} />
          </Section>

          <Section title="Languages">
            <Group options={LANGUAGE_OPTIONS} selected={filters.languages} onToggle={(k) => patch({ languages: toggle(filters.languages, k) })} />
          </Section>

          <Section title="Time of day">
            <Group options={TIME_OPTIONS} selected={filters.timeOfDay} onToggle={(k) => patch({ timeOfDay: toggle(filters.timeOfDay, k) })} />
          </Section>

          <Section title="Price">
            <Group options={PRICE_OPTIONS} selected={filters.price} onToggle={(k) => patch({ price: toggle(filters.price, k) })} />
          </Section>

          <Section title="Cancellation">
            <OptionRow checked={filters.freeCancel} onChange={() => patch({ freeCancel: !filters.freeCancel })}>
              Free cancellation only
            </OptionRow>
          </Section>
          <div className="h-6" />
        </div>

        <div className="flex items-center gap-3 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() =>
              patch({
                awards: [],
                languages: [],
                timeOfDay: [],
                price: [],
                categories: [],
                freeCancel: false,
                dates: { from: "", to: "" },
              })
            }
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-50"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800"
          >
            Show {resultCount.toLocaleString("en-US")} {resultCount === 1 ? "activity" : "activities"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
