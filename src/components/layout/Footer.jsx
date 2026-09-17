import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { footerColumns } from "../../data/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-brand-950 text-white">
      <div className="khmer-motif absolute inset-0 opacity-10" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A modern Cambodian travel platform. Explore temples and islands, book
              beautiful stays and taste authentic Khmer flavours — all in one place.
            </p>
            <div className="mt-5 flex gap-2.5">
              {["globe", "mail", "phone"].map((n) => (
                <span
                  key={n}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-gold-400"
                >
                  <Icon name={n} size={17} />
                </span>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-gold-400">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/" className="text-sm text-white/60 transition-colors hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} SovannDomNour. Discover Cambodia.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Icon name="heart" size={14} className="text-gold-400" fill="currentColor" stroke="none" /> in Cambodia
          </p>
        </div>
      </div>
    </footer>
  );
}