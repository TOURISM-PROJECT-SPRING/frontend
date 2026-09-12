import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Phone, Mail, DoorOpen, MapPin, BedDouble } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import EmptyState from "../components/ui/EmptyState";
import SafeImage from "../components/ui/SafeImage";
import { hotelService } from "../services/hotelService";
import { hotelRoomService } from "../services/hotelRoomService";
import { HOTEL_IMAGES, pickImage, formatPrice } from "../utils/helpers";

export default function StaysPage() {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [hotelList, roomList] = await Promise.all([
        hotelService.getAllHotelsWithImages(),
        hotelRoomService.getAllHotelRooms(),
      ]);
      setHotels(hotelList);
      setHotelRooms(roomList);
    } catch (err) {
      console.error("Error fetching stays:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stays = useMemo(
    () =>
      hotels.map((hotel) => {
        const rooms = hotelRooms.filter((r) => r.hotelId === hotel.id);
        const minPrice = rooms.length
          ? Math.min(...rooms.map((r) => r.pricePerNight))
          : null;
        const roomLabel = rooms[0]?.roomType || "Room";
        return {
          ...hotel,
          roomCount: rooms.length,
          roomTypes: [...new Set(rooms.map((r) => r.roomType))],
          roomLabel,
          minPrice,
          image: hotel.imageUrl || pickImage(HOTEL_IMAGES, hotel.id),
        };
      }),
    [hotels, hotelRooms]
  );

  const filtered = useMemo(
    () =>
      stays.filter(
        (stay) =>
          !search ||
          stay.hotelName?.toLowerCase().includes(search.toLowerCase()) ||
          stay.locationName?.toLowerCase().includes(search.toLowerCase())
      ),
    [stays, search]
  );

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.stays.eyebrow"
        title="banners.stays.title"
        subtitle="banners.stays.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="relative flex-1 mb-6 sm:mb-8 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("stays.searchPlaceholder")}
            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 dark:placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {loading ? (
          <LoadingState rows={6} />
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filtered.map((stay) => (
              <Link
                key={stay.id}
                to={`/stays/${stay.id}`}
                className="group relative bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all"
              >
                <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden">
                  <SafeImage
                    src={stay.image}
                    alt={stay.hotelName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                    <DoorOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    {stay.roomTypes.length} {t("stays.roomTypes")}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    {stay.roomLabel}
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 lg:p-5">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                    {stay.hotelName}
                  </h3>
                  <p className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{stay.locationName}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                    {stay.phoneContact && (
                      <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 dark:bg-gray-900 rounded-md text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3 shrink-0" />
                        {stay.phoneContact}
                      </span>
                    )}
                    {stay.emailContact && (
                      <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 dark:bg-gray-900 rounded-md text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[180px]">{stay.emailContact}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {stay.minPrice != null ? formatPrice(stay.minPrice) : "—"}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 ml-0.5 sm:ml-1">
                        / {t("stays.perNight")}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg group-hover:bg-primary-dark transition-colors">
                      <BedDouble className="w-3.5 h-3.5" />
                      {t("stays.bookNow")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            icon={BedDouble}
            title={t("stays.noResults")}
            onAction={() => setSearch("")}
            actionLabel={t("common.tryAgain")}
          />
        )}
      </div>
    </div>
  );
}