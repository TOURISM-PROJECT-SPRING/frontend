import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const data = [
  { day: "Mon", thisWeek: 5200, lastWeek: 4100 },
  { day: "Tue", thisWeek: 7800, lastWeek: 6200 },
  { day: "Wed", thisWeek: 6500, lastWeek: 5800 },
  { day: "Thu", thisWeek: 8900, lastWeek: 7100 },
  { day: "Fri", thisWeek: 7200, lastWeek: 6800 },
  { day: "Sat", thisWeek: 9500, lastWeek: 8200 },
  { day: "Sun", thisWeek: 3865, lastWeek: 4500 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState("Weekly");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Weekly comparison</p>
        </div>
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="thisWeek" name="This Week" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="lastWeek" name="Last Week" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2, fill: "#d1d5db" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-[2px] bg-blue-500 rounded-full" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">This Week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-[2px] bg-gray-300 dark:bg-gray-600 rounded-full" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500">Last Week</span>
        </div>
      </div>
    </div>
  );
}
