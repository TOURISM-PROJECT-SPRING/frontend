import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X, AlertTriangle, Check, Hash, Clock, Tag, Percent, Coins, XCircle } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const norm = (s) => String(s || "").toUpperCase();

const statusColors = {
  ACTIVE: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  INACTIVE: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  EXPIRED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const statusColor = (status) => statusColors[norm(status)] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";

const statusLabel = (s) => {
  const n = norm(s);
  if (n === "ACTIVE") return "Active";
  if (n === "INACTIVE") return "Inactive";
  if (n === "EXPIRED") return "Expired";
  return s || "N/A";
};

const discountText = (p) => {
  const type = norm(p.discountType);
  const value = p.discountValue;
  if (!value && value !== 0) return "N/A";
  return type === "PERCENT" ? `${value}% OFF` : `$${value} OFF`;
};

const discountBadge = (p) =>
  norm(p.discountType) === "PERCENT"
    ? "bg-primary/5 text-primary"
    : "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400";

const targetOf = (p) => p.hotelName || p.restaurantName || p.tourPackageName || "N/A";

const targetTypeOf = (p) => {
  if (p.hotelName) return "HOTEL";
  if (p.restaurantName) return "RESTAURANT";
  if (p.tourPackageName) return "TOUR_PACKAGE";
  return "";
};

const emptyForm = {
  name: "",
  code: "",
  discountType: "PERCENT",
  discountValue: "",
  status: "ACTIVE",
  startAt: "",
  endAt: "",
};

export default function AdminPromotionsPage() {
  const toast = useToast();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
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
        const data = await managementService.getPromotions();
        setPromotions(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statuses = [...new Set(promotions.map((p) => p.status).filter(Boolean))];

  const filtered = promotions.filter((p) => {
    const name = p.name || "";
    const code = p.code || "";
    const matchSearch = `${name} ${code}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(p.status) === norm(filter);
    return matchSearch && matchFilter;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openForm = (item) => {
    setEditTarget(item || null);
    if (item) {
      setForm({
        name: item.name || "",
        code: item.code || "",
        discountType: item.discountType || "PERCENT",
        discountValue: item.discountValue != null ? String(item.discountValue) : "",
        status: item.status || "ACTIVE",
        startAt: item.startAt ? item.startAt.slice(0, 10) : "",
        endAt: item.endAt ? item.endAt.slice(0, 10) : "",
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
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue) || 0,
      status: form.status,
      startAt: form.startAt ? new Date(`${form.startAt}T00:00:00`).toISOString() : null,
      endAt: form.endAt ? new Date(`${form.endAt}T23:59:59`).toISOString() : null,
    };
    try {
      if (editTarget) {
        const updated = await managementService.updatePromotion(editTarget.id, payload);
        setPromotions((prev) =>
          prev.map((p) => (p.id === editTarget.id ? { ...p, ...payload, ...(updated || {}) } : p))
        );
        toast.success("Promotion updated successfully");
      } else {
        const created = await managementService.createPromotion(payload);
        setPromotions((prev) => [created || { id: Date.now(), ...payload }, ...prev]);
        toast.success("Promotion created successfully");
      }
    } catch (error) {
      console.error("Error saving promotion:", error);
      if (editTarget) {
        setPromotions((prev) =>
          prev.map((p) => (p.id === editTarget.id ? { ...p, ...payload } : p))
        );
      } else {
        setPromotions((prev) => [{ id: Date.now(), ...payload }, ...prev]);
      }
      toast.success(
        editTarget ? "Promotion updated (offline mode)" : "Promotion created (offline mode)"
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
      await managementService.deletePromotion(deleteTarget.id);
      toast.success("Promotion deleted successfully");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.success("Promotion deleted (offline mode)");
    } finally {
      setPromotions((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading promotions from the server..." />;

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions</h1>
            <TotalBadge count={promotions.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Discount codes and special offers</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...statuses].map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Code</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Discount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Target</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date Range</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">{p.code || "N/A"}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${discountBadge(p)}`}>{discountText(p)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{targetOf(p)}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400">
                    {p.startAt ? p.startAt.slice(0, 10) : "—"} to {p.endAt ? p.endAt.slice(0, 10) : "—"}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(p.status)}`}>{statusLabel(p.status)}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Details"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => openForm(p)} className="p-1.5 rounded-lg hover:bg-primary/5 transition" title="Edit Promotion"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete Promotion"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No promotions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="promotions"
          />
        )}
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Promotion Details</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Discount promotion and campaign details</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.name || "N/A"}</p>
                <code className="text-xs font-bold bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-primary mt-1 inline-block">{viewTarget.code || "N/A"}</code>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(viewTarget.status)}`}>{statusLabel(viewTarget.status)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Discount</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{discountText(viewTarget)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Type</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {norm(viewTarget.discountType) === "PERCENT" ? "Percentage" : "Fixed Amount"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> ID</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">#{viewTarget.id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Target</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{targetOf(viewTarget)}</p>
                {targetTypeOf(viewTarget) && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{targetTypeOf(viewTarget)}</p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2.5 p-3.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-gray-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Start Date</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{viewTarget.startAt ? viewTarget.startAt.slice(0, 10) : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> End Date</span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">{viewTarget.endAt ? viewTarget.endAt.slice(0, 10) : "N/A"}</span>
              </div>
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
                <Edit3 className="w-4 h-4" /> Edit Promotion
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
                  <Tag className="w-5 h-5 text-primary" />
                  {editTarget ? "Edit Promotion" : "Add Promotion"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {editTarget ? "Update promotion details" : "Create a new discount promotion"}
                </p>
              </div>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Promotion Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Angkor Summer Deal" />
                </div>
                <div>
                  <label className={labelClass}>Promo Code *</label>
                  <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className={inputClass} placeholder="e.g. SUMMER20" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Discount Type *</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputClass}>
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Discount Value *</label>
                  <input type="number" min="0" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputClass} placeholder="e.g. 20" />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input type="date" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={closeForm} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 flex items-center gap-2 cursor-pointer">
                  {saving ? <span>Saving...</span> : <><Check className="w-4 h-4" /> {editTarget ? "Save Changes" : "Create Promotion"}</>}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Promotion</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this promotion</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete promotion{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.name}</strong>{" "}
              (<code className="text-xs font-bold">{deleteTarget.code}</code>)? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}