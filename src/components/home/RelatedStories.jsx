import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import SectionHeading from "./SectionHeading";
import { relatedStories } from "../../data/cambodia";

export default function RelatedStories() {
  return (
    <section id="stories" className="bg-white py-20 lg:py-24 border-t border-line/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Read & get inspired"
          title="Travel Stories & Guides"
          subtitle="Insider tips, heritage insights, and hidden wonders written by passionate explorers."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedStories.map((s) => (
            <article
              key={s.id}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-line/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <SmartImage
                  src={s.image}
                  alt={s.place}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-950/80 px-3 py-1 text-[11px] font-bold text-gold-300 backdrop-blur-md shadow-sm">
                  <Icon name="map-pin" size={12} /> {s.place}
                </span>
              </div>
              <div className="flex flex-col p-5">
                <h3 className="font-display text-lg font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
                  {s.topic}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                  {s.info}
                </p>
                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">5 min read</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 group-hover:text-brand-800">
                    Read guide
                    <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
