import Icon from "../ui/Icon";
import { dishes } from "../../data/site";

export default function KhmerFood() {
  // Bento layout: first tile large, rest smaller.
  const tiles = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <section className="bg-brand-950 py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-gold-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
                A culinary journey
              </span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-[38px]">
              Discover Khmer Cuisine
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Fragrant curries, sizzling grills and delicate desserts — Cambodia's
              flavours are as warm as its people. Explore the dishes every traveller
              should taste.
            </p>
            <a
              href="#restaurants"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-gold-400 px-6 py-3 text-sm font-bold text-brand-900 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-gold-300"
            >
              Explore Food Tours
              <Icon name="arrow-right" size={17} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[130px] sm:grid-cols-4">
            {dishes.map((d, i) => (
              <figure
                key={d.name}
                className={`group relative overflow-hidden rounded-2xl ${tiles[i] || ""}`}
              >
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-display text-base font-bold leading-tight text-white sm:text-lg">{d.name}</p>
                  <p className="text-[11px] font-medium text-gold-200/90">{d.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
