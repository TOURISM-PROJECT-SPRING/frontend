import { useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, THEME_MODES } from "../../context/ThemeContext";

const OPTIONS = [
  { value: THEME_MODES.LIGHT, label: "Light", icon: Sun },
  { value: THEME_MODES.DARK, label: "Dark", icon: Moon },
  { value: THEME_MODES.SYSTEM, label: "System", icon: Monitor },
];

export default function AdminThemeMenu() {
  const { mode, isDark, setThemeMode } = useTheme();
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((option) => option.value === mode) || OPTIONS[2];
  const ActiveIcon = current.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`Theme: ${current.label}`}
        aria-label={`Theme: ${current.label}`}
        className="relative p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
      >
        <ActiveIcon
          className={`w-4.5 h-4.5 ${
            isDark ? "text-amber-400" : "text-gray-600 dark:text-gray-300"
          }`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl py-1.5 z-50 animate-scale-in">
            <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-600">
              Theme
            </p>
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = mode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setThemeMode(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition ${
                    active
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {active && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
