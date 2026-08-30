import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Star,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Heart,
  Camera,
  Compass,
  Waves,
  Mountain,
  UtensilsCrossed,
  SlidersHorizontal,
} from "lucide-react";
import PageBanner from "../components/ui/PageBanner";

const categories = [
  { id: "all", icon: Compass, key: "featured.categories.all" },
  { id: "cultural", icon: Camera, key: "featured.categories.cultural" },
  { id: "adventure", icon: Mountain, key: "featured.categories.adventure" },
  { id: "nature", icon: Waves, key: "featured.categories.nature" },
  { id: "culinary", icon: UtensilsCrossed, key: "featured.categories.culinary" },
];

const experiences = [
  {
    id: 1,
    title: "Sunrise at Angkor Wat",
    location: "Siem Reap",
    category: "cultural",
    rating: 4.9,
    reviews: 2847,
    price: 35,
    duration: "4 Hours",
    groupSize: "Max 15",
    badge: "Most Popular",
    image:
      "https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=600&h=400&fit=crop&q=80",
    highlights: ["Sunrise", "Angkor Wat", "Guide", "Transport"],
  },
  {
    id: 2,
    title: "Kulen Waterfall Adventure",
    location: "Phnom Kulen",
    category: "nature",
    rating: 4.8,
    reviews: 1203,
    price: 45,
    duration: "Full Day",
    groupSize: "Max 12",
    badge: "Top Rated",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80",
    highlights: ["Waterfall", "Swimming", "Lunch", "Transport"],
  },
  {
    id: 3,
    title: "Floating Village Tour",
    location: "Tonle Sap Lake",
    category: "cultural",
    rating: 4.7,
    reviews: 956,
    price: 30,
    duration: "Half Day",
    groupSize: "Max 20",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&h=400&fit=crop&q=80",
    highlights: ["Boat Ride", "Village", "Guide", "Lunch"],
  },
  {
    id: 4,
    title: "Khmer Cooking Class",
    location: "Phnom Penh",
    category: "culinary",
    rating: 4.9,
    reviews: 743,
    price: 25,
    duration: "3 Hours",
    groupSize: "Max 8",
    badge: "Editor's Pick",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop&q=80",
    highlights: ["Market Tour", "Cooking", "Recipe Book", "Meal"],
  },
  {
    id: 5,
    title: "Mondulkiri Elephant Sanctuary",
    location: "Mondulkiri",
    category: "nature",
    rating: 4.8,
    reviews: 198,
    price: 55,
    duration: "Full Day",
    groupSize: "Max 10",
    badge: "Eco Friendly",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&q=80",
    highlights: ["Elephants", "Nature", "Guide", "Lunch"],
  },
  {
    id: 6,
    title: "Koh Rong Island Hopping",
    location: "Sihanoukville",
    category: "adventure",
    rating: 4.8,
    reviews: 312,
    price: 45,
    duration: "Full Day",
    groupSize: "Max 16",
    badge: "Adventure",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop&q=80",
    highlights: ["Snorkeling", "Beach", "Lunch", "Boat"],
  },
  {
    id: 7,
    title: "Battambang Countryside",
    location: "Battambang",
    category: "cultural",
    rating: 4.6,
    reviews: 154,
    price: 40,
    duration: "Full Day",
    groupSize: "Max 12",
    badge: "Hidden Gem",
    image:
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=400&fit=crop&q=80",
    highlights: ["Train", "Temple", "Guide", "Transport"],
  },
  {
    id: 8,
    title: "Phnom Penh City Tour",
    location: "Phnom Penh",
    category: "cultural",
    rating: 4.7,
    reviews: 432,
    price: 25,
    duration: "Half Day",
    groupSize: "Max 20",
    badge: "City Tour",
    image:
      "https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=600&h=400&fit=crop&q=80",
    highlights: ["Royal Palace", "Markets", "Guide", "Transport"],
  },
  {
    id: 9,
    title: "Tonle Sap Sunset Cruise",
    location: "Siem Reap",
    category: "adventure",
    rating: 4.7,
    reviews: 289,
    price: 38,
    duration: "2 Hours",
    groupSize: "Max 20",
    badge: "Sunset",
    image:
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&h=400&fit=crop&q=80",
    highlights: ["Sunset", "Boat", "Drinks", "Guide"],
  },
  {
    id: 10,
    title: "Street Food Night Walk",
    location: "Phnom Penh",
    category: "culinary",
    rating: 4.8,
    reviews: 567,
    price: 20,
    duration: "3 Hours",
    groupSize: "Max 12",
    badge: "Foodie Favorite",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80",
    highlights: ["Street Food", "Night Market", "Guide", "Tastings"],
  },
  {
    id: 11,
    title: "Kampot Pepper Farm Tour",
    location: "Kampot",
    category: "culinary",
    rating: 4.6,
    reviews: 134,
    price: 32,
    duration: "Half Day",
    groupSize: "Max 10",
    badge: "Unique",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80",
    highlights: ["Farm Tour", "Tasting", "Guide", "Lunch"],
  },
  {
    id: 12,
    title: "Cardamom Mountains Trek",
    location: "Koh Kong",
    category: "adventure",
    rating: 4.7,
    reviews: 87,
    price: 65,
    duration: "2 Days",
    groupSize: "Max 8",
    badge: "Off the Beaten Path",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop&q=80",
    highlights: ["Trekking", "Camping", "Wildlife", "Guide"],
  },
];

