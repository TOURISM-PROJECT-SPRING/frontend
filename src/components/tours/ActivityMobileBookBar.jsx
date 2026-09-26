import Icon from "../ui/Icon";

// On mobile the booking card sits below every section, so the primary CTA is
// off-screen until you've read the whole page. This pins it to the viewport.
export default function ActivityMobileBookBar({ price, total, guests, onReserve }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_28px_rgba(2,70,46,0.10)] backdrop-blur-lg lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold leading-tight text-brand-900">
            {price || "On request"}
          </p>
          {price != null && (
            <p className="truncate text-[12px] text-muted">
              {total} for {guests} {guests === 1 ? "guest" : "guests"}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onReserve}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 active:scale-[0.98]"
        >
          <Icon name="ticket" size={18} /> Reserve
        </button>
      </div>
    </div>
  );
}
