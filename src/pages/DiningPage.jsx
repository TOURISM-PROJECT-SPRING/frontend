import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, DollarSign, UtensilsCrossed } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import EmptyState from "../components/ui/EmptyState";
import SafeImage from "../components/ui/SafeImage";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import { RESTAURANT_IMAGES, pickImage, formatPrice, formatTime } from "../utils/helpers";

export default function DiningPage() {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [restaurantList, foodList] = await Promise.all([
        restaurantService.getAllRestaurantsWithImages(),
        foodService.getAllFoods(),
      ]);
      setRestaurants(restaurantList);
      setFoods(foodList);
    } catch (err) {
      console.error("Error fetching dining data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dining = useMemo(
    () =>
      restaurants.map((r) => {
        const items = foods.filter((f) => f.restaurantId === r.id);
        const counts = {};
        items.forEach((f) => {
          counts[f.foodCategoryName] = (counts[f.foodCategoryName] || 0) + 1;
        });
        const cuisine =
          Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] ||
          t("dining.cuisineFallback");
        const minPrice = items.length
          ? Math.min(...items.map((f) => f.price))
          : null;
        return {
          ...r,
          cuisine,
          dishCount: items.length,
          minPrice,
          image: r.imageUrl || pickImage(RESTAURANT_IMAGES, r.id),
        };
      }),
    [restaurants, foods, t]
  );

  const filtered = useMemo(
    () =>
      dining.filter(
        (r) =>
          !search ||
          r.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.tourismPlaceName?.toLowerCase().includes(search.toLowerCase())
      ),
    [dining, search]
  );

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.dining.eyebrow"
        title="banners.dining.title"
        subtitle="banners.dining.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="relative flex-1 mb-6 sm:mb-8 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dining.searchPlaceholder")}
            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {loading ? (
          <LoadingState rows={6} />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/dining/${restaurant.id}`}
                className="group relative bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all"
              >
                <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden">
                  <SafeImage
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                    <UtensilsCrossed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    {restaurant.dishCount} {t("dining.dishes")}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5">
                    <span className="bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                      {restaurant.cuisine}
                    </span>
                    {restaurant.minPrice !== null && (
                      <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {t("destinations.from")} {formatPrice(restaurant.minPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 lg:p-5">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                    {restaurant.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{restaurant.tourismPlaceName}</span>
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      {formatTime(restaurant.openTime)} – {formatTime(restaurant.closeTime)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2.5 sm:mt-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  <span className="inline-flex w-full justify-center mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                    {t("dining.viewMenu")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={UtensilsCrossed}
            title={t("dining.noResults")}
            onAction={() => setSearch("")}
            actionLabel={t("common.tryAgain")}
          />
        )}
      </div>
    </div>
  );
}