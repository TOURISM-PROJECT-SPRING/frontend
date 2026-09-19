import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useDashboardData from "../../hooks/useDashboardData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">${item.value.toLocaleString()} ({item.pct})</p>
    </div>
  );
};

export default function AdminRevenueChart() {
  const { data } = useDashboardData();

  const raw = data
    ? [
        { name: "Hotel Bookings", value: data.roomBookings.reduce((s, b) => s + (Number(b.amount) || 0), 0), color: "#3b82f6" },
        { name: "Ticket Bookings", value: data.ticketBookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0), color: "#22c55e" },
        { name: "Food Orders", value: data.foodOrders.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0), color: "#f59e0b" },
      ].filter((x) => x.value > 0)
    : [];
  const total = raw.reduce((s, x) => s + x.value, 0) || 1;
  const chartData = raw.map((x) => ({ ...x, pct: `${((x.value / total) * 100).toFixed(1)}%` }));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 animate-fade-in-up delay-150 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total: {data?.revenueText || "$0"}</p>
        </div>
      </div>

      {chartData.length ? (
        <div className="flex flex-1 items-center gap-5 py-2">
          <div className="w-40 h-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2">
            {chartData.map((item) => (
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
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          No revenue yet.
        </div>
      )}
    </div>
  );
}