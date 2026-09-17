import { useTranslation } from "react-i18next";

const MAP = {
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

const TONES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  gold: "bg-gold-100 text-gold-700",
  neutral: "bg-brand-50 text-brand-700",
};

const DOT = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  gold: "bg-gold-400",
  neutral: "bg-brand-400",
};

export default function StatusBadge({ status, dot = true, className = "" }) {
  const { t } = useTranslation();
  const key = String(status || "").toLowerCase();
  const tone = MAP[key] || "neutral";
  const label = t(`statuses.${key}`, { defaultValue: status ? String(status).replace(/^\w/, (c) => c.toUpperCase()) : "—" });
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${TONES[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT[tone]}`} />}
      {label}
    </span>
  );
}
