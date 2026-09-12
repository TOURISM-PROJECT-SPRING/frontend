import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Star, MapPin, ChevronRight, Wind, Compass } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import EmptyState from "../components/ui/EmptyState";
import SafeImage from "../components/ui/SafeImage";
import { tourPlaceService } from "../services/tourPlaceService";
import { primaryPlaceImage } from "../utils/helpers";

export default function ToursPage() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await tourPlaceService.getAllTourPlaces();
      setPlaces(data);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(
    () =>
      [...places]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .filter(
          (place) =>
            !search ||
            place.name?.toLowerCase().includes(search.toLowerCase()) ||
            place.district?.name?.toLowerCase().includes(search.toLowerCase()) ||
            place.address?.toLowerCase().includes(search.toLowerCase())
        ),
    [places, search]
  );

  const primaryImage = (place) => primaryPlaceImage(place);

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.tours.eyebrow"
        title="banners.tours.title"
        subtitle="banners.tours.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="relative flex-1 mb-6 sm:mb-8 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("tours.searchPlaceholder")}
            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {loading ? (
          <LoadingState rows={6} />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {sorted.map((place) => (
              <Link
                key={place.id}
                to={`/tours/${place.id}`}
                className="group relative bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all flex flex-col sm:flex-row"
              >
                <div className="relative h-48 sm:h-auto sm:w-56 md:w-64 shrink-0 overflow-hidden">
                  <SafeImage
                    src={primaryImage(place)}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    {place.placeCategory?.name || "Tour"}
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 lg:p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="truncate">{place.district?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="truncate">{place.district?.province?.name}</span>
                    </div>
                    {place.rating != null && (
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-auto shrink-0">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                        {place.rating}
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                    {place.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                    {place.description}
                  </p>

                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-3">
                    {place.address && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-primary/5 text-primary text-[10px] sm:text-xs font-medium rounded-md">
                        {place.address}
                      </span>
                    )}
                    {place.status && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] sm:text-xs font-medium rounded-md">
                        {place.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-bold text-amber-500">
                        ★ {place.rating != null ? place.rating : "—"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 ml-0.5 sm:ml-1">
                        {t("tours.rating")}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg group-hover:bg-primary-dark transition-colors">
                      {t("tours.viewDetails")}
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <EmptyState
            icon={Compass}
            title={t("tours.noResults")}
            onAction={() => setSearch("")}
            actionLabel={t("common.tryAgain")}
          />
        )}
      </div>
    </div>
  );
}