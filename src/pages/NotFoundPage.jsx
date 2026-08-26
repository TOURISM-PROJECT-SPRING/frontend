import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-14 sm:pt-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
          <span className="text-4xl sm:text-5xl font-extrabold text-primary">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t("notFound.title")}
        </h1>
        <p className="text-gray-400 mt-2.5 sm:mt-3 text-sm sm:text-base max-w-sm mx-auto">
          {t("notFound.subtitle")}
        </p>
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-200 text-gray-600 text-xs sm:text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("notFound.goBack")}
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {t("notFound.home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
