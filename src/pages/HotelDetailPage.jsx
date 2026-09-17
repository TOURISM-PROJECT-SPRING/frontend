import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useHotel, useHotels } from "../hooks/useResource";
import { roomBookingService } from "../services/roomBookingService";
import { buildRoomBookingPayload } from "../lib/cartBooking";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { Modal } from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { money } from "../lib/format";
import { EmptyState, ErrorState } from "../components/ui/feedback";
import Icon from "../components/ui/Icon";
import { decorateHotels } from "../data/hotels";
import { buildHotelDetail, buildNearby } from "../data/hotelDetail";

import HotelHeader from "../components/hotels/detail/HotelHeader";
import HotelGallery from "../components/hotels/detail/HotelGallery";
import BookingCard from "../components/hotels/detail/BookingCard";
import ReviewHighlights from "../components/hotels/detail/ReviewHighlights";
import AboutSection from "../components/hotels/detail/AboutSection";
import NearbyHotels from "../components/hotels/detail/NearbyHotels";
import LocationSection from "../components/hotels/detail/LocationSection";
import StickyBookingBar from "../components/hotels/detail/StickyBookingBar";
import DetailSkeleton from "../components/hotels/detail/DetailSkeleton";
import ReviewModal from "../components/hotels/detail/ReviewModal";

function isoPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function nightsBetween(a, b) {
  if (!a || !b) return 1;
  const start = new Date(a);
  const end = new Date(b);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 86400000));
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, loading, error, source } = useHotel(id);
  const hotelsList = useHotels();
  const { user, isAuthenticated, userId } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();

  const hotel = useMemo(() => buildHotelDetail(items[0]), [items]);
  const nearby = useMemo(
    () => buildNearby(items[0], decorateHotels(hotelsList.items), 4),
    [items, hotelsList.items]
  );

  const [booking, setBooking] = useState(() => ({
    checkIn: isoPlus(14),
    checkOut: isoPlus(16),
    adults: 2,
    children: 0,
    rooms: 1,
  }));
  const [guestReviews, setGuestReviews] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [pendingDeal, setPendingDeal] = useState(null); // { provider, room } awaiting confirm
  const [placing, setPlacing] = useState(false);

  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const dateValue = { ...booking, nights };
  const favorite = hotel ? isSaved("hotel", hotel.id) : false;

  // SEO: dynamic title + meta description for this hotel.
  useEffect(() => {
    if (!hotel) return;
    document.title = `${hotel.title} | SovannDomNour`;
    const desc = `Discover ${hotel.title} in ${hotel.city}, Cambodia. View photos, prices, amenities, reviews, location and available booking deals.`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    return () => {
      document.title = "SovannDomNour";
    };
  }, [hotel]);

  const onDeal = (provider) => {
    if (!hotel) return;
    if (provider?.url) {
      window.open(provider.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in to book this hotel.");
      navigate("/login", { state: { from: `/hotels/${id}` } });
      return;
    }
    const room =
      [...(hotel.rooms || [])].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9))[0] || null;
    setPendingDeal({ provider, room });
  };

  const confirmBooking = async () => {
    if (!hotel || !pendingDeal) return;
    const room = pendingDeal.room;
    const roomId = Number(room?.id ?? hotel.roomId ?? null) || null;
    if (!roomId) {
      toast.error("No bookable room was found for this hotel yet.");
      setPendingDeal(null);
      return;
    }
    setPlacing(true);
    try {
      const res = await roomBookingService.createRoomBooking(
        buildRoomBookingPayload(
          {
            meta: {
              roomId,
              guests: booking.adults + booking.children,
              checkIn: booking.checkIn,
              checkOut: booking.checkOut,
              nights,
            },
          },
          userId
        )
      );
      if (res) {
        toast.success(`${hotel.title} booked (${nights} night${nights > 1 ? "s" : ""}) — see your bookings.`);
        setPendingDeal(null);
        navigate("/profile");
      } else {
        toast.error("The booking was rejected. Please try again.");
      }
    } catch {
      toast.error("Booking couldn't be placed — the backend is unreachable.");
    }
    setPlacing(false);
  };

  const onToggleFavorite = () => {
    const saved = toggle({
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location || hotel.city,
      href: `/hotels/${id}`,
    });
    toast[saved ? "success" : "info"](saved ? `Saved ${hotel.title} to My trips.` : `Removed ${hotel.title} from My trips.`);
  };

  const onReview = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review.");
      navigate("/login", { state: { from: `/hotels/${id}` } });
      return;
    }
    setReviewOpen(true);
  };

  /* ------------------------- states ------------------------- */
  if (loading) return <DetailSkeleton />;

  if (!hotel) {
    const container = "mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8";
    if (error && source !== "demo") {
      return (
        <div className={container}>
          <div className="mx-auto max-w-md">
            <ErrorState message="Unable to load this hotel. Please try again." retry={() => window.location.reload()} />
          </div>
        </div>
      );
    }
    return (
      <div className={container}>
        <div className="mx-auto max-w-md">
          <EmptyState
            title="Hotel not found"
            message="The hotel you're looking for may have been removed or is no longer available."
            icon="bed"
            action={
              <Link to="/hotel" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800">
                Back to hotels
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="pt-5">
        </div>

        <HotelHeader
          hotel={hotel}
          favorite={favorite}
          onToggleFavorite={onToggleFavorite}
          onReview={onReview}
          onJumpReviews={() => scrollToId("reviews")}
          onJumpPrices={() => scrollToId("prices")}
        />

        <div className="mt-6">
          <HotelGallery images={hotel.galleryImages} award={hotel.award} title={hotel.title} />
        </div>

        <div className="space-y-14 py-10 sm:py-12 lg:space-y-20 lg:py-14">
          <BookingCard providers={hotel.bookingProviders} dateValue={dateValue} onDateChange={(p) => setBooking((b) => ({ ...b, ...p }))} onDeal={onDeal} />

          <ReviewHighlights
            reviews={[...guestReviews, ...hotel.reviewsList]}
            rating={hotel.rating}
            reviewCount={hotel.reviews}
            onSeeAll={() => scrollToId("reviews")}
          />

          <AboutSection
            rating={hotel.rating}
            reviews={hotel.reviews}
            ranking={hotel.ranking}
            totalHotels={hotel.totalHotelsInCity}
            city={hotel.city}
            ratingBreakdown={hotel.ratingBreakdown}
            amenities={hotel.amenities}
            roomFeatures={hotel.roomFeatures}
            onReviewsClick={() => scrollToId("reviews")}
          />

          <NearbyHotels
            hotels={nearby}
            isFavorite={(id) => isSaved("hotel", id)}
            onToggleFavorite={(h) => {
              const saved = toggle({ kind: "hotel", id: h.id, title: h.name, image: h.image, location: h.location, href: h.href || `/hotels/${h.id}` });
              toast[saved ? "success" : "info"](saved ? `Saved ${h.name} to My trips.` : `Removed ${h.name} from My trips.`);
            }}
          />

          <LocationSection
            address={hotel.address}
            city={hotel.city}
            country={hotel.country}
            email={hotel.email}
            lat={hotel.latitude}
            lng={hotel.longitude}
            name={hotel.title}
            rating={hotel.rating}
            price={hotel.price}
          />
        </div>
      </div>

      <StickyBookingBar price={hotel.price} />
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        author={user?.name || user?.fullName || "You"}
        onSubmit={(r) => { setGuestReviews((prev) => [r, ...prev]); toast.success("Thanks! Your review was published."); scrollToId("reviews"); }}
      />

      <Modal open={!!pendingDeal} onClose={() => (placing ? null : setPendingDeal(null))} title="Confirm your stay" size="lg">
        {pendingDeal && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Review the details and confirm — this places the booking on your account
              {user?.email ? ` (${user.email})` : ""}. Payment is collected at check-in.
            </p>
            <div className="rounded-xl border border-line bg-canvas p-4">
              <p className="font-display text-lg font-bold text-brand-800">{hotel.title}</p>
              {hotel.location && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
                  <Icon name="map-pin" size={13} className="text-brand-400" /> {hotel.location}
                </p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Detail label="Rate" value={pendingDeal.provider?.name || "Best deal"} />
                <Detail label="Room" value={pendingDeal.room?.roomType || "Standard room"} />
                <Detail label="Check-in" value={booking.checkIn} />
                <Detail label="Check-out" value={booking.checkOut} />
                <Detail label="Guests" value={`${booking.adults + booking.children} · ${booking.rooms} room${booking.rooms > 1 ? "s" : ""}`} />
                <Detail label="Nights" value={`${nights} night${nights > 1 ? "s" : ""}`} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-700 px-4 py-3 text-white">
              <span className="text-sm font-bold">Estimated total</span>
              <span className="font-display text-xl font-bold text-gold-400">
                {money((Number(pendingDeal.provider?.price ?? hotel.price) || 0) * nights)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 justify-center" disabled={placing} onClick={() => setPendingDeal(null)}>Back</Button>
              <Button variant="primary" className="flex-1 justify-center" disabled={placing} onClick={confirmBooking}>
                {placing ? "Placing booking…" : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="font-semibold text-brand-800">{value}</p>
    </div>
  );
}
