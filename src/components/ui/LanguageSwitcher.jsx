import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const LANGUAGES = [
  {
    code: "km",
    label: "ភាសាខ្មែរ",
    short: "KM",
    flag: "🇰🇭",
    sub: "Khmer",
  },
  {
    code: "en",
    label: "English",
    short: "EN",
    flag: "🇬🇧",
    sub: "English",
  },
];

export default function LanguageSwitcher({ className = "", compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 items-center gap-1.5 rounded-xl border border-line/60 bg-white/80 dark:bg-card dark:border-line px-3 text-sm font-semibold text-ink/80 shadow-xs transition-all hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 dark:hover:border-gold-500/40 dark:hover:text-gold-300 focus:outline-none"
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="font-bold">{compact ? currentLang.short : currentLang.label}</span>
        <Icon
          name="chevron-down"
          size={14}
          className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 mt-1 w-44 animate-scalein overflow-hidden rounded-2xl border border-line bg-white dark:bg-card p-1.5 shadow-lift">
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted/70">
            Language / ភាសា
          </div>
          <div className="space-y-0.5">
            {LANGUAGES.map((lang) => {
              const active = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 font-bold text-brand-700"
                      : "text-ink/80 hover:bg-canvas hover:text-brand-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div>
                      <span className="block leading-tight">{lang.label}</span>
                      <span className="text-[11px] font-normal text-muted">{lang.sub}</span>
                    </div>
                  </div>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
