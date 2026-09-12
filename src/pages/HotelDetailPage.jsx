import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Users,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Building2,
  Bell,
  Eye,
} from "lucide-react";
import { hotelService } from "../services/hotelService";
import { hotelRoomService } from "../services/hotelRoomService";
import { hotelAttachmentService } from "../services/hotelAttachmentService";
import { roomBookingService } from "../services/roomBookingService";
import { useAuth } from "../context/AuthContext";
import { useInbox } from "../context/InboxContext";
import SafeImage from "../components/ui/SafeImage";
import { LoadingState, ErrorState } from "../components/ui/AsyncState";
import { HOTEL_IMAGES, pickImage, formatPrice } from "../utils/helpers";

export default function HotelDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addBookingAlert, openInbox, viewBookingDetails } = useInbox();

  const [hotel, setHotel] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openFormFor, setOpenFormFor] = useState(null);
  const [booking, setBooking] = useState({ checkIn: "", checkOut: "", numGuest: 2, paymentMethod: "" });
  const [bookingState, setBookingState] = useState("idle");
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [hotelData, roomList, attachments] = await Promise.all([
        hotelService.getHotelByIdWithImages(id),
        hotelRoomService.getHotelRoomsByHotel(id),
        hotelAttachmentService.getHotelAttachments(id).catch(() => []),
      ]);
      setHotel(hotelData || null);
      setRooms(roomList || []);

      const urls = (attachments || [])
        .map((a) => a.cloudinaryUrl)
        .filter(Boolean);
      if (!urls.length && hotelData) {
        const seed = pickImage(HOTEL_IMAGES, hotelData.id);
        urls.push(seed, ...HOTEL_IMAGES.filter((u) => u !== seed).slice(0, 3));
      }
      setGallery(urls);
      setActiveImage(urls[0] || hotelData?.imageUrl || pickImage(HOTEL_IMAGES, hotelData?.id));
    } catch (err) {
      console.error("Error fetching hotel:", err);
      if (hotel === null) setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleBookingSubmit = async (e, roomId) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setBookingState("submitting");
    try {
      const res = await roomBookingService.createRoomBooking({
        userId: user.id,
        roomId,
        numGuest: Number(booking.numGuest),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        paymentMethod: booking.paymentMethod || undefined,
      });

      const targetRoom = rooms.find((r) => r.id === roomId);
      const confirmedData = {
        ...res,
        id: res?.id || Date.now(),
        hotelName: hotel?.hotelName,
        roomType: targetRoom?.roomType || "Standard Room",
        pricePerNight: targetRoom?.pricePerNight,
        numGuest: Number(booking.numGuest),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        paymentMethod: booking.paymentMethod || "Cash on Arrival",
        status: res?.status || "CONFIRMED",
      };

      addBookingAlert(confirmedData, "hotel_booking");
      setLastConfirmedBooking(confirmedData);
      setBookingState("success");
      setOpenFormFor(null);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingState("error");
      setTimeout(() => setBookingState("idle"), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <LoadingState rows={4} />
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ErrorState onRetry={load} />
        </div>
      </div>
    );
  }

  const mainImage = activeImage || hotel.imageUrl || pickImage(HOTEL_IMAGES, hotel.id);

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <Link
          to="/stays"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          {t("common.backToList")}
        </Link>

        <div className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <SafeImage
              src={mainImage}
              alt={hotel.hotelName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {hotel.hotelName}
              </h1>
              {hotel.locationName && (
                <p className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm mt-1.5 sm:mt-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {hotel.locationName}
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
                  className={`w-20 sm:w-28 h-14 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === url
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                  <SafeImage src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {t("hotelDetail.rooms")}
                </h2>

                {rooms.length === 0 ? (
                  <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                    {t("hotelDetail.noRooms")}
                  </p>
                ) : (
                  <div className="mt-4 space-y-3 sm:space-y-4">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 sm:p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                                {room.roomType}
                              </h3>
                              <p className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                <Users className="w-3 h-3 shrink-0" />
                                {t("hotelDetail.capacity")}: {room.capacity}
                                <span className="ml-2 inline-flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                  {room.totalRoom} {t("hotelDetail.total")}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
                            <div className="text-right">
                              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(room.pricePerNight)}
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                                {t("hotelDetail.pricePerNight")}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setOpenFormFor(openFormFor === room.id ? null : room.id);
                                setBookingState("idle");
                              }}
                              className="px-3.5 sm:px-5 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors shrink-0"
                            >
                              {t("hotelDetail.book")}
                            </button>
                          </div>
                        </div>

                        {openFormFor === room.id && (
                          <form
                            onSubmit={(e) => handleBookingSubmit(e, room.id)}
                            className="mt-3.5 sm:mt-4 pt-3.5 sm:pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                          >
                            <label className="block">
                              <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("hotelDetail.checkIn")}
                              </span>
                              <input
                                type="date"
                                required
                                value={booking.checkIn}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })}
                                className="w-full px-2.5 sm:px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary"
                              />
                            </label>
                            <label className="block">
                              <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("hotelDetail.checkOut")}
                              </span>
                              <input
                                type="date"
                                required
                                value={booking.checkOut}
                                min={booking.checkIn || new Date().toISOString().split("T")[0]}
                                onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })}
                                className="w-full px-2.5 sm:px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary"
                              />
                            </label>
                            <label className="block">
                              <span className="block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("hotelDetail.guests")}
                              </span>
                              <input
                                type="number"
                                min="1"
                                max={room.capacity}
                                required
                                value={booking.numGuest}
                                onChange={(e) =>
                                  setBooking({ ...booking, numGuest: e.target.value })
                                }
                                className="w-full px-2.5 sm:px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary"
                              />
                            </label>
                            <div className="flex items-end">
                              <button
                                type="submit"
                                disabled={bookingState === "submitting"}
                                className="w-full px-3.5 sm:px-5 py-2 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                              >
                                {bookingState === "submitting"
                                  ? t("common.loading")
                                  : t("hotelDetail.book")}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {bookingState === "success" && (
                  <div className="mt-5 p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                            {t("hotelDetail.bookingSuccess")}
                          </h4>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                            Your reservation is confirmed and all information has been added to your <strong>Inbox & Alerts</strong>.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        {lastConfirmedBooking && (
                          <button
                            onClick={() => viewBookingDetails(lastConfirmedBooking)}
                            className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Voucher
                          </button>
                        )}
                        <button
                          onClick={openInbox}
                          className="px-3.5 py-2 bg-white dark:bg-gray-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-xs font-semibold rounded-xl hover:bg-emerald-100/50 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
                        >
                          <Bell className="w-3.5 h-3.5 text-primary" /> Open Inbox
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {bookingState === "error" && (
                  <p className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm text-red-500 font-medium">
                    <AlertCircle className="w-4 h-4" /> {t("hotelDetail.bookingError")}
                  </p>
                )}
              </div>

              <aside className="space-y-4">
                <div className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 sm:p-5">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    {t("hotelDetail.capacity")}
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {hotel.locationName && (
                      <li className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span>{hotel.locationName}</span>
                      </li>
                    )}
                    {hotel.phoneContact && (
                      <li className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span dir="ltr">{hotel.phoneContact}</span>
                      </li>
                    )}
                    {hotel.emailContact && (
                      <li className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span className="break-all" dir="ltr">{hotel.emailContact}</span>
                      </li>
                    )}
                    {!isAuthenticated && (
                      <li className="flex items-start gap-2 pt-2 text-[11px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {t("hotelDetail.loginToBook")}
                      </li>
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}