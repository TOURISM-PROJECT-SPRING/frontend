import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2 } from "lucide-react";

const statusColors = {
  Confirmed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Completed: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const typeColors = {
  Hotel: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  Ticket: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  Tour: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
};

const paymentColors = {
  Paid: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Refunded: "bg-orange-50 text-orange-600",
};

const initialBookings = [
  { id: "BK-001", type: "Hotel", customer: "Sarah Johnson", property: "Green Park Resort", date: "2026-08-25", checkOut: "2026-08-28", amount: "$360", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-002", type: "Ticket", customer: "Michael Chen", property: "Angkor Wat Day Pass", date: "2026-08-26", checkOut: "-", amount: "$45", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-003", type: "Tour", customer: "Emma Wilson", property: "Tonle Sap Boat Tour", date: "2026-08-27", checkOut: "-", amount: "$79", status: "Pending", paymentStatus: "Pending" },
  { id: "BK-004", type: "Food", customer: "James Park", property: "Khmer Kitchen", date: "2026-08-27", checkOut: "-", amount: "$32", status: "Pending", paymentStatus: "Pending" },
  { id: "BK-005", type: "Hotel", customer: "Lisa Nguyen", property: "Paradise Hotel", date: "2026-08-20", checkOut: "2026-08-23", amount: "$480", status: "Completed", paymentStatus: "Paid" },
  { id: "BK-006", type: "Tour", customer: "Tom Brown", property: "Angkor Sunrise Tour", date: "2026-08-22", checkOut: "-", amount: "$249", status: "Cancelled", paymentStatus: "Refunded" },
  { id: "BK-007", type: "Ticket", customer: "Ana Garcia", property: "Royal Palace Entry", date: "2026-08-28", checkOut: "-", amount: "$15", status: "Confirmed", paymentStatus: "Paid" },
  { id: "BK-008", type: "Hotel", customer: "David Kim", property: "Riverside Lodge", date: "2026-08-29", checkOut: "2026-09-01", amount: "$255", status: "Pending", paymentStatus: "Pending" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = bookings.filter((b) => {
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) || b.property.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || b.type === filterType;
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleSave = (data) => {
    if (editItem) {
      setBookings((prev) => prev.map((b) => (b.id === editItem.id ? { ...b, ...data } : b)));
    } else {
      setBookings((prev) => [{ ...data, id: `BK-${String(Date.now()).slice(-3)}` }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage all reservations and bookings</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by customer or property..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Hotel", "Ticket", "Tour", "Food"].map((t) => (
            <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterType === t ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{t}</button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">ID</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Property</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Payment</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{b.id}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${typeColors[b.type]}`}>{b.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{b.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{b.property}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{b.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{b.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${paymentColors[b.paymentStatus]}`}>{b.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(b)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" /></button>
                      <button onClick={() => { setEditItem(b); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No bookings found.</td></tr>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Details</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${typeColors[viewTarget.type]}`}>{viewTarget.type}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status]}`}>{viewTarget.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Booking ID</span><span className="font-mono font-semibold text-primary">{viewTarget.id}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Customer</span><span className="font-medium text-gray-900 dark:text-white">{viewTarget.customer}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Property</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.property}</span></div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Check-in</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.date}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Check-out</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.checkOut}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Amount</span><span className="font-bold text-gray-900 dark:text-white">{viewTarget.amount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400 dark:text-gray-500">Payment</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${paymentColors[viewTarget.paymentStatus]}`}>{viewTarget.paymentStatus}</span>
              </div>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Booking" : "New Booking"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editItem, ...d, id: editItem?.id || `BK-${String(Date.now()).slice(-3)}` }); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                  <select name="type" required defaultValue={editItem?.type || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select type</option>
                    <option>Hotel</option><option>Ticket</option><option>Tour</option><option>Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer *</label>
                  <input name="customer" required defaultValue={editItem?.customer || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property / Place *</label>
                <input name="property" required defaultValue={editItem?.property || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                  <input name="date" type="date" required defaultValue={editItem?.date || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                  <input name="checkOut" type="date" defaultValue={editItem?.checkOut === "-" ? "" : (editItem?.checkOut || "")} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD) *</label>
                  <input name="amount" required defaultValue={editItem?.amount?.replace("$", "") || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                  <select name="status" required defaultValue={editItem?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>Confirmed</option><option>Pending</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
                <select name="paymentStatus" defaultValue={editItem?.paymentStatus || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option>Paid</option><option>Pending</option><option>Refunded</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create Booking"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Booking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete booking <strong>{deleteTarget.id}</strong>? This cannot be undone.</p>
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