export default function FeaturedExperiencesPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [liked, setLiked] = useState({});
  const [sortBy, setSortBy] = useState("popular");

  const filtered =
    activeCategory === "all"
      ? experiences
      : experiences.filter((e) => e.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.experiences.eyebrow"
        title="banners.experiences.title"
        subtitle="banners.experiences.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Mobile: Stacked filters | Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          {/* Category Filters - Scroll on mobile, wrap on desktop */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
            {categories.map(({ id, icon: Icon, key }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t(key)}
              </button>
            ))}
          </div>

          {/* Sort + Filter row */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="popular">{t("featured.sort.popular")}</option>
                <option value="rating">{t("featured.sort.rating")}</option>
                <option value="price-low">{t("featured.sort.priceLow")}</option>
                <option value="price-high">{t("featured.sort.priceHigh")}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mb-4 sm:mb-6">
          {t("featured.showing", { count: sorted.length })}
        </p>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {sorted.map((exp) => (
            <article
              key={exp.id}
              className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-none transition-all group"
            >
              {/* Image */}
              <div className="relative h-44 sm:h-52 lg:h-56 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-primary/90 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg backdrop-blur-sm">
                  {exp.badge}
                </div>
                {/* Like Button */}
                <button
                  onClick={() => toggleLike(exp.id)}
                  className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                    liked[exp.id]
                      ? "bg-red-500 text-white"
                      : "bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked[exp.id] ? "fill-current" : ""}`}
                  />
                </button>
                {/* Rating */}
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                  {exp.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5 sm:p-4 lg:p-5">
                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{exp.location}</span>
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 ml-auto shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {exp.duration}
                  </div>
                </div>

                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {exp.title}
                </h3>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                  {exp.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-1.5 sm:px-2 py-0.5 bg-primary/5 text-primary text-[10px] sm:text-xs font-medium rounded-md"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Reviews */}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    ({exp.reviews.toLocaleString()} {t("aboutCambodia.experiences.reviews")})
                </p>

                {/* Footer */}
                <div className="flex items-end justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ${exp.price}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5 sm:ml-1">
                      / {t("featured.person")}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      <Users className="w-3.5 h-3.5" />
                      {exp.groupSize}
                    </div>
                  </div>
                  <button className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                    {t("featured.bookNow")}
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {sorted.length === 0 && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-400 dark:text-gray-500 text-base sm:text-lg">
              {t("featured.noResults")}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 sm:mt-12 lg:mt-16 bg-primary rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            {t("featured.cta.title")}
          </h2>
          <p className="text-white/70 mt-2 text-sm sm:text-base max-w-md mx-auto">
            {t("featured.cta.desc")}
          </p>
          <button className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-950 text-primary text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {t("featured.cta.button")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
