import { useState } from "react";
import { Plus, Tag, Percent, TrendingUp, Edit3, Trash2, Copy, Search } from "lucide-react";

const statusColors = { Active: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400", Expired: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500", Scheduled: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" };

const initialPromos = [
  { id: 1, code: "WELCOME20", description: "Welcome discount for new guests", discount: 20, type: "Percentage", minBooking: "$100", usage: 156, maxUsage: 500, startDate: "2026-08-01", endDate: "2026-09-30", status: "Active" },
  { id: 2, code: "SUMMER50", description: "Summer season special", discount: 50, type: "Fixed", minBooking: "$200", usage: 89, maxUsage: 200, startDate: "2026-06-01", endDate: "2026-08-31", status: "Active" },
  { id: 3, code: "EARLYBIRD", description: "Early booking discount", discount: 15, type: "Percentage", minBooking: "$150", usage: 234, maxUsage: 300, startDate: "2026-07-01", endDate: "2026-08-15", status: "Expired" },
  { id: 4, code: "LOYALTY30", description: "Loyalty member exclusive", discount: 30, type: "Percentage", minBooking: "$200", usage: 45, maxUsage: 100, startDate: "2026-09-01", endDate: "2026-12-31", status: "Scheduled" },
  { id: 5, code: "FLASH100", description: "24-hour flash sale", discount: 100, type: "Fixed", minBooking: "$300", usage: 0, maxUsage: 50, startDate: "2026-09-15", endDate: "2026-09-16", status: "Scheduled" },
  { id: 6, code: "REFER25", description: "Referral bonus for inviting friends", discount: 25, type: "Percentage", minBooking: "$120", usage: 312, maxUsage: 400, startDate: "2026-07-01", endDate: "2026-10-31", status: "Active" },
];

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState(initialPromos);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const filtered = promos
    .filter((p) => filter === "All" || p.status === filter)
    .filter((p) => p.code.toLowerCase().includes(search.toLowerCase()));

  const activeCount = promos.filter((p) => p.status === "Active").length;
  const totalUses = promos.reduce((s, p) => s + p.usage, 0);
  const conversionRate = Math.round((totalUses / promos.reduce((s, p) => s + p.maxUsage, 0)) * 100);

  const handleSave = (data) => {
    const d = { ...data, discount: Number(data.discount), maxUsage: Number(data.maxUsage), usage: editPromo?.usage || 0 };
    if (editPromo) {
      setPromos((prev) => prev.map((p) => (p.id === editPromo.id ? { ...p, ...d } : p)));
    } else {
      setPromos((prev) => [{ ...d, id: Date.now(), status: "Active" }, ...prev]);
    }
    setFormOpen(false);
    setEditPromo(null);
  };

  const handleDelete = () => {
    setPromos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotions</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage discount codes and special offers</p>
        </div>
        <button
          onClick={() => { setEditPromo(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center"><Tag className="w-5 h-5 text-primary" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active</p><p className="text-lg font-bold text-gray-900 dark:text-white">{activeCount}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Percent className="w-5 h-5 text-green-500" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Uses</p><p className="text-lg font-bold text-gray-900 dark:text-white">{totalUses.toLocaleString()}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-orange-500" /></div>
          <div><p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Conversion</p><p className="text-lg font-bold text-gray-900 dark:text-white">{conversionRate}%</p></div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        {["All", "Active", "Expired", "Scheduled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Code", "Discount", "Min. Booking", "Usage", "Date Range", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800">{p.code}</code>
                      <button onClick={() => copyCode(p.code, p.id)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition" title="Copy code">
                        <Copy className={`w-3 h-3 ${copiedId === p.id ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-primary">{p.discount}{p.type === "Percentage" ? "%" : "$"}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">off</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{p.minBooking}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full" style={{ width: `${(p.usage / p.maxUsage) * 100}%` }} /></div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{p.usage}/{p.maxUsage}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{p.startDate} to {p.endDate}</td>
                  <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditPromo(p); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
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
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditPromo(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editPromo ? "Edit Promotion" : "New Promotion"}</h2>
              <button onClick={() => { setFormOpen(false); setEditPromo(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editPromo, ...d }); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Promo Code *</label>
                <input name="code" required defaultValue={editPromo?.code || ""} placeholder="e.g. SUMMER50" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input name="description" defaultValue={editPromo?.description || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount *</label>
                  <input name="discount" type="number" min="1" required defaultValue={editPromo?.discount || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select name="type" required defaultValue={editPromo?.type || "Percentage"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>Percentage</option><option>Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min. Booking *</label>
                  <input name="minBooking" required defaultValue={editPromo?.minBooking || ""} placeholder="$100" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Usage *</label>
                  <input name="maxUsage" type="number" min="1" required defaultValue={editPromo?.maxUsage || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                  <input name="startDate" type="date" required defaultValue={editPromo?.startDate || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                  <input name="endDate" type="date" required defaultValue={editPromo?.endDate || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                <select name="status" required defaultValue={editPromo?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Active</option><option>Expired</option><option>Scheduled</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditPromo(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editPromo ? "Save Changes" : "Create Promotion"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Promotion</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Delete promo code <strong>{deleteTarget.code}</strong>?</p>
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
