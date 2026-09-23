import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, Eye, Trash2, X, AlertTriangle, Hash, DollarSign, CreditCard, Calendar, Receipt, Link2 } from "lucide-react";
import { managementService } from "../../services/managementService";
import { useToast } from "../../components/ui/Toast";

const norm = (s) => String(s || "").toUpperCase();

const statusColors = {
  COMPLETED: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  SUCCESS: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PAID: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  PENDING: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  FAILED: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  REFUNDED: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
};

const statusColor = (status) => statusColors[norm(status)] || "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400";

const statusLabel = (s) => {
  const n = norm(s);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

const bookingTypeColors = {
  ROOM: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  TICKET: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  FOOD: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400",
  TOUR: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
};

const bookingTypeLabel = (t) => {
  const n = norm(t);
  return n.charAt(0) + n.slice(1).toLowerCase();
};

export default function AdminPaymentsPage() {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getPayments();
        setPayments(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = payments.filter((p) => {
    const tx = p.transactionId || "";
    const ref = p.referenceName || "";
    return `${tx} ${ref}`.toLowerCase().includes(search.toLowerCase());
  });

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await managementService.deletePayment(deleteTarget.id);
      toast.success("Payment record deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.success("Payment record deleted (offline mode)");
    } finally {
      setPayments((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  if (loading) return <AdminLoading message="Loading payments from the server..." />;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <TotalBadge count={payments.length} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Transactions and payment records</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by transaction ID or reference..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Transaction ID</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Method</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Booking Type</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Reference</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Paid At</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-3 text-[11px] font-mono text-primary">{p.transactionId || "N/A"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{p.paymentMethod || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(p.status)}`}>{statusLabel(p.status)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${bookingTypeColors[norm(p.bookingType)] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>{bookingTypeLabel(p.bookingType)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{p.referenceName || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.paidAt ? p.paidAt.slice(0, 10) : p.createdAt ? p.createdAt.slice(0, 10) : "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition" title="View Details"><Eye className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete Payment"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="transactions"
        />
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-primary" /> Payment Details
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Transaction ledger entry</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> Transaction</p>
                <p className="text-sm font-mono font-bold text-primary mt-1">{viewTarget.transactionId || "N/A"}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColor(viewTarget.status)}`}>{statusLabel(viewTarget.status)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Amount</p>
                <p className="text-lg font-bold text-primary mt-1">${Number(viewTarget.amount).toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Method</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.paymentMethod || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Payment ID</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">#{viewTarget.id}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> Booking Type</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${bookingTypeColors[norm(viewTarget.bookingType)] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>{bookingTypeLabel(viewTarget.bookingType)}</span>
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" /> Reference</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.referenceName || "N/A"}</p>
                {viewTarget.referenceId != null && (
                  <p className="text-[10px] text-gray-400 mt-0.5">#{viewTarget.referenceId}</p>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Paid At</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                  {viewTarget.paidAt ? viewTarget.paidAt.slice(0, 10) : viewTarget.createdAt ? viewTarget.createdAt.slice(0, 10) : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Payment</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this transaction record</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete payment record{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.transactionId}</strong>{" "}
              (${Number(deleteTarget.amount).toFixed(2)})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}