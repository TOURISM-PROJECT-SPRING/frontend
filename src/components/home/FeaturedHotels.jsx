import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import ListingCard from "../cards/ListingCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useHotels } from "../../hooks/useResource";

export default function FeaturedHotels() {
  const { items, loading, source } = useHotels();
  const featured = items.slice(0, 4);

  return (
    <section id="hotels" className="bg-cream py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to stay"
          title="Stay Somewhere Special"
          subtitle="Handpicked resorts and boutique hotels for every kind of traveller."
          action={
            <a href="/hotels" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
              View All <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          }
        />

        {loading ? (
          <div className="mt-12"><CardGridSkeleton count={4} /></div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((h) => (
                <ListingCard key={h.id} item={h} />
              ))}
            </div>
            {source === "demo" && <div className="mt-6"><DemoNote /></div>}
          </>
        )}
      </div>
    </section>
  );
}
