import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import HotelCard from "../explore/HotelCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useHotels } from "../../hooks/useResource";
import { useFavorites } from "../../context/FavoritesContext";
import { useToast } from "../ui/Toast";

export default function FeaturedHotels() {
  const { items, loading, source } = useHotels();
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();
  const featured = items.slice(0, 4);

  const onFavorite = (hotel) => {
    const saved = toggle({
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location || hotel.province,
      href: hotel.href || `/hotels/${hotel.id}`,
    });
    toast[saved ? "success" : "info"](saved ? `Saved "${hotel.title}" to My trips.` : `Removed "${hotel.title}" from My trips.`);
  };

  return (
    <section id="hotels" className="bg-canvas py-20 lg:py-24 border-y border-line/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to stay"
          title="Stay Somewhere Special"
          subtitle="Handpicked resorts and boutique hotels for every kind of traveller."
action={
            <Link to="/explore?section=hotels" className="group hidden items-center gap-1.5 text-sm font-bold text-brand-700 sm:inline-flex">
              View All <Icon name="arrow-right" size={16} className="transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </Link>
          }
        />

        {loading ? (
          <div className="mt-12"><CardGridSkeleton count={4} /></div>
        ) : (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((h) => (
                <HotelCard key={h.id} hotel={h} favorite={isSaved("hotel", h.id)} onFavorite={onFavorite} />
              ))}
            </div>
            {source === "demo" && <div className="mt-6"><DemoNote /></div>}
          </>
        )}
      </div>
    </section>
  );
}