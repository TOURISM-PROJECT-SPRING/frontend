import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Icon from "../ui/Icon";
import HotelCard from "../explore/HotelCard";
import { CardGridSkeleton, DemoNote } from "../ui/feedback";
import { useHotels } from "../../hooks/useResource";
import { useTripCart } from "../../context/TripCartContext";
import { useToast } from "../ui/Toast";

export default function FeaturedHotels() {
  const { items, loading, source } = useHotels();
  const { addItem } = useTripCart();
  const toast = useToast();
  const featured = items.slice(0, 4);

  const addHotel = (hotel) => {
    const room = (hotel.rooms || [])[0];
    const price = room ? Number(room.price) : Number(hotel.price ?? 0);
    addItem({
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location,
      province: hotel.province,
      price,
      priceUnit: "/night",
      qty: 1,
      meta: { roomId: hotel.roomId ?? null, roomType: hotel.roomType || "Standard room", nights: 1 },
    });
    toast.success(`"${hotel.title}" added to your trip.`);
  };

  return (
    <section id="hotels" className="bg-cream py-20 lg:py-24">
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
                <HotelCard key={h.id} hotel={h} onAdd={addHotel} />
              ))}
            </div>
            {source === "demo" && <div className="mt-6"><DemoNote /></div>}
          </>
        )}
      </div>
    </section>
  );
}