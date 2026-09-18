import { useInbox } from "../../context/InboxContext";
import { CheckCircle2, X, Eye, Bell } from "lucide-react";

export default function InboxToast() {
  const { toastAlert, setToastAlert, viewBookingDetails, openInbox } = useInbox();

  if (!toastAlert) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slide-up">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-primary/20 p-4 relative overflow-hidden backdrop-blur-md">
        {/* Top subtle highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-emerald-500" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Booking Confirmed
              </span>
              <span className="text-[10px] text-gray-400">Just now</span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
              {toastAlert.hotelName || toastAlert.ticketName || "Booking Added to Inbox!"}
            </h4>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {toastAlert.subtitle || "Your reservation details are ready in your inbox."}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  viewBookingDetails(toastAlert);
                  setToastAlert(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" /> View Voucher
              </button>

              <button
                onClick={() => {
                  openInbox();
                  setToastAlert(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Bell className="w-3.5 h-3.5 text-primary" /> Open Inbox
              </button>
            </div>
          </div>

          <button
            onClick={() => setToastAlert(null)}
            className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
