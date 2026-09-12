import { X, Calendar, MapPin, Users, CreditCard, ShieldCheck, Printer, CheckCircle2, Clock, Hotel, Compass, AlertCircle } from "lucide-react";
import { formatPrice } from "../../utils/helpers";

export default function BookingVoucherModal({ booking, onClose }) {
  if (!booking) return null;

  const isHotel = Boolean(booking.hotelName || booking.roomType || booking.checkIn);
  const isTicket = Boolean(booking.ticketName || booking.tourismPlaceName || booking.visitDate);

  const referenceNo = booking.id
    ? `${isHotel ? "RB" : "TB"}-${String(booking.id).padStart(5, "0")}`
    : "BOOK-REF";

  const checkInDate = booking.checkIn ? new Date(booking.checkIn) : null;
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut) : null;
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)))
    : 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-gray-100 dark:border-gray-800 animate-scale-up">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white relative rounded-t-3xl overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              {booking.status || "CONFIRMED"}
            </span>
            <span className="text-xs text-white/80 font-mono">
              Ref #{referenceNo}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            {isHotel ? booking.hotelName || "Hotel Reservation" : booking.ticketName || "Tour Experience"}
          </h2>
          <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4 shrink-0 text-white/90" />
            {isHotel ? "Cambodia Hospitality & Stays" : booking.tourismPlaceName || "Cambodia Experience"}
          </p>
        </div>

        {/* Voucher Content */}
        <div className="p-6 space-y-6">
          {/* Main Info Box */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-700/60">
            {isHotel ? (
              <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200 dark:divide-gray-700">
                <div>
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Check-in</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{booking.checkIn || "N/A"}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> From 2:00 PM
                  </span>
                </div>
                <div className="pl-4">
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Check-out</span>
                  <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{booking.checkOut || "N/A"}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Until 12:00 PM
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Scheduled Visit Date</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{booking.visitDate || "N/A"}</p>
              </div>
            )}
          </div>

          {/* Details Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Booking Particulars
            </h4>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {isHotel && (
                <>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-primary" /> Room Type
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.roomType || "Standard Room"}</span>
                  </div>

                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Duration of Stay
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{nights} Night{nights > 1 ? "s" : ""}</span>
                  </div>

                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Number of Guests
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.numGuest || 1} Person(s)</span>
                  </div>

                  {booking.pricePerNight && (
                    <div className="p-3.5 flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Nightly Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(booking.pricePerNight)}</span>
                    </div>
                  )}
                </>
              )}

              {isTicket && (
                <>
                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-primary" /> Experience / Place
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.tourismPlaceName || booking.ticketName}</span>
                  </div>

                  <div className="p-3.5 flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" /> Quantity
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{booking.quantity || 1} Ticket(s)</span>
                  </div>
                </>
              )}

              <div className="p-3.5 flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment Method
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{booking.paymentMethod || "Cash on Arrival"}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center bg-primary/5 rounded-b-xl">
                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(booking.amount || booking.totalPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Simulated QR Code for Rapid Check-in */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center p-2 shrink-0">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-gray-800 dark:text-gray-200 fill-current">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm6 0h2v4h-2v-4zm-2 2h2v2h-2v-2zm-4 2h2v2h-2v-2zm4 0h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Digital Check-In Code
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Present this QR or reference #{referenceNo} at reception.
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 shrink-0 transition"
            >
              <Printer className="w-3.5 h-3.5 text-primary" /> Print Voucher
            </button>
          </div>

          {/* Footer note */}
          <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>
              A confirmation alert has been filed in your Smart Tourism Inbox. You can access your reservation receipt anytime from your account.
            </p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-primary/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
