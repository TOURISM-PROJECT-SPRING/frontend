import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, DollarSign, Clock, RotateCcw, AlertTriangle } from "lucide-react";

const statusColors = {
  Completed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Failed: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  Refunded: "bg-orange-50 text-orange-600",
};

const initialPayments = [
  { id: "TX-001", transactionId: "TRX-20260827-001", customer: "Sarah Johnson", type: "Booking", amount: "$360.00", method: "Credit Card", status: "Completed", date: "2026-08-27" },
  { id: "TX-002", transactionId: "TRX-20260827-002", customer: "Michael Chen", type: "Booking", amount: "$149.00", method: "Wallet", status: "Completed", date: "2026-08-27" },
  { id: "TX-003", transactionId: "TRX-20260826-003", customer: "Emma Wilson", type: "Promotion", amount: "$25.00", method: "Credit Card", status: "Pending", date: "2026-08-26" },
  { id: "TX-004", transactionId: "TRX-20260826-004", customer: "James Park", type: "Booking", amount: "$399.00", method: "Bank Transfer", status: "Failed", date: "2026-08-26" },
  { id: "TX-005", transactionId: "TRX-20260825-005", customer: "Lisa Nguyen", type: "Refund", amount: "$480.00", method: "Credit Card", status: "Refunded", date: "2026-08-25" },
  { id: "TX-006", transactionId: "TRX-20260825-006", customer: "Tom Brown", type: "Booking", amount: "$249.00", method: "Cash", status: "Completed", date: "2026-08-25" },
  { id: "TX-007", transactionId: "TRX-20260824-007", customer: "Ana Garcia", type: "Booking", amount: "$79.00", method: "Wallet", status: "Pending", date: "2026-08-24" },
  { id: "TX-008", transactionId: "TRX-20260823-008", customer: "David Kim", type: "Promotion", amount: "$50.00", method: "Bank Transfer", status: "Completed", date: "2026-08-23" },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = payments.filter((p) => {
    const matchSearch = p.transactionId.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchMethod = filterMethod === "All" || p.method === filterMethod;
    return matchSearch && matchStatus && matchMethod;
  });

  const totalRevenue = payments.filter((p) => p.status === "Completed").reduce((sum, p) => sum + parseFloat(p.amount.replace("$", "")), 0);
  const pendingAmount = payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + parseFloat(p.amount.replace("$", "")), 0);
  const refundAmount = payments.filter((p) => p.status === "Refunded").reduce((sum, p) => sum + parseFloat(p.amount.replace("$", "")), 0);
  const failedAmount = payments.filter((p) => p.status === "Failed").reduce((sum, p) => sum + parseFloat(p.amount.replace("$", "")), 0);

  const handleSave = (data) => {
    if (editItem) {
      setPayments((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
    } else {
      setPayments((prev) => [{ ...data, id: `TX-${String(Date.now()).slice(-3)}`, transactionId: `TRX-${Date.now()}` }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setPayments((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage transactions and payment records</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> New Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-500" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${pendingAmount.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-500" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Refunds</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${refundAmount.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><RotateCcw className="w-5 h-5 text-orange-500" /></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${failedAmount.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by transaction ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Completed", "Pending", "Failed", "Refunded"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Credit Card", "Wallet", "Bank Transfer", "Cash"].map((m) => (
            <button key={m} onClick={() => setFilterMethod(m)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterMethod === m ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{m}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Transaction ID</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Method</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-[11px] font-mono text-primary">{p.transactionId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{p.type}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{p.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /></button>
                      <button onClick={() => { setEditItem(p); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Details</h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Transaction ID</span><span className="font-mono text-primary text-[11px]">{viewTarget.transactionId}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Customer</span><span className="font-medium text-gray-900 dark:text-white">{viewTarget.customer}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Type</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.type}</span></div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Amount</span><span className="font-bold text-gray-900 dark:text-white">{viewTarget.amount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Method</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.method}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Date</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.date}</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Transaction" : "New Transaction"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editItem, ...d, id: editItem?.id || `TX-${String(Date.now()).slice(-3)}` }); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                <input name="customer" required defaultValue={editItem?.customer || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select name="type" required defaultValue={editItem?.type || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select type</option>
                    <option>Booking</option><option>Promotion</option><option>Refund</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD) *</label>
                  <input name="amount" required defaultValue={editItem?.amount?.replace("$", "") || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method *</label>
                  <select name="method" required defaultValue={editItem?.method || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select method</option>
                    <option>Credit Card</option><option>Wallet</option><option>Bank Transfer</option><option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                  <select name="status" required defaultValue={editItem?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>Completed</option><option>Pending</option><option>Failed</option><option>Refunded</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Transaction"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Transaction</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete transaction <strong>{deleteTarget.transactionId}</strong>? This cannot be undone.</p>
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
