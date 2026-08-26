import { useTranslation } from "react-i18next";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { tours } from "../data/listings";
import PageBanner from "../components/ui/PageBanner";

export default function ToursPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageBanner
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.tours.eyebrow"
        title="banners.tours.title"
        subtitle="banners.tours.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {tours.map((tour) => (
            <article
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group flex flex-col sm:flex-row"
            >
              <div className="relative h-48 sm:h-auto sm:w-56 md:w-64 shrink-0 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                  {tour.category}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 lg:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 ml-auto shrink-0">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                    {tour.rating}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  {tour.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                  {tour.description}
                </p>

                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-3">
                  {tour.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-1.5 sm:px-2 py-0.5 bg-primary/5 text-primary text-[10px] sm:text-xs font-medium rounded-md"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ${tour.price}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 ml-0.5 sm:ml-1">
                      / {t("tours.person")}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                    {t("tours.bookTour")}
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
