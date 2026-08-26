import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2 } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Preparing: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Delivered: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const initialOrders = [
  { id: "FO-001", customer: "Sarah Johnson", restaurant: "Khmer Kitchen", items: "Amok Chicken x2, Fried Rice x1", total: "$32.50", status: "Pending", date: "2026-08-27", paymentMethod: "Cash" },
  { id: "FO-002", customer: "Michael Chen", restaurant: "The Foreign Correspondents' Club", items: "Grilled Beef, Fresh Salad, Iced Tea x2", total: "$45.00", status: "Preparing", date: "2026-08-27", paymentMethod: "Card" },
  { id: "FO-003", customer: "Emma Wilson", restaurant: "Bamboo Garden", items: "Pad Thai x2, Spring Rolls", total: "$28.00", status: "Delivered", date: "2026-08-26", paymentMethod: "Wallet" },
  { id: "FO-004", customer: "James Park", restaurant: "Riverside Fusion", items: "Fish Amok, Mango Sticky Rice", total: "$38.00", status: "Delivered", date: "2026-08-26", paymentMethod: "Card" },
  { id: "FO-005", customer: "Lisa Nguyen", restaurant: "Ocean Catch", items: "Grilled Squid, Coconut Soup", total: "$42.00", status: "Cancelled", date: "2026-08-25", paymentMethod: "Cash" },
  { id: "FO-006", customer: "Tom Brown", restaurant: "Street Food Heaven", items: "Lok Lak x2, Iced Coffee x3", total: "$22.00", status: "Pending", date: "2026-08-27", paymentMethod: "Wallet" },
  { id: "FO-007", customer: "Ana Garcia", restaurant: "Khmer Kitchen", items: "Kuy Teav, Fried Noodles", total: "$18.50", status: "Preparing", date: "2026-08-27", paymentMethod: "Card" },
  { id: "FO-008", customer: "David Kim", restaurant: "Bamboo Garden", items: "Green Curry, Jasmine Rice, Mango Smoothie", total: "$35.00", status: "Delivered", date: "2026-08-25", paymentMethod: "Cash" },
];

export default function AdminFoodOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.restaurant.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (data) => {
    if (editItem) {
      setOrders((prev) => prev.map((o) => (o.id === editItem.id ? { ...o, ...data } : o)));
    } else {
      setOrders((prev) => [{ ...data, id: `FO-${String(Date.now()).slice(-3)}` }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food & Orders</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage restaurant orders and deliveries</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by customer or restaurant..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Preparing", "Delivered", "Cancelled"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Order ID</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Restaurant</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Items</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Total</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Payment</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{o.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{o.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{o.restaurant}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-[200px] truncate">{o.items}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{o.total}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{o.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(o)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /></button>
                      <button onClick={() => { setEditItem(o); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(o)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No orders found.</td></tr>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Order ID</span><span className="font-mono font-semibold text-primary">{viewTarget.id}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Customer</span><span className="font-medium text-gray-900 dark:text-white">{viewTarget.customer}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Restaurant</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.restaurant}</span></div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="text-sm"><span className="text-gray-400 dark:text-gray-500">Items</span><p className="text-gray-600 dark:text-gray-300 mt-1">{viewTarget.items}</p></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Total</span><span className="font-bold text-gray-900 dark:text-white">{viewTarget.total}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Payment</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.paymentMethod}</span></div>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Order" : "New Order"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editItem, ...d, id: editItem?.id || `FO-${String(Date.now()).slice(-3)}` }); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                  <input name="customer" required defaultValue={editItem?.customer || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant *</label>
                  <select name="restaurant" required defaultValue={editItem?.restaurant || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select restaurant</option>
                    <option>Khmer Kitchen</option><option>The Foreign Correspondents' Club</option><option>Bamboo Garden</option><option>Riverside Fusion</option><option>Ocean Catch</option><option>Street Food Heaven</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items *</label>
                <textarea name="items" rows={3} required defaultValue={editItem?.items || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total (USD) *</label>
                  <input name="total" required defaultValue={editItem?.total?.replace("$", "") || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method *</label>
                  <select name="paymentMethod" required defaultValue={editItem?.paymentMethod || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select method</option>
                    <option>Cash</option><option>Card</option><option>Wallet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editItem?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Pending</option><option>Preparing</option><option>Delivered</option><option>Cancelled</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Order"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Order</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete order <strong>{deleteTarget.id}</strong>? This cannot be undone.</p>
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
