import { useEffect, useState, useMemo } from "react";
import { Search, ShoppingBag, Eye, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { orderService } from "../../services/orderService";
import { restaurantService } from "../../services/restaurantService";
import { formatPrice } from "../../utils/helpers";

export default function OwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const [orderList, restList] = await Promise.all([
        orderService.getAllOrders().catch(() => []),
        restaurantService.getAllRestaurants().catch(() => []),
      ]);
      setOrders(orderList || []);
      setRestaurants(restList || []);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "ALL" && (o.status || "").toUpperCase() !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const text = `${o.id} ${o.customerName || o.userName || ""} ${o.restaurantName || ""}`.toLowerCase();
        return text.includes(q);
      }
      return true;
    });
  }, [orders, statusFilter, search]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Restaurant Orders
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Food Orders Hub</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Track dining customer orders, preparation status, and invoices</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar w-full sm:w-auto bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
          {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? "bg-amber-600 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Restaurant</th>
                <th className="px-5 py-4">Items / Details</th>
                <th className="px-5 py-4">Total Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                  <td className="px-5 py-4 font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    #FD-{String(order.id).padStart(5, "0")}
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                    {order.customerName || order.userName || "Guest Patron"}
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                    {order.restaurantName || "My Restaurant"}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    {order.orderItems?.length || 1} item(s)
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900 dark:text-white">
                    {formatPrice(order.totalAmount || order.amount || 0)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : order.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {order.status || "PENDING"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs font-medium transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 px-4">
            <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">No food orders found</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Orders placed by dining customers will show up here.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  #FD-{String(selectedOrder.id).padStart(5, "0")}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Order Details</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Customer</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.customerName || selectedOrder.userName || "Guest"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Restaurant</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedOrder.restaurantName || "Restaurant"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                <span className="text-gray-400 text-xs">Total Amount</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-base">{formatPrice(selectedOrder.totalAmount || selectedOrder.amount || 0)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400 text-xs">Current Status</span>
                <span className="font-bold uppercase text-xs">{selectedOrder.status || "PENDING"}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, "CONFIRMED")}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Confirm Order
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, "COMPLETED")}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Complete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
