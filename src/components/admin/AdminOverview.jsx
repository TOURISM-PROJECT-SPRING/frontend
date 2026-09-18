import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import AdminLoading from "./AdminLoading";
import AdminKPICards from "./AdminKPICards";
import AdminBookingsChart from "./AdminBookingsChart";
import AdminRevenueChart from "./AdminRevenueChart";
import AdminRecentBookings from "./AdminRecentBookings";
import AdminTopPlaces from "./AdminTopPlaces";
import AdminSystemStats from "./AdminSystemStats";
import AdminRecentActivities from "./AdminRecentActivities";
import AdminQuickActions from "./AdminQuickActions";

function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdminOverview() {
  const { loading, error, data, reload } = useDashboardData();
  const { user } = useAuth();
  const problem = error || data?.error;

  const displayName = user?.fullname || user?.username || "Admin";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {greetingFor()}, {displayName}!
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Here&apos;s what&apos;s happening with your system today.
        </p>
      </div>

      {loading && <AdminLoading skeleton message="Loading dashboard from the server..." />}

      {!loading && (problem || data?.partial) && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <span>
            {problem
              ? `Backend: ${problem}`
              : `Some dashboard data could not be loaded (${data.failedSources.join(", ")}). Showing partial results.`}
          </span>
          <button
            type="button"
            onClick={reload}
            className="shrink-0 rounded-lg border border-amber-300 dark:border-amber-500/40 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition"
          >
            Retry
          </button>
        </div>
      )}

      <AdminKPICards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <AdminBookingsChart />
        </div>
        <div>
          <AdminRevenueChart />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <AdminRecentBookings />
          <AdminRecentActivities />
        </div>
        <div className="space-y-5">
          <AdminQuickActions />
          <AdminTopPlaces />
          <AdminSystemStats />
        </div>
      </div>
    </div>
  );
}
