import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

const ToastContext = createContext(null);

const TONES = {
  success: { ring: "border-success/30", icon: "check-circle", color: "text-success" },
  error: { ring: "border-danger/30", icon: "info", color: "text-danger" },
  info: { ring: "border-info/30", icon: "info", color: "text-info" },
  warning: { ring: "border-warning/30", icon: "bell", color: "text-warning" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (message, type = "info", ttl = 3200) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      if (ttl) setTimeout(() => remove(id), ttl);
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      push,
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
      warning: (m) => push(m, "warning"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 right-5 z-[200] flex w-[min(92vw,360px)] flex-col gap-2">
          {toasts.map((t) => {
            const tone = TONES[t.type] || TONES.info;
            return (
              <div
                key={t.id}
                className={`animate-scalein flex items-start gap-3 rounded-xl border ${tone.ring} bg-white px-4 py-3 shadow-lift`}
              >
                <Icon name={tone.icon} size={18} className={`mt-0.5 shrink-0 ${tone.color}`} />
                <p className="flex-1 text-sm font-medium text-ink">{t.message}</p>
                <button onClick={() => remove(t.id)} className="text-muted hover:text-brand-700" aria-label="Dismiss">
                  <Icon name="x" size={16} />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
