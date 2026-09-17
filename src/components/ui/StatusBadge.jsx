import { useTranslation } from "react-i18next";

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

const STATUS_MAP = {
  // bookings / orders
  pending: "warning",
  confirmed: "success",
  completed: "success",
  delivered: "success",
  paid: "success",
  used: "info",
  cancelled: "danger",
  failed: "danger",
  refunded: "danger",
  preparing: "info",
  ready: "gold",
  // tables / rooms
  available: "success",
  occupied: "danger",
  reserved: "warning",
  maintenance: "neutral",
  cleaning: "info",
  active: "success",
  inactive: "neutral",
  // generic
  open: "success",
  closed: "neutral",
};

const STATUS_TONES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  gold: "bg-gold-100 text-gold-700",
  neutral: "bg-brand-50 text-brand-700",
};

const STATUS_DOT = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  gold: "bg-gold-400",
  neutral: "bg-brand-400",
};

export function StatusBadge({ status, dot = true, className = "" }) {
  const key = String(status || "").toLowerCase();
  const tone = STATUS_MAP[key] || "neutral";
  const label = status ? String(status).replace(/^\w/, (c) => c.toUpperCase()) : "\u2014";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_TONES[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[tone]}`} />}
      {label}
    </span>
  );
}

// Open/closed indicator for restaurants.
export function OpenBadge({ open, label }) {
  const { t } = useTranslation();
  if (open == null) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold backdrop-blur ${
        open ? "text-success" : "text-danger"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-success" : "bg-danger"}`} />
      {open ? t("common.openNow") : t("common.closed")}
      {label && <span className="font-medium text-muted">· {label}</span>}
    </span>
  );
}
