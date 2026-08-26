import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X, MapPin, Star } from "lucide-react";

const initialPlaces = [
  { id: 1, name: "Angkor Wat", location: "Siem Reap", category: "Temple", visits: 2450000, rating: 4.9, status: "Active", description: "The largest religious monument in the world.", image: "https://images.unsplash.com/photo-1508159452718-d22f5721a6f8?w=600&h=400&fit=crop" },
  { id: 2, name: "Sihanoukville Beach", location: "Sihanoukville", category: "Beach", visits: 890000, rating: 4.5, status: "Active", description: "Beautiful white sand beaches along the Gulf of Thailand.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop" },
  { id: 3, name: "Koh Rong Island", location: "Koh Rong", category: "Island", visits: 650000, rating: 4.7, status: "Active", description: "A pristine island paradise with crystal-clear waters.", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop" },
  { id: 4, name: "Phnom Penh City", location: "Phnom Penh", category: "City", visits: 1800000, rating: 4.3, status: "Active", description: "The vibrant capital city of Cambodia.", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&h=400&fit=crop" },
  { id: 5, name: "Cardamom Mountains", location: "Koh Kong", category: "Nature", visits: 120000, rating: 4.6, status: "Inactive", description: "Pristine rainforest and biodiversity hotspot.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop" },
  { id: 6, name: "Silver Pagoda", location: "Phnom Penh", category: "Temple", visits: 720000, rating: 4.4, status: "Active", description: "A stunning temple complex within the Royal Palace grounds.", image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop" },
];

const categoryColors = { Temple: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400", Beach: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", Island: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400", City: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400", Nature: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" };
const statusColors = { Active: "bg-green-500 text-white dark:bg-green-500/15 dark:text-green-400", Inactive: "bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-300" };

export default function AdminPlacesPage() {
  const [places, setPlaces] = useState(initialPlaces);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = places.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.category === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (editItem) {
      setPlaces((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
    } else {
      setPlaces((prev) => [{ ...data, id: Date.now(), visits: 0, rating: 0, image: "https://images.unsplash.com/photo-1508159452718-d22f5721a6f8?w=600&h=400&fit=crop" }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setPlaces((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Tourist Places</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage all tourist destinations and attractions.</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Plus className="w-4 h-4" /> Add Place
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Temple", "Beach", "Island", "City", "Nature"].map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === c ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${categoryColors[p.category]}`}>{p.category}</span>
              <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[p.status]}`}>{p.status}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</h3>
              <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1"><MapPin className="w-3 h-3" /> {p.location}</p>
              <div className="grid grid-cols-2 gap-2 text-center mt-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><p className="text-sm font-bold text-gray-900 dark:text-white">{(p.visits / 1000).toFixed(0)}K</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Visits</p></div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2"><div className="flex items-center justify-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><p className="text-sm font-bold text-gray-900 dark:text-white">{p.rating}</p></div><p className="text-[10px] text-gray-400 dark:text-gray-500">Rating</p></div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                <button onClick={() => setViewTarget(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-3.5 h-3.5" /> View</button>
                <button onClick={() => { setEditItem(p); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => setDeleteTarget(p)} className="flex items-center justify-center py-2 px-3 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No places found.</p></div>}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={viewTarget.image} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${categoryColors[viewTarget.category]}`}>{viewTarget.category}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${viewTarget.status === "Active" ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500"}`}>{viewTarget.status}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{viewTarget.name}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.location}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-3">{viewTarget.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2 text-center"><p className="text-sm font-bold text-gray-900 dark:text-white">{(viewTarget.visits / 1000).toFixed(0)}K</p><p className="text-[10px] text-gray-400 dark:text-gray-500">Visits</p></div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2 text-center"><div className="flex items-center justify-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.rating}</p></div><p className="text-[10px] text-gray-400 dark:text-gray-500">Rating</p></div>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Place" : "Add New Place"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Place Name *</label><input name="name" type="text" required defaultValue={editItem?.name || ""} placeholder="e.g. Angkor Wat" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location *</label><input name="location" type="text" required defaultValue={editItem?.location || ""} placeholder="e.g. Siem Reap" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label><select name="category" defaultValue={editItem?.category || "Temple"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option>Temple</option><option>Beach</option><option>Island</option><option>City</option><option>Nature</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label><textarea name="description" rows={3} defaultValue={editItem?.description || ""} placeholder="Describe this place..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition resize-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label><select name="status" defaultValue={editItem?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Place"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Place</h3>
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
