import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { managementService } from "../../services/managementService";
import { downloadCSV } from "../../utils/export";

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

export default function OwnerPayoutsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getPayments();
        setPayments(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payouts:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    const rows = [["Transaction ID", "Date", "Amount", "Reference", "Status"]];
    payments.forEach((p) => {
      rows.push([
        p.transactionId || "N/A",
        p.paidAt ? p.paidAt.slice(0, 10) : p.createdAt ? p.createdAt.slice(0, 10) : "N/A",
        Number(p.amount).toFixed(2),
        p.referenceName || "N/A",
        statusLabel(p.status),
      ]);
    });
    downloadCSV(rows, `owner-payouts-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading payouts from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payouts</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Payment history</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 self-start px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Transaction ID</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Reference</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-5 py-3 text-xs font-mono text-primary">{p.transactionId || "N/A"}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{p.paidAt ? p.paidAt.slice(0, 10) : p.createdAt ? p.createdAt.slice(0, 10) : "N/A"}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900 dark:text-white">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{p.referenceName || "N/A"}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColor(p.status)}`}>{statusLabel(p.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No payouts found.</div>}
      </div>
    </div>
  );
}