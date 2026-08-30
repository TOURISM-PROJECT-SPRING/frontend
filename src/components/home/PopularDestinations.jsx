import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { InlineLoader } from "../ui/AsyncState";
import { provinceService } from "../../services/provinceService";
import { tourPlaceService } from "../../services/tourPlaceService";
import { DESTINATION_IMAGES, pickImage } from "../../utils/helpers";

export default function PopularDestinations() {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [provinces, places] = await Promise.all([
          provinceService.getAllProvinces(),
          tourPlaceService.getAllTourPlaces(),
        ]);
        if (cancelled) return;
        const enriched = provinces.map((province) => {
          const inProvince = places.filter(
            (p) => p.district?.province?.id === province.id
          );
          const avg =
            inProvince.length > 0
              ? inProvince.reduce((sum, p) => sum + (p.rating || 0), 0) / inProvince.length
              : null;
          const count = inProvince.length;
          return {
            id: province.id,
            title: province.name,
            image: pickImage(DESTINATION_IMAGES, province.id),
            rating: avg,
            subtitle:
              count > 0
                ? `${count} ${count === 1 ? "attraction" : "attractions"}`
                : province.image
                  ? "Beautiful destination"
                  : "",
            explore: `Explore ${province.name}`,
          };
        });
        setDestinations(enriched.filter((d) => d.subtitle));
      } catch (err) {
        console.error("Error fetching popular destinations:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10 sm:py-14 bg-gray-50/80 dark:bg-gray-900/50 w-full">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {t("popular.title")}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
              {t("popular.subtitle")}
            </p>
          </div>
          <a
            href="/destinations"
            className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors shrink-0 ml-3 sm:ml-4"
          >
            {t("popular.viewAll")}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>

        {loading ? (
          <InlineLoader />
        ) : destinations.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            No destinations available right now.
          </p>
        ) : (
          <div className="relative group">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory"
            >
              {destinations.map((dest) => (
                <article
                  key={dest.id}
                  className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all snap-start shrink-0"
                >
                  <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {dest.rating !== null && (
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                        {dest.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                      {dest.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {dest.subtitle}
                    </p>
                    <a
                      href={`/destinations/${dest.id}`}
                      className="inline-flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      {dest.explore}
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        <div className="mt-5 sm:mt-6 text-center sm:hidden">
          <a
            href="/destinations"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            {t("popular.viewAllFull")}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}