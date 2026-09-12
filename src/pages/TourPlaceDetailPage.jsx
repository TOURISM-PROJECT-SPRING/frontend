import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Tag,
  Star,
  Compass,
  ExternalLink,
  CircleDot,
} from "lucide-react";
import { tourPlaceService } from "../services/tourPlaceService";
import SafeImage from "../components/ui/SafeImage";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { primaryPlaceImage, TRAVEL_IMAGES } from "../utils/helpers";

export default function TourPlaceDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await tourPlaceService.getTourPlaceById(id);
      setPlace(data || null);
      const urls = (data?.placeImages || []).map((i) => i.imageUrl).filter(Boolean);
      setGallery(urls);
      setActiveImage(urls[0] || primaryPlaceImage(data));
    } catch (err) {
      console.error("Error fetching tour place:", err);
      setError(true);
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
          <LoadingState rows={3} />
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ErrorState onRetry={load} />
        </div>
      </div>
    );
  }

  const location = place.district
    ? [place.district.name, place.district.province?.name].filter(Boolean).join(", ")
    : place.address;

  const mapsUrl =
    place.latitude != null && place.longitude != null
      ? `https://www.google.com/maps?q=${place.latitude},${place.longitude}`
      : null;

  const isOpen = String(place.status || "").toLowerCase() !== "closed";

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <Link
          to="/tours"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {t("common.backToList")}
        </Link>

        <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <SafeImage
              src={activeImage || primaryPlaceImage(place) || TRAVEL_IMAGES[0]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
              {place.placeCategory?.name && (
                <span className="inline-flex items-center gap-1 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-lg">
                  <Tag className="w-3 h-3" />
                  {place.placeCategory.name}
                </span>
              )}
            </div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {place.name}
              </h1>
              {location && (
                <p className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm mt-1.5 sm:mt-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {location}
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
            <div className="lg:col-span-2 space-y-6">
              {place.description && (
                <section>
                  <h2 className="flex items-center gap-1.5 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    <Compass className="w-5 h-5 text-primary" />
                    {t("tourDetail.overview")}
                  </h2>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                    {place.description}
                  </p>
                </section>
              )}

              {place.address && (
                <section>
                  <h2 className="flex items-center gap-1.5 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    <MapPin className="w-5 h-5 text-primary" />
                    {t("tourDetail.location")}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    {place.address}
                  </p>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                    </a>
                  )}
                </section>
              )}

              <section className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate("/experiences")}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {t("tourDetail.bookExperience")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/experiences"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-primary/10 text-primary text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors"
                >
                  {t("tourDetail.browseExperiences")}
                </Link>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 sm:p-5 space-y-3 text-sm">
                {place.rating != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("tourDetail.rating")}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {place.rating}
                    </span>
                  </div>
                )}
                {place.placeCategory?.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      {t("tourDetail.category")}
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {place.placeCategory.name}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t("tourDetail.status")}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isOpen
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    <CircleDot className="w-3 h-3" />
                    {String(place.status || "") || "—"}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}