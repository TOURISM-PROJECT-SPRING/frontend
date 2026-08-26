import { TrendingUp, AlertTriangle, BedDouble, Calendar } from "lucide-react";

const insights = [
  { title: "Revenue Growth Trend", value: "+22.4%", description: "Your revenue has been consistently growing over the past 4 weeks. The upward trend is driven by increased bookings from the Smart Tourism App.", icon: TrendingUp, color: "bg-green-50 text-green-600", trend: "up" },
  { title: "Peak Booking Season", value: "Jun-Aug", description: "Historical data shows June to August is your busiest period. Consider increasing rates and preparing additional inventory.", icon: Calendar, color: "bg-blue-50 text-blue-600", trend: "up" },
  { title: "Guest Satisfaction Alert", value: "3 mentions", description: "Recent reviews mention slow Wi-Fi speed at Green Park Resort. Addressing this could improve your overall rating from 4.6 to 4.8.", icon: AlertTriangle, color: "bg-yellow-50 text-yellow-600", trend: "neutral" },
  { title: "Occupancy Opportunity", value: "85% potential", description: "This weekend's occupancy is expected to reach 85%. Consider enabling dynamic pricing to maximize revenue per available room.", icon: BedDouble, color: "bg-orange-50 text-orange-600", trend: "up" },
];

const recommendations = [
  { title: "Enable Dynamic Pricing", description: "Based on demand patterns, you could increase weekday rates by 12% without impacting occupancy.", impact: "High", category: "Revenue" },
  { title: "Launch Social Media Campaign", description: "Properties with active social presence see 35% more direct bookings. Consider promoting your Angkor Wat Villa.", impact: "Medium", category: "Marketing" },
  { title: "Respond to Reviews", description: "You have 5 unanswered reviews. Responding to reviews increases guest trust and repeat bookings by 20%.", impact: "High", category: "Guest Experience" },
  { title: "Update Property Photos", description: "Listings with professional photos receive 40% more views. Consider updating Sunset Beach House photos.", impact: "Medium", category: "Marketing" },
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">AI-powered recommendations to grow your business</p>
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
