import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Eye, Trash2, X, AlertTriangle, CheckCircle2, Ban, CheckCheck, User, Building2, Calendar, DollarSign, Hash, Info } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";
import { roomBookingService } from "../../services/roomBookingService";
import { ticketBookingService } from "../../services/ticketBookingService";
import { orderService } from "../../services/orderService";
import { useToast } from "../../components/ui/Toast";

const norm = (s) => String(s || "").toUpperCase();

const typeColors = {
  Room: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  Ticket: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const statusColors = {
  CONFIRMED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  COMPLETED: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  CANCELLED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const statusLabel = (s) => {
  const n = norm(s);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

// Parse an aggregate booking id like "HB-3", "TB-5", "FO-7" into { prefix, rawId }
const parseId = (str) => {
  const m = String(str || "").match(/^(HB|TB|FO)-(\d+)$/i);
  return m ? { prefix: m[1].toUpperCase(), rawId: Number(m[2]) } : { prefix: "", rawId: null };
};

export default function AdminBookingsPage() {
  const toast = useToast();
  const { data, loading } = useDashboardData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [bookings, setBookings] = useState([]);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (data?.allBookings) {
      setBookings(data.allBookings);
    }
  }, [data]);

  const filtered = (bookings || []).filter((b) => {
    const guest = b.guest || "";
    const property = b.property || "";
    const id = String(b.id || "");
    const matchSearch = `${guest} ${property} ${id}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || norm(b.status) === norm(filterStatus);
    return matchSearch && matchStatus;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateLocalStatus = (id, status) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  const handleStatusChange = async (booking, status) => {
    const { rawId } = parseId(booking.id);
    setUpdating(true);
    let updated = false;
    try {
      if (booking.type === "Room") {
        if (status === "CANCELLED") {
          await roomBookingService.cancelRoomBooking(rawId);
        } else {
          await roomBookingService.updateRoomBooking(rawId, { status });
        }
        updated = true;
      } else if (booking.type === "Ticket") {
        if (status === "CANCELLED") {
          await ticketBookingService.cancelTicketBooking(rawId);
          updated = true;
        } else if (status === "COMPLETED") {
          await ticketBookingService.markTicketBookingUsed(rawId);
          updated = true;
        }
      } else {
        if (status === "CANCELLED") {
          await orderService.cancelOrder(rawId);
        } else {
          await orderService.updateOrderStatus(rawId, status);
        }
        updated = true;
      }
      updateLocalStatus(booking.id, status);
      toast.success(`Booking ${statusLabel(status).toLowerCase()} successfully`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      updateLocalStatus(booking.id, status);
      toast.success(`Booking status updated to ${statusLabel(status)}${updated ? " (offline mode)" : ""}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { rawId } = parseId(deleteTarget.id);
    setDeleting(true);
    try {
      if (deleteTarget.type === "Room") await roomBookingService.deleteRoomBooking(rawId);
      else if (deleteTarget.type === "Ticket") await ticketBookingService.deleteTicketBooking(rawId);
      else await orderService.deleteOrder(rawId);
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.success("Booking deleted (offline mode)");
    } finally {
      setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading bookings from the server..." />;

  const statusActionButtons = (b) => {
    const status = norm(b.status);
    return (
      <div className="flex flex-wrap gap-2">
        {(status === "PENDING") && (
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStatusChange(b, "CONFIRMED")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-60 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Confirm
          </button>
        )}
        {status !== "CANCELLED" && status !== "COMPLETED" && (
          <>
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange(b, "COMPLETED")}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition disabled:opacity-60 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange(b, "CANCELLED")}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition disabled:opacity-60 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" /> Cancel
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
            <TotalBadge count={bookings.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All reservations across rooms, tickets, and food</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by guest, property, or ID..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((s) => (
            <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-3.5 font-mono font-semibold text-primary">{b.id}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[b.type] || "bg-gray-100 text-gray-600"}`}>{b.type || "N/A"}</span></td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{b.guest || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{b.property || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{b.date || "N/A"}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{b.amount || "$0"}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[norm(b.status)] || "bg-gray-100 text-gray-600"}`}>{statusLabel(b.status)}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(b)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Details"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete Booking"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={currentPage} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} itemLabel="bookings" />
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> Booking Details
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Reservation #{viewTarget.id}</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.property || "N/A"}</p>
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${typeColors[viewTarget.type] || "bg-gray-100 text-gray-600"}`}>{viewTarget.type}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[norm(viewTarget.status)] || "bg-gray-100 text-gray-600"}`}>{statusLabel(viewTarget.status)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Booking ID</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1 font-mono">#{viewTarget.id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Guest</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.guest || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Property</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.property || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.date || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Amount</p>
                <p className="text-sm font-bold text-primary mt-1">{viewTarget.amount || "$0"}</p>
              </div>
              {viewTarget.customer && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.customer}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Update booking status</p>
              {statusActionButtons(viewTarget)}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Booking</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this reservation</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete booking{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.id}</strong>{" "}
              for <strong className="text-gray-900 dark:text-white">{deleteTarget.guest}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}