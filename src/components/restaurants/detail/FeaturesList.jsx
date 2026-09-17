import { useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../../ui/Icon";

function FeaturesModal({ open, onClose, groups = [], title = "" }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="All features">
      <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-2xl animate-scalein overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-brand-900">Features</h3>
            {title && <p className="mt-0.5 text-sm text-muted">{title}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.group}>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-brand-700">
                <Icon name={g.icon} size={16} className="text-brand-500" />
                {g.group}
              </p>
              <ul className="mt-2 space-y-1.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[15px] text-ink/80">
                    <Icon name="check" size={15} className="mt-1 shrink-0 text-success" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Feature rows with thin green icons + a "See all features" modal.
export default function FeaturesList({ rows = [], groups = [], title = "" }) {
  const [open, setOpen] = useState(false);
  if (!rows.length) return null;

  return (
    <section aria-labelledby="features-heading" className="scroll-mt-28">
      <div className="flex items-center justify-between gap-4">
        <h2 id="features-heading" className="font-display text-2xl font-bold text-brand-900 sm:text-[28px]">Features</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 text-[15px] font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900 hover:decoration-brand-400"
        >
          See all features
        </button>
      </div>

      <ul className="mt-5 space-y-5">
        {rows.map((f, i) => (
          <li key={i} className="flex items-start gap-3.5">
            <Icon name={f.icon} size={22} strokeWidth={1.6} className="mt-0.5 shrink-0 text-brand-500" />
            <span className="text-[16px] leading-snug text-ink/85 sm:text-lg">{f.text}</span>
          </li>
        ))}
      </ul>

      <FeaturesModal open={open} onClose={() => setOpen(false)} groups={groups} title={title} />
    </section>
  );
}
