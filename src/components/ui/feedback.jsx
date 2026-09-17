import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
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

export function EmptyState({ title, message, icon = "compass", action }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-gold-50 text-brand-600">
        <Icon name={icon} size={28} />
        <span className="absolute -bottom-0.5 -right-0.5 grid h-6 w-6 place-items-center rounded-full bg-gold-400 text-brand-900 shadow-sm">
          <Icon name="plus" size={13} />
        </span>
      </span>
      <h3 className="mt-5 font-display text-xl font-bold text-brand-800">
        {title ?? t("common.emptyDefault") ?? "Nothing here yet"}
      </h3>
      {message && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Shown when the backend is unreachable and we're rendering demo data.
export function DemoNote({ className = "" }) {
  const { t } = useTranslation();
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50 px-3.5 py-1.5 text-xs font-semibold text-gold-700 ${className}`}>
      <Icon name="info" size={14} />
      {t("common.demoNote")}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-700" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong.", retry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-danger">
        <Icon name="info" size={26} />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-brand-800">Couldn't load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
        >
          <Icon name="refresh" size={15} /> Try again
        </button>
      )}
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false, loading = false }) {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-sm animate-scalein rounded-2xl border border-line bg-white p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${danger ? "bg-danger/10 text-danger" : "bg-brand-50 text-brand-600"}`}>
          <Icon name={danger ? "trash" : "check-circle"} size={22} />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-brand-800">{title}</h3>
        {message && <p className="mt-1 text-sm leading-relaxed text-muted">{message}</p>}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-60 ${
              danger ? "bg-danger hover:bg-danger/90" : "bg-brand-700 hover:bg-brand-800"
            }`}
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}