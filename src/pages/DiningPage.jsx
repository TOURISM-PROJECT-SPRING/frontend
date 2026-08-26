import { useTranslation } from "react-i18next";
import { Star, MapPin, Clock, DollarSign } from "lucide-react";
import { dining } from "../data/listings";
import PageBanner from "../components/ui/PageBanner";

export default function DiningPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageBanner
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.dining.eyebrow"
        title="banners.dining.title"
        subtitle="banners.dining.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {dining.map((restaurant) => (
            <article
              key={restaurant.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group"
            >
              <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                  {restaurant.rating}
                </div>
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5">
                  <span className="bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    {restaurant.cuisine}
                  </span>
                  <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {restaurant.priceRange}
                  </span>
                </div>
              </div>
              <div className="p-3.5 sm:p-4 lg:p-5">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                  {restaurant.title}
                </h3>
                <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 mt-1">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span className="truncate">{restaurant.location}</span>
                </p>
                <div className="flex items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    {restaurant.hours}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-gray-50 rounded-md">
                    {t(`dining.priceRange.${restaurant.priceRange === "$$$" ? "upscale" : restaurant.priceRange === "$$" ? "moderate" : "affordable"}`)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2.5 sm:mt-3 line-clamp-2">
                  {restaurant.description}
                </p>
                <button className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                  {t("dining.viewMenu")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
