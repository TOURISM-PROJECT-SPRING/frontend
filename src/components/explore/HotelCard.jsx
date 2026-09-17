import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

export default function HotelCard({ hotel, favorite, onFavorite }) {
  const price = hotel.price != null ? money(hotel.price) : null;
  const originalPrice = hotel.originalPrice != null ? money(hotel.originalPrice) : null;
  const href = hotel.href || `/hotels/${hotel.id}`;
  
  const starCount = hotel.stars || 4;

  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Link to={href} className="block h-full w-full">
          <SmartImage
            src={hotel.image}
            alt={hotel.title}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Heart / Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavorite?.(hotel);
          }}
          aria-label={favorite ? "Remove from My trips" : "Save to My trips"}
          aria-pressed={favorite}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full shadow transition-all duration-200 hover:scale-105 active:scale-95 ${
            favorite ? "bg-white text-danger" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Icon name="heart" size={16} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Destination Sub-header */}
        <p className="text-[11px] text-gray-500 mb-0.5">
          {hotel.location || hotel.province || "Siem Reap"}
        </p>

        {/* Title & Star Rating */}
        <Link to={href} className="block mb-2 group-hover:underline">
          <h3 className="inline font-bold text-gray-900 text-[15px] leading-snug">
            {hotel.title}
          </h3>
          <span className="inline-flex items-center ml-1.5 align-baseline">
            {Array.from({ length: starCount }).map((_, i) => (
              <span key={i} className="text-amber-400 text-[12px]">★</span>
            ))}
          </span>
        </Link>

        {/* Rating Score Badge & Review Count */}
        {hotel.rating != null && (
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center rounded bg-blue-700 px-1.5 py-0.5 font-bold text-white text-[11px]">
              {hotel.rating}/10
            </span>
            <span className="text-[11px] text-gray-500">
              {hotel.reviewsCount || "41"} avis
            </span>
          </div>
        )}

        {/* Pricing Info Footer */}
        <div className="mt-auto pt-2">
          {price ? (
            <div className="flex items-center flex-wrap gap-x-1.5">
              <span className="text-[13px] text-gray-700">À partir de</span>
              <span className="text-[14px] font-bold text-gray-900">{price}</span>
              {originalPrice && (
                <span className="text-[12px] text-gray-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[13px] font-bold text-gray-900">Price on request</span>
          )}
        </div>
      </div>
    </article>
  );
}