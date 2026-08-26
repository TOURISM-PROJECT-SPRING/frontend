import { useState } from "react";
import { Search, Plus, MapPin, Clock, Users, Edit3, Trash2, Eye } from "lucide-react";

const statusColors = { Active: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400", Draft: "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300", Archived: "bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400" };

const initialPackages = [
  { id: 1, name: "Angkor Sunrise Tour", type: "Cultural", duration: "3 days", price: "$249", maxGuests: 12, bookings: 87, status: "Active", image: "https://images.unsplash.com/photo-1508159441842-1b67f1024093?w=400&h=300&fit=crop", description: "Explore the ancient temples of Angkor Wat at sunrise" },
  { id: 2, name: "Phnom Penh City Break", type: "City Tour", duration: "2 days", price: "$149", maxGuests: 15, bookings: 65, status: "Active", image: "https://images.unsplash.com/photo-1570306395578-14116e558068?w=400&h=300&fit=crop", description: "Discover the vibrant capital city" },
  { id: 3, name: "Koh Rong Island Escape", type: "Beach", duration: "4 days", price: "$399", maxGuests: 10, bookings: 54, status: "Active", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", description: "Relax on pristine white sand beaches" },
  { id: 4, name: "Tonle Sap Floating Village", type: "Cultural", duration: "1 day", price: "$79", maxGuests: 20, bookings: 112, status: "Draft", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop", description: "Experience life on Southeast Asia's largest lake" },
  { id: 5, name: "Cambodia Food Adventure", type: "Food", duration: "5 days", price: "$549", maxGuests: 8, bookings: 41, status: "Archived", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop", description: "A culinary journey through Cambodia" },
];

export default function OwnerPackagesPage() {
  const [packages, setPackages] = useState(initialPackages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = packages.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (data) => {
    if (editPkg) {
      setPackages((prev) => prev.map((p) => (p.id === editPkg.id ? { ...p, ...data } : p)));
    } else {
      setPackages((prev) => [{ ...data, id: Date.now(), bookings: 0, image: "https://images.unsplash.com/photo-1508159441842-1b67f1024093?w=400&h=300&fit=crop" }, ...prev]);
    }
    setFormOpen(false);
    setEditPkg(null);
  };

  const handleDelete = () => {
    setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your tour packages and experiences</p>
        </div>
        <button
          onClick={() => { setEditPkg(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Draft", "Archived"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[p.status]}`}>{p.status}</span>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-gray-700">{p.type}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {p.maxGuests}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.bookings} booked</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                <span className="text-lg font-bold text-primary">{p.price}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /></button>
                  <button onClick={() => { setEditPkg(p); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No packages found.</div>}

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={viewTarget.image} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">{viewTarget.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{viewTarget.description}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Duration</p><p className="text-sm font-bold text-gray-900">{viewTarget.duration}</p></div>
                <div className="text-center bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Max Guests</p><p className="text-sm font-bold text-gray-900">{viewTarget.maxGuests}</p></div>
                <div className="text-center bg-gray-50 rounded-lg py-2"><p className="text-xs text-gray-400">Bookings</p><p className="text-sm font-bold text-gray-900">{viewTarget.bookings}</p></div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setViewTarget(null); setEditPkg(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
                <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditPkg(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editPkg ? "Edit Package" : "New Package"}</h2>
              <button onClick={() => { setFormOpen(false); setEditPkg(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editPkg, ...d, id: editPkg?.id || Date.now() }); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Name *</label>
                <input name="name" required defaultValue={editPkg?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select name="type" required defaultValue={editPkg?.type || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select type</option>
                    <option>Cultural</option><option>City Tour</option><option>Beach</option><option>Food</option><option>Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration *</label>
                  <input name="duration" required defaultValue={editPkg?.duration || ""} placeholder="e.g. 3 days" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                  <input name="price" type="number" min="0" required defaultValue={editPkg?.price?.replace("$", "") || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Guests *</label>
                  <input name="maxGuests" type="number" min="1" required defaultValue={editPkg?.maxGuests || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editPkg?.description || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editPkg?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Active</option><option>Draft</option><option>Archived</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditPkg(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editPkg ? "Save Changes" : "Create Package"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Package</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.name}</strong>?</p>
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
