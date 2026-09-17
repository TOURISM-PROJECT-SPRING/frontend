import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import DestinationCard from "../cards/DestinationCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useDestinations } from "../../hooks/useResource";

export default function PopularDestinations() {
  const { items, loading, source } = useDestinations();

  return (
    <section id="destinations" className="bg-cream py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to go"
          title="Popular Destinations"
          action={
            <Link to="/destinations" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
              View All <Icon name="arrow-right" size={16} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </Link>
          }
        />

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={5} cols="grid-cols-2 lg:grid-cols-5" /></div>
        ) : (
          <>
            <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 hide-scrollbar">
              {items.map((d) => (
                <div key={d.id} className="w-[210px] shrink-0 snap-start sm:w-[230px]">
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
