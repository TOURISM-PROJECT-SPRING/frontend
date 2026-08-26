import { BarChart3, Download, TrendingUp, DollarSign, BedDouble } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 28400, bookings: 95 },
  { month: "Feb", revenue: 32100, bookings: 108 },
  { month: "Mar", revenue: 38500, bookings: 124 },
  { month: "Apr", revenue: 41200, bookings: 132 },
  { month: "May", revenue: 48965, bookings: 128 },
];

const propertyPerformance = [
  { name: "Green Park Resort", revenue: 12480, bookings: 42, occupancy: 82 },
  { name: "Paradise Hotel", revenue: 9870, bookings: 35, occupancy: 74 },
  { name: "Angkor Wat Villa", revenue: 14200, bookings: 28, occupancy: 68 },
  { name: "Riverside Lodge", revenue: 6340, bookings: 15, occupancy: 52 },
  { name: "Sunset Beach", revenue: 6075, bookings: 8, occupancy: 38 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.name === "Revenue" ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function OwnerReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">View detailed analytics and export reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$48,965", icon: DollarSign, color: "bg-green-50 text-green-600", iconBg: "bg-green-100" },
          { label: "Total Bookings", value: "128", icon: BedDouble, color: "bg-blue-50 text-blue-600", iconBg: "bg-blue-100" },
          { label: "Avg. Occupancy", value: "68.5%", icon: TrendingUp, color: "bg-orange-50 text-orange-600", iconBg: "bg-orange-100" },
          { label: "Revenue/Room", value: "$362", icon: BarChart3, color: "bg-purple-50 text-purple-600", iconBg: "bg-purple-100" },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${m.iconBg} rounded-lg flex items-center justify-center`}>
                <m.icon className={`w-5 h-5 ${m.color.split(" ")[1]}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{m.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Property Revenue Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
