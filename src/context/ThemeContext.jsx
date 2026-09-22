import { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext();

const STORAGE_KEY = "theme";

// oxlint-disable-next-line react/only-export-components
export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const SYSTEM_QUERY = "(prefers-color-scheme: dark)";

function readStoredMode() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === THEME_MODES.LIGHT || saved === THEME_MODES.DARK || saved === THEME_MODES.SYSTEM) {
      return saved;
    }
  } catch {
    // Ignore storage access errors (private mode, etc.)
  }
  return THEME_MODES.SYSTEM;
}

const prefersDark = () =>
  typeof window !== "undefined" && window.matchMedia(SYSTEM_QUERY).matches;

// Dark mode is only applied on the management consoles (/admin and /owner).
// Public-facing pages always render in light mode.
const CONSOLE_PREFIXES = ["/admin", "/owner"];

function isConsolePath(pathname) {
  return CONSOLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function ThemeProvider({ children }) {
  const { pathname } = useLocation();
  const isConsole = isConsolePath(pathname);

  const [mode, setModeState] = useState(readStoredMode);
  const [systemDark, setSystemDark] = useState(prefersDark);

  // Track the OS preference so `system` mode reacts live.
  useEffect(() => {
    const media = window.matchMedia(SYSTEM_QUERY);
    const onChange = (event) => setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Dark mode is only honored inside the admin/owner consoles. Public pages
  // stay light, so `.dark` is never applied to them regardless of preference.
  const isDark =
    isConsole &&
    (mode === THEME_MODES.DARK || (mode === THEME_MODES.SYSTEM && systemDark));

  // Apply before the browser paints so the color transition animates smoothly
  // instead of flashing the light theme first.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    // Only persist the preference while inside a console; stepping back to the
    // public site must not carry a stale dark mode setting around.
    if (isConsole) {
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // Persisting the preference is best-effort.
      }
    }
  }, [mode, isConsole]);

  const setThemeMode = useCallback((next) => {
    setModeState(
      next === THEME_MODES.LIGHT || next === THEME_MODES.DARK || next === THEME_MODES.SYSTEM
        ? next
        : THEME_MODES.SYSTEM
    );
  }, []);

  // Back-compat binary toggle for existing buttons: overrides `system` with an
  // explicit opposite of whatever is currently shown.
  const toggleTheme = useCallback(() => {
    setModeState((current) => {
      const currentlyDark =
        current === THEME_MODES.DARK || (current === THEME_MODES.SYSTEM && prefersDark());
      return currentlyDark ? THEME_MODES.LIGHT : THEME_MODES.DARK;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDark,
      dark: isDark,
      systemDark,
      setThemeMode,
      toggleTheme,
      toggle: toggleTheme,
    }),
    [mode, isDark, systemDark, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
