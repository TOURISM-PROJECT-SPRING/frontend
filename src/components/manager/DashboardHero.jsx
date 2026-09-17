import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

export default function DashboardHero({ eyebrow, title, subtitle, date, actions = [] }) {
  return (
    <section className="relative animate-rise overflow-hidden rounded-[24px] bg-brand-800 p-6 text-white shadow-lift sm:p-8">
      <div className="khmer-motif absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-400/25 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{eyebrow}</p>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">{subtitle}</p>}
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {actions.map((a) =>
              a.to ? (
                <Link
                  key={a.label}
                  to={a.to}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold-400 px-4 py-2.5 text-sm font-bold text-brand-900 shadow-md transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-gold-300"
                >
                  <Icon name={a.icon} size={16} />
                  {a.label}
                </Link>
              ) : null
            )}
          </div>
        )}
      </div>

      <span className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/85 ring-1 ring-white/15">
        <Icon name="clock" size={13} className="text-gold-300" />
        {date}
      </span>
    </section>
  );
}