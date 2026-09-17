const TONES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  neutral: "bg-brand-50 text-brand-700",
};

export function Pill({ tone = "neutral", children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

// Open/closed indicator for restaurants.
export function OpenBadge({ open, label }) {
  if (open == null) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold backdrop-blur ${
        open ? "text-success" : "text-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-success" : "bg-danger"}`} />
      {open ? "Open now" : "Closed"}
      {label && <span className="font-medium text-muted">· {label}</span>}
    </span>
  );
}
