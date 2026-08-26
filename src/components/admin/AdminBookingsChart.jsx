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
  { day: "Mon", hotel: 45, ticket: 32, tour: 18 },
  { day: "Tue", hotel: 52, ticket: 38, tour: 24 },
  { day: "Wed", hotel: 48, ticket: 35, tour: 20 },
  { day: "Thu", hotel: 61, ticket: 42, tour: 28 },
  { day: "Fri", hotel: 55, ticket: 40, tour: 25 },
  { day: "Sat", hotel: 72, ticket: 50, tour: 35 },
  { day: "Sun", hotel: 68, ticket: 48, tour: 30 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500 dark:text-gray-400">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminBookingsChart() {
  const [timeframe, setTimeframe] = useState("This Week");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bookings Overview</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Weekly booking trends</p>
        </div>
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="hotel" name="Hotel Bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} />
            <Line type="monotone" dataKey="ticket" name="Ticket Bookings" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: "#22c55e" }} />
            <Line type="monotone" dataKey="tour" name="Tour Bookings" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: "#a855f7" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500">Hotel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500">Ticket</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500">Tour</span>
        </div>
      </div>
    </div>
  );
}
