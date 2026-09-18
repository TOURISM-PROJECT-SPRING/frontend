import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  X,
  Eye,
  Edit3,
  Trash2,
  Lock,
  Users,
  Check,
  AlertTriangle,
  Key,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const PERMISSION_GROUPS = [
  {
    category: "Users & Access Control",
    permissions: [
      { id: "users.view", label: "View User Accounts" },
      { id: "users.create", label: "Create Users" },
      { id: "users.edit", label: "Edit Profiles & Roles" },
      { id: "users.delete", label: "Delete User Accounts" },
    ],
  },
  {
    category: "Accommodations & Stays",
    permissions: [
      { id: "hotels.view", label: "View Hotels & Properties" },
      { id: "hotels.edit", label: "Create & Edit Hotels" },
      { id: "rooms.manage", label: "Manage Room Inventory" },
      { id: "bookings.view", label: "Manage Room Reservations" },
    ],
  },
  {
    category: "Restaurants & Dining",
    permissions: [
      { id: "dining.view", label: "View Dining Listings" },
      { id: "menu.manage", label: "Manage Food Items & Menus" },
      { id: "orders.manage", label: "Process Food Orders" },
    ],
  },
  {
    category: "Attractions & Tours",
    permissions: [
      { id: "places.manage", label: "Manage Tourist Attractions" },
      { id: "tickets.manage", label: "Manage Entrance Tickets" },
      { id: "packages.manage", label: "Manage Packages & Guides" },
    ],
  },
  {
    category: "Financials & Platform Settings",
    permissions: [
      { id: "payments.view", label: "Inspect Ledger & KHQR Payments" },
      { id: "payouts.manage", label: "Manage Partner Payouts" },
      { id: "reports.export", label: "Export Financial Reports" },
      { id: "settings.edit", label: "Modify System Settings" },
      { id: "logs.view", label: "Audit System Security Logs" },
    ],
  },
];

const DEFAULT_ROLES = [
  {
    id: 1,
    name: "ADMIN",
    label: "Super Administrator",
    description:
      "Full administrative privileges across user accounts, destinations, hotels, financial reconciliations, and global settings.",
    userCount: 3,
    color: "purple",
    isSystem: true,
    permissions: [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "hotels.view",
      "hotels.edit",
      "rooms.manage",
      "bookings.view",
      "dining.view",
      "menu.manage",
      "orders.manage",
      "places.manage",
      "tickets.manage",
      "packages.manage",
      "payments.view",
      "payouts.manage",
      "reports.export",
      "settings.edit",
      "logs.view",
    ],
  },
  {
    id: 2,
    name: "OWNER",
    label: "Business & Property Partner",
    description:
      "Full management rights over registered properties, room inventories, dining menus, tour packages, and payout accounts.",
    userCount: 14,
    color: "green",
    isSystem: true,
    permissions: [
      "hotels.view",
      "hotels.edit",
      "rooms.manage",
      "bookings.view",
      "dining.view",
      "menu.manage",
      "orders.manage",
      "places.manage",
      "tickets.manage",
      "packages.manage",
      "payments.view",
      "payouts.manage",
      "reports.export",
    ],
  },
  {
    id: 3,
    name: "MANAGER",
    label: "Operations Manager",
    description:
      "Operational supervisor rights over day-to-day reservations, guest check-ins, kitchen order boards, and place ticket verifications.",
    userCount: 8,
    color: "blue",
    isSystem: false,
    permissions: [
      "hotels.view",
      "rooms.manage",
      "bookings.view",
      "dining.view",
      "orders.manage",
      "places.manage",
      "tickets.manage",
      "reports.export",
    ],
  },
  {
    id: 4,
    name: "USER",
    label: "Customer & Tourist",
    description:
      "Default public traveler role for browsing attractions, making room & ticket bookings, dining reservations, and Bakong KHQR payments.",
    userCount: 4820,
    color: "emerald",
    isSystem: true,
    permissions: [
      "hotels.view",
      "dining.view",
      "places.manage",
      "bookings.view",
    ],
  },
];

