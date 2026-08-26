import { useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, X } from "lucide-react";

const initialUsers = [
  { id: 1, name: "Sok Dara", email: "dara@example.com", phone: "012 345 678", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?img=1", joinDate: "2024-01-15", bookings: 24 },
  { id: 2, name: "Chan Bopha", email: "bopha@example.com", phone: "015 234 567", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?img=5", joinDate: "2024-03-22", bookings: 8 },
  { id: 3, name: "Lim Visal", email: "visal@example.com", phone: "017 876 543", role: "Owner", status: "Active", avatar: "https://i.pravatar.cc/150?img=3", joinDate: "2023-11-10", bookings: 42 },
  { id: 4, name: "Keo Chantrea", email: "chantrea@example.com", phone: "098 765 432", role: "User", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=8", joinDate: "2024-06-05", bookings: 3 },
  { id: 5, name: "Pov Sreynith", email: "sreynith@example.com", phone: "086 543 210", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?img=9", joinDate: "2024-02-28", bookings: 15 },
  { id: 6, name: "Hun Many", email: "many@example.com", phone: "011 999 888", role: "Owner", status: "Suspended", avatar: "https://i.pravatar.cc/150?img=12", joinDate: "2023-08-17", bookings: 19 },
  { id: 7, name: "Sun Sophea", email: "sophea@example.com", phone: "093 456 789", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/150?img=16", joinDate: "2023-05-01", bookings: 31 },
  { id: 8, name: "Nhem Chandara", email: "chandara@example.com", phone: "070 321 654", role: "User", status: "Active", avatar: "https://i.pravatar.cc/150?img=20", joinDate: "2024-09-12", bookings: 6 },
];

const roleColors = { Admin: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400", User: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400", Owner: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" };
const statusDot = { Active: "bg-green-500", Inactive: "bg-gray-400", Suspended: "bg-red-500" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    if (editItem) {
      setUsers((prev) => prev.map((u) => (u.id === editItem.id ? { ...u, ...data } : u)));
    } else {
      setUsers((prev) => [{ ...data, id: Date.now(), avatar: `https://i.pravatar.cc/150?u=${Date.now()}`, joinDate: new Date().toISOString().split("T")[0], bookings: 0 }, ...prev]);
    }
    setFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage all registered users, roles, and permissions.</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Admin", "User", "Owner"].map((r) => (
            <button key={r} onClick={() => setFilter(r)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === r ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusDot[u.status]}`} />
                      <span className="text-gray-600 dark:text-gray-300">{u.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{u.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 dark:text-gray-500">{u.joinDate}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{u.bookings}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(u)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditItem(u); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No users found.</p></div>}
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <div className="flex items-center gap-4 mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <img src={viewTarget.avatar} alt={viewTarget.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">{viewTarget.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleColors[viewTarget.role]}`}>{viewTarget.role}</span>
                  <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${statusDot[viewTarget.status]}`} /><span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{viewTarget.status}</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Phone</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.phone}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Join Date</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.joinDate}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Total Bookings</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.bookings}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">User ID</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">#{viewTarget.id}</p></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => { setViewTarget(null); setDeleteTarget(viewTarget); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit User" : "Add New User"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400 dark:text-gray-500" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label><input name="name" type="text" required defaultValue={editItem?.name || ""} placeholder="e.g. Sok Dara" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label><input name="email" type="email" required defaultValue={editItem?.email || ""} placeholder="user@example.com" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label><input name="phone" type="text" required defaultValue={editItem?.phone || ""} placeholder="012 345 678" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label><select name="role" defaultValue={editItem?.role || "User"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Admin">Admin</option><option value="User">User</option><option value="Owner">Owner</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label><select name="status" defaultValue={editItem?.status || "Active"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Suspended">Suspended</option></select></div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editItem ? "Save Changes" : "Create User"}</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
