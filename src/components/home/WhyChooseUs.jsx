import { useTranslation } from "react-i18next";
import { Shield, Headphones, Wallet, Award } from "lucide-react";

const reasons = [
  { icon: Shield, color: "text-green-500 bg-green-50", key: "secure" },
  { icon: Headphones, color: "text-blue-500 bg-blue-50", key: "support" },
  { icon: Wallet, color: "text-amber-500 bg-amber-50", key: "price" },
  { icon: Award, color: "text-purple-500 bg-purple-50", key: "quality" },
];

export default function WhyChooseUs() {
  const { t } = useTranslation();

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            {t("whyUs.badge")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("whyUs.title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <div
              key={r.key}
              className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <div className={`w-12 h-12 ${r.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <r.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                {t(`whyUs.reasons.${r.key}.title`)}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                {t(`whyUs.reasons.${r.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
