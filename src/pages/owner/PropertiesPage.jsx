import { useState } from "react";
import {
  Search,
  Plus,
  MapPin,
  Star,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import PropertyForm from "../../components/dashboard/PropertyForm";
import DeleteModal from "../../components/dashboard/DeleteModal";

const initialProperties = [
  { id: 1, name: "Green Park Resort", location: "Siem Reap", type: "Resort", rooms: 45, rating: 4.8, reviews: 124, occupancy: 82, revenue: "$12,480", status: "Active", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
  { id: 2, name: "Paradise Hotel", location: "Phnom Penh", type: "Hotel", rooms: 60, rating: 4.6, reviews: 98, occupancy: 74, revenue: "$9,870", status: "Active", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop" },
  { id: 3, name: "Angkor Wat Villa", location: "Siem Reap", type: "Villa", rooms: 12, rating: 4.9, reviews: 67, occupancy: 68, revenue: "$14,200", status: "Active", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop" },
  { id: 4, name: "Riverside Lodge", location: "Battambang", type: "Lodge", rooms: 20, rating: 4.4, reviews: 45, occupancy: 52, revenue: "$6,340", status: "Active", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop" },
  { id: 5, name: "Sunset Beach House", location: "Koh Rong", type: "Beach House", rooms: 8, rating: 4.7, reviews: 32, occupancy: 38, revenue: "$6,075", status: "Inactive", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop" },
];

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState(initialProperties);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = properties.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.type === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (data) => {
    if (editProperty) {
      setProperties((prev) => prev.map((p) => (p.id === editProperty.id ? { ...p, ...data } : p)));
    } else {
      setProperties((prev) => [{ ...data, id: Date.now(), rating: 0, reviews: 0, occupancy: 0, revenue: "$0", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" }, ...prev]);
    }
    setFormOpen(false);
    setEditProperty(null);
  };

  const handleDelete = () => {
    setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your properties and listings</p>
        </div>
        <button
          onClick={() => { setEditProperty(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {/* Filters */}
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
        <div className="flex gap-2 flex-wrap">
          {["All", "Resort", "Hotel", "Villa", "Lodge", "Beach House"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                filter === t ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                p.status === "Active" ? "bg-green-500 text-white dark:bg-green-500/15 dark:text-green-400" : "bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-300"
              }`}>
                {p.status}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <MoreVertical className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                {p.location}
                <span className="mx-1">·</span>
                {p.type}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{p.rooms}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{p.rating}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{p.reviews} reviews</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{p.occupancy}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Occupancy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                <button
                  onClick={() => setViewTarget(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => { setEditProperty(p); setFormOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(p)}
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

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={viewTarget.image} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  viewTarget.status === "Active" ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400" : "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300"
                }`}>{viewTarget.status}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">{viewTarget.type}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2">{viewTarget.name}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {viewTarget.location}
              </p>
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.rooms}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Rooms</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.rating}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{viewTarget.reviews} reviews</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.occupancy}%</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Occupancy</p>
                </div>
                <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2">
                  <p className="text-sm font-bold text-green-600">{viewTarget.revenue}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">Revenue</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setViewTarget(null); setEditProperty(viewTarget); setFormOpen(true); }}
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

      {/* Create/Edit Form */}
      {formOpen && (
        <PropertyForm
          property={editProperty}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditProperty(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteModal
          title="Delete Property"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
