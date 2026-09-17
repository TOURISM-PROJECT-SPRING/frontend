import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import { services } from "../../data/site";

export default function Services() {
  return (
    <section id="tours" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Explore Cambodia"
        title="Experience the Best of Cambodia"
        subtitle="Three ways to fall in love with the Kingdom — wander ancient temples, unwind in beautiful stays, and savour Khmer cooking."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.key}
            to={s.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-1.5 hover:border-brand-300/50 hover:shadow-lift"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-700 backdrop-blur">
                <Icon name={s.icon} size={13} className="text-gold-500" />
                {s.label}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-2xl font-bold text-brand-800">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">
                {s.cta}
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 text-brand-700 transition-all duration-500 ease-out group-hover:bg-brand-700 group-hover:text-white">
                  <Icon name="arrow-right" size={15} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
