import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

export default function PageBanner({
  image,
  eyebrow,
  title,
  subtitle,
  children,
  height,
}) {
  const { t } = useTranslation();

  return (
    <section
      className={`relative w-full flex items-center pt-14 sm:pt-16 overflow-hidden ${
        height || "min-h-[240px] sm:min-h-[300px] lg:min-h-[360px]"
      }`}
    >
      <div className="absolute inset-0">
        <img
          src={image}
          alt={t(title)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-gray-900/30" />
      </div>

      <div className="relative w-full mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="max-w-2xl text-center lg:text-left">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium mb-3 sm:mb-4">
              <MapPin className="w-3.5 h-3.5" />
              {t(eyebrow)}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
            {t(title)}
          </h1>
          {subtitle && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              {t(subtitle)}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
