import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Plus, MapPin, Eye, Edit3, Trash2 } from "lucide-react";
import { hotelService } from "../../services/hotelService";
import { hotelAttachmentService } from "../../services/hotelAttachmentService";
import { districtService } from "../../services/districtService";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ui/ImageUpload";
import { useToast } from "../../components/ui/Toast";

export default function AdminHotelsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        const [hotelData, districtData] = await Promise.all([
          hotelService.getAllHotelsWithImages(),
          districtService.getAllDistricts(),
        ]);
        setHotels(hotelData);
        setDistricts(districtData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = hotels.filter((h) => {
    const name = h.hotelName || "";
    const location = h.locationName || "";
    const owner = h.ownerName || "";
    return `${name} ${location} ${owner}`.toLowerCase().includes(search.toLowerCase());
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openForm = async (item) => {
    setEditItem(item || null);
    setImages([]);
    setExistingImages([]);
    setFormOpen(true);
    if (item) {
      const attachments = await hotelAttachmentService.getHotelAttachments(item.id).catch(() => []);
      setExistingImages(
        (attachments || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl }))
      );
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditItem(null);
    setImages([]);
    setExistingImages([]);
  };

  const refreshHotels = async () => {
    const data = await hotelService.getAllHotelsWithImages();
    setHotels(data);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        hotelName: data.hotelName,
        locationId: Number(data.locationId),
        ownerId: user?.id || 1,
        emailContact: data.emailContact || "",
        phoneContact: data.phoneContact || "",
      };
      let saved;
      if (editItem) {
        saved = await hotelService.updateHotel(editItem.id, payload);
        if (saved?.id == null) saved = { ...editItem, ...payload };
      } else {
        saved = await hotelService.createHotel(payload);
      }
      if (images.length && saved?.id != null) {
        await hotelAttachmentService.uploadHotelAttachments(saved.id, images);
      }
      await refreshHotels();
      closeForm();
      toast.success(editItem ? "Hotel updated successfully" : "Hotel created successfully");
    } catch (error) {
      console.error("Error saving hotel:", error);
      toast.error("Failed to save hotel. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    if (!editItem) return;
    try {
      await hotelAttachmentService.deleteHotelAttachment(editItem.id, image.id);
      setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
      await refreshHotels();
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await hotelService.deleteHotel(deleteTarget.id);
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Hotel deleted successfully");
    } catch (error) {
      console.error("Error deleting hotel:", error);
      toast.error("Failed to delete hotel. Please try again.");
    }
  };

  if (loading) return <AdminLoading message="Loading hotels from the server..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hotels</h1>
            <TotalBadge count={hotels.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage hotel listings, details, and availability</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Hotel
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name, location, or owner..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedItems.map((h) => (
          <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            {h.imageUrl ? (
              <div className="h-36">
                <img src={h.imageUrl} alt={h.hotelName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-36 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">No image</div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{h.hotelName}</h3>
              </div>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3" /> {h.locationName || "N/A"}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Owner: {h.ownerName || "N/A"}</p>
              <div className="space-y-1 mb-3">
                <p className="text-[11px] text-gray-400"><span className="inline-block w-16">Email:</span>{h.emailContact || "N/A"}</p>
                <p className="text-[11px] text-gray-400"><span className="inline-block w-16">Phone:</span>{h.phoneContact || "N/A"}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">ID #{h.id}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewTarget(h)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => openForm(h)} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                  <button onClick={() => setDeleteTarget(h)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400">No hotels found.</div>}

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <AdminPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="hotels"
          />
        </div>
      )}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {viewTarget.imageUrl && (
              <img src={viewTarget.imageUrl} alt={viewTarget.hotelName} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{viewTarget.hotelName}</h3>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {viewTarget.locationName || "N/A"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Owner: {viewTarget.ownerName || "N/A"}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Email</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.emailContact || "N/A"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Phone</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.phoneContact || "N/A"}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { const t = viewTarget; setViewTarget(null); openForm(t); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
                <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Hotel" : "Add Hotel"}</h2>
              <button onClick={closeForm} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hotel Name *</label>
                <input name="hotelName" required defaultValue={editItem?.hotelName || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                <select name="locationId" required defaultValue={editItem?.locationId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="">Select location</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name}{d.province?.name ? `, ${d.province.name}` : ""}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Contact *</label>
                  <input name="emailContact" type="email" required defaultValue={editItem?.emailContact || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Contact</label>
                  <input name="phoneContact" defaultValue={editItem?.phoneContact || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <ImageUpload
                label="Hotel Images"
                existingImages={existingImages}
                onRemoveExisting={handleRemoveExistingImage}
                files={images}
                onFilesChange={setImages}
                uploading={saving}
                helperText="The first image is used as the cover photo."
              />
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60">{saving ? "Saving..." : editItem ? "Save Changes" : "Add Hotel"}</button>
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.hotelName}</strong>? This cannot be undone.</p>
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