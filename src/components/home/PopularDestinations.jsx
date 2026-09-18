import { useRef } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import DestinationCard from "../cards/DestinationCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useDestinations } from "../../hooks/useResource";

export default function PopularDestinations() {
  const { items, loading, source } = useDestinations();
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section id="destinations" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Where to go"
            title="Popular Destinations"
            subtitle="Iconic ancient temples, vibrant riverside cities, and tranquil coastal sanctuaries."
          />
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll destinations left"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-sm transition-all hover:bg-brand-50 hover:border-brand-300"
            >
              <Icon name="chevron-right" size={18} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll destinations right"
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-brand-800 shadow-sm transition-all hover:bg-brand-50 hover:border-brand-300"
            >
              <Icon name="chevron-right" size={18} />
            </button>
            <Link
              to="/destinations"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-4 py-2 text-xs font-bold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
            >
              All Destinations
              <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={5} cols="grid-cols-2 lg:grid-cols-5" /></div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
            >
              {items.map((d) => (
                <div key={d.id} className="w-[220px] shrink-0 snap-start sm:w-[250px]">
                  <DestinationCard item={d} />
                </div>
              ))}
            </div>
            {source === "demo" && <div className="mt-6"><DemoNote /></div>}
          </>
        )}
      </div>
    </section>
  );
}
