import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";

export default function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-brand-700 px-6 py-16 text-center shadow-lift sm:px-12 lg:py-20">
        <div className="khmer-motif absolute inset-0 -z-10 opacity-50" />
        <div className="absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-gold-400/20 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 -z-10 h-64 w-64 rounded-full bg-brand-500/40 blur-2xl" />

        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-200">
          <Icon name="compass" size={15} className="text-gold-400" />
          {t("finalCta.eyebrow")}
        </span>

        <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("finalCta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
          {t("finalCta.subtitle")}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#great-for" className="group inline-flex items-center gap-2 rounded-xl bg-gold-400 px-7 py-3.5 text-sm font-bold text-brand-900 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-gold-300">
            {t("finalCta.btnTours") || "Explore Cambodia"}
            <Icon name="arrow-right" size={17} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
          </a>
          <a href="#essentials" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors duration-500 ease-out hover:bg-white/15">
            {t("finalCta.btnHotels") || "Discover Tours"}
          </a>
        </div>
      </div>
    </section>
  );
}
