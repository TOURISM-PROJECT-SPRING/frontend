import { useEffect, useState, useMemo } from "react";
import { Search, Plus, MapPin, Eye, Edit3, Trash2, UtensilsCrossed, Clock, Building2, AlertCircle, CheckCircle, X, ChevronRight } from "lucide-react";
import { restaurantService } from "../../services/restaurantService";
import { restaurantAttachmentService } from "../../services/restaurantAttachmentService";
import { foodService } from "../../services/foodService";
import { tourPlaceService } from "../../services/tourPlaceService";
import { Link } from "react-router-dom";
import ImageUpload from "../../components/ui/ImageUpload";

export default function OwnerRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [places, setPlaces] = useState([]);
  const [menuCounts, setMenuCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    openTime: "08:00",
    closeTime: "22:00",
    tourismPlaceId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [restData, placeData, foodData] = await Promise.all([
        restaurantService.getAllRestaurantsWithImages().catch(() => []),
        tourPlaceService.getAllTourPlaces().catch(() => []),
        foodService.getAllFoods().catch(() => []),
      ]);
      setRestaurants(restData || []);
      setPlaces(placeData || []);

      const counts = {};
      (foodData || []).forEach((f) => {
        if (f.restaurantId) {
          counts[f.restaurantId] = (counts[f.restaurantId] || 0) + 1;
        }
      });
      setMenuCounts(counts);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const name = r.name || "";
      const desc = r.description || "";
      const place = r.tourismPlaceName || "";
      return `${name} ${desc} ${place}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [restaurants, search]);

  const openCreateModal = () => {
    setEditItem(null);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: "",
      description: "",
      openTime: "08:00",
      closeTime: "22:00",
      tourismPlaceId: places[0]?.id ? String(places[0].id) : "",
    });
    setFormOpen(true);
  };

  const openEditModal = async (r) => {
    setEditItem(r);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: r.name || "",
      description: r.description || "",
      openTime: r.openTime || "08:00",
      closeTime: r.closeTime || r.clossTime || "22:00",
      tourismPlaceId: r.tourismPlaceId ? String(r.tourismPlaceId) : places[0]?.id ? String(places[0].id) : "",
    });
    const attachments = await restaurantAttachmentService.getRestaurantAttachments(r.id).catch(() => []);
    setExistingImages((attachments || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl })));
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        tourismPlaceId: Number(formData.tourismPlaceId) || 1,
      };

      if (!payload.name || !payload.tourismPlaceId) {
        setErrorMessage("Please fill in restaurant name and select location/tourism place.");
        setSubmitting(false);
        return;
      }

      let saved;
      if (editItem) {
        saved = await restaurantService.updateRestaurant(editItem.id, payload);
        if (saved?.id == null) saved = { ...editItem, ...payload };
        setRestaurants((prev) => prev.map((r) => (r.id === editItem.id ? { ...r, ...payload, ...saved } : r)));
        setSuccessMessage("Restaurant updated successfully!");
      } else {
        saved = await restaurantService.createRestaurant(payload);
        if (saved?.id == null) {
          const freshList = await restaurantService.getAllRestaurantsWithImages().catch(() => []);
          const match = (freshList || []).find((r) => r.name === payload.name);
          saved = match || saved;
        }
        if (saved?.id != null) {
          setRestaurants((prev) => [saved, ...prev]);
        } else {
          setRestaurants((prev) => [{ ...payload, id: Date.now() }, ...prev]);
        }
        setSuccessMessage("Restaurant registered successfully!");
      }

      if (images.length && saved?.id != null) {
        await restaurantAttachmentService.uploadRestaurantAttachments(saved.id, images);
      }

      setFormOpen(false);
      setEditItem(null);
      setImages([]);
      setExistingImages([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving restaurant:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save restaurant.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    if (!editItem) return;
    try {
      await restaurantAttachmentService.deleteRestaurantAttachment(editItem.id, image.id);
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
      await restaurantService.deleteRestaurant(deleteTarget.id);
      setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Restaurant deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete restaurant.");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading restaurants from server...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Restaurant Owner
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">My Restaurants</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Manage dining venues, operating hours, and dish offerings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Restaurant
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
            placeholder="Search restaurants by name or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                  {r.name}
                </h3>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> {r.tourismPlaceName || "Tourism Attraction / City"}
              </p>

              <div className="grid grid-cols-2 gap-2 text-center mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-2.5">
                  <p className="text-base font-bold text-gray-900 dark:text-white">{menuCounts[r.id] || 0}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Menu Dishes</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl py-2.5">
                  <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {r.openTime || "08:00"} - {r.closeTime || r.clossTime || "22:00"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Hours</p>
                </div>
              </div>

              {r.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {r.description}
                </p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <Link
                  to={`/owner/menu?restaurantId=${r.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" /> Manage Menu
                </Link>
                <button
                  onClick={() => openEditModal(r)}
                  className="flex items-center justify-center py-2 px-3 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="flex items-center justify-center py-2 px-3 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Restaurants Found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">You haven&apos;t added any restaurants yet.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Your First Restaurant
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && setFormOpen(false)} />
          <div className="relative max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editItem ? "Edit Restaurant" : "Add Restaurant"}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Restaurant Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Khmer Heritage Bistro"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tourism Destination / Place *</label>
                <select
                  value={formData.tourismPlaceId}
                  onChange={(e) => setFormData({ ...formData, tourismPlaceId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                >
                  <option value="">Select location or attraction</option>
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.district?.name ? `(${p.district?.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={formData.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Authentic Cambodian dining experience with fresh local ingredients..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <ImageUpload
                label="Restaurant Images"
                existingImages={existingImages}
                onRemoveExisting={handleRemoveExistingImage}
                files={images}
                onFilesChange={setImages}
                uploading={submitting}
                helperText="The first image is used as the cover photo."
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editItem ? "Save Changes" : "Create Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Restaurant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
