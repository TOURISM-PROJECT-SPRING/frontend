import { useEffect, useState, useMemo } from "react";
import {
  BedDouble,
  Building2,
  Users,
  DollarSign,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle,
  X,
  Layers,
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

export default function OwnerRoomsPage() {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

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
      console.error("Error loading rooms data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRooms = useMemo(() => {
    return hotelRooms.filter((r) => {
      const matchSearch =
        `${r.hotelName || ""} ${r.roomType || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchHotel =
        selectedHotel === "All" || String(r.hotelId) === String(selectedHotel);
      const matchType =
        selectedType === "All" || String(r.roomTypeId) === String(selectedType);
      return matchSearch && matchHotel && matchType;
    });
  }, [hotelRooms, search, selectedHotel, selectedType]);

  const stats = useMemo(() => {
    const totalTypes = hotelRooms.length;
    const totalUnits = hotelRooms.reduce((sum, r) => sum + Number(r.totalRoom || 0), 0);
    const avgPrice =
      totalTypes > 0
        ? Math.round(
            hotelRooms.reduce((sum, r) => sum + Number(r.pricePerNight || 0), 0) / totalTypes
          )
        : 0;
    const uniqueHotels = new Set(hotelRooms.map((r) => r.hotelId)).size;
    return { totalTypes, totalUnits, avgPrice, uniqueHotels };
  }, [hotelRooms]);

  const openCreateModal = () => {
    setEditRoom(null);
    setErrorMessage("");
    setFormData({
      hotelId: hotels[0]?.id ? String(hotels[0].id) : "",
      roomTypeId: roomTypes[0]?.id ? String(roomTypes[0].id) : "",
      totalRoom: 10,
      capacity: 2,
      pricePerNight: 55,
    });
    setFormOpen(true);
  };

  const openEditModal = (room) => {
    setEditRoom(room);
    setErrorMessage("");
    setFormData({
      hotelId: String(room.hotelId || ""),
      roomTypeId: String(room.roomTypeId || ""),
      totalRoom: Number(room.totalRoom || 1),
      capacity: Number(room.capacity || 2),
      pricePerNight: Number(room.pricePerNight || 0),
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
        throw new Error("Please select a hotel and a room type.");
      }

      if (editRoom) {
        await hotelRoomService.updateHotelRoom(editRoom.id, payload);
        setSuccessMessage("Room updated successfully!");
      } else {
        await hotelRoomService.createHotelRoom(payload);
        setSuccessMessage("Room created and added to hotel successfully!");
      }

      setFormOpen(false);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Save room error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save room. Please verify the input values.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setErrorMessage("");
    try {
      await hotelRoomService.deleteHotelRoom(deleteTarget.id);
      setSuccessMessage("Room removed successfully!");
      setDeleteTarget(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Delete room error:", err);
      setErrorMessage("Failed to delete room. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms & Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your hotel room types, inventory, guest capacities, and room rates
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add New Room
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
      {errorMessage && !formOpen && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTypes}</div>
            <div className="text-xs text-gray-400 font-medium">Room Configurations</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUnits}</div>
            <div className="text-xs text-gray-400 font-medium">Total Room Units</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${stats.avgPrice}</div>
            <div className="text-xs text-gray-400 font-medium">Avg. Nightly Rate</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3.5">
          <div className="w-11 h-11 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniqueHotels}</div>
            <div className="text-xs text-gray-400 font-medium">Properties Configured</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room type or property name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Hotel Filter */}
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
          >
            <option value="All">All Properties ({hotels.length})</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.hotelName}
              </option>
            ))}
          </select>

          {/* Room Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
          >
            <option value="All">All Room Types</option>
            {roomTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.roomType}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Loading hotel rooms...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Total Units
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Price / Night
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRooms.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <BedDouble className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {r.roomType || "Standard Room"}
                          </div>
                          <div className="text-xs text-gray-400">ID: #{r.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{r.hotelName || "Hotel"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                        <Users className="w-3.5 h-3.5" />
                        <span>{r.capacity || 2} Guests</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {r.totalRoom || 1}
                      </span>{" "}
                      <span className="text-xs text-gray-400">rooms</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ${r.pricePerNight}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                          title="Edit Room"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No rooms found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Room Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editRoom ? "Edit Hotel Room" : "Add New Hotel Room"}
              </h2>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Property Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Select Hotel Property *
                </label>
                <select
                  disabled={Boolean(editRoom)}
                  value={formData.hotelId}
                  onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary disabled:opacity-60"
                  required
                >
                  <option value="">Select a property</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.hotelName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Room Type *
                </label>
                <select
                  disabled={Boolean(editRoom)}
                  value={formData.roomTypeId}
                  onChange={(e) => {
                    const selected = roomTypes.find((t) => String(t.id) === e.target.value);
                    setFormData({
                      ...formData,
                      roomTypeId: e.target.value,
                      capacity: selected?.capacity || formData.capacity,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary disabled:opacity-60"
                  required
                >
                  <option value="">Select room type</option>
                  {roomTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.roomType} ({t.capacity || 2} Guests max)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Total Rooms */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Total Rooms *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.totalRoom}
                    onChange={(e) => setFormData({ ...formData, totalRoom: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                {/* Price Per Night */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Price / Night ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-md shadow-primary/20 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editRoom ? "Save Changes" : "Create Room"}
                </button>
              </div>
            </form>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Room</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {deleteTarget.roomType}
              </span>{" "}
              from{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {deleteTarget.hotelName}
              </span>
              ? This action cannot be undone.
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
                onClick={handleDelete}
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
