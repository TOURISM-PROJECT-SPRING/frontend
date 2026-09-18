import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Plus, Star, MapPin, Eye, Edit3, Trash2 } from "lucide-react";
import { tourPlaceService } from "../../services/tourPlaceService";
import { placeCategoryService } from "../../services/placeCategoryService";
import { districtService } from "../../services/districtService";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ui/ImageUpload";
import { useToast } from "../../components/ui/Toast";
import { primaryPlaceImage, pickImage, TRAVEL_IMAGES } from "../../utils/helpers";

const norm = (s) => String(s || "").toUpperCase();

const statusColors = {
  ACTIVE: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  INACTIVE: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
};

const statusLabel = (s) => (norm(s) === "ACTIVE" ? "Active" : norm(s) === "INACTIVE" ? "Inactive" : s || "Inactive");

export default function AdminPlacesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placeData, categoryData, districtData] = await Promise.all([
          tourPlaceService.getAllTourPlaces(),
          placeCategoryService.getAllCategories(),
          districtService.getAllDistricts(),
        ]);
        setPlaces(placeData);
        setCategories(categoryData);
        setDistricts(districtData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching places:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = places.filter((p) => {
    const name = p.name || "";
    const location = p.district?.name || p.address || "";
    const matchSearch = `${name} ${location}`.toLowerCase().includes(search.toLowerCase());
    const normStatus = norm(p.status);
    const matchFilter = filter === "All" || normStatus === norm(filter);
    return matchSearch && matchFilter;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const refreshPlaces = async () => {
    const data = await tourPlaceService.getAllTourPlaces();
    setPlaces(data);
  };

  const openForm = async (item) => {
    setEditItem(item || null);
    setImages([]);
    setExistingImages([]);
    setFormOpen(true);
    if (item) {
      const imgs = await tourPlaceService.getTourPlaceImages(item.id).catch(() => []);
      setExistingImages(
        (imgs || []).map((img) => ({ id: img.id, url: img.imageUrl, isPrimary: img.isPrimary }))
      );
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
    setImages([]);
    setExistingImages([]);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        address: data.address || "",
        status: data.status || "ACTIVE",
        placeCategoryId: Number(data.placeCategoryId),
        districtId: Number(data.districtId),
        userId: user?.id || 1,
      };
      if (editItem) {
        await tourPlaceService.updateTourPlace(editItem.id, payload, images);
      } else {
        await tourPlaceService.createTourPlace(payload, images);
      }
      await refreshPlaces();
      closeForm();
      toast.success(editItem ? "Place updated successfully" : "Place created successfully");
    } catch (error) {
      console.error("Error saving place:", error);
      toast.error("Failed to save place. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    if (!editItem) return;
    try {
      await tourPlaceService.removeTourPlaceImage(editItem.id, image.id);
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      await refreshPlaces();
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await tourPlaceService.deleteTourPlace(deleteTarget.id);
      setPlaces((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Place deleted successfully");
    } catch (error) {
      console.error("Error deleting place:", error);
      toast.error("Failed to delete place. Please try again.");
    }
  };

  if (loading) return <AdminLoading message="Loading places from the server..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tourist Places</h1>
            <TotalBadge count={places.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage all tourist destinations and attractions</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Place
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or location..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Active", "Inactive"].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedItems.map((p) => {
          const normStatus = norm(p.status);
          return (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
              <div className="relative h-40">
                <img src={primaryPlaceImage(p, pickImage(TRAVEL_IMAGES, p.id))} alt={p.name} className="w-full h-full object-cover" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[normStatus] || statusColors.INACTIVE}`}>{statusLabel(p.status)}</span>
                {p.placeCategory?.name && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-gray-900/90 text-primary">{p.placeCategory.name}</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{p.name}</h3>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" /> {p.district?.province?.name || p.district?.name || p.address || "N/A"}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{p.placeCategory?.name || "General"}</span>
                  <span className="flex items-center gap-0.5 text-[11px] text-yellow-500"><Star className="w-3 h-3 fill-yellow-400" /> {p.rating || 0}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                  <span className="text-[11px] text-gray-400 truncate">{p.address || "N/A"}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button onClick={() => openForm(p)} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                    <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <AdminPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="places"
          />
        </div>
      )}

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400">No places found.</div>}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <img src={primaryPlaceImage(viewTarget, pickImage(TRAVEL_IMAGES, viewTarget.id))} alt={viewTarget.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[norm(viewTarget.status)] || statusColors.INACTIVE}`}>{statusLabel(viewTarget.status)}</span>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.district?.province?.name || viewTarget.district?.name || viewTarget.address || "N/A"}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{viewTarget.placeCategory?.name || "General"}</span>
                <span className="flex items-center gap-0.5 text-sm text-yellow-500"><Star className="w-3.5 h-3.5 fill-yellow-400" /> {viewTarget.rating || 0}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">{viewTarget.description || "No description."}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Address</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.address || "N/A"}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setViewTarget(null); openForm(viewTarget); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Place" : "Add Place"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input name="name" required defaultValue={editItem?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editItem?.description || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input name="address" defaultValue={editItem?.address || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select name="placeCategoryId" required defaultValue={editItem?.placeCategory?.id || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District *</label>
                  <select name="districtId" required defaultValue={editItem?.district?.id || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select district</option>
                    {districts.map((d) => <option key={d.id} value={d.id}>{d.name}{d.province?.name ? `, ${d.province.name}` : ""}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editItem?.status || "ACTIVE"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <ImageUpload
                label="Place Images"
                existingImages={existingImages}
                onRemoveExisting={handleRemoveExistingImage}
                files={images}
                onFilesChange={setImages}
                uploading={saving}
                helperText="The first image is used as the cover photo."
              />
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60">{saving ? "Saving..." : editItem ? "Save Changes" : "Add Place"}</button>
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