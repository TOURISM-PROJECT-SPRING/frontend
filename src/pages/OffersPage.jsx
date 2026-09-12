import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Percent, Tag, ArrowRight, Mail, CheckCircle, Gift } from "lucide-react";
import { offersService } from "../services/offersService";
import { newsletterService } from "../services/newsletterService";
import { pickImage } from "../utils/helpers";
import PageBanner from "../components/ui/PageBanner";
import SafeImage from "../components/ui/SafeImage";
import { InlineLoader } from "../components/ui/AsyncState";
import EmptyState from "../components/ui/EmptyState";

const OFFER_IMAGES = [
  "https://images.unsplash.com/photo-1520256862855-398228c41684?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop&q=80",
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=600&fit=crop&q=80",
];

export default function OffersPage() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const handleClaim = async (offer) => {
    if (!offer.code) return;
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopiedId(offer.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(null);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeError("");
    try {
      await newsletterService.subscribe(email.trim());
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      setSubscribeError(err?.response?.data?.message || t("common.tryAgain"));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promotions = await offersService.getPromotions();
        if (Array.isArray(promotions) && promotions.length > 0) {
          setOffers(
            promotions.map((p, i) => ({
              id: p.id,
              title: p.name,
              description: `${p.hotelName || p.restaurantName || p.tourPackageName || "KhmerStay"} — ${
                p.discountType === "FIXED"
                  ? `$${p.discountValue} off`
                  : `${p.discountValue}% off`
              }`,
              discount:
                p.discountType === "FIXED"
                  ? `$${p.discountValue} OFF`
                  : `${p.discountValue}% OFF`,
              code: p.code,
              validUntil: p.endAt ? p.endAt.slice(0, 10) : undefined,
              image: pickImage(OFFER_IMAGES, i),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          {loading && (
            <div className="col-span-full flex flex-col items-center gap-3 py-12 text-sm text-gray-400 dark:text-gray-500">
              <InlineLoader />
              {t("offers.loading")}
            </div>
          )}
          {!loading && loadError && (
            <div className="col-span-full">
              <EmptyState
                icon={Gift}
                title={t("offers.noOffers")}
                actionLabel={t("common.tryAgain")}
                onAction={() => window.location.reload()}
              />
            </div>
          )}
          {!loading && !loadError && offers.length === 0 && (
            <div className="col-span-full">
              <EmptyState icon={Gift} title={t("offers.noOffers")} />
            </div>
          )}
          {!loading &&
            offers.map((offer) => (
              <article
                key={offer.id}
                className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-none transition-all group"
              >
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <SafeImage
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
                  <button
                    onClick={() => handleClaim(offer)}
                    disabled={!offer.code}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-1 px-3 sm:px-4 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copiedId === offer.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {t("offers.copied")}
                      </>
                    ) : (
                      <>
                        {t("offers.claimNow")}
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </>
                    )}
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
            <form onSubmit={handleSubscribe} className="flex w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("offers.newsletter.placeholder")}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-l-xl text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-950 text-primary text-xs sm:text-sm font-bold rounded-r-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {t("newsletter.subscribed")}
                  </span>
                ) : (
                  t("offers.newsletter.subscribe")
                )}
              </button>
            </form>
          </div>
          {subscribeError && (
            <p className="mt-2.5 text-xs text-white/80">{subscribeError}</p>
          )}
        </div>
      </div>
    </div>
  );
}