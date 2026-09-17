import { Link } from "react-router-dom";
import Icon from "../ui/Icon";

// Small muted breadcrumb. Shows a Cambodia-wide trail by default and inserts
// the selected province when the traveler narrows to one location.
export default function Breadcrumb({ province = "" }) {
  const trail = [
    { label: "Asia", to: "/" },
    { label: "Cambodia", to: "/" },
    ...(province
      ? [
          { label: province, to: "/hotel" },
          { label: `${province} Restaurants`, to: null },
        ]
      : [{ label: "Restaurants in Cambodia", to: null }]),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px] font-medium text-muted">
      {trail.map((item, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={item.label} className="inline-flex items-center gap-1">
            {item.to && !last ? (
              <Link to={item.to} className="transition hover:text-brand-700 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "font-semibold text-brand-800" : ""}>{item.label}</span>
            )}
            {!last && <Icon name="chevron-right" size={12} className="text-muted/50" />}
          </span>
        );
      })}
    </nav>
  );
}
