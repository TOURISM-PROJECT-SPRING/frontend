import { useTranslation } from "react-i18next";
import { BadgeCheck, Headphones, XCircle, ShieldCheck } from "lucide-react";

const featureKeys = [
  { title: "trust.bestPrice", desc: "trust.bestPriceDesc", icon: BadgeCheck },
  { title: "trust.support", desc: "trust.supportDesc", icon: Headphones },
  { title: "trust.freeCancel", desc: "trust.freeCancelDesc", icon: XCircle },
  { title: "trust.trusted", desc: "trust.trustedDesc", icon: ShieldCheck },
];

export default function TrustBar() {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-10 bg-white dark:bg-gray-950 w-full">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featureKeys.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-gray-50/80 dark:bg-gray-900/80 hover:bg-primary/5 transition-colors"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{t(title)}</h3>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t(desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
