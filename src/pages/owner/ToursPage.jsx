import { useEffect, useState, useMemo } from "react";
import { Search, Plus, MapPin, Eye, Edit3, Trash2, Compass, Tag, Star, AlertCircle, CheckCircle, X } from "lucide-react";
import { tourPlaceService } from "../../services/tourPlaceService";
import { tourPlaceAttachmentService } from "../../services/tourPlaceAttachmentService";
import { districtService } from "../../services/districtService";
import { placeCategoryService } from "../../services/placeCategoryService";
import ImageUpload from "../../components/ui/ImageUpload";

export default function OwnerToursPage() {
  const [places, setPlaces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    districtId: "",
    placeCategoryId: "",
    status: "OPEN",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [placeList, distList, catList] = await Promise.all([
        tourPlaceService.getAllTourPlaces().catch(() => []),
        districtService.getAllDistricts().catch(() => []),
        placeCategoryService.getAllPlaceCategories().catch(() => []),
      ]);
      setPlaces(placeList || []);
      setDistricts(distList || []);
      setCategories(catList || []);
    } catch (e) {
      console.error("Error loading tour places:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const name = p.name || "";
      const desc = p.description || "";
      const cat = p.placeCategory?.name || "";
      return `${name} ${desc} ${cat}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [places, search]);

  const openCreateModal = () => {
    setEditItem(null);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: "",
      description: "",
      address: "Siem Reap, Cambodia",
      districtId: districts[0]?.id ? String(districts[0].id) : "",
      placeCategoryId: categories[0]?.id ? String(categories[0].id) : "",
      status: "OPEN",
    });
    setFormOpen(true);
  };

  const openEditModal = async (p) => {
    setEditItem(p);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: p.name || "",
      description: p.description || "",
      address: p.address || "",
      districtId: p.district?.id ? String(p.district.id) : districts[0]?.id ? String(districts[0].id) : "",
      placeCategoryId: p.placeCategory?.id ? String(p.placeCategory.id) : categories[0]?.id ? String(categories[0].id) : "",
      status: p.status || "OPEN",
    });
    setFormOpen(true);
    const atts = await tourPlaceAttachmentService.getByTourPlaceId(p.id).catch(() => []);
    setExistingImages((atts || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl })));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        districtId: Number(formData.districtId) || 1,
        placeCategoryId: Number(formData.placeCategoryId) || 1,
        status: formData.status,
      };

      if (!payload.name) {
        setErrorMessage("Please fill in the attraction name.");
        setSubmitting(false);
        return;
      }

      let saved;
      if (editItem) {
        saved = await tourPlaceService.updateTourPlace(editItem.id, payload);
        setPlaces((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...payload, ...saved } : p)));
        setSuccessMessage("Attraction updated successfully!");
      } else {
        saved = await tourPlaceService.createTourPlace(payload);
        setPlaces((prev) => [saved || { ...payload, id: Date.now() }, ...prev]);
        setSuccessMessage("New tourism attraction created!");
      }

      if (images.length && saved?.id != null) {
        await tourPlaceAttachmentService.uploadAttachments(saved.id, images);
      } else if (images.length && saved?.id == null) {
        const refreshed = await tourPlaceService.getAllTourPlaces().catch(() => []);
        const match = (refreshed || []).find((p) => p.name === payload.name);
        if (match?.id != null) {
          await tourPlaceAttachmentService.uploadAttachments(match.id, images);
        }
      }

      setFormOpen(false);
      setEditItem(null);
      setImages([]);
      setExistingImages([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving tour place:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save attraction.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    try {
      await tourPlaceAttachmentService.deleteAttachment(image.id);
      setExistingImages((prev) => prev.filter((i) => i.id !== image.id));
      setSuccessMessage("Image removed successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (e) {
      setErrorMessage("Failed to remove image. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await tourPlaceService.deleteTourPlace(deleteTarget.id);
      setPlaces((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Attraction deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      console.error("Failed to delete place:", e);
      setErrorMessage("Failed to delete attraction.");
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
    setImages([]);
    setExistingImages([]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Tour & Attraction Owner
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Tour Places & Attractions</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Manage tourism destinations, travel spots, and experience sites</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Attraction
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search attractions by name or province..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {p.placeCategory?.name || "Attraction"}
              </span>
              <span className="text-xs font-semibold text-gray-400">
                ★ {p.rating != null ? p.rating : "4.8"}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{p.name}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {p.district?.name || p.address || "Cambodia"}
            </p>

            {p.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                {p.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => openEditModal(p)}
                className="flex-1 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => setDeleteTarget(p)}
                className="p-1.5 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Compass className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Attractions Found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">You haven&apos;t created any tour places yet.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add First Attraction
          </button>
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && setFormOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editItem ? "Edit Attraction" : "Add Attraction"}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Attraction Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Phnom Kulen Eco Tour"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.placeCategoryId}
                    onChange={(e) => setFormData({ ...formData, placeCategoryId: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">District / Province</label>
                  <select
                    value={formData.districtId}
                    onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name || d.district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Address / Location</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Siem Reap, Cambodia"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition"
                >
                  {submitting ? "Saving..." : editItem ? "Save Changes" : "Create Attraction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
