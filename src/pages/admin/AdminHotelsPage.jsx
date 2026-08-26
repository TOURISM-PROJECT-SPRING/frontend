import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X, MapPin, Star } from "lucide-react";

const initialHotels = [
  { id: 1, name: "Angkor Resort & Spa", location: "Siem Reap", owner: "Sok Dara", rooms: 120, rating: 4.8, reviews: 342, occupancy: 85, priceRange: "$80 - $350", status: "Active", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" },
  { id: 2, name: "Riverside Hotel", location: "Phnom Penh", owner: "Chan Bopha", rooms: 85, rating: 4.6, reviews: 218, occupancy: 72, priceRange: "$55 - $200", status: "Active", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop" },
  { id: 3, name: "Paradise Lodge", location: "Koh Rong", owner: "Lim Visal", rooms: 32, rating: 4.9, reviews: 156, occupancy: 90, priceRange: "$100 - $500", status: "Active", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop" },
  { id: 4, name: "Beach House Inn", location: "Sihanoukville", owner: "Keo Chantrea", rooms: 24, rating: 4.3, reviews: 87, occupancy: 58, priceRange: "$45 - $150", status: "Inactive", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop" },
  { id: 5, name: "City Central Hotel", location: "Phnom Penh", owner: "Sun Sophea", rooms: 150, rating: 4.4, reviews: 412, occupancy: 78, priceRange: "$40 - $180", status: "Active", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop" },
  { id: 6, name: "Mountain View Resort", location: "Battambang", owner: "Hun Many", rooms: 45, rating: 0, reviews: 0, occupancy: 0, priceRange: "$30 - $120", status: "Pending", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop" },
];

const statusColors = { Active: "bg-green-500 text-white dark:bg-green-500/15 dark:text-green-400", Inactive: "bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-300", Pending: "bg-yellow-500 text-white dark:bg-yellow-500/15 dark:text-yellow-400" };
const owners = ["Sok Dara", "Chan Bopha", "Lim Visal", "Keo Chantrea", "Sun Sophea", "Hun Many"];

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState(initialHotels);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = hotels.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) || h.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || h.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.rooms = parseInt(data.rooms) || 0;
    data.priceRange = `$${data.priceMin || 0} - $${data.priceMax || 0}`;
    if (editItem) {
      setHotels((prev) => prev.map((h) => (h.id === editItem.id ? { ...h, ...data } : h)));
    } else {
      setHotels((prev) => [{ ...data, id: Date.now(), rating: 0, reviews: 0, occupancy: 0, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop" }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hotels</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage hotel listings, details, and availability.</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Inactive", "Pending"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[h.status]}`}>{h.status}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{h.name}</h3>
              <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1"><MapPin className="w-3 h-3" /> {h.location}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">Owner: {h.owner}</p>
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-gray-900 dark:text-white">{h.rooms}</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p></div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-1">
                    {h.rating > 0 ? <><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><p className="text-sm font-bold text-gray-900 dark:text-white">{h.rating}</p></> : <p className="text-sm font-bold text-gray-400 dark:text-gray-500">—</p>}
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{h.reviews} reviews</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-gray-900 dark:text-white">{h.occupancy}%</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Occupancy</p></div>
              </div>
              <p className="text-xs font-medium text-green-600 mt-2 text-center">{h.priceRange}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                <button onClick={() => setViewTarget(h)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => { setEditItem(h); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => setDeleteTarget(h)} className="flex items-center justify-center py-2 px-3 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No hotels found.</p></div>}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={viewTarget.image} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{viewTarget.name}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.location}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Owner: {viewTarget.owner}</p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.rooms}</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p></div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-0.5">
                    {viewTarget.rating > 0 ? <><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.rating}</p></> : <p className="text-sm font-bold text-gray-400 dark:text-gray-500">—</p>}
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{viewTarget.reviews} reviews</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.occupancy}%</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Occupancy</p></div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-green-600">{viewTarget.priceRange}</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Price</p></div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
                <button onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /> Delete</button>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Hotel" : "Add New Hotel"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hotel Name *</label><input name="name" type="text" required defaultValue={editItem?.name || ""} placeholder="e.g. Angkor Resort & Spa" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location *</label><input name="location" type="text" required defaultValue={editItem?.location || ""} placeholder="e.g. Siem Reap" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Owner *</label><select name="owner" required defaultValue={editItem?.owner || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="">Select owner</option>{owners.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Rooms *</label><input name="rooms" type="number" min="1" required defaultValue={editItem?.rooms || ""} placeholder="Number of rooms" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label><select name="status" defaultValue={editItem?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min Price ($)</label><input name="priceMin" type="number" min="0" defaultValue={editItem?.priceRange ? editItem.priceRange.split(" - ")[0].replace("$", "") : ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Price ($)</label><input name="priceMax" type="number" min="0" defaultValue={editItem?.priceRange ? editItem.priceRange.split(" - ")[1].replace("$", "") : ""} placeholder="0" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Hotel"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Hotel</h3>
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
