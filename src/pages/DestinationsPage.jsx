import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Star, MapPin, SlidersHorizontal, Map } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import EmptyState from "../components/ui/EmptyState";
import SafeImage from "../components/ui/SafeImage";
import { hotelService } from "../services/hotelService";
import { hotelRoomService } from "../services/hotelRoomService";
import { tourPlaceService } from "../services/tourPlaceService";
import { restaurantService } from "../services/restaurantService";
import { foodService } from "../services/foodService";
import {
  HOTEL_IMAGES,
  RESTAURANT_IMAGES,
  pickImage,
  primaryPlaceImage,
  formatPrice,
} from "../utils/helpers";

const categories = ["all", "stays", "tours", "dining"];

const categoryBadgeStyle = (category) =>
  category === "stays"
    ? "bg-emerald-500"
    : category === "tours"
      ? "bg-primary"
      : "bg-amber-500";

const categoryHref = (item) =>
  item.category === "stays"
    ? `/stays/${item.id}`
    : item.category === "tours"
      ? `/tours/${item.id}`
      : `/dining/${item.id}`;

export default function DestinationsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    categories.includes(searchParams.get("tab")) ? searchParams.get("tab") : "all"
  );

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [hotels, hotelRooms, places, restaurants, foods] = await Promise.all([
        hotelService.getAllHotelsWithImages(),
        hotelRoomService.getAllHotelRooms(),
        tourPlaceService.getAllTourPlaces(),
        restaurantService.getAllRestaurantsWithImages(),
        foodService.getAllFoods(),
      ]);

      const stays = hotels.map((hotel) => {
        const rooms = hotelRooms.filter((r) => r.hotelId === hotel.id);
        const minPrice = rooms.length
          ? Math.min(...rooms.map((r) => r.pricePerNight))
          : null;
        return {
          id: hotel.id,
          key: `stays-${hotel.id}`,
          category: "stays",
          title: hotel.hotelName,
          location: hotel.locationName,
          rating: null,
          price: minPrice,
          image: hotel.imageUrl || pickImage(HOTEL_IMAGES, hotel.id),
        };
      });

      const tours = places.map((place) => ({
        id: place.id,
        key: `tours-${place.id}`,
        category: "tours",
        title: place.name,
        location: place.district
          ? `${place.district.name}, ${place.district.province?.name || ""}`
          : "",
        rating: place.rating,
        price: null,
        image: primaryPlaceImage(place),
      }));

      const dining = restaurants.map((r) => {
        const items = foods.filter((f) => f.restaurantId === r.id);
        const minPrice = items.length
          ? Math.min(...items.map((f) => f.price))
          : null;
        return {
          id: r.id,
          key: `dining-${r.id}`,
          category: "dining",
          title: r.name,
          location: r.tourismPlaceName,
          rating: null,
          price: minPrice,
          image: r.imageUrl || pickImage(RESTAURANT_IMAGES, r.id),
        };
      });

      setItems([...stays, ...tours, ...dining]);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory =
          activeCategory === "all" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      }),
    [items, search, activeCategory]
  );

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.destinations.eyebrow"
        title="banners.destinations.title"
        subtitle="banners.destinations.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("destinations.searchPlaceholder")}
              className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 sm:py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t("featured.showing", { count: filtered.length })}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {t(`destinations.categories.${cat}`)}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState rows={6} />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((item) => (
              <Link
                key={item.key}
                to={categoryHref(item)}
                className="group relative bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all"
              >
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                    {item.rating !== null ? (
                      <>
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                        {item.rating}
                      </>
                    ) : (
                      item.price !== null && formatPrice(item.price)
                    )}
                  </div>
                  <div
                    className={`absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 ${categoryBadgeStyle(item.category)} text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg`}
                  >
                    {t(`destinations.categories.${item.category}`)}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  {item.location && (
                    <p className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  )}
                  {item.price !== null && (
                    <p className="mt-2 text-xs sm:text-sm font-bold text-primary">
                      {t("destinations.from")} {formatPrice(item.price)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={Map}
            title={t("destinations.noResults")}
            description={t("destinations.noResultsDesc")}
          />
        )}
      </div>
    </div>
  );
}