import { useEffect, useState, useMemo } from "react";
import {
  CalendarCheck,
  Search,
  Plus,
  Building2,
  BedDouble,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  X,
  CreditCard,
  Ban,
} from "lucide-react";
import { roomBookingService } from "../../services/roomBookingService";
import { hotelService } from "../../services/hotelService";
import { hotelRoomService } from "../../services/hotelRoomService";
import { useAuth } from "../../context/AuthContext";

const norm = (s) => String(s || "").toUpperCase();

const statusStyles = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  COMPLETED: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800",
};

export default function OwnerBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedHotel, setSelectedHotel] = useState("All");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    guestName: "",
    hotelId: "",
    roomId: "",
    numGuest: 2,
    checkIn: todayStr,
    checkOut: tomorrowStr,
    paymentMethod: "Cash on Arrival",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, hotelsData, roomsData] = await Promise.all([
        roomBookingService.getAllRoomBookings().catch(() => []),
        hotelService.getAllHotels().catch(() => []),
        hotelRoomService.getAllHotelRooms().catch(() => []),
      ]);

      setBookings(bookingsData || []);
      setHotels(hotelsData || []);
      setHotelRooms(roomsData || []);
    } catch (err) {
      console.error("Error loading bookings data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const guest = b.userName || b.guest || "";
      const property = b.hotelName || b.property || "";
      const id = String(b.id || "");
      const matchSearch = `${guest} ${property} ${id}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        filterStatus === "All" || norm(b.status) === norm(filterStatus);
      const matchHotel =
        selectedHotel === "All" ||
        String(b.hotelId) === String(selectedHotel) ||
        (b.hotelName && b.hotelName.toLowerCase() === selectedHotel.toLowerCase());
      return matchSearch && matchStatus && matchHotel;
    });
  }, [bookings, search, filterStatus, selectedHotel]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => norm(b.status) === "CONFIRMED").length;
    const pending = bookings.filter((b) => norm(b.status) === "PENDING").length;
    const revenue = bookings
      .filter((b) => norm(b.status) !== "CANCELLED")
      .reduce((sum, b) => sum + Number(b.amount || 0), 0);
    return { total, confirmed, pending, revenue };
  }, [bookings]);

  // Filter available rooms when a hotel is selected in form
  const availableRoomsForHotel = useMemo(() => {
    if (!formData.hotelId) return hotelRooms;
    return hotelRooms.filter((r) => String(r.hotelId) === String(formData.hotelId));
  }, [hotelRooms, formData.hotelId]);

  // Selected room details for price & nights calculation
  const selectedRoomDetail = useMemo(() => {
    if (!formData.roomId) return null;
    return hotelRooms.find((r) => String(r.id) === String(formData.roomId));
  }, [hotelRooms, formData.roomId]);

  const calculatedNights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    const d1 = new Date(formData.checkIn);
    const d2 = new Date(formData.checkOut);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [formData.checkIn, formData.checkOut]);

  const calculatedAmount = useMemo(() => {
    const price = Number(selectedRoomDetail?.pricePerNight || 50);
    return price * calculatedNights;
  }, [selectedRoomDetail, calculatedNights]);

  const openCreateModal = () => {
    setErrorMessage("");
    const defaultHotelId = hotels[0]?.id ? String(hotels[0].id) : "";
    const defaultRooms = hotelRooms.filter((r) => String(r.hotelId) === defaultHotelId);
    const defaultRoomId = defaultRooms[0]?.id ? String(defaultRooms[0].id) : hotelRooms[0]?.id ? String(hotelRooms[0].id) : "";

    setFormData({
      guestName: user?.fullname || "Walk-in Guest",
      hotelId: defaultHotelId,
      roomId: defaultRoomId,
      numGuest: 2,
      checkIn: todayStr,
      checkOut: tomorrowStr,
      paymentMethod: "Cash on Arrival",
    });
    setCreateModalOpen(true);
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      if (!formData.roomId) {
        throw new Error("Please select a hotel room for the reservation.");
      }

      const payload = {
        userId: user?.id || 1,
        roomId: Number(formData.roomId),
        numGuest: Number(formData.numGuest),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        paymentMethod: formData.paymentMethod,
      };

      await roomBookingService.createRoomBooking(payload);
      setSuccessMessage("Reservation created successfully!");
      setCreateModalOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Create reservation error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create reservation. Please check date availability.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    setSubmitting(true);
    try {
      await roomBookingService.cancelRoomBooking(bookingId);
      setSuccessMessage("Reservation cancelled successfully.");
      await loadData();
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      }
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Cancel reservation error:", err);
      setErrorMessage("Failed to cancel reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await roomBookingService.deleteRoomBooking(deleteTarget.id);
      setSuccessMessage("Reservation removed successfully.");
      setDeleteTarget(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Delete reservation error:", err);
      setErrorMessage("Failed to delete reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bookings & Reservations
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage incoming room reservations, check-ins, guest details, and payments
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add New Reservation
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && !createModalOpen && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-gray-400 font-medium">Total Bookings</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmed}</div>
            <div className="text-xs text-gray-400 font-medium">Confirmed</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
            <div className="text-xs text-gray-400 font-medium">Pending Confirmation</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${stats.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 font-medium">Total Booking Value</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name, hotel, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {/* Hotel Filter */}
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
          >
            <option value="All">All Properties</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.hotelName}
              </option>
            ))}
          </select>

          {/* Status Pills */}
          <div className="flex gap-1 bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
            {["All", "Confirmed", "Pending", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterStatus === s
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading reservations...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Guest Name
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Property & Room
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredBookings.map((b) => {
                  const st = norm(b.status || "CONFIRMED");
                  const badgeClass = statusStyles[st] || "bg-gray-100 text-gray-600 border-gray-200";

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-primary">
                        #{b.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {b.userName || b.guest || "Guest"}
                        </div>
                        <div className="text-xs text-gray-400">
                          Pay: {b.paymentMethod || "Standard"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.hotelName || b.property || "Hotel"}</span>
                        </div>
                        <div className="text-xs text-primary flex items-center gap-1 mt-0.5">
                          <BedDouble className="w-3 h-3" />
                          <span>{b.roomType || "Room"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.checkIn} &rarr; {b.checkOut}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.numGuest || 1} Guests</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                        ${b.amount || "$0"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                          {b.status || "CONFIRMED"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setDetailModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                            title="View Reservation Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {st !== "CANCELLED" && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                              title="Cancel Reservation"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTarget(b)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      No reservations found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create New Reservation Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" />
                Add New Room Reservation
              </h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="p-5 space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Guest Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                  required
                />
              </div>

              {/* Property & Room Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Select Hotel Property *
                  </label>
                  <select
                    value={formData.hotelId}
                    onChange={(e) => {
                      const newHotelId = e.target.value;
                      const matchedRooms = hotelRooms.filter(
                        (r) => String(r.hotelId) === String(newHotelId)
                      );
                      setFormData({
                        ...formData,
                        hotelId: newHotelId,
                        roomId: matchedRooms[0]?.id ? String(matchedRooms[0].id) : "",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select hotel</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hotelName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Select Room Type *
                  </label>
                  <select
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select room</option>
                    {availableRoomsForHotel.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomType} (${r.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    min={formData.checkIn || todayStr}
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Guests Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.numGuest}
                    onChange={(e) => setFormData({ ...formData, numGuest: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                >
                  <option value="Cash on Arrival">Cash on Arrival</option>
                  <option value="ABA KHQR">ABA KHQR (Direct Pay)</option>
                  <option value="Credit Card">Credit Card (Visa/Mastercard)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Booking Summary Box */}
              <div className="p-3.5 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Duration & Rate</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {calculatedNights} night{calculatedNights > 1 ? "s" : ""} @ ${selectedRoomDetail?.pricePerNight || 50}/night
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Calculation</div>
                  <div className="text-lg font-bold text-primary">${calculatedAmount}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {submitting ? "Booking..." : "Confirm & Save Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {detailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reservation #{selectedBooking.id}
              </h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Guest Name</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.userName || selectedBooking.guest || "Guest"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Hotel Property</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedBooking.hotelName || selectedBooking.property || "Hotel"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Room Type</span>
                <span className="font-semibold text-primary">
                  {selectedBooking.roomType || "Standard Room"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Check-In & Check-Out</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBooking.checkIn} &rarr; {selectedBooking.checkOut}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Guests</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBooking.numGuest || 1} Guests
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedBooking.paymentMethod || "Standard"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  ${selectedBooking.amount || "$0"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[norm(selectedBooking.status)] || ""}`}>
                  {selectedBooking.status || "CONFIRMED"}
                </span>
              </div>

              {norm(selectedBooking.status) !== "CANCELLED" && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 rounded-xl text-sm font-semibold transition"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl p-6 text-center animate-scale-up">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Delete Reservation Record
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete reservation #{deleteTarget.id} for{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {deleteTarget.userName || deleteTarget.guest}
              </span>
              ?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteBooking}
                className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition shadow-md shadow-red-600/20 disabled:opacity-60"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}