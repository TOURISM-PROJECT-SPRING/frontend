import { useState } from "react";
import Icon from "../../ui/Icon";
import DateGuestSelector from "./DateGuestSelector";
import BookingProviderRow from "./BookingProviderRow";
import { money } from "../../../lib/format";

const DEFAULT_VISIBLE = 3;

// The large "View prices for your travel dates" card.
export default function BookingCard({ providers = [], dateValue, onDateChange, onDeal, priceDisclaimer }) {
  const [expanded, setExpanded] = useState(false);
  const visible = providers.slice(0, DEFAULT_VISIBLE);
  const extra = providers.slice(DEFAULT_VISIBLE);
  const minPrice = providers.length ? Math.min(...providers.map((p) => p.price)) : null;
  const nights = dateValue?.nights || 1;

  return (
    <section id="prices" aria-labelledby="prices-heading" className="scroll-mt-28 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="prices-heading" className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">
          View prices for your travel dates
        </h2>
        {nights > 0 && (
          <span className="text-sm font-medium text-muted">
            {nights} night{nights > 1 ? "s" : ""} total
          </span>
        )}
      </div>

      <div className="mt-5">
        <DateGuestSelector value={dateValue} onChange={onDateChange} />
      </div>

      <div className="mt-6 space-y-3">
        {visible.map((p) => (
          <BookingProviderRow key={p.id} provider={p} onDeal={onDeal} />
        ))}

        {extra.length > 0 && (
          <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="space-y-3 overflow-hidden">
              {extra.map((p) => (
                <BookingProviderRow key={p.id} provider={p} onDeal={onDeal} />
              ))}
            </div>
          </div>
        )}
      </div>

      {extra.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer deals" : `View all ${providers.length} deals${minPrice != null ? ` from ${money(minPrice)}` : ""}`}
          <Icon name="chevron-down" size={16} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      <p className="mt-6 text-[13px] leading-relaxed text-muted">
        {priceDisclaimer ||
          "Prices are provided by our partners and reflect nightly room rates, including any mandatory fees. Taxes may not be included. Please see each partner for details."}
      </p>
    </section>
  );
}
