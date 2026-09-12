import { CalendarCheck, DollarSign, BedDouble, MapPin, Star } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

const recommendations = [
  { title: "Enable Dynamic Pricing", description: "Based on demand patterns, you could increase weekday rates by 12% without impacting occupancy.", impact: "High", category: "Revenue" },
  { title: "Launch Social Media Campaign", description: "Properties with active social presence see 35% more direct bookings. Consider promoting your top listings.", impact: "Medium", category: "Marketing" },
  { title: "Respond to Reviews", description: "Responding to reviews increases guest trust and repeat bookings by 20%.", impact: "High", category: "Guest Experience" },
  { title: "Update Property Photos", description: "Listings with professional photos receive 40% more views. Refresh your best-performing properties.", impact: "Medium", category: "Marketing" },
];

const impactStyle = {
  High: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  Medium: "bg-orange-50 text-orange-600",
  Low: "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300",
};

const categoryStyle = {
  Revenue: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  Marketing: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  "Guest Experience": "bg-purple-50 text-purple-600",
};

export default function OwnerInsightsPage() {
  const { data } = useDashboardData();

  const insights = data
    ? [
        {
          title: "Total Bookings",
          value: String(data.totalBookings),
          description: `${data.roomBookings.length} room, ${data.ticketBookings.length} ticket, ${data.foodOrders.length} food bookings recorded`,
          icon: CalendarCheck,
          color: "bg-blue-50 text-blue-600",
        },
        {
          title: "Total Revenue",
          value: data.revenueText,
          description: "Accumulated from confirmed room, ticket, and food bookings",
          icon: DollarSign,
          color: "bg-green-50 text-green-600",
        },
        {
          title: "Occupancy",
          value: `${data.occupancyRate ?? 0}%`,
          description: `${data.rooms.length} rooms listed across ${data.totalHotels} properties`,
          icon: BedDouble,
          color: "bg-orange-50 text-orange-600",
        },
        {
          title: "Average Rating",
          value: data.avgRating ? `${data.avgRating}/5` : "—",
          description: `${data.totalPlaces} destinations rated by visitors`,
          icon: Star,
          color: "bg-yellow-50 text-yellow-600",
        },
      ]
    : [];

  const topProperty = data?.topProperties?.[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Live insights from your bookings and listings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div key={item.title} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {topProperty && (
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Top Performing Property</p>
            <h3 className="text-sm text-gray-900 dark:text-white">{topProperty.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">{topProperty.bookings} bookings</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{topProperty.revenueText}</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h2>
        <div className="space-y-3">
          {recommendations.map((r, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{r.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${categoryStyle[r.category]}`}>{r.category}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{r.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${impactStyle[r.impact]}`}>
                  {r.impact} Impact
                </span>
                <button className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}