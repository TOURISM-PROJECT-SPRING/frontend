import { useEffect, useState, useMemo } from "react";
import {
  DollarSign,
  Calendar,
  TrendingUp,
  Edit3,
  Trash2,
  Plus,
  Building2,
  Users,
  Search,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { hotelRoomService } from "../../services/hotelRoomService";
import { hotelService } from "../../services/hotelService";
import { roomTypeService } from "../../services/roomTypeService";

const FALLBACK_ROOM_TYPES = [
  { id: 1, roomType: "Standard Room", capacity: 2 },
  { id: 2, roomType: "Deluxe Suite", capacity: 2 },
  { id: 3, roomType: "Family Room", capacity: 4 },
  { id: 4, roomType: "Executive Suite", capacity: 3 },
  { id: 5, roomType: "Private Villa", capacity: 6 },
];

export default function OwnerPricingPage() {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    hotelId: "",
    roomTypeId: "",
    totalRoom: 10,
    capacity: 2,
    pricePerNight: 50,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsData, hotelsData, typesData] = await Promise.all([
        hotelRoomService.getAllHotelRooms().catch(() => []),
        hotelService.getAllHotels().catch(() => []),
        roomTypeService.getAllRoomTypes().catch(() => []),
      ]);

      const resolvedTypes = typesData?.length ? typesData : FALLBACK_ROOM_TYPES;

      setHotelRooms(roomsData || []);
      setHotels(hotelsData || []);
      setRoomTypes(resolvedTypes);
    } catch (error) {
      console.error("Error loading pricing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const properties = useMemo(() => {
    const list = hotels.map((h) => h.hotelName).filter(Boolean);
    return [...new Set(list)];
  }, [hotels]);

  const rows = useMemo(() => {
    return hotelRooms.map((hr) => {
      const basePrice = Number(hr.pricePerNight || 0);
      const weekendPrice = Math.round(basePrice * 1.2);
      const peakPrice = Math.round(basePrice * 1.45);
      const total = Number(hr.totalRoom || 1);
      const capacity = Number(hr.capacity || 2);
      const occupancy = 75;
      const available = Math.max(1, Math.round(total * (1 - occupancy / 100)));

      return {
        id: hr.id,
        hotelId: hr.hotelId,
        property: hr.hotelName || "Hotel",
        roomTypeId: hr.roomTypeId,
        roomType: hr.roomType || "Standard",
        capacity,
        weekday: basePrice,
        weekend: weekendPrice,
        peak: peakPrice,
        available,
        total,
        occupancy,
      };
    });
  }, [hotelRooms]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchProperty = filter === "All" || r.property === filter;
      const matchSearch =
        !search ||
        r.property.toLowerCase().includes(search.toLowerCase()) ||
        r.roomType.toLowerCase().includes(search.toLowerCase());
      return matchProperty && matchSearch;
    });
  }, [rows, filter, search]);

  const avgWeekday = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(rows.reduce((s, r) => s + r.weekday, 0) / rows.length);
  }, [rows]);

  const avgWeekend = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(rows.reduce((s, r) => s + r.weekend, 0) / rows.length);
  }, [rows]);

  const avgOccupancy = useMemo(() => {
    if (!rows.length) return 0;
    return Math.round(rows.reduce((s, r) => s + r.occupancy, 0) / rows.length);
  }, [rows]);

  const openCreateModal = () => {
    setEditRoom(null);
    setErrorMessage("");
    setFormData({
      hotelId: hotels[0]?.id ? String(hotels[0].id) : "",
      roomTypeId: roomTypes[0]?.id ? String(roomTypes[0].id) : "",
      totalRoom: 10,
      capacity: 2,
      pricePerNight: 50,
    });
    setFormOpen(true);
  };

  const openEditModal = (r) => {
    setEditRoom(r);
    setErrorMessage("");
    setFormData({
      hotelId: String(r.hotelId || hotels[0]?.id || ""),
      roomTypeId: String(r.roomTypeId || roomTypes[0]?.id || ""),
      totalRoom: r.total || 10,
      capacity: r.capacity || 2,
      pricePerNight: r.weekday || 50,
    });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        hotelId: Number(formData.hotelId),
        roomTypeId: Number(formData.roomTypeId),
        totalRoom: Number(formData.totalRoom),
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
      };

      if (!payload.hotelId || !payload.roomTypeId) {
        setErrorMessage("Please select both a property and a room type.");
        setSubmitting(false);
        return;
      }

      if (editRoom) {
        await hotelRoomService.updateHotelRoom(editRoom.id, payload);
        setSuccessMessage("Room pricing updated successfully!");
      } else {
        await hotelRoomService.createHotelRoom(payload);
        setSuccessMessage("Room pricing created successfully!");
      }

      await loadData();
      setFormOpen(false);
      setEditRoom(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving room pricing:", error);
      const serverMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to save room pricing. Please verify that this room type is not already configured for this property.";
      setErrorMessage(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await hotelRoomService.deleteHotelRoom(deleteTarget.id);
      setHotelRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Room pricing removed successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting room pricing:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete room pricing.");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading pricing and availability from server...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing & Availability</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Set room rates, manage inventory, and configure nightly pricing across all properties
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Room Pricing
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Avg. Weekday Rate</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${avgWeekday}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Avg. Weekend Rate</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${avgWeekend}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Avg. Occupancy</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{avgOccupancy}%</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property or room type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setFilter("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === "All"
              ? "bg-primary text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            All Properties ({rows.length})
          </button>
          {properties.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === p
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
                {["Property", "Room Type", "Capacity", "Weekday Rate", "Weekend Rate", "Peak Rate", "Total Rooms", "Actions"].map(
                  (h) => (
                    <th key={h} className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3.5">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                    {r.property}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 dark:text-gray-300 font-medium">{r.roomType}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" /> {r.capacity} guests
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">${r.weekday}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 dark:text-white">${r.weekend}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-orange-600 dark:text-orange-400">${r.peak}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {r.total} rooms
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(r)}
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"
                        title="Edit pricing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition"
                        title="Delete room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                    No room pricing configurations found. Click &quot;Add Room Pricing&quot; to configure rates for your hotel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!submitting) {
                setFormOpen(false);
                setEditRoom(null);
              }
            }}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editRoom ? "Edit Room Pricing" : "Add Room Pricing"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditRoom(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hotel Property *</label>
                  <select
                    value={formData.hotelId}
                    onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  >
                    {hotels.length === 0 && <option value="">No properties available</option>}
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hotelName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type *</label>
                  <select
                    value={formData.roomTypeId}
                    onChange={(e) => setFormData({ ...formData, roomTypeId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  >
                    {roomTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.roomType} (Max {t.capacity} guests)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Per Night ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Rooms *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalRoom}
                    onChange={(e) => setFormData({ ...formData, totalRoom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setFormOpen(false);
                    setEditRoom(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editRoom ? "Update Pricing" : "Create Pricing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Room Pricing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to delete <strong>{deleteTarget.roomType}</strong> at <strong>{deleteTarget.property}</strong>?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
