import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X } from "lucide-react";

const initialTickets = [
  { id: 1, name: "Angkor Wat Day Pass", place: "Angkor Wat", price: 37, type: "Single", sold: 12500, available: 500, validUntil: "2026-12-31", status: "Active" },
  { id: 2, name: "Angkor Wat Group Ticket", place: "Angkor Wat", price: 150, type: "Group", sold: 3200, available: 200, validUntil: "2026-12-31", status: "Active" },
  { id: 3, name: "Silver Pagoda Entry", place: "Silver Pagoda", price: 10, type: "Single", sold: 8900, available: 0, validUntil: "2026-06-30", status: "Sold Out" },
  { id: 4, name: "Koh Rong Island Tour", place: "Koh Rong Island", price: 65, type: "VIP", sold: 1800, available: 150, validUntil: "2026-09-30", status: "Active" },
  { id: 5, name: "Phnom Penh City Pass", place: "Phnom Penh City", price: 25, type: "Single", sold: 5600, available: 800, validUntil: "2025-01-15", status: "Expired" },
  { id: 6, name: "Cardamom Trek Package", place: "Cardamom Mountains", price: 120, type: "Group", sold: 950, available: 100, validUntil: "2026-08-15", status: "Active" },
];

const placeNames = ["Angkor Wat", "Silver Pagoda", "Koh Rong Island", "Phnom Penh City", "Cardamom Mountains", "Sihanoukville Beach"];
const typeColors = { Single: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", Group: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400", VIP: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400" };
const statusColors = { Active: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400", Expired: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", "Sold Out": "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" };

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = tickets.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.place.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || t.type === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.price = parseFloat(data.price) || 0;
    data.available = parseInt(data.available) || 0;
    if (editItem) {
      setTickets((prev) => prev.map((t) => (t.id === editItem.id ? { ...t, ...data } : t)));
    } else {
      setTickets((prev) => [{ ...data, id: Date.now(), sold: 0 }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setTickets((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage ticket types for attractions and events.</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Plus className="w-4 h-4" /> Add Ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or place..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Single", "Group", "VIP"].map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === t ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Place</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sold</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Available</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{t.place}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">${t.price}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[t.type]}`}>{t.type}</span></td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{t.sold.toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{t.available}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 dark:text-gray-500">{t.validUntil}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(t)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditItem(t); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No tickets found.</p></div>}
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{viewTarget.place}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[viewTarget.type]}`}>{viewTarget.type}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Price</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">${viewTarget.price}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Sold</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.sold.toLocaleString()}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Available</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.available}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Valid Until</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.validUntil}</p></div>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Ticket" : "Add New Ticket"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ticket Name *</label><input name="name" type="text" required defaultValue={editItem?.name || ""} placeholder="e.g. Angkor Wat Day Pass" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Place *</label><select name="place" required defaultValue={editItem?.place || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="">Select place</option>{placeNames.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label><select name="type" defaultValue={editItem?.type || "Single"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Single">Single</option><option value="Group">Group</option><option value="VIP">VIP</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price ($) *</label><input name="price" type="number" min="0" step="0.01" required defaultValue={editItem?.price || ""} placeholder="0.00" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Available *</label><input name="available" type="number" min="0" required defaultValue={editItem?.available || ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Valid Until *</label><input name="validUntil" type="date" required defaultValue={editItem?.validUntil || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label><select name="status" defaultValue={editItem?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Active">Active</option><option value="Expired">Expired</option><option value="Sold Out">Sold Out</option></select></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Ticket"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Ticket</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.</p>
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
