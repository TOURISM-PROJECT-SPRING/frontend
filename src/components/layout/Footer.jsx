import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { footerColumns } from "../../data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-cream-soft">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A modern Cambodian travel platform. Explore temples and islands, book
              beautiful stays and taste authentic Khmer flavours — all in one place.
            </p>
            <div className="mt-5 flex gap-2.5">
              {["globe", "mail", "phone"].map((n) => (
                <span
                  key={n}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-brand-700"
                >
                  <Icon name={n} size={17} />
                </span>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-brand-800">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/" className="text-sm text-muted hover:text-brand-700">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} SovannDomNour. Discover Cambodia.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Icon name="heart" size={14} className="text-gold-500" fill="currentColor" stroke="none" /> in Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
}
