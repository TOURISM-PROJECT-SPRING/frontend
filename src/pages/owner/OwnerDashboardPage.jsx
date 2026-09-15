import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CalendarCheck,
  Layers,
  TrendingUp,
  Clock,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  DollarSign,
  Bed,
  Compass,
  UtensilsCrossed,
  X,
  Sparkles,
} from "lucide-react";
import { ownerService } from "../../services/ownerService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";

const STATUS_BADGE = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  CONFIRMED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  COMPLETED: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

const TYPE_ICONS = {
  ROOM: Bed,
  HOTEL: Bed,
  TICKET: Compass,
  TOUR: Compass,
  FOOD_ORDER: UtensilsCrossed,
  FOOD: UtensilsCrossed,
};

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const ownerId = user?.id || 1;

  const [activeTab, setActiveTab] = useState("overview"); // overview | bookings | services
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Bookings filter state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Services filter state
  const [serviceTypeFilter, setServiceTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Offering form state
  const [newOffering, setNewOffering] = useState({
    name: "",
    offeringType: "ROOM",
    category: "",
    price: "",
    description: "",
    isAvailable: true,
  });

  const loadData = useCallback(async () => {
    try {
      const [sData, bData, oData] = await Promise.all([
        ownerService.getDashboardStats(ownerId),
        ownerService.getBookings(ownerId),
        ownerService.getServices(ownerId),
      ]);
      setStats(sData);
      setBookings(bData || []);
      setServices(oData || []);
    } catch (err) {
      console.error("Failed to load owner dashboard data:", err);
      toast.error("Could not load owner data");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [ownerId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = () => {
    setSyncing(true);
    loadData().then(() => {
      toast.success("Owner operations synced with live API");
    });
  };

  // Status update handler
  const handleUpdateStatus = async (booking, newStatus) => {
    const prevStatus = booking.status;
    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b))
    );
    try {
      const bType = booking.bookingType || "ROOM";
      const bId = booking.rawId || booking.id.replace(/^[A-Z]+-/, "");
      await ownerService.updateBookingStatus(bType, bId, newStatus);
      toast.success(`Booking ${booking.id} marked as ${newStatus}`);
      loadData();
    } catch {
      // Rollback
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: prevStatus } : b))
      );
      toast.error("Failed to update status on server");
    }
  };

  // Toggle offering availability
  const handleToggleAvailability = async (offering) => {
    const newAvail = !offering.isAvailable;
    setServices((prev) =>
      prev.map((s) => (s.id === offering.id ? { ...s, isAvailable: newAvail } : s))
    );
    try {
      await ownerService.toggleAvailability(offering.offeringType, offering.id, newAvail);
      toast.info(`${offering.name} is now ${newAvail ? "Available" : "Unavailable"}`);
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === offering.id ? { ...s, isAvailable: !newAvail } : s))
      );
      toast.error("Failed to toggle availability");
    }
  };

  // Delete offering
  const handleDeleteOffering = async (offering) => {
    if (!window.confirm(`Delete "${offering.name}"?`)) return;
    setServices((prev) => prev.filter((s) => s.id !== offering.id));
    try {
      await ownerService.deleteService(offering.offeringType, offering.id);
      toast.success("Offering removed");
    } catch {
      loadData();
      toast.error("Could not delete offering");
    }
  };

  // Submit new offering
  const handleCreateOffering = async (e) => {
    e.preventDefault();
    if (!newOffering.name || !newOffering.price) {
      toast.error("Please provide offering name and price");
      return;
    }
    try {
      const payload = {
        ...newOffering,
        price: Number(newOffering.price),
      };
      const created = await ownerService.createService(ownerId, payload);
      setServices((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewOffering({
        name: "",
        offeringType: "ROOM",
        category: "",
        price: "",
        description: "",
        isAvailable: true,
      });
      toast.success("New offering published to your catalog!");
    } catch {
      toast.error("Failed to create offering");
    }
  };

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.serviceName && b.serviceName.toLowerCase().includes(q)) ||
        (b.id && b.id.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Filtered services
  const filteredServices = useMemo(() => {
    if (serviceTypeFilter === "ALL") return services;
    return services.filter((s) => s.offeringType === serviceTypeFilter);
  }, [services, serviceTypeFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-700 border-t-transparent" />
          <p className="text-sm font-semibold text-muted">Loading your Owner Operations Dashboard…</p>
        </div>
      </div>
    );
  }

  const businessName = stats?.businessName || "Angkor Heritage & Hospitality Group";
  const totalRevenueFmt = `$${Number(stats?.totalRevenue || 0).toLocaleString()}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header & Identity */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-line bg-white/80 p-6 backdrop-blur dark:bg-card dark:border-line md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
            <Sparkles size={14} /> Business Owner Workspace
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-brand-900 dark:text-brand-100 sm:text-3xl">
            {businessName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live operations, booking approvals, and service management for Provider #{ownerId}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-brand-700 shadow-soft transition-all hover:bg-brand-50 disabled:opacity-50 dark:bg-card dark:text-brand-300 dark:border-line"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing API…" : "Sync Live Data"}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white shadow-soft transition-all hover:bg-brand-800"
          >
            <Plus size={16} /> Add Offering
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-line">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "overview"
              ? "border-brand-700 text-brand-800 dark:border-gold-400 dark:text-gold-400"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <TrendingUp size={16} /> Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "bookings"
              ? "border-brand-700 text-brand-800 dark:border-gold-400 dark:text-gold-400"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <CalendarCheck size={16} /> Bookings & Orders ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "services"
              ? "border-brand-700 text-brand-800 dark:border-gold-400 dark:text-gold-400"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Layers size={16} /> Manage Offerings ({services.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-rise">
          {/* Key Metric Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Bookings */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft dark:bg-card dark:border-line">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Total Bookings</p>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-brand-900 dark:text-brand-100">
                {stats?.totalBookings || bookings.length}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>+12% this month</span>
              </div>
            </div>

            {/* Active Services */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft dark:bg-card dark:border-line">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Active Offerings</p>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  <Layers size={20} />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-brand-900 dark:text-brand-100">
                {stats?.activeServices || services.length}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <span>Rooms, Tours & Menu Items</span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft dark:bg-card dark:border-line">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Gross Revenue</p>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/15 text-gold-600 dark:bg-gold-500/20 dark:text-gold-400">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-brand-900 dark:text-brand-100">
                {totalRevenueFmt}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>+8.4% vs last period</span>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="rounded-2xl border border-line bg-white p-5 shadow-soft dark:bg-card dark:border-line">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Pending Orders</p>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  <Clock size={20} />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats?.pendingOrders || bookings.filter((b) => b.status === "PENDING").length}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Action required</span>
              </div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-soft dark:bg-card dark:border-line">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-900 dark:text-brand-100">
                  6-Month Revenue Trend
                </h3>
                <p className="text-xs text-muted">Monthly earnings from confirmed bookings</p>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between gap-3 pt-8 sm:gap-6">
              {(stats?.revenueTrend || []).map((pt) => (
                <div key={pt.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-[11px] font-bold text-muted">${(pt.revenue / 1000).toFixed(1)}k</div>
                  <div className="w-full rounded-t-xl bg-brand-100 dark:bg-brand-950/60 overflow-hidden flex flex-col justify-end h-40">
                    <div
                      style={{ height: `${Math.min(100, (pt.revenue / 10000) * 100)}%` }}
                      className="w-full rounded-t-xl bg-brand-700 dark:bg-gold-500 transition-all duration-500 hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs font-bold text-ink/75 dark:text-ink/60">{pt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Quick View */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-soft dark:bg-card dark:border-line">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-900 dark:text-brand-100">
                  Recent Orders & Reservations
                </h3>
                <p className="text-xs text-muted">Latest bookings placed for your business offerings</p>
              </div>
              <button
                onClick={() => setActiveTab("bookings")}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-800 dark:text-gold-400"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-line">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-gold-400">
                      {(() => {
                        const IconComponent = TYPE_ICONS[b.bookingType] || Bed;
                        return <IconComponent size={20} />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-800 dark:text-brand-200">{b.id}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                            STATUS_BADGE[b.status] || STATUS_BADGE.PENDING
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <p className="font-semibold text-ink text-sm">{b.serviceName}</p>
                      <p className="text-xs text-muted">
                        Guest: <span className="font-medium text-ink/80">{b.customerName}</span> ·{" "}
                        {b.bookingDate || "Today"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-display font-bold text-brand-900 dark:text-brand-100">
                      ${Number(b.totalAmount || 0).toFixed(2)}
                    </span>
                    {b.status === "PENDING" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(b, "CONFIRMED")}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b, "CANCELLED")}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS & ORDERS MANAGEMENT VIEW */}
      {activeTab === "bookings" && (
        <div className="space-y-6 animate-rise">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-line bg-white/70 p-1.5 dark:bg-card dark:border-line">
              {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    statusFilter === st
                      ? "bg-brand-700 text-white shadow-soft"
                      : "text-muted hover:text-ink hover:bg-brand-50/50"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer, id, service…"
                className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-4 text-xs font-medium text-ink focus:border-brand-500 focus:outline-none dark:bg-card dark:border-line"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft dark:bg-card dark:border-line">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-line bg-canvas/60 font-bold uppercase tracking-wider text-muted dark:bg-brand-950/40">
                  <tr>
                    <th className="px-5 py-3.5">Booking ID</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Offering / Service</th>
                    <th className="px-5 py-3.5">Date / Qty</th>
                    <th className="px-5 py-3.5">Total Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted">
                        No bookings match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="transition-colors hover:bg-brand-50/40 dark:hover:bg-brand-900/10">
                        <td className="px-5 py-4 font-bold text-brand-800 dark:text-brand-200">
                          {b.id}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-ink">{b.customerName}</div>
                          <div className="text-[11px] text-muted">{b.customerEmail || "No email"}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-ink">{b.serviceName}</div>
                          <div className="text-[11px] text-muted uppercase">{b.bookingType}</div>
                        </td>
                        <td className="px-5 py-4 text-ink">
                          <div>{b.bookingDate || "Flexible"}</div>
                          <div className="text-[11px] text-muted">Qty: {b.quantity || 1}</div>
                        </td>
                        <td className="px-5 py-4 font-display font-bold text-brand-900 dark:text-brand-100">
                          ${Number(b.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                              STATUS_BADGE[b.status] || STATUS_BADGE.PENDING
                            }`}
                          >
                            {b.status === "CONFIRMED" && <CheckCircle2 size={12} />}
                            {b.status === "PENDING" && <Clock3 size={12} />}
                            {b.status === "CANCELLED" && <XCircle size={12} />}
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {b.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(b, "CONFIRMED")}
                                  className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(b, "CANCELLED")}
                                  className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/30"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {b.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleUpdateStatus(b, "COMPLETED")}
                                className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OFFERINGS & SERVICES MANAGER */}
      {activeTab === "services" && (
        <div className="space-y-6 animate-rise">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {[
                { label: "All Offerings", value: "ALL" },
                { label: "Hotel Rooms", value: "ROOM" },
                { label: "Tour Experiences", value: "TOUR" },
                { label: "Food & Menus", value: "FOOD" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setServiceTypeFilter(tab.value)}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                    serviceTypeFilter === tab.value
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-line bg-white text-muted hover:text-ink dark:bg-card dark:border-line"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800"
            >
              <Plus size={16} /> Add New Offering
            </button>
          </div>

          {/* Offerings Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((offering) => (
              <div
                key={offering.id}
                className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-soft transition-all hover:shadow-lift dark:bg-card dark:border-line"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-gold-400">
                      {offering.offeringType}
                    </span>
                    <button
                      onClick={() => handleToggleAvailability(offering)}
                      className="inline-flex items-center gap-1 text-xs font-bold"
                    >
                      {offering.isAvailable ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <ToggleRight size={20} /> Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted">
                          <ToggleLeft size={20} /> Paused
                        </span>
                      )}
                    </button>
                  </div>

                  <h4 className="mt-3 font-display text-base font-bold text-brand-900 dark:text-brand-100">
                    {offering.name}
                  </h4>
                  <p className="text-xs font-semibold text-gold-600 dark:text-gold-400">
                    {offering.category || "General"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs text-muted">
                    {offering.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-display text-lg font-bold text-brand-800 dark:text-gold-400">
                    ${Number(offering.price || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDeleteOffering(offering)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title="Remove offering"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD OFFERING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-lift dark:bg-card dark:border-line animate-scalein">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display text-lg font-bold text-brand-900 dark:text-brand-100">
                Publish New Offering
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-muted hover:bg-brand-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase">Offering Name</label>
                <input
                  type="text"
                  required
                  value={newOffering.name}
                  onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
                  placeholder="e.g. Sunset Angkor Boat Cruise"
                  className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none dark:bg-canvas dark:border-line"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase">Type</label>
                  <select
                    value={newOffering.offeringType}
                    onChange={(e) => setNewOffering({ ...newOffering, offeringType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none dark:bg-canvas dark:border-line"
                  >
                    <option value="ROOM">Hotel Room</option>
                    <option value="TOUR">Tour Package</option>
                    <option value="FOOD">Food Dish</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted uppercase">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newOffering.price}
                    onChange={(e) => setNewOffering({ ...newOffering, price: e.target.value })}
                    placeholder="45.00"
                    className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none dark:bg-canvas dark:border-line"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase">Category / Tag</label>
                <input
                  type="text"
                  value={newOffering.category}
                  onChange={(e) => setNewOffering({ ...newOffering, category: e.target.value })}
                  placeholder="e.g. Deluxe Suite, Signature Main, Half-Day"
                  className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none dark:bg-canvas dark:border-line"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted uppercase">Description</label>
                <textarea
                  rows={3}
                  value={newOffering.description}
                  onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                  placeholder="Short overview of what is included in this service..."
                  className="mt-1 w-full rounded-xl border border-line px-3 py-2 text-xs font-semibold text-ink focus:border-brand-600 focus:outline-none dark:bg-canvas dark:border-line"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-line px-4 py-2 text-xs font-bold text-muted hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-brand-700 px-5 py-2 text-xs font-bold text-white hover:bg-brand-800 shadow-soft"
                >
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
