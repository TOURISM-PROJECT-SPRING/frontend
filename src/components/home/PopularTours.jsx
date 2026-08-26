import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ArrowRight } from "lucide-react";

const tours = [
  {
    id: 1,
    title: "Angkor Wat Sunrise Tour",
    image: "https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=600&h=400&fit=crop&q=80",
    duration: "Full Day",
    group: "2-8",
    rating: 4.9,
    reviews: 342,
    price: "$45",
    badge: "Best Seller",
    badgeColor: "bg-amber-500",
  },
  {
    id: 2,
    title: "Koh Rong Island Hopping",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80",
    duration: "2 Days",
    group: "4-12",
    rating: 4.8,
    reviews: 218,
    price: "$89",
    badge: "Popular",
    badgeColor: "bg-blue-500",
  },
  {
    id: 3,
    title: "Phnom Penh City Discovery",
    image: "https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=600&h=400&fit=crop&q=80",
    duration: "Half Day",
    group: "2-10",
    rating: 4.7,
    reviews: 156,
    price: "$35",
    badge: "New",
    badgeColor: "bg-emerald-500",
  },
];

export default function PopularTours() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              {t("popularTours.badge")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("popularTours.title")}
            </h2>
          </div>
          <Link
            to="/tours"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition"
          >
            {t("popularTours.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, i) => (
            <div
              key={tour.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 ${tour.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                  {tour.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{tour.rating}</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">({tour.reviews} {t("popularTours.reviews")})</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{tour.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {tour.group}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-lg font-extrabold text-primary">{tour.price}</span>
                  <span className="text-[11px] text-gray-400">{t("popularTours.perPerson")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
