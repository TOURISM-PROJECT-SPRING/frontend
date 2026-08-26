import { useState } from "react";
import { Search, Eye, Edit3, Trash2, Plus } from "lucide-react";

const statusColors = {
  Confirmed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  Completed: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const initialBookings = [
  { id: 1, guest: "Sarah Johnson", email: "sarah@email.com", property: "Green Park Resort", room: "Deluxe Suite", checkIn: "2026-08-25", checkOut: "2026-08-28", nights: 3, total: "$360", status: "Confirmed", phone: "+1 555 0123" },
  { id: 2, guest: "Michael Chen", email: "michael@email.com", property: "Paradise Hotel", room: "Ocean View", checkIn: "2026-08-26", checkOut: "2026-08-30", nights: 4, total: "$480", status: "Pending", phone: "+855 12 345 678" },
  { id: 3, guest: "Emma Wilson", email: "emma@email.com", property: "Angkor Wat Villa", room: "Private Villa", checkIn: "2026-08-22", checkOut: "2026-08-26", nights: 4, total: "$1000", status: "Completed", phone: "+44 7700 900123" },
  { id: 4, guest: "James Park", email: "james@email.com", property: "Riverside Lodge", room: "Garden Bungalow", checkIn: "2026-08-28", checkOut: "2026-08-31", nights: 3, total: "$255", status: "Confirmed", phone: "+82 10 1234 5678" },
  { id: 5, guest: "Lisa Nguyen", email: "lisa@email.com", property: "Green Park Resort", room: "Standard Room", checkIn: "2026-08-20", checkOut: "2026-08-22", nights: 2, total: "$150", status: "Cancelled", phone: "+84 90 1234 567" },
  { id: 6, guest: "Tom Brown", email: "tom@email.com", property: "Paradise Hotel", room: "Deluxe Room", checkIn: "2026-08-29", checkOut: "2026-09-02", nights: 4, total: "$520", status: "Pending", phone: "+1 555 0456" },
  { id: 7, guest: "Ana Garcia", email: "ana@email.com", property: "Angkor Wat Villa", room: "Private Villa", checkIn: "2026-09-01", checkOut: "2026-09-05", nights: 4, total: "$1000", status: "Confirmed", phone: "+34 612 345 678" },
];

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = bookings.filter((b) => {
    const matchSearch = b.guest.toLowerCase().includes(search.toLowerCase()) || b.property.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (data) => {
    if (editBooking) {
      setBookings((prev) => prev.map((b) => (b.id === editBooking.id ? { ...b, ...data } : b)));
    } else {
      setBookings((prev) => [{ ...data, id: Date.now() }, ...prev]);
    }
    setFormOpen(false);
    setEditBooking(null);
  };

  const handleDelete = () => {
    setBookings((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage all guest reservations</p>
        </div>
        <button
          onClick={() => { setEditBooking(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by guest or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Guest</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Property</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Check-in</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Check-out</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Nights</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Total</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{b.guest}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{b.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{b.property}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">{b.room}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{b.checkIn}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{b.checkOut}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{b.nights}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{b.total}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(b)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View">
                        <Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      </button>
                      <button onClick={() => { setEditBooking(b); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition" title="Edit">
                        <Edit3 className="w-3.5 h-3.5 text-primary" />
                      </button>
                      <button onClick={() => setDeleteTarget(b)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Booking Details</h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[viewTarget.status]}`}>
                {viewTarget.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Guest</span>
                <span className="font-medium text-gray-900 dark:text-white">{viewTarget.guest}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Email</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Phone</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.phone}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Property</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.property}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Room</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.room}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Check-in</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.checkIn}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Check-out</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.checkOut}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Nights</span>
                <span className="text-gray-600 dark:text-gray-300">{viewTarget.nights}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 my-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 dark:text-gray-500">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">{viewTarget.total}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setViewTarget(null); setEditBooking(viewTarget); setFormOpen(true); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setViewTarget(null)}
className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Form */}
      {formOpen && (
        <BookingForm
          booking={editBooking}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditBooking(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/15 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Booking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete the booking for <strong>{deleteTarget.guest}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm({ booking, onSave, onClose }) {
  const isEdit = !!booking;
  const statuses = ["Confirmed", "Pending", "Completed", "Cancelled"];
  const properties = ["Green Park Resort", "Paradise Hotel", "Angkor Wat Villa", "Riverside Lodge"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{isEdit ? "Edit Booking" : "New Booking"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 dark:text-gray-500">&times;</button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const d = Object.fromEntries(new FormData(e.target));
            onSave({ ...booking, ...d, id: booking?.id || Date.now() });
          }}
          className="p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guest Name *</label>
              <input name="guest" required defaultValue={booking?.guest || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input name="email" type="email" required defaultValue={booking?.email || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input name="phone" defaultValue={booking?.phone || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property *</label>
              <select name="property" required defaultValue={booking?.property || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                <option value="">Select property</option>
                {properties.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room *</label>
              <input name="room" required defaultValue={booking?.room || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in *</label>
              <input name="checkIn" type="date" required defaultValue={booking?.checkIn || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out *</label>
              <input name="checkOut" type="date" required defaultValue={booking?.checkOut || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nights</label>
              <input name="nights" type="number" min="1" defaultValue={booking?.nights || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total (USD) *</label>
              <input name="total" type="number" min="0" required defaultValue={booking?.total?.replace("$", "") || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select name="status" defaultValue={booking?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">
              {isEdit ? "Save Changes" : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
