import { useState } from "react";
import { Download, DollarSign, BedDouble, Star, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 18400, bookings: 312 },
  { month: "Feb", revenue: 22100, bookings: 389 },
  { month: "Mar", revenue: 28500, bookings: 445 },
  { month: "Apr", revenue: 35200, bookings: 520 },
  { month: "May", revenue: 42965, bookings: 612 },
  { month: "Jun", revenue: 39800, bookings: 578 },
  { month: "Jul", revenue: 46300, bookings: 685 },
  { month: "Aug", revenue: 51200, bookings: 734 },
  { month: "Sep", revenue: 38700, bookings: 548 },
  { month: "Oct", revenue: 33400, bookings: 467 },
  { month: "Nov", revenue: 27800, bookings: 395 },
  { month: "Dec", revenue: 44200, bookings: 654 },
];

const bookingsByType = [
  { name: "Hotels", value: 1890, color: "#3b82f6" },
  { name: "Tours", value: 1245, color: "#22c55e" },
  { name: "Stays", value: 987, color: "#f59e0b" },
  { name: "Dining", value: 667, color: "#8b5cf6" },
];

const topProperties = [
  { name: "Angkor Wat Villa", revenue: 14200, bookings: 198, occupancy: 92 },
  { name: "Green Park Resort", revenue: 12480, bookings: 165, occupancy: 85 },
  { name: "Paradise Hotel", revenue: 9870, bookings: 132, occupancy: 78 },
  { name: "Riverside Lodge", revenue: 7340, bookings: 98, occupancy: 72 },
  { name: "Sunset Beach Resort", revenue: 5075, bookings: 89, occupancy: 65 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" && p.name === "Revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("year");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Platform-wide performance insights and data exports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {[
              { id: "month", label: "Month" },
              { id: "quarter", label: "Quarter" },
              { id: "year", label: "Year" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-3 py-2 text-xs font-medium transition ${dateRange === r.id ? "bg-primary text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$48,965", icon: DollarSign, iconBg: "bg-green-100 dark:bg-green-500/15", iconColor: "text-green-600" },
          { label: "Total Bookings", value: "4,789", icon: BedDouble, iconBg: "bg-blue-100 dark:bg-blue-500/15", iconColor: "text-blue-600" },
          { label: "Avg. Rating", value: "4.6", icon: Star, iconBg: "bg-yellow-100 dark:bg-yellow-500/15", iconColor: "text-yellow-600" },
          { label: "Active Users", value: "2,568", icon: Users, iconBg: "bg-purple-100 dark:bg-purple-500/15", iconColor: "text-purple-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${m.iconBg} rounded-lg flex items-center justify-center`}>
                <m.icon className={`w-5 h-5 ${m.iconColor}`} />
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
          <div className="h-72">
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Bookings by Type</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingsByType} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {bookingsByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => v.toLocaleString()} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top Properties by Revenue</h3>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Top 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Rank", "Property", "Revenue", "Bookings", "Occupancy"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProperties.map((p, i) => (
                <tr key={p.name} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800/50 transition">
                  <td className="px-5 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 dark:text-gray-500"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-primary">${p.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-300">{p.bookings.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${p.occupancy}%` }} /></div>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{p.occupancy}%</span>
                    </div>
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
