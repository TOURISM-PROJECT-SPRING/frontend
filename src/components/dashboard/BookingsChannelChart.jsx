import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useDashboardData from "../../admin/hooks/useDashboardData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg shadow-lg p-2.5">
      <p className="text-xs font-semibold text-gray-900 dark:text-white">{item.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {item.value} booking{item.value === 1 ? "" : "s"}
      </p>
    </div>
  );
};

export default function BookingsChannelChart() {
  const { data } = useDashboardData();
  const chartData = data?.bookingsByType || [];
  const total = data?.totalChannel || 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bookings by Channel</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Total: {total} bookings</p>
      </div>

      {chartData.length ? (
        <div className="flex items-center gap-6">
          <div className="w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
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
                  <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{item.value}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 w-10 text-right">
                    {total ? Math.round((item.value / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">
          No bookings yet.
        </div>
      )}
    </div>
  );
}