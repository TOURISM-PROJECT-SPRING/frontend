import { useTranslation } from "react-i18next";
import { Search, CalendarCheck, Map, Sparkles } from "lucide-react";

const steps = [
  { icon: Search, key: "search", color: "bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-300" },
  { icon: CalendarCheck, key: "book", color: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { icon: Map, key: "travel", color: "bg-amber-50 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300" },
  { icon: Sparkles, key: "enjoy", color: "bg-purple-50 text-purple-500 dark:bg-purple-500/15 dark:text-purple-300" },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            {t("howItWorks.badge")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("howItWorks.title")}
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-md mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.key}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gray-200 dark:bg-gray-700" />
              )}
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md">
                {i + 1}
              </div>
              <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10`}>
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                {t(`howItWorks.steps.${step.key}.title`)}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                {t(`howItWorks.steps.${step.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
