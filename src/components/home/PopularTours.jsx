import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { InlineLoader } from "../ui/AsyncState";
import { tourPlaceService } from "../../services/tourPlaceService";
import { primaryPlaceImage } from "../../utils/helpers";

const badgeColors = ["bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-rose-500", "bg-cyan-500"];

export default function PopularTours() {
  const { t } = useTranslation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await tourPlaceService.getAllTourPlaces();
        if (cancelled) return;
        const sorted = [...data]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 6)
          .map((place, i) => ({
            id: place.id,
            title: place.name,
            image: primaryPlaceImage(place),
            rating: place.rating,
            badge: place.placeCategory?.name || "Tour",
            badgeColor: badgeColors[i % badgeColors.length],
            area: place.district?.name || "",
            province: place.district?.province?.name || "",
            status: place.status,
          }));
        setTours(sorted);
      } catch (err) {
        console.error("Error loading popular tours:", err);
        if (!cancelled) setTours([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {t("popularTours.badge")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("popularTours.title")}
            </h2>
          </div>
          <Link
            to="/tours"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition"
          >
            {t("popularTours.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <InlineLoader />
        ) : tours.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
            No tours available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, i) => (
              <div
                key={tour.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${i * 100 + 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 ${tour.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}
                  >
                    {tour.badge}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{tour.rating}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">({tour.status})</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{tour.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tour.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {tour.province}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-lg font-extrabold text-amber-500">★ {tour.rating}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{tour.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}