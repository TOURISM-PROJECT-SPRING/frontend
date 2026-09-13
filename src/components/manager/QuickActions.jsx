import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

export default function QuickActions({ items = [] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => {
        const inner = (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400 text-brand-900">
              <Icon name={a.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-brand-800">{a.label}</span>
              {a.hint && <span className="block truncate text-xs text-muted">{a.hint}</span>}
            </span>
            <Icon name="arrow-right" size={16} className="ml-auto shrink-0 text-muted transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:text-brand-700" />
          </>
        );
        const cls =
          "group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 text-left shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brand-300/50 hover:shadow-lift";
        return a.to ? (
          <Link key={a.label} to={a.to} className={cls}>{inner}</Link>
        ) : (
          <button key={a.label} type="button" onClick={a.onClick} className={cls}>{inner}</button>
        );
      })}
    </div>
  );
}
