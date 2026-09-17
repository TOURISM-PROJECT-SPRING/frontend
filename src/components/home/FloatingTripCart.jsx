import { useState } from "react";
import Icon from "../ui/Icon";
import { useFavorites } from "../../context/FavoritesContext";

export default function FloatingTripCart() {
  const { count, openFavorites, items } = useFavorites();
  const [showQuickPeek, setShowQuickPeek] = useState(false);

  const lastItem = items.length > 0 ? items[items.length - 1] : null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Quick Peek Tooltip / Popover when hovered */}
      {showQuickPeek && count > 0 && lastItem && (
        <div className="animate-fade-up rounded-2xl border border-brand-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md w-72 transition-all">
          <div className="flex items-center justify-between pb-2 border-b border-line/60 text-xs">
            <span className="font-bold text-brand-900">Trip Cart Summary</span>
            <span className="rounded-full bg-brand-100 px-2 py-0.5 font-bold text-brand-800 text-[10px]">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            {lastItem.image ? (
              <img
                src={lastItem.image}
                alt={lastItem.title}
                className="h-11 w-11 shrink-0 rounded-xl object-cover border border-line/60"
              />
            ) : (
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Icon name="luggage" size={18} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-brand-900">{lastItem.title}</p>
              <p className="truncate text-[11px] text-muted">{lastItem.location || "Cambodia"}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={openFavorites}
              className="w-full rounded-xl bg-brand-700 py-1.5 text-center text-xs font-bold text-white transition-colors hover:bg-brand-800"
            >
              View Full Itinerary
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <button
        type="button"
        onClick={openFavorites}
        onMouseEnter={() => setShowQuickPeek(true)}
        onMouseLeave={() => setShowQuickPeek(false)}
        aria-label={`Open Trip Cart with ${count} saved items`}
        className={`group relative flex items-center gap-2.5 rounded-full border border-white/40 px-4 py-2.5 shadow-lift transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md ${
          count > 0
            ? "bg-brand-900/95 text-white ring-2 ring-gold-400/50 hover:bg-brand-900"
            : "bg-white/95 text-brand-900 ring-1 ring-black/5 hover:bg-white"
        }`}
      >
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-brand-950 font-bold">
          <Icon name="luggage" size={15} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
              {count}
            </span>
          )}
        </span>

        <div className="text-left">
          <p className="text-xs font-bold leading-none">
            {count > 0 ? "My Trip Cart" : "Trip Planner"}
          </p>
          <p className={`text-[10px] font-medium leading-tight ${count > 0 ? "text-gold-300" : "text-muted"}`}>
            {count > 0 ? `${count} saved · View plan` : "0 saved places"}
          </p>
        </div>

        <span className="ml-1 text-gold-400 transition-transform duration-300 group-hover:translate-x-0.5">
          <Icon name="chevron-right" size={14} />
        </span>
      </button>
    </div>
  );
}
