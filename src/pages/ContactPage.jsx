import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import PageBanner from "../components/ui/PageBanner";

const contactInfo = [
  {
    key: "contact.info.email",
    value: "info@smarttourismcambodia.com",
    icon: Mail,
    href: "mailto:info@smarttourismcambodia.com",
  },
  {
    key: "contact.info.phone",
    value: "+855 12 345 678",
    icon: Phone,
    href: "tel:+85512345678",
  },
  {
    key: "contact.info.address",
    value: "Phnom Penh, Cambodia",
    icon: MapPin,
  },
  {
    key: "contact.info.hours",
    value: "Mon - Sat: 8:00 AM - 6:00 PM",
    icon: Clock,
  },
];

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-900">
      <PageBanner
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=600&fit=crop&q=80"
        eyebrow="banners.contact.eyebrow"
        title="banners.contact.title"
        subtitle="banners.contact.subtitle"
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <div className="space-y-3 sm:space-y-4">
            {contactInfo.map(({ key, value, icon: Icon, href }) => (
              <div
                key={key}
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-gray-400 dark:text-gray-500">{t(key)}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors break-all"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6 lg:p-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5">
                {t("contact.form.title")}
              </h2>
              <form className="space-y-3.5 sm:space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                      {t("contact.form.firstName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("contact.form.firstNamePlaceholder")}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                      {t("contact.form.lastName")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("contact.form.lastNamePlaceholder")}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:placeholder-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                    {t("contact.form.email")}
                  </label>
                  <input
                    type="email"
                    placeholder={t("contact.form.emailPlaceholder")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                    {t("contact.form.subject")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("contact.form.subjectPlaceholder")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={t("contact.form.messagePlaceholder")}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none dark:placeholder-gray-500"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
