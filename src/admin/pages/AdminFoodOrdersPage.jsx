import { useEffect, useState } from "react";
import { Search, Eye, Edit3, Trash2, Loader2 } from "lucide-react";
import { orderService } from "../../services/orderService";
import { withTimeout } from "../../utils/helpers";
import { useToast } from "../../components/ui/Toast";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  CONFIRMED: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  PREPARING: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  READY: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  COMPLETED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  CANCELLED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const STATUSES = ["DRAFT", "PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

const formatItems = (items) =>
  Array.isArray(items) && items.length
    ? items.map((i) => `${i.foodName || "Item"}${i.quantity ? ` x${i.quantity}` : ""}`).join(", ")
    : "N/A";

const formatDate = (iso) => {
  if (!iso) return "N/A";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatMoney = (v) => `$${Number(v || 0).toFixed(2)}`;

export default function AdminFoodOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [statusDraft, setStatusDraft] = useState("PENDING");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await withTimeout(orderService.getAllOrders());
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = orders.filter((o) => {
    const haystack = `${o.userName || ""} ${o.restaurantName || ""}`.toLowerCase();
    const matchSearch = haystack.includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const openEdit = (order) => {
    setViewTarget(null);
    setEditItem(order);
    setStatusDraft(order.status || "PENDING");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await orderService.updateOrderStatus(editItem.id, statusDraft);
      setOrders((prev) => prev.map((o) => (o.id === editItem.id ? { ...o, status: statusDraft } : o)));
      toast.success("Order status updated");
      setEditItem(null);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await orderService.deleteOrder(deleteTarget.id);
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      toast.success("Order deleted");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading data from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food & Orders</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage restaurant orders and deliveries</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by customer or restaurant..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
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
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{o.id ?? "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{o.userName || "Guest"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{o.restaurantName || "N/A"}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">{formatItems(o.items)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatMoney(o.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[o.status] || statusColors.DRAFT}`}>{o.status || "DRAFT"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(o)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(o)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scalein">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status] || statusColors.DRAFT}`}>{viewTarget.status || "DRAFT"}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Order ID</span><span className="font-mono font-semibold text-primary">{viewTarget.id ?? "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Customer</span><span className="font-medium text-gray-900 dark:text-white">{viewTarget.userName || "Guest"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Restaurant</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.restaurantName || "N/A"}</span></div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="text-sm"><span className="text-gray-400">Items</span><p className="text-gray-600 dark:text-gray-300 mt-1">{formatItems(viewTarget.items)}</p></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span className="font-bold text-gray-900 dark:text-white">{formatMoney(viewTarget.totalPrice)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Pickup Time</span><span className="text-gray-600 dark:text-gray-300">{formatDate(viewTarget.pickupTime)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Created</span><span className="text-gray-600 dark:text-gray-300">{formatDate(viewTarget.createdAt)}</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => openEdit(viewTarget)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Update Status</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setEditItem(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scalein">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order #{editItem.id}</h2>
              <button onClick={() => setEditItem(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setEditItem(null)} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scalein">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Order</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete order <strong>{deleteTarget.id}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">{deleting && <Loader2 className="w-4 h-4 animate-spin" />}Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
