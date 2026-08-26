import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, MapPin, Calendar, Compass, ArrowRight, Star, Globe } from "lucide-react";

const features = [
  { icon: Compass, key: "discover" },
  { icon: Calendar, key: "book" },
  { icon: MapPin, key: "explore" },
];

export default function WelcomeOverlay() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("welcome_seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("welcome_seen", "1");
    setVisible(false);
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const toggleLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" onClick={dismiss} />

      {/* Card */}
      <div className="relative w-full max-w-lg mx-4 animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=800&h=400&fit=crop&q=80"
              alt="Cambodia"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Close button */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Language toggle */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-1 py-0.5">
              <button
                onClick={() => toggleLang("en")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${i18n.language === "en" ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLang("km")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${i18n.language === "km" ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}
              >
                KM
              </button>
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-4 left-5 flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                <Star className="w-3 h-3 fill-current" /> 4.9
              </div>
              <span className="text-white/80 text-xs">2,500+ experiences</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i <= step ? "bg-primary w-8" : "bg-gray-200 w-4"
                  }`}
                />
              ))}
            </div>

            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {t("welcome.greeting")}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {t("welcome.title")}
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {t("welcome.subtitle")}
                </p>

                {/* Features preview */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {features.map((f, i) => (
                    <div
                      key={f.key}
                      className="text-center p-3 bg-gray-50 rounded-xl animate-fade-in-up"
                      style={{ animationDelay: `${i * 100 + 200}ms` }}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <f.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-[11px] font-semibold text-gray-700">
                        {t(`welcome.features.${f.key}.title`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Discover */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {t("welcome.steps.discover.title")}
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {t("welcome.steps.discover.desc")}
                </p>
                <div className="mt-5 space-y-2.5">
                  {["angkorWat", "kohRong", "phnomPenh"].map((place, i) => (
                    <div
                      key={place}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-slide-right"
                      style={{ animationDelay: `${i * 80 + 150}ms` }}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {t(`welcome.places.${place}.name`)}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {t(`welcome.places.${place}.desc`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Get Started */}
            {step === 2 && (
              <div className="animate-fade-in-up text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {t("welcome.steps.ready.title")}
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-sm mx-auto">
                  {t("welcome.steps.ready.desc")}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                  <button
                    onClick={dismiss}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/25"
                  >
                    {t("welcome.steps.ready.start")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={dismiss}
                    className="w-full sm:flex-1 px-6 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition"
                  >
                    {t("welcome.steps.ready.browse")}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={dismiss}
                className="text-xs text-gray-400 hover:text-gray-600 transition"
              >
                {t("welcome.skip")}
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition"
              >
                {step < 2 ? t("welcome.next") : t("welcome.getStarted")}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
