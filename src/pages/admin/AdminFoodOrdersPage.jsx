import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2 } from "lucide-react";
import { orderService } from "../../services/orderService";
import { useToast } from "../../components/ui/Toast";

const statusColors = {
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Confirmed: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Preparing: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Completed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Delivered: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const titleCase = (s) => {
  const str = String(s || "");
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
};

const money = (v) => `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const toOrderRow = (o) => ({
  ...o,
  id: o.id,
  customer: o.userName || "Guest",
  restaurant: o.restaurantName || "N/A",
  items: Array.isArray(o.items) ? o.items.join(", ") : o.items || "N/A",
  total: money(o.totalPrice),
  status: titleCase(o.status),
  date: formatDate(o.createdAt || o.pickupTime),
});

export default function AdminFoodOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders((data || []).map(toOrderRow));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const customerName = o.customer || o.name || "";
    const restaurantName = o.restaurant || "";
    const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) || restaurantName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (o.status || "").toUpperCase() === filter.toUpperCase();
    return matchSearch && matchFilter;
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (data) => {
    if (editItem) {
      setOrders((prev) => prev.map((o) => (o.id === editItem.id ? { ...o, ...data } : o)));
      toast.success("Order updated successfully");
    } else {
      setOrders((prev) => [{ ...data, id: `FO-${String(Date.now()).slice(-3)}` }, ...prev]);
      toast.success("Order created successfully");
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Order deleted successfully");
  };

  if (loading) return <AdminLoading message="Loading food orders from the server..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food &amp; Orders</h1>
            <TotalBadge count={orders.length} />
          </div>
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
          <input type="text" placeholder="Search by customer or restaurant..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setCurrentPage(1); }} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
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
              {paginatedItems.map((o) => (
                <tr key={o.id || o.name} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{o.id || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{o.customer || o.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{o.restaurant || "N/A"}</td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{o.items || "N/A"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{o.total || o.price || "0.00"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>{o.status || "Pending"}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{o.date || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{o.paymentMethod || "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(o)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => { setEditItem(o); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(o)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-sm text-gray-400">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={currentPage} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} itemLabel="orders" />
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status] || "bg-gray-100 text-gray-600"}`}>{viewTarget.status || "Pending"}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Order ID</span><span className="font-mono font-semibold text-primary">{viewTarget.id || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Customer</span><span className="font-medium text-gray-900 dark:text-white">{viewTarget.customer || viewTarget.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Restaurant</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.restaurant || "N/A"}</span></div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="text-sm"><span className="text-gray-400">Items</span><p className="text-gray-600 dark:text-gray-300 mt-1">{viewTarget.items || "N/A"}</p></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span className="font-bold text-gray-900 dark:text-white">{viewTarget.total || viewTarget.price || "0.00"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Payment</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.paymentMethod || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Date</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.date || "N/A"}</span></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
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
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editItem, ...d, id: editItem?.id || `FO-${String(Date.now()).slice(-3)}` }); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                  <input name="customer" required defaultValue={editItem?.customer || editItem?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant *</label>
                  <select name="restaurant" required defaultValue={editItem?.restaurant || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select restaurant</option>
                    <option>Khmer Kitchen</option><option>The Foreign Correspondents' Club</option><option>Bamboo Garden</option><option>Riverside Fusion</option><option>Ocean Catch</option><option>Street Food Heaven</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items *</label>
                <textarea name="items" rows={3} required defaultValue={editItem?.items || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total (USD) *</label>
                  <input name="total" required defaultValue={editItem?.total?.replace("$", "") || editItem?.price || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method *</label>
                  <select name="paymentMethod" required defaultValue={editItem?.paymentMethod || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select method</option>
                    <option>Cash</option><option>Card</option><option>Wallet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" defaultValue={editItem?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Pending</option><option>Preparing</option><option>Delivered</option><option>Cancelled</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete order <strong>{deleteTarget.id}</strong>? This cannot be undone.</p>
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