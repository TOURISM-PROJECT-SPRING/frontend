import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  UtensilsCrossed,
  Compass,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { managementService } from "../../services/managementService";

const norm = (s) => String(s || "").toUpperCase();

const BIZ_CATEGORIES = {
  hotel: {
    label: "Hotel & Stays",
    icon: Building2,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-800",
  },
  restaurant: {
    label: "Restaurant & Dining",
    icon: UtensilsCrossed,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800",
  },
  tour: {
    label: "Tourist & Tours",
    icon: Compass,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800",
  },
};

const getCategoryInfo = (type) => {
  const key = String(type || "hotel").toLowerCase();
  return BIZ_CATEGORIES[key] || BIZ_CATEGORIES.hotel;
};

const DEFAULT_OWNERS = [
  {
    id: 1,
    businessName: "Angkor Palace Resort & Spa",
    businessLicenseNo: "LIC-SR-2024-8841",
    businessType: "hotel",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-01-15T09:30:00Z",
    userName: "Sovann Hotel Owner",
    userEmail: "owner.hotel@smart-tourism.com",
    phone: "+855 12 345 678",
    address: "National Road 6, Krong Siem Reap",
    city: "Siem Reap",
    propertyCount: 4,
    description:
      "Premier 5-star luxury heritage resort offering traditional Khmer architecture, spa facilities, and curated Angkor temple tour itineraries.",
  },
  {
    id: 2,
    businessName: "Khmer Heritage Cuisine & Riverside Bistro",
    businessLicenseNo: "LIC-PP-2024-5120",
    businessType: "restaurant",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-02-10T14:15:00Z",
    userName: "Chann Restaurant Owner",
    userEmail: "owner.restaurant@smart-tourism.com",
    phone: "+855 23 888 999",
    address: "Sisowath Quay, Daun Penh, Phnom Penh",
    city: "Phnom Penh",
    propertyCount: 2,
    description:
      "Award-winning traditional dining establishment specializing in authentic royal Khmer recipes and sunset dining overlooking the Tonle Sap.",
  },
  {
    id: 3,
    businessName: "Kingdom Eco Tours & Guides Co.",
    businessLicenseNo: "LIC-KK-2024-3392",
    businessType: "tour",
    verificationStatus: "VERIFIED",
    verifiedAt: "2026-03-01T11:00:00Z",
    userName: "Bopha Tour Owner",
    userEmail: "owner.tour@smart-tourism.com",
    phone: "+855 97 777 666",
    address: "Smach Mean Chey, Krong Khemarak Phoumin, Koh Kong",
    city: "Koh Kong",
    propertyCount: 8,
    description:
      "Licensed adventure eco-tourism operator providing guided trekking through Cardamom mountains, mangrove kayaking, and wildlife expeditions.",
  },
  {
    id: 4,
    businessName: "Bokor Mountain Haven Villas",
    businessLicenseNo: "LIC-KP-2025-1049",
    businessType: "hotel",
    verificationStatus: "PENDING",
    verifiedAt: null,
    userName: "Seng Visal",
    userEmail: "visal.seng@bokorhaven.com",
    phone: "+855 88 444 333",
    address: "Preah Monivong National Park, Kampot",
    city: "Kampot",
    propertyCount: 1,
    description:
      "High-altitude boutique eco-villas nestled atop Mount Bokor with panoramic views of the Gulf of Thailand.",
  },
  {
    id: 5,
    businessName: "Battambang Heritage Cafe & Roasters",
    businessLicenseNo: "LIC-BB-2025-9921",
    businessType: "restaurant",
    verificationStatus: "PENDING",
    verifiedAt: null,
    userName: "Keo Phalla",
    userEmail: "phalla.keo@battambangroasters.kh",
    phone: "+855 70 222 111",
    address: "Street 2.5, Krong Battambang",
    city: "Battambang",
    propertyCount: 1,
    description:
      "Artisan specialty coffee roastery and organic bakery serving single-origin beans sourced directly from Pailin smallholders.",
  },
  {
    id: 6,
    businessName: "Mekong Dolphin Expeditions",
    businessLicenseNo: "LIC-KR-2025-6612",
    businessType: "tour",
    verificationStatus: "REJECTED",
    verifiedAt: null,
    userName: "Vannak Nhem",
    userEmail: "vannak.nhem@mekongdolphin.com",
    phone: "+855 92 111 000",
    address: "Kampi Rapids, Kratie Province",
    city: "Kratie",
    propertyCount: 2,
    description:
      "River boat excursions for Irrawaddy dolphin watching in the protected Mekong conservation corridor.",
  },
];

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals state
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formState, setFormState] = useState({
    businessName: "",
    businessLicenseNo: "",
    businessType: "hotel",
    userName: "",
    userEmail: "",
    phone: "",
    address: "",
    city: "Siem Reap",
    verificationStatus: "PENDING",
    description: "",
  });

  const fetchOwners = async () => {
    try {
      const data = await managementService.getOwners();
      if (Array.isArray(data) && data.length > 0) {
        setOwners(data);
      } else {
        setOwners(DEFAULT_OWNERS);
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
      setOwners(DEFAULT_OWNERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // Filter logic
  const filtered = owners.filter((o) => {
    const bName = o.businessName || "";
    const uName = o.userName || "";
    const email = o.userEmail || "";
    const lic = o.businessLicenseNo || "";
    const addr = o.address || "";
    const city = o.city || "";

    const query = `${bName} ${uName} ${email} ${lic} ${addr} ${city}`.toLowerCase();
    const matchSearch = query.includes(search.toLowerCase());

    const oStatus = norm(o.verificationStatus);
    const matchStatus = statusFilter === "ALL" || oStatus === statusFilter;

    const oType = String(o.businessType || "hotel").toLowerCase();
    const matchType = typeFilter === "ALL" || oType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  // KPIs
  const totalOwners = owners.length;
  const verifiedCount = owners.filter((o) => norm(o.verificationStatus) === "VERIFIED").length;
  const pendingCount = owners.filter((o) => norm(o.verificationStatus) === "PENDING").length;
  const rejectedCount = owners.filter((o) => norm(o.verificationStatus) === "REJECTED").length;

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedOwners = filtered.slice(startIndex, endIndex);

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
  const handleOpenEdit = (item) => {
    setEditTarget(item);
    setFormState({
      businessName: item.businessName || "",
      businessLicenseNo: item.businessLicenseNo || "",
      businessType: item.businessType || "hotel",
      userName: item.userName || "",
      userEmail: item.userEmail || "",
      phone: item.phone || "",
      address: item.address || "",
      city: item.city || "Siem Reap",
      verificationStatus: norm(item.verificationStatus) || "PENDING",
      description: item.description || "",
    });
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsCreating(true);
    setFormState({
      businessName: "",
      businessLicenseNo: `LIC-${Math.floor(1000 + Math.random() * 9000)}`,
      businessType: "hotel",
      userName: "",
      userEmail: "",
      phone: "",
      address: "",
      city: "Siem Reap",
      verificationStatus: "VERIFIED",
      description: "",
    });
  };

  // Save handler (Create or Edit)
  const handleSaveForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isCreating) {
        const payload = {
          ...formState,
          id: Date.now(),
          verifiedAt: formState.verificationStatus === "VERIFIED" ? new Date().toISOString() : null,
        };
        try {
          await managementService.createOwner(payload);
        } catch {
          // fallback to local update
        }
        setOwners((prev) => [payload, ...prev]);
        setIsCreating(false);
      } else if (editTarget) {
        const payload = {
          ...editTarget,
          ...formState,
          verifiedAt:
            formState.verificationStatus === "VERIFIED" && !editTarget.verifiedAt
              ? new Date().toISOString()
              : formState.verificationStatus !== "VERIFIED"
              ? null
              : editTarget.verifiedAt,
        };
        try {
          await managementService.updateOwner(editTarget.id, payload);
        } catch {
          // fallback
        }
        setOwners((prev) => prev.map((o) => (o.id === editTarget.id ? payload : o)));
        setEditTarget(null);
        if (viewTarget?.id === editTarget.id) {
          setViewTarget(payload);
        }
      }
    } catch (err) {
      console.error("Error saving owner:", err);
    } finally {
      setSaving(false);
    }
  };

  // Quick Verification Toggle
  const handleQuickVerify = async (item, newStatus) => {
    const updated = {
      ...item,
      verificationStatus: newStatus,
      verifiedAt: newStatus === "VERIFIED" ? new Date().toISOString() : null,
    };
    try {
      await managementService.verifyOwner(item.id, newStatus);
    } catch {
      // local fallback
    }
    setOwners((prev) => prev.map((o) => (o.id === item.id ? updated : o)));
    if (viewTarget?.id === item.id) {
      setViewTarget(updated);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      try {
        await managementService.deleteOwner(deleteTarget.id);
      } catch {
        // local fallback
      }
      setOwners((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      if (viewTarget?.id === deleteTarget.id) {
        setViewTarget(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting owner:", err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = norm(status);
    if (s === "VERIFIED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle className="w-3.5 h-3.5" />
          Verified
        </span>
      );
    }
    if (s === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-800">
        <XCircle className="w-3.5 h-3.5" />
        Rejected
      </span>
    );
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading businesses from server...</div>;
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Owners & Businesses</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              Management
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Oversee registered property owners, business licenses, and platform verification status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1b3b2b] text-white hover:bg-[#12281e] text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#f4b938]" />
          <span>Add Business</span>
        </button>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Total Accounts</p>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOwners}</p>
            <ShieldCheck className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">
            Verified Businesses
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedCount}</p>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wider">
            Pending Review
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium uppercase tracking-wider">
            Rejected / Flagged
          </p>
          <div className="flex items-baseline justify-between mt-1">
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{rejectedCount}</p>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Search by business, license, owner name, email, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-primary transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="PENDING">Pending Review</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Business Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary transition cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="hotel">Hotels & Stays</option>
          <option value="restaurant">Restaurant & Dining</option>
          <option value="tour">Tourist & Tours</option>
        </select>
      </div>

      {/* OWNERS TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Business & Type
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  License No.
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Owner & Contact
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOwners.map((o) => {
                const cat = getCategoryInfo(o.businessType);
                const IconComponent = cat.icon;
                const isVerified = norm(o.verificationStatus) === "VERIFIED";
                const isPending = norm(o.verificationStatus) === "PENDING";

                return (
                  <tr
                    key={o.id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition"
                  >
                    {/* Business Name & Type */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                          <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white leading-tight">{o.businessName}</p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${cat.badgeClass}`}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* License No */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {o.businessLicenseNo || "—"}
                      </span>
                    </td>

                    {/* Owner Name & Contact */}
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{o.userName || "N/A"}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{o.userEmail || "—"}</p>
                        {o.phone && <p className="text-xs text-gray-400 dark:text-gray-500">{o.phone}</p>}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5">
                      <div className="text-xs text-gray-600 dark:text-gray-300 max-w-[160px] truncate">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{o.city || "Cambodia"}</p>
                        <p className="text-gray-400 dark:text-gray-500 truncate" title={o.address}>
                          {o.address || "—"}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <div>
                        {getStatusBadge(o.verificationStatus)}
                        {o.verifiedAt && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                            {o.verifiedAt.slice(0, 10)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Approve/Reject buttons when pending */}
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleQuickVerify(o, "VERIFIED")}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 transition cursor-pointer"
                              title="Approve Business"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickVerify(o, "REJECTED")}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 transition cursor-pointer"
                              title="Reject Application"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewTarget(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-[#1b3b2b] hover:bg-[#edf5f0] dark:hover:text-emerald-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer"
                          title="View Business Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 transition cursor-pointer"
                          title="Edit Business"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(o)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/50 transition cursor-pointer"
                          title="Delete Business"
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

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 dark:text-gray-500">No businesses found matching your criteria.</p>
          </div>
        ) : (
          /* Pagination Footer */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            {/* Left: Summary & Per-Page Selector */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing <strong className="text-gray-900 dark:text-white font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">{endIndex}</strong> of{" "}
                <strong className="text-gray-900 dark:text-white font-semibold">{totalItems}</strong> businesses
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

      {/* VIEW DETAILS MODAL */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {viewTarget.businessName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{viewTarget.businessName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {viewTarget.businessLicenseNo}
                    </span>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {getCategoryInfo(viewTarget.businessType).label}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewTarget(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Verification Banner */}
            <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">Platform Status</p>
                <div className="mt-1">{getStatusBadge(viewTarget.verificationStatus)}</div>
              </div>
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {norm(viewTarget.verificationStatus) !== "VERIFIED" && (
                  <button
                    type="button"
                    onClick={() => handleQuickVerify(viewTarget, "VERIFIED")}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                )}
                {norm(viewTarget.verificationStatus) !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => handleQuickVerify(viewTarget, "REJECTED")}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Owner Email
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{viewTarget.userEmail || "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Contact
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{viewTarget.phone || "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> City / Region
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{viewTarget.city || "—"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Verified At
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {viewTarget.verifiedAt ? viewTarget.verifiedAt.slice(0, 10) : "Pending Review"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
              <p className="text-xs text-gray-400 dark:text-gray-500">Registered Business Address</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{viewTarget.address || "—"}</p>
            </div>

            {/* Description */}
            {viewTarget.description && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500">Business Profile & Services</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{viewTarget.description}</p>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  const target = viewTarget;
                  setViewTarget(null);
                  handleOpenEdit(target);
                }}
                className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" /> Edit Business
              </button>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BUSINESS MODAL */}
      {(isCreating || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setIsCreating(false);
              setEditTarget(null);
            }}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {isCreating ? "Add New Business Owner" : "Edit Business Profile"}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {isCreating
                    ? "Register a new partner business and owner details"
                    : `Editing ${editTarget.businessName}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditTarget(null);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-sm">
              {/* Business Name & License */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.businessName}
                    onChange={(e) => setFormState({ ...formState, businessName: e.target.value })}
                    placeholder="e.g. Siem Reap Royal Villa"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    License / Tax Reg. No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.businessLicenseNo}
                    onChange={(e) => setFormState({ ...formState, businessLicenseNo: e.target.value })}
                    placeholder="e.g. LIC-SR-2026-001"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Business Category *
                  </label>
                  <select
                    value={formState.businessType}
                    onChange={(e) => setFormState({ ...formState, businessType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="hotel">Hotel & Accommodations</option>
                    <option value="restaurant">Restaurant & Dining</option>
                    <option value="tour">Tourists & Attractions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Verification Status *
                  </label>
                  <select
                    value={formState.verificationStatus}
                    onChange={(e) => setFormState({ ...formState, verificationStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="VERIFIED">VERIFIED (Approved)</option>
                    <option value="PENDING">PENDING (In Review)</option>
                    <option value="REJECTED">REJECTED (Declined)</option>
                  </select>
                </div>
              </div>

              {/* Owner Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.userName}
                    onChange={(e) => setFormState({ ...formState, userName: e.target.value })}
                    placeholder="e.g. Sokha Dara"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Owner Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.userEmail}
                    onChange={(e) => setFormState({ ...formState, userEmail: e.target.value })}
                    placeholder="owner@domain.com"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+855 12 345 678"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    City / Province
                  </label>
                  <input
                    type="text"
                    value={formState.city}
                    onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                    placeholder="e.g. Siem Reap, Phnom Penh, Kampot"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business Physical Address
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  placeholder="Street, Sangkat, Khan / District"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business Description & Offerings
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Briefly describe what this business provides..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditTarget(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#1b3b2b] hover:bg-[#12281e] rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#f4b938]" />
                  <span>{saving ? "Saving..." : isCreating ? "Create Business" : "Save Changes"}</span>
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Business Account</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm permanent removal</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.businessName}</strong>? All associated
              property credentials and business linkages will be revoked.
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
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? "Deleting..." : "Yes, Delete Business"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}