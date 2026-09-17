import { Fragment } from "react";
import { Link } from "react-router-dom";
import Icon from "../../ui/Icon";

// Asia > Cambodia > {city} > Restaurants > {restaurant}
// Trailing crumb (current restaurant) is not a link; scrolls horizontally on mobile.
export default function RestaurantBreadcrumb({ city = "Siem Reap", title = "" }) {
  const to = "/restaurant";
  const crumbs = [
    { label: "Asia", to },
    { label: "Cambodia", to },
    { label: city, to },
    { label: "Restaurants", to },
    { label: title, to: null },
  ];
  return (
    <nav aria-label="Breadcrumb" className="hide-scrollbar -mx-1 overflow-x-auto px-1">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-sm text-muted">
        {crumbs.map((c, i) => (
          <Fragment key={`${c.label}-${i}`}>
            <li>
              {c.to && i < crumbs.length - 1 ? (
                <Link
                  to={c.to}
                  className="font-medium underline decoration-brand-200 underline-offset-4 transition-colors hover:text-brand-700 hover:decoration-brand-400"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="font-semibold text-brand-800" aria-current="page">
                  {c.label}
                </span>
              )}
            </li>
            {i < crumbs.length - 1 && <Icon name="chevron-right" size={13} className="shrink-0 text-muted/60" />}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
