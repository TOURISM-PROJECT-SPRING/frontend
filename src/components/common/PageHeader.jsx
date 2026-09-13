import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

export default function PageHeader({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-gradient-to-br from-brand-50 via-cream to-canvas">
      <div className="khmer-motif absolute inset-0 opacity-[0.35]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {crumbs.length > 0 && (
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {c.to ? (
                  <Link to={c.to} className="font-medium hover:text-brand-700">{c.label}</Link>
                ) : (
                  <span className="font-semibold text-brand-700">{c.label}</span>
                )}
                {i < crumbs.length - 1 && <Icon name="chevron-right" size={14} className="text-muted/60" />}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">{eyebrow}</span>
          </div>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-800 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
