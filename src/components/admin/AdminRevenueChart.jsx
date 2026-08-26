import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const data = [
  { name: "Hotel Bookings", value: 20450, pct: "41.7%", color: "#3b82f6" },
  { name: "Ticket Bookings", value: 12650, pct: "25.8%", color: "#22c55e" },
  { name: "Tour Packages", value: 8780, pct: "17.9%", color: "#a855f7" },
  { name: "Food Orders", value: 4235.5, pct: "8.6%", color: "#f59e0b" },
  { name: "Others", value: 2850, pct: "5.8%", color: "#94a3b8" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload) return null;
  const item = data.find((d) => d.name === payload[0].name);
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">${payload[0].value.toLocaleString()} ({item?.pct})</p>
    </div>
  );
};

export default function AdminRevenueChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-150">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total: $48,965.50</p>
        </div>
        <Link to="/admin/reports" className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition">
          View full report <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-gray-900 dark:text-white">${item.value.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 w-9 text-right">{item.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
