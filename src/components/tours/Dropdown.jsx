import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../ui/Icon";

// Pill trigger + floating panel. The panel is rendered in a portal with fixed
// positioning so it is never clipped by the filter bar's horizontal-scroll
// container (overflow-x-auto). Closes on outside click / Escape, repositions on scroll.
export default function Dropdown({
  label,
  icon,
  active = false,
  count = 0,
  chevron = true,
  align = "left",
  panelClassName = "w-72",
  children,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const w = panelRef.current?.offsetWidth || 288;
    let left = align === "right" ? r.right - w : r.left;
    left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
    setPos({ top: r.bottom + 8, left });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    let raf = 0;
    const onMove = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(place);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex h-[52px] shrink-0 items-center gap-2 rounded-full border bg-white px-5 text-[15px] font-semibold transition-colors ${
          active
            ? "border-brand-500 bg-brand-50 text-brand-900"
            : "border-line text-brand-900 hover:border-brand-300 hover:bg-brand-50/40"
        }`}
      >
        {icon && <Icon name={icon} size={18} className="text-brand-700" />}
        <span className="whitespace-nowrap">{label}</span>
        {count > 0 && (
          <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-700 px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
        {chevron && (
          <Icon
            name="chevron-down"
            size={16}
            className={`text-brand-700 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className={`z-[100] origin-top rounded-2xl border border-line bg-white p-3 shadow-lift animate-scalein ${panelClassName}`}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}

// Checkbox row used inside dropdown panels.
export function OptionRow({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-[15px] text-ink/85 transition-colors hover:bg-brand-50/60">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
          checked ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-transparent"
        }`}
      >
        <Icon name="check" size={13} strokeWidth={3} />
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {children}
    </label>
  );
}
