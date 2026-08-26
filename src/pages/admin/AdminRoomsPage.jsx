import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X } from "lucide-react";

const initialRooms = [
  { id: 1, hotel: "Angkor Resort & Spa", roomType: "Deluxe Suite", price: 180, weekend: 220, capacity: 2, available: 8, total: 15, status: "Available" },
  { id: 2, hotel: "Angkor Resort & Spa", roomType: "Standard Room", price: 80, weekend: 100, capacity: 2, available: 12, total: 20, status: "Available" },
  { id: 3, hotel: "Riverside Hotel", roomType: "Family Suite", price: 150, weekend: 180, capacity: 4, available: 3, total: 10, status: "Available" },
  { id: 4, hotel: "Paradise Lodge", roomType: "Beach Villa", price: 350, weekend: 500, capacity: 3, available: 0, total: 6, status: "Occupied" },
  { id: 5, hotel: "City Central Hotel", roomType: "Economy Room", price: 40, weekend: 55, capacity: 1, available: 15, total: 30, status: "Available" },
  { id: 6, hotel: "Mountain View Resort", roomType: "Penthouse", price: 280, weekend: 350, capacity: 4, available: 2, total: 4, status: "Maintenance" },
];

const hotelNames = ["Angkor Resort & Spa", "Riverside Hotel", "Paradise Lodge", "City Central Hotel", "Mountain View Resort"];
const statusColors = { Available: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400", Occupied: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400", Maintenance: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400" };

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = rooms.filter((r) => {
    const matchSearch = r.hotel.toLowerCase().includes(search.toLowerCase()) || r.roomType.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = parseFloat(data.price) || 0;
    data.weekend = parseFloat(data.weekend) || 0;
    data.capacity = parseInt(data.capacity) || 1;
    data.available = parseInt(data.available) || 0;
    data.total = parseInt(data.total) || 1;
    if (editItem) {
      setRooms((prev) => prev.map((r) => (r.id === editItem.id ? { ...r, ...data } : r)));
    } else {
      setRooms((prev) => [{ ...data, id: Date.now() }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rooms</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage room types, pricing, and inventory.</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by hotel or room type..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Available", "Occupied", "Maintenance"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Room Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Weekend</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const pct = r.total > 0 ? (r.available / r.total) * 100 : 0;
                return (
                  <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{r.hotel}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.roomType}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">${r.price}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">${r.weekend}</td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{r.capacity} guests</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pct > 50 ? "bg-green-500" : pct > 20 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">{r.available}/{r.total}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setViewTarget(r)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => { setEditItem(r); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No rooms found.</p></div>}
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Room Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.roomType}</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{viewTarget.hotel}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Weekday Price</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">${viewTarget.price}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Weekend Price</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">${viewTarget.weekend}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Capacity</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.capacity} guests</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Availability</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.available} / {viewTarget.total}</p></div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5"><span className="text-xs text-gray-400 dark:text-gray-500">Occupancy</span><span className="text-xs font-medium text-gray-600 dark:text-gray-300">{viewTarget.total - viewTarget.available} / {viewTarget.total}</span></div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${viewTarget.total > 0 ? ((viewTarget.total - viewTarget.available) / viewTarget.total) * 100 : 0}%` }} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Room" : "Add New Room"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hotel *</label><select name="hotel" required defaultValue={editItem?.hotel || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="">Select hotel</option>{hotelNames.map((h) => <option key={h} value={h}>{h}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Room Type *</label><input name="roomType" type="text" required defaultValue={editItem?.roomType || ""} placeholder="e.g. Deluxe Suite" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weekday Price ($) *</label><input name="price" type="number" min="0" required defaultValue={editItem?.price || ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weekend Price ($) *</label><input name="weekend" type="number" min="0" required defaultValue={editItem?.weekend || ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Capacity *</label><input name="capacity" type="number" min="1" required defaultValue={editItem?.capacity || ""} placeholder="1" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Available *</label><input name="available" type="number" min="0" required defaultValue={editItem?.available || ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total *</label><input name="total" type="number" min="1" required defaultValue={editItem?.total || ""} placeholder="1" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label><select name="status" defaultValue={editItem?.status || "Available"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Available">Available</option><option value="Occupied">Occupied</option><option value="Maintenance">Maintenance</option></select></div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Room</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete "{deleteTarget.roomType}" at {deleteTarget.hotel}? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
