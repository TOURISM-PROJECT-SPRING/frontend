import { useState } from "react";
import { Plus, Bell, Search, Edit3, Trash2, CreditCard, Star, Tag, Settings, Eye, EyeOff } from "lucide-react";

const typeConfig = {
  Booking: { icon: Bell, color: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400", badge: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
  System: { icon: Settings, color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", badge: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" },
  Payment: { icon: CreditCard, color: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400", badge: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400" },
  Review: { icon: Star, color: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400", badge: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400" },
  Promotion: { icon: Tag, color: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400", badge: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400" },
};

const priorityColors = { High: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400", Medium: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400", Low: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500" };

const initialNotifications = [
  { id: 1, type: "Booking", title: "New booking confirmed", message: "Booking #1234 for Angkor Wat Villa has been confirmed by John Smith.", recipient: "admin@tourism.com", date: "2026-08-27", read: false, priority: "High" },
  { id: 2, type: "Payment", title: "Payment received", message: "Payment of $2,450 received for booking #1230. Payout scheduled for Sep 1.", recipient: "finance@tourism.com", date: "2026-08-27", read: false, priority: "High" },
  { id: 3, type: "Review", title: "New 5-star review", message: "Sarah left a 5-star review for Paradise Hotel: 'Absolutely amazing stay!'", recipient: "owner@paradise.com", date: "2026-08-26", read: true, priority: "Medium" },
  { id: 4, type: "System", title: "Scheduled maintenance", message: "System maintenance scheduled for Sep 1, 2026 from 2:00 AM to 4:00 AM UTC.", recipient: "admin@tourism.com", date: "2026-08-25", read: true, priority: "Low" },
  { id: 5, type: "Promotion", title: "Promotion expiring soon", message: "PROMO code 'SUMMER50' will expire in 4 days. 89 of 200 uses redeemed.", recipient: "marketing@tourism.com", date: "2026-08-25", read: false, priority: "Medium" },
  { id: 6, type: "Booking", title: "Cancellation request", message: "Booking #1228 for Riverside Lodge has a cancellation request from Mike Brown.", recipient: "support@tourism.com", date: "2026-08-24", read: true, priority: "High" },
  { id: 7, type: "Payment", title: "Refund processed", message: "Refund of $320 processed for booking #1215. Customer notified via email.", recipient: "finance@tourism.com", date: "2026-08-23", read: true, priority: "Low" },
  { id: 8, type: "System", title: "New user registration", message: "15 new users registered today. Total active users: 2,568.", recipient: "admin@tourism.com", date: "2026-08-23", read: true, priority: "Low" },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");
  const [readFilter, setReadFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editNotif, setEditNotif] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = notifications
    .filter((n) => filter === "All" || n.type === filter)
    .filter((n) => readFilter === "All" || (readFilter === "Read" ? n.read : !n.read))
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.recipient.toLowerCase().includes(search.toLowerCase()));

  const toggleRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSave = (data) => {
    if (editNotif) {
      setNotifications((prev) => prev.map((n) => (n.id === editNotif.id ? { ...n, ...data } : n)));
    } else {
      setNotifications((prev) => [{ ...data, id: Date.now(), date: new Date().toISOString().slice(0, 10), read: false }, ...prev]);
    }
    setFormOpen(false);
    setEditNotif(null);
  };

  const handleDelete = () => {
    setNotifications((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage system notifications and alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition">
            <Eye className="w-4 h-4" /> Mark All Read
          </button>
          <button
            onClick={() => { setEditNotif(null); setFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
          >
            <Plus className="w-4 h-4" /> New Notification
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
          <option value="All">All Types</option>
          {Object.keys(typeConfig).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)} className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
          <option value="All">All Status</option>
          <option value="Read">Read</option>
          <option value="Unread">Unread</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Type", "Title", "Message", "Recipient", "Date", "Status", "Priority", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <tr key={n.id} className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition ${!n.read ? "bg-primary/[0.02]" : ""}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.badge}`}>
                        <Icon className="w-3 h-3" /> {n.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${!n.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{n.title}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 truncate">{n.message}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">{n.recipient}</td>
                    <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{n.date}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRead(n.id)} className="relative" title={n.read ? "Mark as unread" : "Mark as read"}>
                        <span className={`block w-2 h-2 rounded-full ${n.read ? "bg-gray-300" : "bg-primary"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${priorityColors[n.priority]}`}>{n.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => toggleRead(n.id)} className="p-1.5 rounded-lg hover:bg-primary/5 transition" title={n.read ? "Mark unread" : "Mark read"}>
                          {n.read ? <EyeOff className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-primary" />}
                        </button>
                        <button onClick={() => { setEditNotif(n); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                        <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No notifications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditNotif(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editNotif ? "Edit Notification" : "New Notification"}</h2>
              <button onClick={() => { setFormOpen(false); setEditNotif(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editNotif, ...d }); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select name="type" required defaultValue={editNotif?.type || "Booking"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    {Object.keys(typeConfig).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority *</label>
                  <select name="priority" required defaultValue={editNotif?.priority || "Medium"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input name="title" required defaultValue={editNotif?.title || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                <textarea name="message" rows={3} required defaultValue={editNotif?.message || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient *</label>
                <input name="recipient" type="email" required defaultValue={editNotif?.recipient || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditNotif(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editNotif ? "Save Changes" : "Create Notification"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Notification</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Delete <strong>{deleteTarget.title}</strong>?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
