import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import { useEffect, useState } from "react";
import {
  Search,
  X,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle,
  Check,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { managementService } from "../../services/managementService";
import { userAttachmentService } from "../../services/userAttachmentService";
import AvatarUpload from "../../components/ui/AvatarUpload";
import { useToast } from "../../components/ui/Toast";
import { AUTH_USER_STORAGE_KEY } from "../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";
import { setOwnerRoleOverride } from "../../utils/rbac";

const norm = (s) => String(s || "").toUpperCase();

// Network / backend-down / 5xx, or a missing route (404), is treated as
// "offline" so the demo fallback stays usable. Any other status (400/401/403)
// is a genuine rejection and must surface to the user instead of silently
// pretending the edit succeeded.
const shouldDemoFallback = (e) => {
  if (!e) return false;
  if (e.request && !e.response) return true;
  const status = e.response?.status;
  if (status == null) return true;
  return status === 404 || status >= 500;
};

// If the edited account is the one currently signed in, write the change
// through to the session so every open tab (owner dashboard included) reflects
// the new role immediately — even when the backend is offline.
const syncSignedInSession = (editedUser, updates) => {
  try {
    setOwnerRoleOverride(editedUser, updates.roles?.[0] || editedUser.role || null);
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return;
    const current = JSON.parse(raw);
    if (current && String(current.id) === String(editedUser.id)) {
      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        JSON.stringify({ ...current, ...updates, roles: updates.roles || current.roles })
      );
    }
  } catch {}
};

const roleColors = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  OWNER: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  USER: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const roleColor = (role) =>
  roleColors[norm(role)] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

const ROLE_LABELS = {
  ADMIN: "ADMIN (System Administrator)",
  SUPEROWNER: "SUPEROWNER (All Verticals)",
  OWNER: "OWNER (Hotel/Restaurant/Tour Partner)",
  OWNER_HOTEL: "OWNER_HOTEL (Hotel Only)",
  OWNER_TOUR: "OWNER_TOUR (Tour Only)",
  OWNER_RESTAURANT: "OWNER_RESTAURANT (Restaurant Only)",
  USER: "USER (Customer / Tourist)",
  TOURIST: "TOURIST (Customer / Tourist)",
};

// Owner-like roles get a Business Access selector below. Scoped roles are
// pinned to one vertical; generic OWNER / SUPEROWNER allow up to two / three.
const OWNER_LIKE_ROLES = ["OWNER", "SUPEROWNER", "OWNER_HOTEL", "OWNER_TOUR", "OWNER_RESTAURANT"];

// Legacy/typo'd role rows that still exist in the DB but should not be offered
// in the Platform Role dropdown.
const HIDDEN_ROLES = new Set(["SUPER_OWNER", "OWNER_RESTUARANT"]);

const OWNER_BIZ_OPTIONS = [
  { id: "hotel", label: "Hotel & Stays" },
  { id: "restaurant", label: "Restaurant & Dining" },
  { id: "tour", label: "Tourist & Tours" },
];

const OWNER_ROLE_BIZ_SUGGEST = {
  SUPEROWNER: ["hotel", "restaurant", "tour"],
  OWNER_HOTEL: ["hotel"],
  OWNER_TOUR: ["tour"],
  OWNER_RESTAURANT: ["restaurant"],
};

const normalizeBiz = (list) =>
  [...new Set((list || []).map(String).map((b) => b.toLowerCase()).filter((b) =>
    ["hotel", "restaurant", "tour"].includes(b)
  ))];

