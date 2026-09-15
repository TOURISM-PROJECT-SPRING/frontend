import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import { img } from "../../data/site";

const HERO_IMG = img("Angkor_Wat.jpg", 2000);

export default function Hero() {
  const stats = [
    { n: "500+", l: "Curated experiences" },
    { n: "100+", l: "Verified partners" },
    { n: "50+", l: "Destinations" },
  ];

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={HERO_IMG}
          alt="Angkor Wat at sunrise, Cambodia"
          className="h-full w-full origin-center object-cover animate-slowzoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-900/45 to-brand-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950/60 to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="max-w-3xl animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
            <Icon name="map-pin-house" size={15} className="text-gold-400" />
            Welcome to Cambodia
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Discover Cambodia
            <span className="mt-1 block text-gold-400">Your Way.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Explore beautiful destinations, stay in unique places and discover
            authentic Cambodian flavors.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.l} className="flex items-center gap-3">
                <p className="font-display text-2xl font-bold text-gold-400">{s.n}</p>
                <p className="max-w-[130px] text-xs font-medium leading-snug text-white/70">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-white/80">
            <a
              href="#essentials"
              className="group inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3 text-sm font-bold text-brand-900 shadow-lg transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-gold-300"
            >
              Start Exploring
              <Icon name="arrow-right" size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/tour"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
