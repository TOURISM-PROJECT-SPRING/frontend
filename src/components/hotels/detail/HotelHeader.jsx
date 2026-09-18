import { useRef, useState } from "react";
import Icon from "../../ui/Icon";
import HotelRating from "./HotelRating";
import AwardBadge from "./AwardBadge";
import { money } from "../../../lib/format";

function SaveButton({ active, onClick }) {
  const [pop, setPop] = useState(false);
  const timer = useRef(null);
  const handle = () => {
    onClick?.();
    setPop(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPop(false), 320);
  };
  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={active}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-all duration-200 ${
        active ? "border-danger/40 bg-danger/5 text-danger" : "border-brand-300 bg-white text-brand-800 hover:bg-brand-50"
      }`}
    >
      <Icon name="heart" size={17} fill={active ? "currentColor" : "none"} className={`transition-transform duration-300 ${pop ? "scale-[1.15]" : ""}`} />
      {active ? "Saved" : "Save"}
    </button>
  );
}

function QuickLink({ link }) {
  const isScroll = link.href?.startsWith("#");
  const cls = "inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900 hover:decoration-brand-400";
  const inner = (
    <>
      <Icon name={link.icon} size={15} className="text-brand-600" />
      {link.label}
    </>
  );
  if (isScroll) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => document.getElementById(link.href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })}
      >
        {inner}
      </button>
    );
  }
  const external = /^https?:/.test(link.href || "");
  return (
    <a
      href={link.href || undefined}
      className={cls}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}

// Hero header: title, rating, ranking, actions, price CTA, and quick links.
export default function HotelHeader({
  hotel,
  favorite,
  onToggleFavorite,
  onReview,
  onJumpReviews,
  onJumpPrices,
}) {
  const price = hotel.price != null ? money(hotel.price) : null;
  return (
    <header className="mt-4 sm:mt-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        {/* Title + rating */}
        <div className="min-w-0">
          {hotel.award && <AwardBadge award={hotel.award} className="mb-2" />}
          <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight text-brand-900 sm:text-4xl lg:text-[46px]">
            {hotel.title}
          </h1>
          <div className="mt-2">
            <HotelRating rating={hotel.rating} reviews={hotel.reviews} onReviewsClick={onJumpReviews} />
          </div>
          {hotel.ranking != null && hotel.totalHotelsInCity != null && (
            <p className="mt-1.5 text-sm font-medium text-muted">
              #{hotel.ranking} of {hotel.totalHotelsInCity.toLocaleString("en-US")} hotels in {hotel.city}
            </p>
          )}
        </div>

        {/* Actions + price */}
        <div className="flex flex-col items-start gap-4 lg:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <SaveButton active={favorite} onClick={onToggleFavorite} />
            <button
              type="button"
              onClick={onReview}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-300 bg-white px-4 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
            >
              <Icon name="pencil" size={16} />
              Review
            </button>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-3 shadow-soft">
            <div className="text-right">
              {price ? (
                <p className="font-display text-3xl font-bold leading-none text-brand-800">
                  {price}
                  <span className="text-sm font-semibold text-muted"> /night</span>
                </p>
              ) : (
                <p className="font-display text-lg font-bold text-brand-800">On request</p>
              )}
              <p className="mt-1 text-[11px] font-medium text-muted">{hotel.priceObj?.provider || "Booking partner"}</p>
            </div>
            {price && (
              <button
                type="button"
                onClick={onJumpPrices}
                className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#4ecd54] hover:shadow-md active:scale-[0.99]"
              >
                View deal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="hide-scrollbar mt-5 flex gap-x-6 gap-y-2 overflow-x-auto border-t border-line pt-4 sm:flex-wrap sm:overflow-visible">
        {(hotel.quickLinks || []).map((l) => (
          <QuickLink key={l.key} link={l} />
        ))}
      </div>
    </header>
  );
}
