import { useTranslation } from "react-i18next";
import { Heart, Users, Award, Globe, MapPin } from "lucide-react";

const stats = [
  { key: "about.stats.happyTravelers", value: "10K+", icon: Heart },
  { key: "about.stats.localPartners", value: "200+", icon: Users },
  { key: "about.stats.awards", value: "15", icon: Award },
  { key: "about.stats.countries", value: "50+", icon: Globe },
];

const values = [
  {
    key: "about.values.authentic",
    desc: "about.values.authenticDesc",
  },
  {
    key: "about.values.sustainable",
    desc: "about.values.sustainableDesc",
  },
  {
    key: "about.values.support",
    desc: "about.values.supportDesc",
  },
  {
    key: "about.values.innovation",
    desc: "about.values.innovationDesc",
  },
];

const team = [
  {
    name: "Sok Vannak",
    roleKey: "about.team.founder",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
  },
  {
    name: "Chan Dara",
    roleKey: "about.team.headOfOperations",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
  },
  {
    name: "Lim Bopha",
    roleKey: "about.team.leadDesigner",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
  },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50/80 pt-14 sm:pt-20">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=1920&h=600&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t("about.hero.title")}
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 sm:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {t("about.story.title")}
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                {t("about.story.p1")}
              </p>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                {t("about.story.p2")}
              </p>
              <div className="mt-5 sm:mt-6 flex items-center gap-2.5 text-sm text-primary font-medium">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                {t("about.story.location")}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=500&fit=crop&q=80"
                alt="Cambodia landscape"
                className="rounded-2xl shadow-xl w-full h-64 sm:h-72 lg:h-80 object-cover"
              />
              <div className="absolute -bottom-4 sm:-bottom-6 -left-3 sm:-left-6 bg-white rounded-xl shadow-lg p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-gray-900">
                    {t("about.story.awardYear")}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    {t("about.story.awardTitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map(({ key, value, icon: Icon }) => (
              <div key={key} className="text-center p-4 sm:p-6 rounded-xl bg-gray-50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center mb-7 sm:mb-10">
            {t("about.values.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map(({ key, desc }) => (
              <div
                key={key}
                className="p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t(key)}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2">{t(desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center mb-7 sm:mb-10">
            {t("about.team.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto object-cover border-4 border-gray-100"
                />
                <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-primary font-medium">{t(member.roleKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
