import SearchPanel from "./SearchPanel";
import Icon from "../ui/Icon";
import { img } from "../../data/site";

const HERO_IMG = img("Angkor_Wat.jpg", 2000);

export default function Hero() {
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

      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="max-w-3xl animate-rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-200 backdrop-blur">
            <Icon name="landmark" size={15} className="text-gold-400" />
            Welcome to SovannDomNour
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Discover Cambodia
            <span className="mt-1 block text-gold-400">Your Way.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Explore beautiful destinations, stay in unique places and discover
            authentic Cambodian flavors.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/80">
            <span className="flex items-center gap-2"><Icon name="check-circle" size={17} className="text-gold-400" /> 500+ curated experiences</span>
            <span className="flex items-center gap-2"><Icon name="check-circle" size={17} className="text-gold-400" /> Verified local partners</span>
            <span className="flex items-center gap-2"><Icon name="check-circle" size={17} className="text-gold-400" /> Best-price guarantee</span>
          </div>
        </div>

        {/* Floating search */}
        <div className="mt-auto pt-12 animate-rise delay-200">
          <div className="mx-auto w-full max-w-5xl">
            <SearchPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
