import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Edit3, Trash2, UtensilsCrossed, AlertCircle, CheckCircle, X, DollarSign, Image as ImageIcon } from "lucide-react";
import { foodService } from "../../services/foodService";
import { restaurantService } from "../../services/restaurantService";
import { foodCategoryService } from "../../services/foodCategoryService";
import { foodAttachmentService } from "../../services/foodAttachmentService";
import ImageUpload from "../../components/ui/ImageUpload";
import { formatPrice } from "../../utils/helpers";

export default function OwnerMenuPage() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    foodCategoryId: "",
    restaurantId: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodList, restList, catList] = await Promise.all([
        foodService.getAllFoods().catch(() => []),
        restaurantService.getAllRestaurants().catch(() => []),
        foodCategoryService.getAllFoodCategories().catch(() => []),
      ]);
      setFoods(foodList || []);
      setRestaurants(restList || []);
      setCategories(catList || []);
    } catch (error) {
      console.error("Error loading menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      if (selectedRestaurant !== "all" && String(f.restaurantId) !== String(selectedRestaurant)) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${f.name} ${f.description || ""} ${f.categoryName || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [foods, selectedRestaurant, search]);

  const openCreateModal = () => {
    setEditItem(null);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: "",
      description: "",
      price: "5.50",
      foodCategoryId: categories[0]?.id ? String(categories[0].id) : "",
      restaurantId: selectedRestaurant !== "all" ? selectedRestaurant : restaurants[0]?.id ? String(restaurants[0].id) : "",
    });
    setFormOpen(true);
  };

  const openEditModal = async (f) => {
    setEditItem(f);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      name: f.name || "",
      description: f.description || "",
      price: f.price ? String(f.price) : "0",
      foodCategoryId: f.foodCategoryId ? String(f.foodCategoryId) : categories[0]?.id ? String(categories[0].id) : "",
      restaurantId: f.restaurantId ? String(f.restaurantId) : restaurants[0]?.id ? String(restaurants[0].id) : "",
    });
    const atts = await foodAttachmentService.getFoodAttachments(f.id).catch(() => []);
    setExistingImages((atts || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl })));
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
        price: Number(formData.price),
        foodCategoryId: Number(formData.foodCategoryId),
        restaurantId: Number(formData.restaurantId),
      };

      if (!payload.name || !payload.price || !payload.restaurantId) {
        setErrorMessage("Please fill all required dish details and choose a restaurant.");
        setSubmitting(false);
        return;
      }

      let saved;
      if (editItem) {
        saved = await foodService.updateFood(editItem.id, payload);
        setFoods((prev) => prev.map((f) => (f.id === editItem.id ? { ...f, ...payload, ...saved } : f)));
        setSuccessMessage("Menu dish updated successfully!");
      } else {
        saved = await foodService.createFood(payload);
        setFoods((prev) => [saved || { ...payload, id: Date.now() }, ...prev]);
        setSuccessMessage("New dish added to menu!");
      }

      let savedId = saved?.id;
      if (savedId == null && !editItem) {
        const fresh = await foodService.getAllFoods().catch(() => []);
        const match = (fresh || []).find(
          (x) => String(x.name) === String(payload.name) && String(x.restaurantId) === String(payload.restaurantId)
        );
        if (match) savedId = match.id;
      }

      if (images.length && savedId != null) {
        await foodAttachmentService.uploadFoodAttachments(savedId, images);
      }

      setFormOpen(false);
      setEditItem(null);
      setImages([]);
      setExistingImages([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving food dish:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save dish.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    if (!editItem) return;
    try {
      await foodAttachmentService.deleteFoodAttachment(editItem.id, image.id);
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
      await foodService.deleteFood(deleteTarget.id);
      setFoods((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Dish removed from menu.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting dish:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete dish.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Menu & Food Dishes
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Menu Items & Prices</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add food items, update pricing, and categorize dining options</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Dish
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search dishes by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <select
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
          className="w-full sm:w-64 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
        >
          <option value="all">All Restaurants ({restaurants.length})</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFoods.map((f) => (
          <div key={f.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {f.categoryName || f.foodCategory?.name || "Dish"}
                </span>
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                  {formatPrice(f.price || 0)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{f.name}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{f.description || "Authentic freshly prepared specialty dish."}</p>
            </div>

            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => openEditModal(f)}
                className="flex-1 py-1.5 px-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => setDeleteTarget(f)}
                className="p-1.5 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <UtensilsCrossed className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Menu Dishes Found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Start by adding your first food item or dish.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add First Dish
          </button>
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && (setImages([]), setExistingImages([]), setFormOpen(false))} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editItem ? "Edit Dish" : "Add New Dish"}</h2>
              <button
                onClick={() => { setImages([]); setExistingImages([]); setFormOpen(false); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Dish / Food Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Fish Amok Royale"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Restaurant *</label>
                  <select
                    value={formData.restaurantId}
                    onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="8.50"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Food Category</label>
                <select
                  value={formData.foodCategoryId}
                  onChange={(e) => setFormData({ ...formData, foodCategoryId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Fresh river fish steamed in aromatic coconut curry and kroeung paste..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <ImageUpload
                label="Dish Images"
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
                  onClick={() => { setImages([]); setExistingImages([]); setFormOpen(false); }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editItem ? "Save Changes" : "Add Dish"}
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Dish</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the menu?
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
