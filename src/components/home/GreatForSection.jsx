import { useRef } from "react";
import Icon from "../ui/Icon";
import SectionHeading from "./SectionHeading";
import InfoCard from "./InfoCard";
import { greatFor } from "../../data/cambodia";

function Row({ group }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-brand-800 sm:text-2xl">{group.title}</h3>
          <p className="mt-1 text-sm text-muted">{group.subtitle}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${group.title} left`}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-brand-700 transition-colors hover:bg-brand-50"
          >
            <Icon name="chevron-right" size={18} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Scroll ${group.title} right`}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-brand-700 transition-colors hover:bg-brand-50"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {group.items.map((it) => (
          <InfoCard key={it.id} item={it} kind={group.kind} />
        ))}
      </div>
    </div>
  );
}

export default function GreatForSection() {
  return (
    <section id="great-for" className="bg-canvas py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Explore by interest" title="Cambodia Is Great For" />
        <div className="mt-8 space-y-12">
          {greatFor.map((g) => (
            <Row key={g.key} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
