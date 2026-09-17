import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { useFavorites } from "../../context/FavoritesContext";

const KIND_ICON = { tour: "binoculars", hotel: "bed", restaurant: "utensils" };

// One saved place: thumbnail | title + location | dark-green pill action.
// Clicking the thumbnail/title switches back to the item's detail page,
// but only when the favorite carries a real href (showcase attractions
// without a detail page stay non-clickable).
function SavedRow({ item, onRemove, onOpen }) {
  const href = item.href || null;

  const body = (
    <>
      <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-28">
        {item.image ? (
          <SmartImage src={item.image} alt={item.title} className="h-full w-full" imgClassName="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-800 text-gold-400">
            <Icon name={KIND_ICON[item.kind] || "heart"} size={24} />
          </span>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-display text-base font-bold leading-snug text-brand-800 sm:text-lg">{item.title}</p>
        {item.location && (
          <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted">
            <Icon name="map-pin" size={14} className="shrink-0 text-brand-500" />
            {item.location}
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3 shadow-soft transition-shadow hover:shadow-lift sm:p-4">
      {href ? (
        <Link to={href} onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-4" aria-label={`Open ${item.title}`}>
          {body}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-4">{body}</div>
      )}

      <button
        type="button"
        onClick={() => onRemove(item.key)}
        aria-label={`Remove ${item.title} from My trips`}
        className="shrink-0 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-brand-800 hover:shadow-md active:scale-95 sm:px-7 sm:py-3 sm:text-base"
      >
        Remove
      </button>
    </div>
  );
}

// "My trips" — favorites-only slide-over panel (no prices, no checkout).
// Fed exclusively by the heart buttons; styled after the save-to-trip design.
export default function MyTrips() {
  const { items, isOpen, closeFavorites, remove, clear, count } = useFavorites();

  useEffect(() => {
    if (!isOpen) return undefined;
    const h = (e) => e.key === "Escape" && closeFavorites();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, closeFavorites]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 animate-fade bg-brand-950/50 backdrop-blur-sm" onClick={closeFavorites} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="My trips"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slidein flex-col bg-white shadow-lift sm:max-w-lg"
      >
        {/* Header — centered luggage + "My trips", close on the right */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-line px-5 py-4">
          <span className="flex items-center gap-2.5 font-display text-lg font-bold text-brand-800">
            <Icon name="luggage" size={20} className="text-brand-700" />
            My trips
          </span>
          <button
            type="button"
            onClick={closeFavorites}
            aria-label="Close"
            className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-brand-900 transition-colors hover:bg-brand-50"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {items.length === 0 ? (
            <div>
              <h2 className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">Nothing saved yet</h2>
              <p className="mt-1.5 text-base font-semibold text-muted">
                Tap the <Icon name="heart" size={14} className="inline -mt-0.5 text-danger" fill="currentColor" /> on any tour, hotel or restaurant to save it here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">Saved places</h2>
                  <p className="mt-1.5 text-base font-semibold text-muted">
                    {count} {count === 1 ? "place" : "places"} you can revisit anytime.
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-3 sm:space-y-4">
                {items.map((i) => (
                  <SavedRow key={i.key} item={i} onRemove={remove} onOpen={closeFavorites} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer bar */}
        <div className="flex shrink-0 items-center justify-between border-t border-line px-5 py-4 sm:px-6">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold text-brand-800 transition-colors hover:bg-danger/10 hover:text-danger"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white">
                <Icon name="trash" size={15} />
              </span>
              Clear all
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={closeFavorites}
            className="rounded-xl px-2 py-1.5 text-sm font-bold text-brand-800 transition-colors hover:text-brand-600 sm:text-base"
          >
            Close
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}
