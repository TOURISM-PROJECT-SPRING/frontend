import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import ListingCard from "../cards/ListingCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useTours } from "../../hooks/useResource";

export default function PopularExperiences() {
  const { items, loading, source } = useTours();
  const featured = items.slice(0, 4);

  return (
    <section id="experiences" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Handpicked"
        title="Popular Experiences"
        subtitle="Unforgettable journeys across the Kingdom, rated by real travellers."
        action={
          <a href="/tours" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
            View All <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        }
      />

      {loading ? (
        <div className="mt-12"><CardGridSkeleton count={4} /></div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((t) => (
              <ListingCard key={t.id} item={t} />
            ))}
          </div>
          {source === "demo" && <div className="mt-6"><DemoNote /></div>}
        </>
      )}
    </section>
  );
}
