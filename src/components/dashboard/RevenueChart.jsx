import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import useDashboardData from "../../admin/hooks/useDashboardData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{payload[0].payload.label}</p>
      <p className="text-xs text-blue-500">Revenue: ${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function RevenueChart() {
  const { data } = useDashboardData();
  const [timeframe, setTimeframe] = useState("Monthly");

  const chartData = (data || { revenueByMonth: [], revenueByWeekday: [] })[
    timeframe === "Weekly" ? "revenueByWeekday" : "revenueByMonth"
  ].map((item) => ({ label: item.month || item.day, revenue: item.revenue }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {timeframe === "Weekly" ? "Revenue by weekday" : "Monthly comparison"}
          </p>
        </div>
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      {chartData.length ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-56 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          No booking revenue in this period yet.
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-[2px] bg-blue-500 rounded-full" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">Revenue</span>
        </div>
      </div>
    </div>
  );
}