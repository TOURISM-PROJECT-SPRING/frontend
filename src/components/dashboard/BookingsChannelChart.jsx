import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Website Direct", value: 56, pct: "43.8%", color: "#3b82f6" },
  { name: "Smart Tourism App", value: 34, pct: "26.6%", color: "#22c55e" },
  { name: "Booking.com", value: 20, pct: "15.6%", color: "#f59e0b" },
  { name: "Expedia", value: 12, pct: "9.4%", color: "#a855f7" },
  { name: "Other", value: 6, pct: "4.6%", color: "#94a3b8" },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload) return null;
  const item = data.find((d) => d.name === payload[0].name);
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{payload[0].value} bookings ({item?.pct})</p>
    </div>
  );
};

export default function BookingsChannelChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bookings by Channel</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total: 128 bookings</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-36 h-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
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
                <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{item.value}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 w-9 text-right">{item.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
