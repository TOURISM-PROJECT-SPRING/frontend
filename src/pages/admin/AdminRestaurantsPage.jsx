import { useEffect, useState } from "react";
import { Search, Plus, Star, MapPin, Eye, Edit3, Trash2 } from "lucide-react";
import { restaurantService } from "../../services/restaurantService";

const statusColors = { 
  Active: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400", 
  Inactive: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400" 
};

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filtered = restaurants.filter((r) => {
    const name = r.name || "";
    const cuisine = r.cuisine || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || cuisine.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = async (data) => {
    try {
      if (editItem) {
        const updated = await restaurantService.updateRestaurant(editItem.id, data);
        setRestaurants((prev) => prev.map((r) => (r.id === editItem.id ? updated : r)));
      } else {
        const created = await restaurantService.createRestaurant({
          ...data,
          rating: 0,
          reviews: 0,
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
        });
        setRestaurants((prev) => [created, ...prev]);
      }
      setFormOpen(false);
      setEditItem(null);
    } catch (error) {
      console.error("Error saving restaurant:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await restaurantService.deleteRestaurant(deleteTarget.id);
      setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading restaurants from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage all restaurants and dining partners</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or cuisine..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Inactive"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"} alt={r.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[r.status || "Active"]}`}>{r.status || "Active"}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{r.name}</h3>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" /> {r.location || "N/A"}</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{r.cuisine || "General"}</span>
                <span className="text-[11px] text-gray-400">{r.priceRange || "$$"}</span>
                <span className="flex items-center gap-0.5 text-[11px] text-yellow-500"><Star className="w-3 h-3 fill-yellow-400" /> {r.rating || 0}</span>
                <span className="text-[11px] text-gray-400">({r.reviews || 0})</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">{r.phone || "N/A"}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewTarget(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => { setEditItem(r); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                  <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400">No restaurants found.</div>}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={viewTarget.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status || "Active"]}`}>{viewTarget.status || "Active"}</span>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.location}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{viewTarget.cuisine}</span>
                <span className="text-sm text-gray-400">{viewTarget.priceRange}</span>
                <span className="flex items-center gap-0.5 text-sm text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-400" /> {viewTarget.rating}</span>
                <span className="text-sm text-gray-400">({viewTarget.reviews || 0} reviews)</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Phone</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.phone}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
                <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Restaurant" : "Add Restaurant"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input name="name" required defaultValue={editItem?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                  <input name="location" required defaultValue={editItem?.location || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuisine *</label>
                  <select name="cuisine" required defaultValue={editItem?.cuisine || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select cuisine</option>
                    <option>Khmer</option><option>Western</option><option>Asian</option><option>Fusion</option><option>Seafood</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                  <input name="phone" required defaultValue={editItem?.phone || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range *</label>
                  <select name="priceRange" required defaultValue={editItem?.priceRange || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select range</option>
                    <option>$</option><option>$$</option><option>$$$</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editItem?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Add Restaurant"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Restaurant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
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