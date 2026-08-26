import {
  TrendingUp,
  Flame,
  AlertTriangle,
  Megaphone,
} from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Revenue is up 22.4%",
    description: "Keep up the momentum with seasonal promotions.",
    accent: "border-l-green-500",
    iconColor: "text-green-500",
  },
  {
    icon: Flame,
    title: "High demand this weekend",
    description: "Consider adjusting pricing to maximize revenue.",
    accent: "border-l-orange-500",
    iconColor: "text-orange-500",
  },
  {
    icon: AlertTriangle,
    title: "Improve guest experience",
    description: "3 recent reviews mentioned Wi-Fi speed.",
    accent: "border-l-yellow-500",
    iconColor: "text-yellow-500",
  },
  {
    icon: Megaphone,
    title: "Promote your properties",
    description: "Create a limited-time promotion to boost bookings.",
    accent: "border-l-blue-500",
    iconColor: "text-blue-500",
  },
];

export default function InsightsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {insights.map((item, i) => (
        <div
          key={item.title}
          className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 border-l-4 ${item.accent} p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default animate-fade-in-up`}
          style={{ animationDelay: `${i * 100 + 300}ms` }}
        >
          <div className="flex items-start gap-3">
            <item.icon className={`w-4 h-4 ${item.iconColor} mt-0.5 shrink-0 transition-transform duration-300 hover:scale-125`} />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
