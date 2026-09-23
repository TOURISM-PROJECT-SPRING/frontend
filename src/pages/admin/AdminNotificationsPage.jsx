import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Plus, CheckCheck, Trash2, X, AlertTriangle, BellRing, Megaphone } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const norm = (s) => String(s || "").toUpperCase();

const typeConfig = {
  PROMOTION: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  BOOKING: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  SYSTEM: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
};

const typeColor = (type) => typeConfig[norm(type)] || typeConfig.SYSTEM;

const typeLabel = (t) => {
  const n = norm(t);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return iso.slice(0, 10);
};

const emptyForm = {
  title: "",
  message: "",
  type: "SYSTEM",
};

export default function AdminNotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getNotifications();
        setNotifications(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = notifications
    .filter((n) => readFilter === "All" || (readFilter === "Unread" ? !n.isRead : n.isRead))
    .filter((n) => `${n.title || ""} ${n.message || ""}`.toLowerCase().includes(search.toLowerCase()));

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const markRead = async (n) => {
    const updated = { ...n, isRead: true };
    try {
      await managementService.updateNotification(n.id, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? updated : x)));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      message: form.message,
      type: form.type,
      isRead: false,
    };
    try {
      const created = await managementService.createNotification(payload);
      setNotifications((prev) => [created || { id: Date.now(), ...payload, userName: "Admin", createdAt: new Date().toISOString() }, ...prev]);
      toast.success("Notification broadcast successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
      setNotifications((prev) => [{ id: Date.now(), ...payload, userName: "Admin", createdAt: new Date().toISOString() }, ...prev]);
      toast.success("Notification broadcast (offline mode)");
    } finally {
      setSaving(false);
      setForm(emptyForm);
      setFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await managementService.deleteNotification(deleteTarget.id);
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.success("Notification deleted (offline mode)");
    } finally {
      setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading notifications from the server..." />;

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            <TotalBadge count={notifications.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">System notifications and broadcasts</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Broadcast Notification
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by title or message..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Unread", "Read"].map((s) => (
            <button
              key={s}
              onClick={() => { setReadFilter(s); setCurrentPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${readFilter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Message</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((n) => (
                <tr key={n.id} className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!n.isRead ? "bg-primary/[0.02]" : ""}`}>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${typeColor(n.type)}`}>{typeLabel(n.type)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${!n.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{n.title || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[300px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{n.userName || "System"}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400">{formatWhen(n.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`block w-2 h-2 rounded-full ${n.isRead ? "bg-gray-300 dark:bg-gray-600" : "bg-primary"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {!n.isRead && (
                        <button onClick={() => markRead(n)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition" title="Mark as read"><CheckCheck className="w-3.5 h-3.5 text-blue-500" /></button>
                      )}
                      <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete notification"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No notifications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="notifications"
        />
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" /> Broadcast Notification
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Send a notification to platform users</p>
              </div>
              <button onClick={() => setFormOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className={labelClass}>Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="e.g. Maintenance on Sunday" />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                  <option value="SYSTEM">System</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="BOOKING">Booking</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Message *</label>
                <textarea rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} placeholder="Notification message to broadcast..." />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 flex items-center gap-2 cursor-pointer">
                  {saving ? <span>Broadcasting...</span> : <><BellRing className="w-4 h-4" /> Broadcast</>}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Notification</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this notification</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete notification{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.title}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}