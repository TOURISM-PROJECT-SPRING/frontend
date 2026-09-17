import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

function useEsc(onClose) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
}

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEsc(onClose);
  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} animate-scalein overflow-hidden rounded-2xl border border-line bg-white shadow-lift`}>
        {title && (
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="font-display text-lg font-bold text-brand-800">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
              <Icon name="x" size={18} />
            </button>
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line bg-canvas px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({ open, onClose, title, children, width = "max-w-md" }) {
  useEsc(onClose);
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-brand-950/50 backdrop-blur-sm animate-fade" onClick={onClose} />
      <div className={`absolute right-0 top-0 flex h-full w-full ${width} flex-col bg-white shadow-lift`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display text-lg font-bold text-brand-800">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
