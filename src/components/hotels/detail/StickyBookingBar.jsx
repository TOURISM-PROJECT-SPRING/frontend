import Icon from "../../ui/Icon";
import { money } from "../../../lib/format";

// Mobile-only sticky booking bar. Scroll to the pricing card on tap.
export default function StickyBookingBar({ price, targetId = "prices" }) {
  if (price == null) return null;
  const scrollTo = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <div className="leading-tight">
          <p className="text-[11px] font-medium text-muted">From</p>
          <p className="font-display text-xl font-bold text-brand-800">
            {money(price)}
            <span className="text-xs font-medium text-muted"> /night</span>
          </p>
        </div>
        <button
          type="button"
          onClick={scrollTo}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-green-600 px-6 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#4ecd54] active:scale-[0.99]"
        >
          View prices
          <Icon name="arrow-right" size={15} />
        </button>
      </div>
    </div>
  );
}
