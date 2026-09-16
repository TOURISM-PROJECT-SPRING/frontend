import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const roleColors = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  OWNER: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  USER: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const roleColor = (role) => roleColors[norm(role)] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewTarget, setViewTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getUsers();
        setUsers(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const roleName = (u) => (u.roles && u.roles[0]) || "USER";
  const roles = [...new Set(users.map(roleName))];

  const filtered = users.filter((u) => {
    const name = u.fullname || "";
    const email = u.email || "";
    const matchSearch = `${name} ${email}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(roleName(u)) === norm(filter);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading users from server...</div>;
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
                      <div className="flex items-center justify-end">
                        <button onClick={() => setViewTarget(u)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition">View</button>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
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
            <button onClick={() => setViewTarget(null)} className="w-full py-2.5 mt-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}