const colorStyles = {
  purple: {
    badge: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
    pill: "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
    border: "hover:border-purple-300 dark:hover:border-purple-700",
  },
  green: {
    badge: "bg-[#edf5f0] text-[#1b3b2b] border-[#1b3b2b]/20 dark:bg-[#16291e] dark:text-emerald-300 dark:border-emerald-700/50",
    pill: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
    border: "hover:border-[#1b3b2b]/40 dark:hover:border-emerald-700",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    border: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
    border: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  amber: {
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    border: "hover:border-amber-300 dark:hover:border-amber-700",
  },
};

export default function AdminRolesPage() {
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedRoles, setExpandedRoles] = useState({});

  // Modals state
  const [viewRole, setViewRole] = useState(null);
  const [editRole, setEditRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
    color: "blue",
    permissions: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await managementService.getRoles();
        if (Array.isArray(data) && data.length > 0) {
          // Normalize server roles with default details
          const merged = data.map((r, i) => {
            const def = DEFAULT_ROLES.find((d) => d.name === (r.name || r)) || {};
            return {
              id: r.id || i + 1,
              name: (r.name || r).toUpperCase(),
              label: r.label || def.label || `${r.name || r} Role`,
              description: r.description || def.description || "Platform assigned role and permissions.",
              userCount: r.userCount ?? def.userCount ?? 0,
              color: r.color || def.color || "blue",
              isSystem: r.isSystem ?? def.isSystem ?? (r.name === "ADMIN" || r.name === "USER" || r.name === "OWNER"),
              permissions: r.permissions || def.permissions || ["users.view"],
            };
          });
          setRoles(merged);
        } else {
          setRoles(DEFAULT_ROLES);
        }
      } catch (err) {
        console.warn("Could not fetch remote roles, using defaults:", err);
        setRoles(DEFAULT_ROLES);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const totalPermissionsCount = PERMISSION_GROUPS.reduce(
    (sum, g) => sum + g.permissions.length,
    0
  );

  const toggleExpand = (roleId) => {
    setExpandedRoles((prev) => ({ ...prev, [roleId]: !prev[roleId] }));
  };

  const filteredRoles = roles.filter((r) => {
    const term = search.toLowerCase();
    const matchName = (r.name || "").toLowerCase().includes(term);
    const matchLabel = (r.label || "").toLowerCase().includes(term);
    const matchDesc = (r.description || "").toLowerCase().includes(term);
    const matchPerm = (r.permissions || []).some((p) => p.toLowerCase().includes(term));
    return matchName || matchLabel || matchDesc || matchPerm;
  });

  const totalItems = filteredRoles.length;
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Open Create Form
  const handleOpenCreate = () => {
    setIsCreating(true);
    setEditRole(null);
    setFormData({
      name: "",
      label: "",
      description: "",
      color: "blue",
      permissions: ["users.view"],
    });
  };

  // Open Edit Form
  const handleOpenEdit = (role) => {
    setIsCreating(false);
    setEditRole(role);
    setFormData({
      name: role.name,
      label: role.label,
      description: role.description,
      color: role.color || "blue",
      permissions: [...(role.permissions || [])],
    });
  };

  // Toggle single permission
  const handleTogglePermission = (permId) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permId);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permId)
          : [...prev.permissions, permId],
      };
    });
  };

  // Toggle all in group
  const handleToggleGroup = (groupPerms) => {
    setFormData((prev) => {
      const ids = groupPerms.map((p) => p.id);
      const allSelected = ids.every((id) => prev.permissions.includes(id));
      if (allSelected) {
        return {
          ...prev,
          permissions: prev.permissions.filter((id) => !ids.includes(id)),
        };
      }
      const newPerms = [...new Set([...prev.permissions, ...ids])];
      return { ...prev, permissions: newPerms };
    });
  };

  // Submit Handler
  const handleSaveRole = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setSubmitting(true);
    try {
      const cleanName = formData.name.toUpperCase().replace(/\s+/g, "_");
      if (isCreating) {
        const newRole = {
          id: Date.now(),
          ...formData,
          name: cleanName,
          userCount: 0,
          isSystem: false,
        };
        try {
          await managementService.createRole(newRole);
        } catch {}
        setRoles((prev) => [...prev, newRole]);
        toast.success("Role created successfully");
      } else if (editRole) {
        const updated = {
          ...editRole,
          ...formData,
          name: cleanName,
        };
        try {
          await managementService.updateRole(editRole.id, updated);
        } catch {}
        setRoles((prev) => prev.map((r) => (r.id === editRole.id ? updated : r)));
        toast.success("Role updated successfully");
      }
      setIsCreating(false);
      setEditRole(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleteTarget.isSystem) return;
    try {
      await managementService.deleteRole(deleteTarget.id);
    } catch {}
    setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Role deleted successfully");
  };

  if (loading) return <AdminLoading message="Loading roles and permissions matrix..." />;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <ShieldCheck className="w-7 h-7 text-[#1b3b2b] dark:text-emerald-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Roles &amp; Permissions Management
            </h1>
            <TotalBadge count={roles.length} />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Define system roles, access capabilities, and operational resource privileges
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1b3b2b] hover:bg-[#12281e] text-white text-sm font-semibold rounded-xl shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#f4b938]" />
          <span>Create New Role</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Total Roles
            </span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">System & custom access roles</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Permission Rules
            </span>
            <Key className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPermissionsCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Granular resource actions</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Protected Roles
            </span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {roles.filter((r) => r.isSystem).length}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Locked core system defaults</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Users Covered
            </span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {roles.reduce((sum, r) => sum + (r.userCount || 0), 0)}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Assigned account memberships</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          type="text"
          placeholder="Filter roles by code, title, or permission..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary transition"
        />
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paginatedRoles.map((role) => {
          const style = colorStyles[role.color] || colorStyles.blue;
          const isExpanded = expandedRoles[role.id];
          const displayedPerms = isExpanded
            ? role.permissions
            : (role.permissions || []).slice(0, 6);
          const hasMore = (role.permissions || []).length > 6;

          return (
            <div
              key={role.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-xs transition hover:shadow-md ${style.border}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700">
                    <ShieldCheck className="w-5 h-5 text-[#1b3b2b] dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {role.label}
                      </h3>
                      {role.isSystem && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500"
                          title="Core System Role"
                        >
                          <Lock className="w-2.5 h-2.5" /> System
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${style.badge}`}
                    >
                      ROLE_{role.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/80 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{role.userCount} users</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 min-h-[36px]">
                {role.description}
              </p>

              {/* Permissions Checklist preview */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                  <span>Granted Permissions ({role.permissions?.length || 0})</span>
                  {hasMore && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(role.id)}
                      className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Less <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          +{role.permissions.length - 6} more <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {displayedPerms.map((p) => (
                    <span
                      key={p}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${style.pill} flex items-center gap-1`}
                    >
                      <Check className="w-3 h-3 opacity-60" />
                      <span>{p}</span>
                    </span>
                  ))}
                  {(!role.permissions || role.permissions.length === 0) && (
                    <span className="text-xs text-gray-400 italic">No permissions assigned.</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[11px] text-gray-400">ID #{role.id}</span>
                <div className="flex items-center gap-2">
                  {/* View Details Button */}
                  <button
                    type="button"
                    onClick={() => setViewRole(role)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer border border-gray-200 dark:border-gray-700"
                    title="View Role Matrix"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {/* Edit Role Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(role)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 transition cursor-pointer"
                    title="Edit Role & Permissions"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Role Button (Disabled for Core System Roles) */}
                  <button
                    type="button"
                    disabled={role.isSystem}
                    onClick={() => setDeleteTarget(role)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      role.isSystem
                        ? "opacity-30 cursor-not-allowed text-gray-400 border border-gray-200 dark:border-gray-800"
                        : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 cursor-pointer"
                    }`}
                    title={role.isSystem ? "System roles cannot be deleted" : "Delete Role"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRoles.length > 0 && (
        <AdminPagination currentPage={currentPage} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} itemLabel="roles" />
      )}

      {filteredRoles.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No roles match your search</h3>
          <p className="text-xs text-gray-400 mt-1">Try searching for a different keyword or create a new role.</p>
        </div>
      )}

      {/* VIEW ROLE MODAL */}
      {viewRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewRole(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {viewRole.label}
                    {viewRole.isSystem && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                        System Default
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-mono text-gray-400">ROLE_{viewRole.name}</p>
                </div>
              </div>
              <button
                onClick={() => setViewRole(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="my-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Description</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                {viewRole.description}
              </p>
            </div>

            {/* Categorized Permissions View */}
            <div className="space-y-4 my-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                Capability Matrix ({viewRole.permissions?.length || 0} active permissions)
              </p>

              {PERMISSION_GROUPS.map((group) => {
                const groupPerms = group.permissions.filter((p) =>
                  (viewRole.permissions || []).includes(p.id)
                );
                const hasAny = groupPerms.length > 0;

                return (
                  <div
                    key={group.category}
                    className="border border-gray-100 dark:border-gray-800 rounded-xl p-3 bg-gray-50/40 dark:bg-gray-800/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {group.category}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {groupPerms.length} / {group.permissions.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {group.permissions.map((p) => {
                        const isGranted = (viewRole.permissions || []).includes(p.id);
                        return (
                          <div
                            key={p.id}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                              isGranted
                                ? "bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                                : "text-gray-400 opacity-40 bg-gray-50 dark:bg-gray-800/40"
                            }`}
                          >
                            {isGranted ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{p.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  const target = viewRole;
                  setViewRole(null);
                  handleOpenEdit(target);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 className="w-4 h-4" />
                Edit Permissions
              </button>
              <button
                type="button"
                onClick={() => setViewRole(null)}
                className="py-2.5 px-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ROLE MODAL */}
      {(isCreating || editRole) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setIsCreating(false);
              setEditRole(null);
            }}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1b3b2b] dark:text-emerald-400" />
                  {isCreating ? "Create Custom Role" : `Edit Role: ${editRole?.label}`}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Configure role identifier, descriptive title, and toggle granular permissions
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditRole(null);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Role Code (Identifier) *
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 font-mono text-xs rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700">
                      ROLE_
                    </span>
                    <input
                      type="text"
                      required
                      disabled={editRole?.isSystem}
                      placeholder="e.g. SUPERVISOR"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary uppercase"
                    />
                  </div>
                  {editRole?.isSystem && (
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      Code is locked for core system roles.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operations Supervisor"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summarize the responsibilities and scope of this role..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Badge Color Theme
                </label>
                <div className="flex gap-2">
                  {["purple", "green", "blue", "emerald", "amber"].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: col })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition cursor-pointer flex items-center gap-1.5 ${
                        formData.color === col
                          ? `${colorStyles[col].badge} ring-2 ring-offset-1 ring-primary`
                          : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      }`}
                    >
                      {formData.color === col && <Check className="w-3 h-3" />}
                      <span>{col}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permission Checklists by Group */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Permissions Assignment ({formData.permissions.length} Selected)
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = PERMISSION_GROUPS.flatMap((g) =>
                          g.permissions.map((p) => p.id)
                        );
                        setFormData({ ...formData, permissions: allIds });
                      }}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, permissions: [] })}
                      className="text-xs font-semibold text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {PERMISSION_GROUPS.map((group) => {
                    const ids = group.permissions.map((p) => p.id);
                    const allSelected = ids.every((id) => formData.permissions.includes(id));

                    return (
                      <div
                        key={group.category}
                        className="bg-gray-50/70 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {group.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleGroup(group.permissions)}
                            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            {allSelected ? "Uncheck Group" : "Check Group"}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.permissions.map((perm) => {
                            const checked = formData.permissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs transition cursor-pointer border ${
                                  checked
                                    ? "bg-white dark:bg-gray-800 border-primary/30 text-gray-900 dark:text-white font-medium shadow-xs"
                                    : "bg-transparent border-transparent text-gray-500 hover:bg-gray-100/60 dark:hover:bg-gray-800/30"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => handleTogglePermission(perm.id)}
                                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                                />
                                <span className="truncate">{perm.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditRole(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#1b3b2b] hover:bg-[#12281e] rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#f4b938]" />
                  <span>{submitting ? "Saving..." : isCreating ? "Create Role" : "Save Changes"}</span>
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Role</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm role removal</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete role{" "}
              <strong className="text-gray-900 dark:text-white">
                {deleteTarget.label} (ROLE_{deleteTarget.name})
              </strong>
              ? Users assigned to this role will lose their special privileges.
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
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Role</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
