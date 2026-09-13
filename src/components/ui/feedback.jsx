import Icon from "./Icon";

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-brand-100/70 ${className}`} />;
}

export function CardGridSkeleton({ count = 8, cols = "sm:grid-cols-2 lg:grid-cols-4" }) {
  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-[20px] border border-line bg-white shadow-soft">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", message, icon = "compass" }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="mt-4 font-display text-xl font-bold text-brand-800">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>}
    </div>
  );
}

// Shown when the backend is unreachable and we're rendering demo data.
export function DemoNote({ className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3.5 py-1.5 text-xs font-semibold text-gold-700 ${className}`}>
      <Icon name="info" size={14} />
      Showing demo data — start the backend to go live
    </div>
  );
}
