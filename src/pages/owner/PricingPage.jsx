import { useState } from "react";
import { DollarSign, Calendar, TrendingUp, Edit3, Trash2, Plus } from "lucide-react";

const initialRooms = [
  { id: 1, property: "Green Park Resort", roomType: "Deluxe Suite", weekday: 120, weekend: 150, peak: 180, available: 8, total: 15, occupancy: 82 },
  { id: 2, property: "Green Park Resort", roomType: "Standard Room", weekday: 75, weekend: 95, peak: 110, available: 3, total: 20, occupancy: 85 },
  { id: 3, property: "Paradise Hotel", roomType: "Ocean View", weekday: 95, weekend: 120, peak: 140, available: 5, total: 12, occupancy: 58 },
  { id: 4, property: "Paradise Hotel", roomType: "Standard Room", weekday: 65, weekend: 80, peak: 95, available: 8, total: 30, occupancy: 73 },
  { id: 5, property: "Angkor Wat Villa", roomType: "Private Villa", weekday: 250, weekend: 300, peak: 350, available: 2, total: 6, occupancy: 67 },
  { id: 6, property: "Riverside Lodge", roomType: "Garden Bungalow", weekday: 85, weekend: 100, peak: 120, available: 7, total: 12, occupancy: 42 },
];

const properties = ["Green Park Resort", "Paradise Hotel", "Angkor Wat Villa", "Riverside Lodge"];

export default function OwnerPricingPage() {
  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = filter === "All" ? rooms : rooms.filter((r) => r.property === filter);

  const handleSave = (data) => {
    const d = { ...data, weekday: Number(data.weekday), weekend: Number(data.weekend), peak: Number(data.peak), available: Number(data.available), total: Number(data.total) };
    d.occupancy = Math.round(((d.total - d.available) / d.total) * 100) || 0;
    if (editRoom) {
      setRooms((prev) => prev.map((r) => (r.id === editRoom.id ? { ...r, ...d } : r)));
    } else {
      setRooms((prev) => [{ ...d, id: Date.now() }, ...prev]);
    }
    setFormOpen(false);
    setEditRoom(null);
  };

  const handleDelete = () => {
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pricing & Availability</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Set room rates and manage availability</p>
        </div>
        <button
          onClick={() => { setEditRoom(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Avg. Weekday</p><p className="text-lg font-bold text-gray-900 dark:text-white">${Math.round(rooms.reduce((s, r) => s + r.weekday, 0) / rooms.length)}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-green-500" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Avg. Weekend</p><p className="text-lg font-bold text-gray-900 dark:text-white">${Math.round(rooms.reduce((s, r) => s + r.weekend, 0) / rooms.length)}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-orange-500" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Avg. Occupancy</p><p className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(rooms.reduce((s, r) => s + r.occupancy, 0) / rooms.length)}%</p></div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter("All")} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === "All" ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>All Properties</button>
        {properties.map((p) => (
          <button key={p} onClick={() => setFilter(p)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === p ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{p}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Property", "Room Type", "Weekday", "Weekend", "Peak", "Availability", "Occupancy", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{r.property}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.roomType}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${r.weekday}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${r.weekend}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-orange-600">${r.peak}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${r.occupancy}%` }} /></div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{r.available}/{r.total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{r.occupancy}%</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditRoom(r); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditRoom(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editRoom ? "Edit Room Pricing" : "Add New Room"}</h2>
              <button onClick={() => { setFormOpen(false); setEditRoom(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editRoom, ...d }); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property *</label>
                  <select name="property" required defaultValue={editRoom?.property || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select</option>
                    {properties.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Type *</label>
                  <input name="roomType" required defaultValue={editRoom?.roomType || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekday (USD) *</label>
                  <input name="weekday" type="number" min="0" required defaultValue={editRoom?.weekday || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weekend (USD) *</label>
                  <input name="weekend" type="number" min="0" required defaultValue={editRoom?.weekend || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peak (USD) *</label>
                  <input name="peak" type="number" min="0" required defaultValue={editRoom?.peak || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Rooms *</label>
                  <input name="total" type="number" min="1" required defaultValue={editRoom?.total || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available *</label>
                  <input name="available" type="number" min="0" required defaultValue={editRoom?.available || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditRoom(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editRoom ? "Save Changes" : "Add Room"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/15 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Room</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Delete <strong>{deleteTarget.roomType}</strong> at {deleteTarget.property}?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
