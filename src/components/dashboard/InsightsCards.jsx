import { TrendingUp, BedDouble, MapPin, UtensilsCrossed } from "lucide-react";
import useDashboardData from "../../hooks/useDashboardData";

export default function InsightsCards() {
  const { data } = useDashboardData();

  const insights = data
    ? [
        {
          icon: TrendingUp,
          title: `${data.totalBookings} bookings recorded`,
          description: `${data.totalChannel} across rooms, tickets and food orders.`,
          accent: "border-l-green-500",
          iconColor: "text-green-500",
        },
        {
          icon: MapPin,
          title: `${data.totalPlaces} destinations live`,
          description: `${data.tickets.length} tickets purchasable across Cambodia.`,
          accent: "border-l-orange-500",
          iconColor: "text-orange-500",
        },
        {
          icon: BedDouble,
          title: `${data.totalHotels} properties and ${data.totalRooms} rooms`,
          description: "Popularity ranked from actual room bookings.",
          accent: "border-l-yellow-500",
          iconColor: "text-yellow-500",
        },
        {
          icon: UtensilsCrossed,
          title: `${data.totalRestaurants} restaurants, ${data.totalFoods} dishes`,
          description: `${data.foodOrders.length} food orders placed through the app.`,
          accent: "border-l-blue-500",
          iconColor: "text-blue-500",
        },
      ]
    : [];

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