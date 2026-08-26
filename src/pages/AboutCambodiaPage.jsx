import { useTranslation } from "react-i18next";
import {
  Play,
  ArrowRight,
  Landmark,
  Mountain,
  Palmtree,
  Building2,
  Users,
  MapPin,
  Calendar,
  Globe,
  ShieldCheck,
  UtensilsCrossed,
  Star,
  ChevronRight,
  Heart,
} from "lucide-react";

const FacebookIcon1 = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon1 = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const TwitterIcon1 = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon1 = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const historyCards = [
  {
    title: "Angkor Wat",
    century: "12th Century",
    image:
      "https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=400&h=250&fit=crop&q=80",
  },
  {
    title: "Bayon Temple",
    century: "13th Century",
    image:
      "https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=400&h=250&fit=crop&q=80",
  },
  {
    title: "Ta Prohm",
    century: "12th Century",
    image:
      "https://images.unsplash.com/photo-1553697388-94e804e2de0a?w=400&h=250&fit=crop&q=80",
  },
];

const categories = [
  {
    key: "aboutCambodia.categories.landmarks",
    icon: Landmark,
    image:
      "https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=600&h=400&fit=crop&q=80",
  },
  {
    key: "aboutCambodia.categories.nature",
    icon: Mountain,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80",
  },
  {
    key: "aboutCambodia.categories.culture",
    icon: Palmtree,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop&q=80",
  },
  {
    key: "aboutCambodia.categories.cities",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&h=400&fit=crop&q=80",
  },
];

const regions = [
  { key: "aboutCambodia.regions.siemReap", icon: Landmark },
  { key: "aboutCambodia.regions.phnomPenh", icon: Building2 },
  { key: "aboutCambodia.regions.sihanoukville", icon: Palmtree },
  { key: "aboutCambodia.regions.battambang", icon: Users },
  { key: "aboutCambodia.regions.mondulkiri", icon: Mountain },
];

const trustReasons = [
  { key: "aboutCambodia.trust.heritage", icon: Landmark },
  { key: "aboutCambodia.trust.nature", icon: Mountain },
  { key: "aboutCambodia.trust.hospitality", icon: Users },
  { key: "aboutCambodia.trust.cuisine", icon: UtensilsCrossed },
  { key: "aboutCambodia.trust.safety", icon: ShieldCheck },
];

const featuredExperiences = [
  {
    title: "Sunrise at Angkor Wat",
    location: "Siem Reap",
    rating: 4.9,
    reviews: 2847,
    price: 35,
    image:
      "https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=400&h=250&fit=crop&q=80",
  },
  {
    title: "Kulen Waterfall Adventure",
    location: "Phnom Kulen",
    rating: 4.8,
    reviews: 1203,
    price: 45,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&q=80",
  },
  {
    title: "Floating Village Tour",
    location: "Tonle Sap Lake",
    rating: 4.7,
    reviews: 956,
    price: 30,
    image:
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400&h=250&fit=crop&q=80",
  },
  {
    title: "Khmer Cooking Class",
    location: "Phnom Penh",
    rating: 4.9,
    reviews: 743,
    price: 25,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=250&fit=crop&q=80",
  },
];

const footerLinks = {
  explore: [
    { key: "footer.links.destinations", href: "/destinations" },
    { key: "footer.links.staysHotels", href: "/stays" },
    { key: "footer.links.toursActivities", href: "/tours" },
    { key: "footer.links.foodDining", href: "/dining" },
    { key: "footer.links.specialOffers", href: "/offers" },
  ],
  about: [
    { key: "footer.links.aboutUs", href: "/about" },
    { key: "footer.links.careers", href: "/careers" },
    { key: "footer.links.press", href: "/press" },
    { key: "footer.links.blog", href: "/blog" },
  ],
  support: [
    { key: "footer.links.helpCenter", href: "/help" },
    { key: "footer.links.contactUs", href: "/contact" },
    { key: "footer.links.privacyPolicy", href: "/privacy" },
    { key: "footer.links.termsOfService", href: "/terms" },
  ],
};

