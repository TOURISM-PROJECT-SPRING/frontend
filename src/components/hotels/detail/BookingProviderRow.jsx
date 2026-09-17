import Icon from "../../ui/Icon";
import { money } from "../../../lib/format";

// One booking-partner price row. Desktop: name | refund | price | CTA. Mobile: stacks.
export default function BookingProviderRow({ provider: p, onDeal }) {
  if (!p) return null;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 transition-colors hover:border-brand-200 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none sm:basis-[240px]">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 font-display text-sm font-bold text-brand-700">
          {p.name.slice(0, 1)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-brand-900">{p.name}</span>
          <span className="block truncate text-xs text-muted">{p.tagline}</span>
        </span>
      </div>

      <div className="flex-1 text-sm">
        {p.refundable ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-success">
            <Icon name="check-circle" size={15} className="shrink-0" />
            Fully refundable{p.refundableUntil ? ` before ${p.refundableUntil}` : ""}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-medium text-muted">
            <Icon name="info" size={15} className="shrink-0" /> Non-refundable
          </span>
        )}
        {p.roomsRemaining != null && (
          <span className="mt-0.5 block text-xs font-semibold text-danger">Only {p.roomsRemaining} left</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="text-right">
          <span className="font-display text-xl font-bold text-brand-800">{money(p.price)}</span>
          <span className="block text-[11px] text-muted">/night</span>
        </div>
        <button
          type="button"
          onClick={() => onDeal?.(p)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-green-600 px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#4ecd54] hover:shadow-md active:scale-[0.99]"
        >
          View deal
        </button>
      </div>
    </div>
  );
}
