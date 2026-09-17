import { useEffect, useState } from "react";
import { Search, X, Eye, Edit3, Trash2, Loader2 } from "lucide-react";
import { managementService } from "../../services/managementService";
import { withTimeout } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";

const norm = (s) => String(s || "").toUpperCase();

const roleColors = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  OWNER: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  USER: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  TOURIST: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const roleColor = (role) => roleColors[norm(role)] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

const ROLE_OPTIONS = ["ADMIN", "OWNER", "TOURIST"];

const ROLE_NAMES = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  TOURIST: "TOURIST",
};

export default function AdminUsersPage() {
  const toast = useToast();
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewTarget, setViewTarget] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await withTimeout(managementService.getUsers());
        setUsers(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setFetchError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roleName = (u) => (u.roles && u.roles[0]) || "USER";
  const roles = [...new Set(users.map(roleName))];
  const isSelf = (u) => u?.id != null && userId != null && u.id === userId;

  const filtered = users.filter((u) => {
    const name = u.fullname || "";
    const email = u.email || "";
    const matchSearch = `${name} ${email}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(roleName(u)) === norm(filter);
    return matchSearch && matchFilter;
  });

  const handleSave = async (data) => {
    if (isSelf(editItem) && norm(data.role || ROLE_NAMES.TOURIST) !== "ADMIN") {
      toast.error("You cannot change your own admin role.");
      return;
    }
    setSaving(true);
    try {
      const updated = await managementService.updateUser(editItem.id, {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        gender: data.gender || "Male",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth || null,
        status: data.status || "Online",
        roles: [data.role || ROLE_NAMES.TOURIST],
      });
      setUsers((prev) => prev.map((u) => (u.id === editItem.id ? updated : u)));
      setFormOpen(false);
      setEditItem(null);
      toast.success("User updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isSelf(deleteTarget)) {
      toast.error("You cannot delete your own account.");
      setDeleteTarget(null);
      return;
    }
    setDeleting(true);
    try {
      await managementService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("User deleted");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (u) => {
    setViewTarget(null);
    setEditItem(u);
    setFormOpen(true);
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading users from server...</div>;
  }

  if (fetchError && users.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-red-500">Could not load users from the server.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All registered users, roles, and permissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary transition"
        >
          <option value="All">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Username</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Address</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const role = roleName(u);
                const online = norm(u.status) === "ONLINE";
                return (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={`https://i.pravatar.cc/100?u=${u.id}`} alt={u.fullname || u.username} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{u.fullname || "N/A"}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{u.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColor(role)}`}>{role}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-gray-400"}`} />
                        <span className="text-gray-600 dark:text-gray-300">{u.status || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{u.username || "N/A"}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{u.address || "N/A"}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{u.createdAt ? u.createdAt.slice(0, 10) : "N/A"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTarget(u)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={isSelf(u)}
                          title={isSelf(u) ? "You cannot delete your own account" : "Delete user"}
                          className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent"
                        ><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12"><p className="text-sm text-gray-400 dark:text-gray-500">No users found.</p></div>}
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scalein">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex items-center gap-4 mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <img src={`https://i.pravatar.cc/100?u=${viewTarget.id}`} alt={viewTarget.fullname || viewTarget.username} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.fullname || "N/A"}</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">{viewTarget.email || "N/A"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleColor(roleName(viewTarget))}`}>{roleName(viewTarget)}</span>
                  <span className={`flex items-center gap-1 text-xs ${norm(viewTarget.status) === "ONLINE" ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    <span className={`w-2 h-2 rounded-full ${norm(viewTarget.status) === "ONLINE" ? "bg-green-500" : "bg-gray-400"}`} />
                    {viewTarget.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Username</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.username || "N/A"}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Gender</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.gender || "N/A"}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">Date of Birth</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{viewTarget.dateOfBirth ? viewTarget.dateOfBirth.slice(0, 10) : "N/A"}</p></div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"><p className="text-xs text-gray-400 dark:text-gray-500">User ID</p><p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">#{viewTarget.id}</p></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Address</span><span className="text-gray-600 dark:text-gray-300 text-right">{viewTarget.address || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Roles</span><span className="text-gray-600 dark:text-gray-300">{(viewTarget.roles && viewTarget.roles.join(", ")) || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Join Date</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.createdAt ? viewTarget.createdAt.slice(0, 10) : "N/A"}</span></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => openEdit(viewTarget)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scalein">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit User</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input name="fullname" required defaultValue={editItem.fullname || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username *</label>
                  <input name="username" required defaultValue={editItem.username || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input name="email" type="email" required defaultValue={editItem.email || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                  <select name="gender" defaultValue={editItem.gender || "Male"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                  <input name="dateOfBirth" type="date" defaultValue={editItem.dateOfBirth ? editItem.dateOfBirth.slice(0, 10) : ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input name="address" defaultValue={editItem.address || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select name="status" defaultValue={editItem.status || "Online"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option>Online</option>
                    <option>Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                  {isSelf(editItem) ? (
                    <>
                      <input type="hidden" name="role" value="ADMIN" />
                      <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed">ADMIN (locked)</div>
                    </>
                  ) : (
                    <select name="role" defaultValue={roleName(editItem)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                      {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      {roleName(editItem) && !ROLE_OPTIONS.includes(norm(roleName(editItem))) && <option value={roleName(editItem)}>{roleName(editItem)}</option>}
                    </select>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.fullname || deleteTarget.username}</strong>? This cannot be undone.</p>
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