import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, Loader2 } from "lucide-react";
import { roomService } from "../../services/roomService";
import { hotelService } from "../../services/hotelService";
import { roomTypeService } from "../../services/roomTypeService";
import { withTimeout } from "../../utils/helpers";
import { useToast } from "../../components/ui/Toast";

export default function AdminRoomsPage() {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomData, hotelData, typeData] = await withTimeout(Promise.all([
          roomService.getAllRooms(),
          hotelService.getAllHotels(),
          roomTypeService.getAllRoomTypes(),
        ]));
        setRooms(roomData);
        setHotels(hotelData);
        setRoomTypes(typeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setFetchError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = rooms.filter((r) => {
    const hotel = r.hotelName || "";
    const type = r.roomType || "";
    return `${hotel} ${type}`.toLowerCase().includes(search.toLowerCase());
  });

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        hotelId: Number(data.hotelId),
        roomTypeId: Number(data.roomTypeId),
      };
      if (editItem) {
        const updated = await roomService.updateRoom(editItem.id, payload);
        setRooms((prev) => prev.map((r) => (r.id === editItem.id ? updated : r)));
      } else {
        const created = await roomService.createRoom(payload);
        setRooms((prev) => [created, ...prev]);
      }
      setFormOpen(false);
      setEditItem(null);
      toast.success(editItem ? "Room updated" : "Room created");
    } catch (error) {
      console.error("Error saving room:", error);
      toast.error("Failed to save room");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await roomService.deleteRoom(deleteTarget.id);
      setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Room deleted");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading rooms from server...</div>;
  }

  if (fetchError && rooms.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-red-500">Could not load rooms from the server.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage room types, capacity, and assignments</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by hotel or room type..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Room Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{r.hotelName || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.roomType || "N/A"}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.capacity} guests</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(r)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditItem(r); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400">No rooms found.</div>}
        </div>
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scalein">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.roomType || "N/A"}</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{viewTarget.hotelName || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400">Capacity</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.capacity} guests</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400">Room Type ID</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.roomTypeId || "N/A"}</p></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scalein">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Room" : "Add Room"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hotel *</label>
                <select name="hotelId" required defaultValue={editItem?.hotelId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="">Select hotel</option>
                  {hotels.map((h) => <option key={h.id} value={h.id}>{h.hotelName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type *</label>
                <select name="roomTypeId" required defaultValue={editItem?.roomTypeId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="">Select type</option>
                  {roomTypes.map((t) => <option key={t.id} value={t.id}>{t.roomType}{t.capacity ? ` (${t.capacity} guests)` : ""}</option>)}
                </select>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Capacity is defined by the selected room type.</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editItem ? "Save Changes" : "Add Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scalein">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Room</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete this room at <strong>{deleteTarget.hotelName || "N/A"}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">{deleting && <Loader2 className="w-4 h-4 animate-spin" />}Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}