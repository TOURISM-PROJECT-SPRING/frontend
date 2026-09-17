import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

export default function SectionHeader({ eyebrow, title, subtitle, action, actionIcon = "arrow-right", to, onClick }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">{eyebrow}</p>}
        <h2 className="mt-0.5 font-display text-lg font-bold text-brand-800">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action &&
        (to ? (
          <Link to={to} className="group flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900">
            {action}
            <Icon name={actionIcon} size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="group flex shrink-0 items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
          >
            {action}
            <Icon name={actionIcon} size={15} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
    </div>
  );
}