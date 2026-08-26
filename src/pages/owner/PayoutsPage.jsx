import { Wallet, DollarSign, CreditCard, TrendingUp, Download } from "lucide-react";

const payouts = [
  { id: "PO-1241", date: "May 25, 2025", amount: "$4,250.00", method: "Bank Transfer", status: "Completed", reference: "TXN-88412" },
  { id: "PO-1240", date: "May 18, 2025", amount: "$3,890.00", method: "Bank Transfer", status: "Completed", reference: "TXN-88390" },
  { id: "PO-1239", date: "May 11, 2025", amount: "$4,120.00", method: "Bank Transfer", status: "Completed", reference: "TXN-88356" },
  { id: "PO-1238", date: "May 4, 2025", amount: "$3,560.00", method: "Bank Transfer", status: "Completed", reference: "TXN-88312" },
  { id: "PO-1237", date: "Apr 27, 2025", amount: "$2,980.00", method: "PayPal", status: "Completed", reference: "TXN-88278" },
];

const statusStyle = {
  Completed: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Processing: "bg-orange-50 text-orange-600",
  Pending: "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300",
};

export default function OwnerPayoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payouts</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Track your earnings and payout history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Download className="w-4 h-4" />
          Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">$48,965</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Total Revenue (May)</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">$18,800</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Total Payouts (May)</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">$3,250</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Pending Payout</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">+18.6%</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">vs Last Month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Payout History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Payout ID</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Method</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Reference</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{p.date}</td>
                  <td className="px-5 py-3 text-sm font-bold text-gray-900 dark:text-white">{p.amount}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">{p.method}</td>
                  <td className="px-5 py-3 text-xs font-mono text-gray-500 dark:text-gray-400 hidden lg:table-cell">{p.reference}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle[p.status]}`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
