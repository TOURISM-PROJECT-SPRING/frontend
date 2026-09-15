import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const title = isDark ? t("theme.switchToLight") : t("theme.switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      className={`relative grid h-10 w-10 place-items-center rounded-xl border border-line/60 bg-white/80 text-ink/80 shadow-xs transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 focus:outline-none dark:border-line dark:bg-card dark:text-gold-300 dark:hover:border-gold-500/40 dark:hover:bg-brand-50/50 dark:hover:text-gold-200 ${className}`}
    >
      <span className="relative flex items-center justify-center transition-transform duration-300 ease-out hover:scale-110">
        {isDark ? (
          <Icon
            name="sun"
            size={19}
            className="text-gold-400 transition-transform duration-300 rotate-0 hover:rotate-45"
          />
        ) : (
          <Icon
            name="moon"
            size={18}
            className="text-brand-700 transition-transform duration-300 -rotate-12 hover:rotate-0"
          />
        )}
      </span>
    </button>
  );
}
