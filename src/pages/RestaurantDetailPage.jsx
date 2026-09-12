import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  UtensilsCrossed,
  CheckCircle,
  MinusCircle,
} from "lucide-react";
import { restaurantService } from "../services/restaurantService";
import { restaurantAttachmentService } from "../services/restaurantAttachmentService";
import { foodService } from "../services/foodService";
import SafeImage from "../components/ui/SafeImage";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { formatTime, formatPrice, RESTAURANT_IMAGES, pickImage } from "../utils/helpers";

export default function RestaurantDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [data, foods, attachments] = await Promise.all([
        restaurantService.getRestaurantByIdWithImages(id),
        foodService.getFoodsByRestaurant(id).catch(() => []),
        restaurantAttachmentService.getRestaurantAttachments(id).catch(() => []),
      ]);
      setRestaurant(data || null);
      setMenu(foods || []);

      const urls = (attachments || []).map((a) => a.cloudinaryUrl).filter(Boolean);
      if (!urls.length && data) {
        const seed = pickImage(RESTAURANT_IMAGES, data.id);
        urls.push(seed, ...RESTAURANT_IMAGES.filter((u) => u !== seed).slice(0, 3));
      }
      setGallery(urls);
      setActiveImage(urls[0] || data?.imageUrl || pickImage(RESTAURANT_IMAGES, data?.id));
    } catch (err) {
      console.error("Error fetching restaurant:", err);
      if (restaurant === null) setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <LoadingState rows={4} />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ErrorState onRetry={load} />
        </div>
      </div>
    );
  }

  const mainImage = activeImage || restaurant.imageUrl || pickImage(RESTAURANT_IMAGES, restaurant.id);

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <Link
          to="/dining"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {t("common.backToList")}
        </Link>

        <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <SafeImage
              src={mainImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {restaurant.name}
              </h1>
              {restaurant.tourismPlaceName && (
                <p className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm mt-1.5 sm:mt-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {restaurant.tourismPlaceName}
                </p>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 p-3 sm:p-4 overflow-x-auto hide-scrollbar">
              {gallery.map((url, i) => (
                <button
                  key={`${url}-${i}`}
                  onClick={() => setActiveImage(url)}
                  className={`w-20 sm:w-28 h-14 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === url
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <SafeImage src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <h2 className="flex items-center gap-1.5 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                {t("restaurantDetail.menu")}
              </h2>

              {menu.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                  {t("restaurantDetail.emptyMenu")}
                </p>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {menu.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                      <div className="w-24 sm:w-28 h-24 sm:h-28 shrink-0">
                        <SafeImage
                          src={item.image || undefined}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-2 pr-3 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        {item.foodCategoryName && (
                          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate">
                            {item.foodCategoryName}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <span className="text-sm sm:text-base font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          {item.isAvailable === false ? (
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                              <MinusCircle className="w-3 h-3" />
                              {t("restaurantDetail.unavailable")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="w-3 h-3" />
                              {t("restaurantDetail.available")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 sm:p-5 space-y-3 text-sm">
                {restaurant.description && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {restaurant.description}
                  </p>
                )}
                {restaurant.tourismPlaceName && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {restaurant.tourismPlaceName}
                    </span>
                  </div>
                )}
                {restaurant.openTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatTime(restaurant.openTime)} – {formatTime(restaurant.closeTime)}
                    </span>
                  </div>
                )}
                {restaurant.phoneContact && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span dir="ltr" className="text-gray-600 dark:text-gray-300">
                      {restaurant.phoneContact}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/contact")}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                {t("restaurantDetail.contactUs")}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}