const footerSocials = [
  { icon: FacebookIcon1, href: "#", label: "Facebook" },
  { icon: InstagramIcon1, href: "#", label: "Instagram" },
  { icon: TwitterIcon1, href: "#", label: "Twitter" },
  { icon: YoutubeIcon1, href: "#", label: "Youtube" },
];

export default function AboutCambodiaPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[400px] sm:min-h-[480px] md:min-h-[550px] lg:min-h-[640px] flex items-center pt-14 sm:pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=1920&h=1080&fit=crop&q=80"
            alt="Angkor Wat panoramic view"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
        </div>

        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-[11px] sm:text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4">
              {t("aboutCambodia.hero.eyebrow")}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              {t("aboutCambodia.hero.title")}
            </h1>
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/70 max-w-lg leading-relaxed">
              {t("aboutCambodia.hero.description")}
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6 sm:mt-8">
              <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                {t("aboutCambodia.hero.watchVideo")}
              </button>
              <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-white/40 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white/10 transition-colors">
                {t("aboutCambodia.hero.explore")}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Welcome & History ─── */}
      <section className="py-10 sm:py-14 lg:py-16 xl:py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-start">
            {/* Left: Welcome */}
            <div>
              <span className="inline-block text-[10px] sm:text-xs font-semibold text-primary tracking-wider uppercase mb-1.5 sm:mb-2">
                {t("aboutCambodia.welcome.eyebrow")}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {t("aboutCambodia.welcome.title")}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                {t("aboutCambodia.welcome.description")}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  {
                    icon: Globe,
                    label: "aboutCambodia.welcome.landArea",
                    value: "101,035 km²",
                  },
                  {
                    icon: Users,
                    label: "aboutCambodia.welcome.people",
                    value: "16+ Million",
                  },
                  {
                    icon: Calendar,
                    label: "aboutCambodia.welcome.history",
                    value: "4,000+",
                  },
                  {
                    icon: Heart,
                    label: "aboutCambodia.welcome.peace",
                    value: "Peaceful Kingdom",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-400">{t(label)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {t("aboutCambodia.welcome.learnMore")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: History */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-3 sm:mb-4">
                {t("aboutCambodia.history.title")}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-5 sm:mb-6">
                {t("aboutCambodia.history.description")}
              </p>
              <div className="space-y-3">
                {historyCards.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-20 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-400">{card.century}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Explore Categories ─── */}
      <section className="py-10 sm:py-14 lg:py-16 bg-gray-50/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {t("aboutCambodia.categories.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map(({ key, icon: Icon, image }) => (
              <article
                key={key}
                className="relative rounded-2xl overflow-hidden h-56 sm:h-64 lg:h-72 group cursor-pointer"
              >
                <img
                  src={image}
                  alt={t(`${key}.name`)}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-4 sm:p-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-2.5 sm:mb-3">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-0.5 line-clamp-2">
                    {t(`${key}.desc`)}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors"
                  >
                    {t("aboutCambodia.categories.discover")}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Regions Map ─── */}
      <section className="py-10 sm:py-14 lg:py-16 xl:py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            {/* Left: Text */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                {t("aboutCambodia.regions.title")}
              </h2>
              <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                {t("aboutCambodia.regions.subtitle")}
              </p>
              <button className="mt-5 sm:mt-6 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20">
                {t("aboutCambodia.regions.viewAll")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Middle: Map */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="aspect-[3/4] bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 flex items-center justify-center overflow-hidden relative">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Cambodia_%28orthographic_projection%29.svg/400px-Cambodia_%28orthographic_projection%29.svg.png"
                    alt="Cambodia map"
                    className="w-48 h-auto opacity-80"
                  />
                  <div className="absolute top-[20%] left-[55%] w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" />
                  <div className="absolute top-[40%] left-[45%] w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-[60%] left-[60%] w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" style={{ animationDelay: "1s" }} />
                  <div className="absolute top-[35%] left-[30%] w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" style={{ animationDelay: "1.5s" }} />
                  <div className="absolute top-[50%] left-[70%] w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse" style={{ animationDelay: "2s" }} />
                </div>
              </div>
            </div>

            {/* Right: Region List */}
            <div className="lg:col-span-4 space-y-2.5 sm:space-y-3">
              {regions.map(({ key, icon: Icon }) => (
                <a
                  key={key}
                  href="#"
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {t(`${key}.name`)}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {t(`${key}.desc`)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <section className="py-10 sm:py-14 bg-gray-50/80">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight text-center mb-7 sm:mb-10">
            {t("aboutCambodia.trust.title")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {trustReasons.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex flex-col items-center text-center p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-2.5 sm:mb-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {t(`${key}.name`)}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {t(`${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Travel Tips & Featured Experiences ─── */}
      <section className="py-10 sm:py-14 lg:py-16 xl:py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left: Travel Tips */}
            <div className="lg:col-span-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-5">
                {t("aboutCambodia.tips.title")}
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 space-y-3 sm:space-y-4">
                {[
                  { icon: Calendar, key: "aboutCambodia.tips.bestTime" },
                  { icon: Globe, key: "aboutCambodia.tips.currency" },
                  { icon: Users, key: "aboutCambodia.tips.language" },
                  { icon: MapPin, key: "aboutCambodia.tips.gettingAround" },
                ].map(({ icon: Icon, key }) => (
                  <div key={key} className="flex items-start gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        {t(`${key}.label`)}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {t(`${key}.value`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                {t("aboutCambodia.tips.viewMore")}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: Featured Experiences */}
            <div className="lg:col-span-8">
              <div className="flex items-end justify-between mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {t("aboutCambodia.experiences.title")}
                </h2>
                <a
                  href="#"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors shrink-0 ml-4"
                >
                  {t("aboutCambodia.experiences.viewAll")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredExperiences.map((exp) => (
                  <article
                    key={exp.title}
                    className="flex gap-4 bg-white rounded-xl border border-gray-100 p-3 hover:shadow-lg hover:shadow-gray-200/50 transition-all cursor-pointer group"
                  >
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-28 h-24 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                        {exp.title}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-gray-900">
                            {exp.rating}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({exp.reviews.toLocaleString()} {t("aboutCambodia.experiences.reviews")})
                        </span>
                      </div>
                      <p className="text-sm font-bold text-primary mt-1.5">
                        ${exp.price}
                        <span className="text-xs font-normal text-gray-400 ml-0.5">
                          / {t("aboutCambodia.experiences.person")}
                        </span>
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="border-b border-gray-800/80">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t("footer.newsletter")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  {t("footer.newsletterDesc")}
                </p>
              </div>
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder={t("footer.enterEmail")}
                  className="flex-1 md:w-72 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-800/80 border border-gray-700 rounded-l-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors"
                />
                <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-r-lg hover:bg-primary-dark transition-colors shrink-0">
                  {t("footer.subscribe")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
            <div className="col-span-2 sm:col-span-2 lg:col-span-2">
              <a href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Landmark className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="leading-none">
                  <span className="block text-[14px] sm:text-[15px] font-bold text-white">
                    Smart Tourism
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-semibold text-gray-500 tracking-wide uppercase mt-0.5">
                    Cambodia
                  </span>
                </div>
              </a>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4 sm:mb-5 max-w-xs">
                {t("footer.tagline")}
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {footerSocials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                  {t(`footer.sections.${section}`)}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {links.map(({ key, href }) => (
                    <li key={key}>
                      <a
                        href={href}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {t(key)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800/80">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
                &copy; {new Date().getFullYear()} Smart Tourism Cambodia.{" "}
                {t("footer.copyright")}
              </p>
              <p className="text-xs text-gray-600">
                Powered by Smart Tourism
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
