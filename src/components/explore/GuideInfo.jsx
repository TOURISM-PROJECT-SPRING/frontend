import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";
import { money } from "../../lib/format";

function initials(name) {
  return (name || "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function GuideInfo({ guide, compact = false }) {
  const { t } = useTranslation();
  const g = guide || { name: t("guide.licensedGuide"), languages: t("guide.languagesShort"), experience: 5 };
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-gold-400 ring-2 ring-gold-400/40">
        {initials(g.name) || t("guide.licensedGuide")}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-brand-800">{g.name}</p>
        <p className="truncate text-xs font-medium text-muted">
          {g.experience != null && g.experience > 0 ? t("guide.yearsExp", { count: g.experience }) : t("guide.localExpert")} · {g.languages || t("guide.languagesShort")}
        </p>
        {!compact && g.rating != null && (
          <p className="flex items-center gap-1 text-xs font-bold text-gold-600">
            <Icon name="star" size={12} className="fill-current" /> {t("guide.rating", { count: g.rating })}
          </p>
        )}
      </div>
    </div>
  );
}

export function GuideFallbackNote() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-700 text-gold-400">
        <Icon name="users" size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-brand-800">{t("guide.ledByLicensed")}</p>
        <p className="text-xs text-muted">{t("guide.languagesNote")}</p>
      </div>
    </div>
  );
}

export function GuidePill({ guide }) {
  const { t } = useTranslation();
  const g = guide || {};
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[11px] font-bold text-brand-700">
      <Icon name="user" size={12} className="text-gold-600" />
      {g.name || t("guide.licensedGuide")} {g.experience ? `· ${t("guide.yearsExp", { count: g.experience })}` : ""}
      {g.ratePerDay != null && ` · ${money(g.ratePerDay)}${t("guide.perDay")}`}
    </span>
  );
}