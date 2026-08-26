import { useTranslation } from "react-i18next";
import { ArrowRight, Star, MapPin } from "lucide-react";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[550px] lg:min-h-[640px] flex items-center pt-14 sm:pt-16 overflow-hidden w-full">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=1920&h=1080&fit=crop&q=80"
          alt="Angkor Wat at sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent" />
      </div>

      <div className="relative w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium mb-4 sm:mb-5">
              <MapPin className="w-3.5 h-3.5" />
              {t("hero.gateway")}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              {t("hero.headline1")}
              <br />
              <span className="text-blue-300">{t("hero.headline2")}</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t("hero.subtext")}
            </p>

            <button className="mt-5 sm:mt-7 inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25">
              {t("hero.exploreNow")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="glass rounded-2xl p-2.5 sm:p-3 max-w-[240px] sm:max-w-[280px] w-full">
              <img
                src="https://images.unsplash.com/photo-1508159441828-3d031a33e1e3?w=400&h=250&fit=crop&q=80"
                alt="Angkor Wat"
                className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-xl"
              />
              <div className="flex items-center justify-between mt-2.5 sm:mt-3 px-1">
                <div>
                  <h3 className="text-white font-semibold text-xs sm:text-sm">
                    {t("hero.angkorWat")}
                  </h3>
                  <p className="text-white/50 text-[10px] sm:text-xs mt-0.5">
                    {t("hero.ancientTemple")}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/90 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shrink-0">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                  4.8
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