export default function AdminUsersPage() {
  const toast = useToast();
  const { markReloginForUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Modals state
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    gender: "Male",
    status: "ACTIVE",
    role: "USER",
    assignedBusinesses: [],
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [existingAvatar, setExistingAvatar] = useState([]);

  const loadRoles = async () => {
    try {
      const roleData = await managementService.getRoles();
      const names = (roleData || [])
        .map((r) => (typeof r === "string" ? r : r?.name))
        .filter(Boolean)
        .map((n) => String(n).toUpperCase())
        .filter((n) => !HIDDEN_ROLES.has(n));
      setRoleOptions(names.length ? [...new Set(names)] : ["ADMIN", "OWNER", "USER"]);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoleOptions((prev) => (prev.length ? prev : ["ADMIN", "OWNER", "USER"]));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await managementService.getUsers();
        setUsers(userData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchData();
    loadRoles();
  }, []);

  const roleName = (u) => (u.roles && u.roles[0]) || "USER";
  const roles = [...new Set([...roleOptions, ...users.map(roleName)].filter(Boolean))];

  const filtered = users.filter((u) => {
    const name = u.fullname || "";
    const email = u.email || "";
    const username = u.username || "";
    const matchSearch = `${name} ${email} ${username}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || norm(roleName(u)) === norm(filter);
    return matchSearch && matchFilter;
  });

  // Pagination states & calculations
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (safeCurrentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (safeCurrentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages);
    }
    return pages;
  };

  // Open Edit Modal
  const handleOpenEdit = async (u) => {
    setEditTarget(u);
    setAvatarFile(null);
    setExistingAvatar([]);
    setEditForm({
      fullname: u.fullname || "",
      email: u.email || "",
      username: u.username || "",
      phone: u.phone || u.phoneNumber || "",
      address: u.address || "",
      gender: u.gender || "Male",
      status: u.status || "ACTIVE",
      role: (u.roles && u.roles[0]) || "USER",
      assignedBusinesses:
        normalizeBiz(u.assignedBusinesses).length > 0
          ? normalizeBiz(u.assignedBusinesses)
          : OWNER_ROLE_BIZ_SUGGEST[u.role || (u.roles && u.roles[0])] || [],
    });
    loadRoles();
    const attachments = await userAttachmentService.getUserAttachments(u.id).catch(() => []);
    setExistingAvatar(
      (attachments || []).map((a) => ({ id: a.id, url: a.cloudinaryUrl }))
    );
  };

  const handleRemoveExistingAvatar = async (image) => {
    if (!editTarget) return;
    try {
      await userAttachmentService.deleteUserAttachment(editTarget.id, image.id);
      setExistingAvatar((prev) => prev.filter((img) => img.id !== image.id));
      setUsers((prev) =>
        prev.map((u) => (u.id === editTarget.id ? { ...u, imageUrl: undefined } : u))
      );
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  // Save Edit Handler
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    let uploadedUrl = null;
    try {
      if (avatarFile) {
        const uploaded = await userAttachmentService.uploadUserAttachment(
          editTarget.id,
          avatarFile,
          "PROFILE"
        );
        uploadedUrl = uploaded?.[0]?.cloudinaryUrl || null;
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Profile photo upload failed. Saving other changes.");
    }
    try {
      const isOwnerLike = OWNER_LIKE_ROLES.includes(editForm.role);
      const patch = {
        ...editForm,
        roles: [editForm.role],
        ...(isOwnerLike ? { assignedBusinesses: normalizeBiz(editForm.assignedBusinesses) } : {}),
      };
      await managementService.updateUser(editTarget.id, patch);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editTarget.id
            ? { ...u, ...patch, imageUrl: uploadedUrl ?? u.imageUrl }
            : u
        )
      );
      setEditTarget(null);
      toast.success("User updated successfully");
      const prevRole = editTarget.roles?.[0] || editTarget.role;
      const nextRole = patch.roles?.[0];
      if (nextRole && nextRole !== prevRole) {
        // A role change invalidates the account's existing session: close it in
        // every open tab and send it to the login page (this tab included) so the
        // user re-authenticates and picks up the new role from the backend.
        markReloginForUser(editTarget);
      } else {
        syncSignedInSession(editTarget, patch);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const offline = shouldDemoFallback(error);
      if (!offline) {
        toast.error(error?.response?.data?.message || "Failed to update user. Please try again.");
        return;
      }
      // Optimistic update fallback so demo / offline mock works smoothly
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editTarget.id
            ? { ...u, ...editForm, roles: [editForm.role], imageUrl: uploadedUrl ?? u.imageUrl }
            : u
        )
      );
      setEditTarget(null);
      toast.success("User updated (offline mode)");
      syncSignedInSession(editTarget, { ...editForm, roles: [editForm.role] });
    } finally {
      setSaving(false);
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await managementService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      // Fallback: update local list
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("User deleted (offline mode)");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading users from the server..." />;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
          <TotalBadge count={users.length} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          All registered users, roles, and administrative permissions
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="All">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => {
                const role = roleName(u);
                const online = norm(u.status) === "ONLINE" || norm(u.status) === "ACTIVE";
                return (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.imageUrl || `https://i.pravatar.cc/100?u=${u.id}`}
                          alt={u.fullname || u.username}
                          className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{u.fullname || "N/A"}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{u.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColor(role)}`}>
                        {role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${online ? "bg-green-500" : "bg-gray-400"}`} />
                        <span className="text-gray-600 dark:text-gray-300 font-medium text-xs">
                          {u.status || "ACTIVE"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{u.username || "N/A"}</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                      {u.address || "N/A"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">
                      {u.createdAt ? u.createdAt.slice(0, 10) : "N/A"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewTarget(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#1b3b2b] hover:bg-[#edf5f0] dark:hover:text-emerald-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          <span>View</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 transition cursor-pointer"
                          title="Edit User"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 dark:text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            {/* Left: Info & Per-Page Selector */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing <strong className="text-gray-900 dark:text-white font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">{endIndex}</strong> of{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">{totalItems}</strong> users
              </span>
              <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary transition cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Right: Page Navigation Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 select-none">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 mx-1">
                  {getPageNumbers().map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-gray-400 dark:text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[28px] h-7 px-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
                          safeCurrentPage === p
                            ? "bg-[#1b3b2b] text-white shadow-xs font-bold dark:bg-emerald-700"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safeCurrentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* VIEW USER MODAL */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Details</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Profile and account details</p>
              </div>
              <button
                onClick={() => setViewTarget(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-5 pb-5 border-b border-gray-100 dark:border-gray-800">
              <img
                src={viewTarget.imageUrl || `https://i.pravatar.cc/100?u=${viewTarget.id}`}
                alt={viewTarget.fullname || viewTarget.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#1b3b2b]/20 dark:border-emerald-500/20"
              />
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {viewTarget.fullname || "N/A"}
                </h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">{viewTarget.email || "N/A"}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${roleColor(roleName(viewTarget))}`}>
                    {roleName(viewTarget)}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      norm(viewTarget.status) === "ONLINE" || norm(viewTarget.status) === "ACTIVE"
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        norm(viewTarget.status) === "ONLINE" || norm(viewTarget.status) === "ACTIVE"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    {viewTarget.status || "ACTIVE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Username
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {viewTarget.username || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {viewTarget.phone || viewTarget.phoneNumber || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> User ID
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  #{viewTarget.id}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Join Date
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {viewTarget.createdAt ? viewTarget.createdAt.slice(0, 10) : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 p-3.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-gray-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5" /> Address
                </span>
                <span className="text-gray-700 dark:text-gray-200 text-right font-medium">
                  {viewTarget.address || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {viewTarget.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Granted Roles
                </span>
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {(viewTarget.roles && viewTarget.roles.join(", ")) || "USER"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  handleOpenEdit(target);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="py-2.5 px-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Edit User Account
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Update profile information, role assignment, and status
                </p>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <AvatarUpload
                currentUrl={existingAvatar[0]?.url}
                file={avatarFile}
                onFileChange={setAvatarFile}
                onRemoveExisting={handleRemoveExistingAvatar}
                fallback={(editForm.fullname || editForm.username || "U").charAt(0).toUpperCase()}
                uploading={saving}
                helperText="Square image recommended. PNG or JPG up to 5MB."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullname}
                    onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+855 ..."
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Platform Role *
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      const suggested = OWNER_ROLE_BIZ_SUGGEST[nextRole];
                      setEditForm({
                        ...editForm,
                        role: nextRole,
                        assignedBusinesses:
                          suggested ||
                          normalizeBiz(editForm.assignedBusinesses) ||
                          (nextRole === "OWNER" ? ["hotel", "restaurant"] : []),
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    {[
                      ...new Set([...(roleOptions || []), editForm.role].filter(Boolean)),
                    ].map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABELS[r] || r}
                      </option>
                    ))}
                  </select>
                </div>
              <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Account Status *
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {OWNER_LIKE_ROLES.includes(editForm.role) && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Business Access
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {OWNER_BIZ_OPTIONS.map((b) => {
                      const cur = normalizeBiz(editForm.assignedBusinesses);
                      const checked = cur.includes(b.id);
                      const licenseMax = editForm.role === "SUPEROWNER" ? 3 : 2;
                      const disabled = !checked && cur.length >= licenseMax;
                      return (
                        <button
                          type="button"
                          key={b.id}
                          disabled={disabled}
                          onClick={() =>
                            setEditForm({
                              ...editForm,
                              assignedBusinesses: checked
                                ? cur.filter((x) => x !== b.id)
                                : [...cur, b.id],
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            checked
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {checked ? "✓ " : ""}
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                    {editForm.role === "SUPEROWNER"
                      ? "Super owner manages all verticals (up to 3)."
                      : editForm.role === "OWNER"
                        ? "Generic owner manages the selected verticals (up to 2)."
                        : "Scoped owner manages a single vertical."}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  placeholder="Street, District, City / Province..."
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete User</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm permanent account removal</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete user{" "}
              <strong className="text-gray-900 dark:text-white">
                {deleteTarget.fullname || deleteTarget.username}
              </strong>{" "}
              ({deleteTarget.email || deleteTarget.username})? This action will revoke their access to the platform and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? "Deleting..." : "Yes, Delete User"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}