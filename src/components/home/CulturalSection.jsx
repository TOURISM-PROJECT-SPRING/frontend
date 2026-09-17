import Icon from "../ui/Icon";
import { img } from "../../data/site";

const apsara = img("Apsara dance Khmer Cambodian.jpg", 1200);
const temple = img("Ta_Prohm.jpg", 1000);

export default function CulturalSection() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-800 py-20 text-white lg:py-28">
      <div className="absolute inset-0 -z-10">
        <img src={apsara} alt="" className="h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/85 to-brand-800/70" />
        <div className="khmer-motif absolute inset-0 opacity-40" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
              Experience the soul of Cambodia
            </span>
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-[44px]">
            Where every journey tells a story
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
            From ancient temples to vibrant cities, tropical islands and unforgettable
            food — discover Cambodia through authentic local experiences.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { n: "5,000+", l: "Years of history" },
              { n: "1,000+", l: "Temples & pagodas" },
              { n: "50+", l: "Destinations" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-display text-2xl font-bold text-gold-400">{s.n}</p>
                <p className="mt-1 text-xs font-medium text-white/70">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#experiences" className="group inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3 text-sm font-bold text-brand-900 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-gold-300">
              Discover Tours <Icon name="arrow-right" size={17} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </a>
            <a href="#destinations" className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors duration-500 ease-out hover:bg-white/10">
              Browse Destinations
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[28px] border border-white/10 shadow-2xl">
            <img src={temple} alt="Ta Prohm temple, Cambodia" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-line bg-white p-4 text-brand-800 shadow-lift sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-700 text-gold-400">
                <Icon name="landmark" size={22} />
              </span>
              <div>
                <p className="text-sm font-bold">Angkor Archaeological Park</p>
                <p className="text-xs text-muted">UNESCO World Heritage Site</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
