import { useTranslation } from "react-i18next";
import { Star, Wifi, Car, UtensilsCrossed, Waves, MapPin } from "lucide-react";
import { stays } from "../data/listings";
import PageBanner from "../components/ui/PageBanner";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  restaurant: UtensilsCrossed,
  pool: Waves,
};

export default function StaysPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageBanner
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.stays.eyebrow"
        title="banners.stays.title"
        subtitle="banners.stays.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {stays.map((stay) => (
            <article
              key={stay.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group"
            >
              <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                  {stay.rating}
                </div>
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                  {stay.type}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 lg:p-5">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {stay.title}
                </h3>
                <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{stay.location}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                  {stay.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <span
                        key={amenity}
                        className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 rounded-md text-[10px] sm:text-xs text-gray-500"
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        {t(`stays.amenities.${amenity}`)}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-end justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${stay.price}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 ml-0.5 sm:ml-1">
                      / {t("stays.night")}
                    </span>
                  </div>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                    {t("stays.bookNow")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
