import { useEffect, useState } from "react";
import { Search, Plus, Clock, MapPin, Eye, Edit3, Trash2, Loader2 } from "lucide-react";
import { restaurantService } from "../../services/restaurantService";
import { restaurantAttachmentService } from "../../services/restaurantAttachmentService";
import { tourPlaceService } from "../../services/tourPlaceService";
import AdminImageField from "../components/AdminImageField";
import { RESTAURANT_IMAGES, pickImage, withTimeout } from "../../utils/helpers";
import { useToast } from "../../components/ui/Toast";

const FALLBACK_IMG = RESTAURANT_IMAGES[0];

const toTimeInput = (t) => (typeof t === "string" ? t.slice(0, 5) : "");
const toTimePayload = (t) => (t && t.length === 5 ? `${t}:00` : t);

export default function AdminRestaurantsPage() {
  const toast = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [tourPlaces, setTourPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, places] = await withTimeout(Promise.all([
          restaurantService.getAllRestaurantsWithImages(),
          tourPlaceService.getAllTourPlaces(),
        ]));
        setRestaurants(data || []);
        setTourPlaces(places || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setFetchError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = restaurants.filter((r) =>
    `${r.name || ""} ${r.tourismPlaceName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || null,
        openTime: toTimePayload(data.openTime),
        closeTime: toTimePayload(data.closeTime),
        tourismPlaceId: Number(data.tourismPlaceId),
      };
      let saved;
      if (editItem) {
        saved = await restaurantService.updateRestaurant(editItem.id, payload);
      } else {
        saved = await restaurantService.createRestaurant(payload);
      }
      if (imageFile) {
        const attachment = await restaurantAttachmentService.uploadRestaurantAttachment(saved.id, imageFile);
        const first = Array.isArray(attachment) ? attachment[0] : attachment;
        saved = { ...saved, imageUrl: first?.cloudinaryUrl || URL.createObjectURL(imageFile) };
      }
      setRestaurants((prev) =>
        editItem
          ? prev.map((r) => (r.id === editItem.id ? { ...r, ...saved } : r))
          : [{ ...saved, imageUrl: saved.imageUrl || FALLBACK_IMG }, ...prev]
      );
      setFormOpen(false);
      setEditItem(null);
      setImageFile(null);
      toast.success(editItem ? "Restaurant updated" : "Restaurant created");
    } catch (error) {
      console.error("Error saving restaurant:", error);
      toast.error("Failed to save restaurant");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await restaurantService.deleteRestaurant(deleteTarget.id);
      setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Restaurant deleted");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Failed to delete restaurant");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading restaurants from server...</div>;
  }

  if (fetchError && restaurants.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-red-500">Could not load restaurants from the server.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage all restaurants and dining partners</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setImageFile(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Restaurant
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or tourist place..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              <img src={r.imageUrl || pickImage(RESTAURANT_IMAGES, r.id)} alt={r.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur">{r.tourismPlaceName || "Unassigned"}</span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{r.name}</h3>
              <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 min-h-[2rem]">{r.description || "No description provided."}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mb-3">
                <Clock className="w-3 h-3" /> {toTimeInput(r.openTime) || "--:--"} – {toTimeInput(r.closeTime) || "--:--"}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                <span className="text-[11px] text-gray-400 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" /> {r.tourismPlaceName || "N/A"}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setViewTarget(r)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => { setEditItem(r); setImageFile(null); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scalein">
            <img src={viewTarget.imageUrl || pickImage(RESTAURANT_IMAGES, viewTarget.id)} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary">{viewTarget.tourismPlaceName || "Unassigned"}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewTarget.description || "No description provided."}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Tourist Place</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.tourismPlaceName || "N/A"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Opening Hours</span><span className="text-gray-600 dark:text-gray-300">{toTimeInput(viewTarget.openTime) || "--:--"} – {toTimeInput(viewTarget.closeTime) || "--:--"}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setImageFile(null); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
                <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => { setFormOpen(false); setEditItem(null); setImageFile(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scalein">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Restaurant" : "Add Restaurant"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); setImageFile(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <AdminImageField
                value={editItem?.imageUrl}
                label="Restaurant Photo"
                onChange={setImageFile}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input name="name" required defaultValue={editItem?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editItem?.description || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Open Time *</label>
                  <input name="openTime" type="time" required defaultValue={toTimeInput(editItem?.openTime)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Close Time *</label>
                  <input name="closeTime" type="time" required defaultValue={toTimeInput(editItem?.closeTime)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tourist Place *</label>
                <select name="tourismPlaceId" required defaultValue={editItem?.tourismPlaceId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="">Select tourist place</option>
                  {tourPlaces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); setImageFile(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editItem ? "Save Changes" : "Add Restaurant"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Restaurant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
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
