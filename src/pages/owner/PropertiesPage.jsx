import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, MapPin, Eye, Edit3, Trash2, BedDouble, Building2, AlertCircle, CheckCircle, X, ArrowRight } from "lucide-react";
import { hotelService } from "../../services/hotelService";
import { hotelAttachmentService } from "../../services/hotelAttachmentService";
import { roomService } from "../../services/roomService";
import { districtService } from "../../services/districtService";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ui/ImageUpload";

export default function OwnerPropertiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [roomCounts, setRoomCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [districts, setDistricts] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    hotelName: "",
    locationId: "",
    emailContact: "",
    phoneContact: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hotelData, roomData, districtData] = await Promise.all([
        hotelService.getAllHotelsWithImages().catch(() => []),
        roomService.getAllRooms().catch(() => []),
        districtService.getAllDistricts().catch(() => []),
      ]);
      setHotels(hotelData || []);
      setDistricts(districtData || []);
      const counts = {};
      (roomData || []).forEach((r) => {
        counts[r.hotelId] = (counts[r.hotelId] || 0) + 1;
      });
      setRoomCounts(counts);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      const name = h.hotelName || "";
      const location = h.locationName || "";
      const owner = h.ownerName || "";
      return `${name} ${location} ${owner}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [hotels, search]);

  const openCreateModal = () => {
    setEditItem(null);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      hotelName: "",
      locationId: districts[0]?.id ? String(districts[0].id) : "",
      emailContact: user?.email || "",
      phoneContact: user?.phone || "+855 12 345 678",
    });
    setFormOpen(true);
  };

  const openEditModal = async (h) => {
    setEditItem(h);
    setErrorMessage("");
    setImages([]);
    setExistingImages([]);
    setFormData({
      hotelName: h.hotelName || "",
      locationId: h.locationId ? String(h.locationId) : districts[0]?.id ? String(districts[0].id) : "",
      emailContact: h.emailContact || "",
      phoneContact: h.phoneContact || "",
    });
    setFormOpen(true);
    const atts = await hotelAttachmentService.getHotelAttachments(h.id).catch(() => []);
    setExistingImages((atts || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl })));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        hotelName: formData.hotelName,
        locationId: Number(formData.locationId),
        ownerId: user?.id || 1,
        emailContact: formData.emailContact || "",
        phoneContact: formData.phoneContact || "",
      };

      if (!payload.hotelName || !payload.locationId) {
        setErrorMessage("Please fill in the property name and select a location.");
        setSubmitting(false);
        return;
      }

      let saved;
      if (editItem) {
        saved = await hotelService.updateHotel(editItem.id, payload);
        setHotels((prev) => prev.map((h) => (h.id === editItem.id ? saved : h)));
        setSuccessMessage("Property updated successfully!");
      } else {
        saved = await hotelService.createHotel(payload);
        setHotels((prev) => [saved, ...prev]);
        setSuccessMessage("Property registered successfully!");
      }

      if (images.length) {
        const targetId = saved?.id;
        if (targetId != null) {
          await hotelAttachmentService.uploadHotelAttachments(targetId, images);
        } else {
          const list = await hotelService.getAllHotelsWithImages().catch(() => []);
          const match = (list || []).find((item) => item.hotelName === payload.hotelName);
          if (match?.id != null) {
            await hotelAttachmentService.uploadHotelAttachments(match.id, images);
          }
        }
      }

      setFormOpen(false);
      setEditItem(null);
      setImages([]);
      setExistingImages([]);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving property:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save property. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExistingImage = async (image) => {
    if (!editItem) return;
    try {
      await hotelAttachmentService.deleteHotelAttachment(editItem.id, image.id);
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
      await hotelService.deleteHotel(deleteTarget.id);
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Property deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting property:", error);
      setErrorMessage(error.response?.data?.message || "Failed to delete property.");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading properties from server...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your hotel listings, locations, and room counts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <div key={h.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition">
            {h.imageUrl && (
              <div className="relative h-28 bg-gray-100 dark:bg-gray-800">
                <img src={h.imageUrl} alt={h.hotelName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{h.hotelName}</h3>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {h.locationName || "Cambodia"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-center mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <p className="text-base font-bold text-gray-900 dark:text-white">{roomCounts[h.id] || 0}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Configured Rooms</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg py-2.5">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate px-2">{h.ownerName || user?.fullname || "Owner"}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Owner</p>
                </div>
              </div>
              <div className="space-y-1 mb-4 text-xs text-gray-500 dark:text-gray-400">
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">Email:</span> {h.emailContact || "N/A"}</p>
                <p><span className="font-semibold text-gray-700 dark:text-gray-300">Phone:</span> {h.phoneContact || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setViewTarget(h)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => openEditModal(h)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <Link
                  to="/owner/rooms"
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition"
                >
                  <BedDouble className="w-3.5 h-3.5" /> Rooms
                </Link>
                <button
                  onClick={() => setDeleteTarget(h)}
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
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Properties Found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">You haven&apos;t added any hotel properties yet or no matches found.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Your First Property
          </button>
        </div>
      )}

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewTarget.hotelName}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {viewTarget.locationName || "Cambodia"}
                </p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm border-t border-b border-gray-100 dark:border-gray-800 py-4 my-4">
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">Owner</span>
                <span className="font-semibold text-gray-900 dark:text-white">{viewTarget.ownerName || user?.fullname || "Owner"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">Contact Email</span>
                <span className="font-semibold text-gray-900 dark:text-white">{viewTarget.emailContact || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">Contact Phone</span>
                <span className="font-semibold text-gray-900 dark:text-white">{viewTarget.phoneContact || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-gray-400">Total Configured Rooms</span>
                <span className="font-semibold text-primary">{roomCounts[viewTarget.id] || 0} rooms</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  openEditModal(target);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition"
              >
                <Edit3 className="w-4 h-4" /> Edit Property
              </button>
              <button
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  setDeleteTarget(target);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
              >
                <Trash2 className="w-4 h-4" /> Delete Property
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!submitting) {
                setFormOpen(false);
                setEditItem(null);
              }
            }}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Property" : "Add Property"}</h2>
              <button
                onClick={() => {
                  setFormOpen(false);
                  setEditItem(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Name *</label>
                <input
                  value={formData.hotelName}
                  onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                  required
                  placeholder="e.g. Angkor Paradise Resort"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / District *</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                >
                  <option value="">Select location</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name || d.district}
                      {d.province?.name || d.province ? `, ${d.province?.name || d.province}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Contact *</label>
                  <input
                    type="email"
                    required
                    value={formData.emailContact}
                    onChange={(e) => setFormData({ ...formData, emailContact: e.target.value })}
                    placeholder="contact@hotel.com"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Contact</label>
                  <input
                    value={formData.phoneContact}
                    onChange={(e) => setFormData({ ...formData, phoneContact: e.target.value })}
                    placeholder="+855 12 345 678"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              <ImageUpload
                label="Property Images"
                existingImages={existingImages}
                onRemoveExisting={handleRemoveExistingImage}
                files={images}
                onFilesChange={setImages}
                uploading={submitting}
                helperText="The first image is used as the cover photo."
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setFormOpen(false);
                    setEditItem(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editItem ? "Save Changes" : "Add Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Property</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Are you sure you want to delete <strong>{deleteTarget.hotelName}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
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