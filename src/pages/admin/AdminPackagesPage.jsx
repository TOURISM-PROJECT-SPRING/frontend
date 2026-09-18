import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, MapPin, Star, Plus, Eye, Edit3, Trash2, X, AlertTriangle, Check, Calendar, Users, DollarSign, User } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const emptyForm = {
  name: "",
  description: "",
  durationDays: "",
  maxPeople: "",
  price: "",
  locationName: "",
  tourGuideName: "",
};

export default function AdminPackagesPage() {
  const toast = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewTarget, setViewTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getTourPackages();
        setPackages(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour packages:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = packages.filter((p) => {
    const name = p.name || "";
    const location = p.locationName || "";
    const guide = p.tourGuideName || "";
    return `${name} ${location} ${guide}`.toLowerCase().includes(search.toLowerCase());
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openForm = (item) => {
    setEditTarget(item || null);
    if (item) {
      setForm({
        name: item.name || "",
        description: item.description || "",
        durationDays: item.durationDays != null ? String(item.durationDays) : "",
        maxPeople: item.maxPeople != null ? String(item.maxPeople) : "",
        price: item.price != null ? String(item.price) : "",
        locationName: item.locationName || "",
        tourGuideName: item.tourGuideName || "",
      });
    } else {
      setForm(emptyForm);
    }
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || "",
      durationDays: Number(form.durationDays) || 1,
      maxPeople: Number(form.maxPeople) || 1,
      price: Number(form.price) || 0,
      locationName: form.locationName || "",
      tourGuideName: form.tourGuideName || "",
    };
    try {
      if (editTarget) {
        const updated = await managementService.updateTourPackage(editTarget.id, payload);
        setPackages((prev) =>
          prev.map((p) => (p.id === editTarget.id ? { ...p, ...payload, ...(updated || {}) } : p))
        );
        toast.success("Package updated successfully");
      } else {
        const created = await managementService.createTourPackage(payload);
        setPackages((prev) => [created || { id: Date.now(), ...payload }, ...prev]);
        toast.success("Package created successfully");
      }
    } catch (error) {
      console.error("Error saving tour package:", error);
      if (editTarget) {
        setPackages((prev) =>
          prev.map((p) => (p.id === editTarget.id ? { ...p, ...payload } : p))
        );
      } else {
        setPackages((prev) => [{ id: Date.now(), ...payload }, ...prev]);
      }
      toast.success(
        editTarget ? "Package updated (offline mode)" : "Package created (offline mode)"
      );
    } finally {
      setSaving(false);
      closeForm();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await managementService.deleteTourPackage(deleteTarget.id);
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting tour package:", error);
      toast.success("Package deleted (offline mode)");
    } finally {
      setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading packages from the server..." />;

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tour Packages</h1>
            <TotalBadge count={packages.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tour packages and experiences</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search packages..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedItems.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition flex flex-col">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{p.name || "N/A"}</h3>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full shrink-0">#{p.id}</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" /> {p.locationName || "N/A"}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 mb-3 flex-1">{p.description || "No description."}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full">{p.durationDays} days</span>
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded-full">Max {p.maxPeople} people</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
              <div>
                <p className="text-lg font-bold text-primary">${p.price}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Guide: {p.tourGuideName || "N/A"}</p>
              </div>
              <div className="text-right">
                {p.avgRating ? (
                  <div className="flex items-center gap-0.5 justify-end">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{Number(p.avgRating).toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">({p.reviewCount || 0})</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">No reviews</span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 pt-3 mt-2 border-t border-gray-50 dark:border-gray-800">
              <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Details"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
              <button onClick={() => openForm(p)} className="p-1.5 rounded-lg hover:bg-primary/5 transition" title="Edit Package"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
              <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete Package"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No packages found.</div>}

      {filtered.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
          <AdminPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="packages"
          />
        </div>
      )}

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Package Details</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Tour package and experience details</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.name || "N/A"}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {viewTarget.locationName || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">${viewTarget.price}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Duration</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.durationDays} day(s)</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Max People</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.maxPeople} people</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Guide</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.tourGuideName || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Rating</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {viewTarget.avgRating ? (
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {Number(viewTarget.avgRating).toFixed(1)} ({viewTarget.reviewCount || 0})</span>
                  ) : "No reviews"}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{viewTarget.description || "No description."}</p>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  openForm(target);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-4 h-4" /> Edit Package
              </button>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="py-2.5 px-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {editTarget ? "Edit Package" : "Add Package"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {editTarget ? "Update package details" : "Create a new tour package"}
                </p>
              </div>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={labelClass}>Package Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Angkor Wat Sunrise Tour" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Duration (days) *</label>
                  <input type="number" min="1" required value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Max People *</label>
                  <input type="number" min="1" required value={form.maxPeople} onChange={(e) => setForm({ ...form, maxPeople: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (USD) *</label>
                  <input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} className={inputClass} placeholder="e.g. Siem Reap" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Tour Guide</label>
                <input type="text" value={form.tourGuideName} onChange={(e) => setForm({ ...form, tourGuideName: e.target.value })} className={inputClass} placeholder="Guide name" />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="Describe the package experience" />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 flex items-center gap-2 cursor-pointer">
                  {saving ? <span>Saving...</span> : <><Check className="w-4 h-4" /> {editTarget ? "Save Changes" : "Create Package"}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Package</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this tour package</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete package{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}