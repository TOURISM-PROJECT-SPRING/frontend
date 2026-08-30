import { useTranslation } from "react-i18next";
import { Percent, Tag, ArrowRight, Mail } from "lucide-react";
import { offers } from "../data/listings";
import PageBanner from "../components/ui/PageBanner";

export default function OffersPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.offers.eyebrow"
        title="banners.offers.title"
        subtitle="banners.offers.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12 lg:mb-16">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all group"
            >
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-red-500 text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {offer.discount}
                </div>
                {offer.validUntil && (
                  <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur-sm text-gray-600 text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    {t("offers.validUntil")} {offer.validUntil}
                  </div>
                )}
              </div>
              <div className="p-3.5 sm:p-4 lg:p-5">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  {offer.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                  {offer.description}
                </p>
                {offer.code && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                    <code className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/5 text-primary text-xs sm:text-sm font-bold rounded-md tracking-wider">
                      {offer.code}
                    </code>
                  </div>
                )}
                <button className="mt-3 sm:mt-4 flex items-center gap-1 px-3 sm:px-4 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                  {t("offers.claimNow")}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
          <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2.5 sm:mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {t("offers.newsletter.title")}
          </h2>
          <p className="text-white/70 mt-2 text-sm sm:text-base max-w-md mx-auto">
            {t("offers.newsletter.desc")}
          </p>
          <div className="flex w-full sm:w-auto mx-auto mt-4 sm:mt-6 max-w-md">
            <input
              type="email"
              placeholder={t("offers.newsletter.placeholder")}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-l-xl text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-950 text-primary text-xs sm:text-sm font-bold rounded-r-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0">
              {t("offers.newsletter.subscribe")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
