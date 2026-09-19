import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useInbox } from "../context/InboxContext";
import {
  Bell,
  CheckCheck,
  Trash2,
  Hotel,
  Ticket,
  Calendar,
  Eye,
  CheckCircle2,
  Inbox as InboxIcon,
  Search,
  ArrowLeft,
  Sparkles,
  Users,
} from "lucide-react";
import { formatPrice } from "../utils/helpers";

export default function InboxPage() {
  const {
    alerts,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    removeAlert,
    clearAllAlerts,
    viewBookingDetails,
  } = useInbox();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return alerts.filter((alert) => {
      if (activeTab === "unread" && alert.isRead) return false;
      if (activeTab === "stays" && alert.type !== "hotel_booking") return false;
      if (activeTab === "tours" && alert.type !== "ticket_booking") return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${alert.title} ${alert.subtitle} ${alert.hotelName || ""} ${alert.roomType || ""} ${alert.referenceNo || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [alerts, activeTab, search]);

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Back to Home
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-950 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  My Inbox & Alerts
                </h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full animate-pulse">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                All your confirmed reservations, travel receipts, and trip notifications in one place
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}

            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar bg-white dark:bg-gray-950 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "unread"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab("stays")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "stays"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Hotel Stays
            </button>
            <button
              onClick={() => setActiveTab("tours")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "tours"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Tours & Tickets
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* Alert Cards */}
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse items-start justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex-1">
                  <div className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  <div className="mt-2 h-3 w-2/3 rounded-lg bg-gray-100 dark:bg-gray-800" />
                  <div className="mt-3 h-3 w-1/6 rounded-lg bg-gray-100 dark:bg-gray-800" />
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3 text-gray-300 dark:text-gray-600">
              <InboxIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No Inbox Alerts
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm mx-auto">
              You do not have any alerts matching this criteria. Booking confirmations and travel receipts will show up here automatically.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Link
                to="/stays"
                className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-primary/20 flex items-center gap-1.5"
              >
                <Hotel className="w-4 h-4" /> Browse Stays
              </Link>
              <Link
                to="/experiences"
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-primary" /> Explore Tours
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-3xl border p-5 sm:p-6 transition-all duration-200 ${
                  !alert.isRead
                    ? "bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm"
                    : "bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        alert.type === "hotel_booking"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {alert.type === "hotel_booking" ? (
                        <Hotel className="w-6 h-6" />
                      ) : (
                        <Ticket className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {alert.referenceNo}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {alert.status}
                        </span>
                        {!alert.isRead && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-white rounded-full">
                            NEW
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {alert.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-3 mt-3 flex-wrap text-xs">
                        {alert.checkIn && alert.checkOut && (
                          <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl font-medium">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {alert.checkIn} → {alert.checkOut}
                          </span>
                        )}

                        {alert.numGuest && (
                          <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1.5 rounded-xl">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            {alert.numGuest} Guests
                          </span>
                        )}

                        {alert.amount && (
                          <span className="text-sm font-bold text-primary">
                            Total: {formatPrice(alert.amount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => viewBookingDetails(alert)}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Voucher
                    </button>

                    <div className="flex items-center gap-1">
                      {!alert.isRead && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => removeAlert(alert.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition"
                        title="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
