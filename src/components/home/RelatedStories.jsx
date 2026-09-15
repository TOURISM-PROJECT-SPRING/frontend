import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import SectionHeading from "./SectionHeading";
import { relatedStories } from "../../data/cambodia";

export default function RelatedStories() {
  return (
    <section id="stories" >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Read & get inspired" title="Related Stories" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedStories.map((s) => (
            <article
              key={s.id}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={s.image}
                  alt={s.place}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-900/80 px-3 py-1 text-xs font-bold text-gold-300 backdrop-blur">
                  <Icon name="map-pin" size={12} /> {s.place}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-brand-800">{s.topic}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.info}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  Read story
                  <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
