import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import ListingCard from "../cards/ListingCard";
import { CardGridSkeleton } from "../ui/feedback";
import { useRestaurants } from "../../hooks/useResource";

export default function FeaturedRestaurants() {
  const { items, loading } = useRestaurants();
  const featured = items.slice(0, 4);

  return (
    <section id="restaurants" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="What to eat"
        title="Taste Cambodia"
        subtitle="From royal Khmer cuisine to buzzing street stalls — book a table or order in."
        action={
          <Link to="/restaurant" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
            View All <Icon name="arrow-right" size={16} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
          </Link>
        }
      />

      {loading ? (
        <div className="mt-12"><CardGridSkeleton count={4} /></div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((r) => (
              <ListingCard key={r.id} item={r} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
