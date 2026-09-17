import Icon from "../ui/Icon";

export default function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-brand-800">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
        {action || (
          <span className="hidden items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700 sm:inline-flex">
            <Icon name="trending-up" size={13} />
            Demo data
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
