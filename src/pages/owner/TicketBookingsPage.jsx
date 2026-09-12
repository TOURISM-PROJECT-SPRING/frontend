import { useEffect, useState, useMemo } from "react";
import { Search, Ticket, Eye, CheckCircle2, QrCode, RefreshCw } from "lucide-react";
import { ticketBookingService } from "../../services/ticketBookingService";
import { formatPrice } from "../../utils/helpers";

export default function OwnerTicketBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await ticketBookingService.getAllTicketBookings().catch(() => []);
      setBookings(data || []);
    } catch (e) {
      console.error("Error loading ticket bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      if (status === "USED") {
        await ticketBookingService.markTicketBookingUsed(id);
      } else if (status === "CANCELLED") {
        await ticketBookingService.cancelTicketBooking(id);
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error("Failed to update ticket status:", e);
    }
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== "ALL" && (b.status || "").toUpperCase() !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${b.id} ${b.userName || ""} ${b.ticketName || ""} ${b.tourismPlaceName || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [bookings, statusFilter, search]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Tour Reservations
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Ticket Bookings & Redemptions</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">View guest ticket reservations, verify digital QR codes, and manage check-ins</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar w-full sm:w-auto bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          {["ALL", "CONFIRMED", "USED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-emerald-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search booking ID or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Booking ID</th>
                <th className="px-5 py-4">Visitor</th>
                <th className="px-5 py-4">Experience / Ticket</th>
                <th className="px-5 py-4">Visit Date</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="px-5 py-4 font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    #TB-{String(b.id).padStart(5, "0")}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                    {b.userName || "Traveler"}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white">{b.ticketName || "Ticket"}</p>
                    <p className="text-gray-400">{b.tourismPlaceName || "Attraction"}</p>
                  </td>
                  <td className="px-5 py-4 text-xs font-mono">
                    {b.visitDate || "Scheduled"}
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {formatPrice(b.totalPrice || 0)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.status === "USED"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : b.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {b.status || "CONFIRMED"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-medium transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 px-4">
            <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">No ticket reservations</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tour bookings made by travelers will show up here.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  #TB-{String(selectedBooking.id).padStart(5, "0")}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Ticket Details</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Visitor</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedBooking.userName || "Guest"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Ticket</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedBooking.ticketName || "Pass"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Scheduled Date</span>
                <span className="font-mono text-gray-900 dark:text-white">{selectedBooking.visitDate || "Anytime"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Quantity</span>
                <span className="font-semibold">{selectedBooking.quantity || 1} Ticket(s)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 text-xs">Total Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatPrice(selectedBooking.totalPrice || 0)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => handleUpdateStatus(selectedBooking.id, "USED")}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Mark Ticket Redeemed
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
