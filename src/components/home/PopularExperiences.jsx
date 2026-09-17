import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import TourCard from "../explore/TourCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useTours } from "../../hooks/useResource";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../ui/Toast";

export default function PopularExperiences() {
  const { items, loading, source } = useTours();
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();
  const featured = items.slice(0, 4);

  const onFavorite = (tour) => {
    const saved = toggle({
      kind: "tour",
      id: tour.id,
      title: tour.title,
      image: tour.image,
      location: tour.location || tour.province,
      href: tour.href || `/tours/${tour.id}`,
    });
    toast[saved ? "success" : "info"](saved ? `Saved "${tour.title}" to My trips.` : `Removed "${tour.title}" from My trips.`);
  };

  return (
    <section id="experiences" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Handpicked"
        title="Popular Experiences"
        subtitle="Unforgettable journeys across the Kingdom, rated by real travellers."
        action={
          <Link to="/explore?section=tours" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
            View All <Icon name="arrow-right" size={16} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
          </Link>
        }
      />

      {loading ? (
        <div className="mt-12"><CardGridSkeleton count={4} /></div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((t) => (
              <TourCard key={t.id} tour={t} favorite={isSaved("tour", t.id)} onFavorite={onFavorite} />
            ))}
          </div>
          {source === "demo" && <div className="mt-6"><DemoNote /></div>}
        </>
      )}
    </section>
  );
}