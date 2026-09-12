import { useEffect, useState } from "react";
import { Search, Plus, MapPin, Eye, Edit3, Trash2, BedDouble } from "lucide-react";
import { hotelService } from "../../services/hotelService";
import { roomService } from "../../services/roomService";
import { districtService } from "../../services/districtService";
import { useAuth } from "../../context/AuthContext";

export default function OwnerPropertiesPage() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [roomCounts, setRoomCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districts, setDistricts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, roomData, districtData] = await Promise.all([
          hotelService.getAllHotels(),
          roomService.getAllRooms(),
          districtService.getAllDistricts(),
        ]);
        setHotels(hotelData);
        setDistricts(districtData);
        const counts = {};
        (roomData || []).forEach((r) => {
          counts[r.hotelId] = (counts[r.hotelId] || 0) + 1;
        });
        setRoomCounts(counts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = hotels.filter((h) => {
    const name = h.hotelName || "";
    const location = h.locationName || "";
    const owner = h.ownerName || "";
    return `${name} ${location} ${owner}`.toLowerCase().includes(search.toLowerCase());
  });

  const handleSave = async (data) => {
    try {
      const payload = {
        hotelName: data.hotelName,
        locationId: Number(data.locationId),
        ownerId: user?.id || 1,
        emailContact: data.emailContact || "",
        phoneContact: data.phoneContact || "",
      };
      if (editItem) {
        const updated = await hotelService.updateHotel(editItem.id, payload);
        setHotels((prev) => prev.map((h) => (h.id === editItem.id ? updated : h)));
      } else {
        const created = await hotelService.createHotel(payload);
        setHotels((prev) => [created, ...prev]);
      }
      setFormOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await hotelService.deleteHotel(deleteTarget.id);
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading properties from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your properties and listings</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="p-4">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{h.hotelName}</h3>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" /> {h.locationName || "N/A"}</p>
              <div className="grid grid-cols-2 gap-2 text-center mb-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-1">
                    <BedDouble className="w-3 h-3 text-primary" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{roomCounts[h.id] || 0}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{h.ownerName || "N/A"}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Owner</p>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <p className="text-[11px] text-gray-400"><span className="inline-block w-10">Email:</span>{h.emailContact || "N/A"}</p>
                <p className="text-[11px] text-gray-400"><span className="inline-block w-10">Phone:</span>{h.phoneContact || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-gray-800">
                <button
                  onClick={() => setViewTarget(h)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => { setEditItem(h); setFormOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(h)}
                  className="flex items-center justify-center py-2 px-3 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/15 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-400 dark:text-gray-500">No properties found matching your search.</p>
        </div>
      )}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{viewTarget.hotelName}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.locationName || "N/A"}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-primary" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{roomCounts[viewTarget.id] || 0}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.ownerName || "N/A"}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Owner</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">#{viewTarget.id}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Property ID</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Email</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.emailContact || "N/A"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Phone</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.phoneContact || "N/A"}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/15 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Property" : "Add Property"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Name *</label>
                <input name="hotelName" required defaultValue={editItem?.hotelName || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                <select name="locationId" required defaultValue={editItem?.locationId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="">Select location</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}{d.province?.name ? `, ${d.province.name}` : ""}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Contact *</label>
                  <input name="emailContact" type="email" required defaultValue={editItem?.emailContact || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Contact</label>
                  <input name="phoneContact" defaultValue={editItem?.phoneContact || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Add Property"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/15 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Property</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.hotelName}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}