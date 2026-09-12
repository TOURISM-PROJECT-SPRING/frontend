import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { managementService } from "../../services/managementService";

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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading payments from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Transactions and payment records</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by transaction ID or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
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
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}