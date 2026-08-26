import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Star, MapPin, SlidersHorizontal } from "lucide-react";
import { stays, tours, dining } from "../data/listings";
import PageBanner from "../components/ui/PageBanner";

const allListings = [
  ...stays.map((item) => ({ ...item, category: "stays" })),
  ...tours.map((item) => ({ ...item, category: "tours" })),
  ...dining.map((item) => ({ ...item, category: "dining" })),
];

const categories = ["all", "stays", "tours", "dining"];

export default function DestinationsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = allListings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50/80">
      <PageBanner
        image="https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.destinations.eyebrow"
        title="banners.destinations.title"
        subtitle="banners.destinations.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("destinations.searchPlaceholder")}
              className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 sm:py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-500">{t("destinations.filter")}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t(`destinations.categories.${cat}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group"
            >
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                  {item.rating}
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900">{item.title}</h3>
                {item.location && (
                  <p className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                )}
                {item.price && (
                  <p className="mt-2 text-xs sm:text-sm font-bold text-primary">
                    {t("destinations.from")} ${item.price}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-400 text-sm sm:text-base">{t("destinations.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
