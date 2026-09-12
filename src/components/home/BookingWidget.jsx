import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Hotel,
  Compass,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
} from "lucide-react";

const inputWrapper =
  "flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all";
const inputField =
  "w-full bg-transparent text-xs sm:text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none";

export default function BookingWidget() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stays");
  const [location, setLocation] = useState("");
  const [guests] = useState(t("booking.guestsDefault"));

  const tabs = [
    { id: "stays", label: t("booking.stays"), icon: Hotel },
    { id: "tours", label: t("booking.tours"), icon: Compass },
    { id: "dining", label: t("booking.dining"), icon: UtensilsCrossed },
    { id: "experiences", label: t("booking.experiences"), icon: Sparkles },
  ];

  const handleSearch = () => {
    if (activeTab === "experiences") {
      navigate("/featured-experiences");
      return;
    }
    const query = new URLSearchParams();
    query.set("tab", activeTab);
    if (location.trim()) query.set("q", location.trim());
    navigate(`/destinations?${query.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 md:-mt-16 pb-6 sm:pb-8 w-full">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-gray-900/60 border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto hide-scrollbar">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 md:px-6 py-3 sm:py-3.5 text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-4 md:p-5">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-2.5 sm:gap-3">
              <div className="flex-1 min-w-0 sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-gray-400 mb-1 sm:mb-1.5">
                  {t("booking.location")}
                </label>
                <div className={inputWrapper}>
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t("booking.locationPlaceholder")}
                    className={inputField}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-400 mb-1 sm:mb-1.5">
                  {t("booking.checkin")}
                </label>
                <div className={inputWrapper}>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={t("booking.addDate")}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    className={inputField}
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-gray-400 mb-1 sm:mb-1.5">
                  {t("booking.checkout")}
                </label>
                <div className={inputWrapper}>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={t("booking.addDate")}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    className={inputField}
                  />
                </div>
              </div>

              <div className="sm:col-span-1 lg:col-span-1">
                <label className="block text-xs font-medium text-gray-400 mb-1 sm:mb-1.5">
                  {t("booking.guests")}
                </label>
                <div className={`${inputWrapper} cursor-pointer`}>
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                   <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">
                    {guests}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                </div>
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t("booking.search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
