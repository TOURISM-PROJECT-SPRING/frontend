import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useInbox } from "../../context/InboxContext";
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Hotel,
  Ticket,
  Calendar,
  Eye,
  CheckCircle2,
  Inbox as InboxIcon,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "../../utils/helpers";

export default function InboxDrawer() {
  const {
    alerts,
    unreadCount,
    isOpen,
    closeInbox,
    markAsRead,
    markAllAsRead,
    removeAlert,
    clearAllAlerts,
    viewBookingDetails,
  } = useInbox();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (activeTab === "unread" && alert.isRead) return false;
      if (activeTab === "stays" && alert.type !== "hotel_booking") return false;
      if (activeTab === "tours" && alert.type !== "ticket_booking") return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const text = `${alert.title} ${alert.subtitle} ${alert.hotelName || ""} ${alert.roomType || ""} ${alert.referenceNo || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [alerts, activeTab, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeInbox}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col border-l border-gray-100 dark:border-gray-800 animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Inbox & Alerts
                  </h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-primary text-white rounded-full animate-pulse">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Your booking confirmations & travel vouchers
                </p>
              </div>
            </div>

            <button
              onClick={closeInbox}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions & Tabs */}
          <div className="px-5 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === "all"
                      ? "bg-primary text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  All ({alerts.length})
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === "unread"
                      ? "bg-primary text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab("stays")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === "stays"
                      ? "bg-primary text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  Stays
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Read all
                </button>
              )}
            </div>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-300 dark:text-gray-600">
                  <InboxIcon className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  No alerts in this view
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto">
                  When you book hotel rooms or tour experiences, all your confirmations and travel vouchers will arrive here.
                </p>
                <Link
                  to="/stays"
                  onClick={closeInbox}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition"
                >
                  <Hotel className="w-3.5 h-3.5" /> Explore Stays
                </Link>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
                    !alert.isRead
                      ? "bg-primary/5 dark:bg-primary/10 border-primary/20 hover:border-primary/40 shadow-sm"
                      : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!alert.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        alert.type === "hotel_booking"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {alert.type === "hotel_booking" ? (
                        <Hotel className="w-5 h-5" />
                      ) : (
                        <Ticket className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {alert.referenceNo}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> {alert.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">
                        {alert.title}
                      </h4>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {alert.subtitle}
                      </p>

                      {/* Dates and Price badge */}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap text-xs">
                        {alert.checkIn && alert.checkOut && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                            <Calendar className="w-3 h-3 text-primary" />
                            {alert.checkIn} → {alert.checkOut}
                          </span>
                        )}

                        {alert.amount && (
                          <span className="text-xs font-bold text-primary">
                            {formatPrice(alert.amount)}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
                        <button
                          onClick={() => {
                            viewBookingDetails(alert);
                            closeInbox();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Voucher
                        </button>

                        {!alert.isRead && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            title="Mark as read"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => removeAlert(alert.id)}
                          title="Delete notification"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 flex items-center justify-between">
            <Link
              to="/inbox"
              onClick={closeInbox}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Open Full Inbox Page <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
