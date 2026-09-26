import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useRestaurant } from "../hooks/useResource";
import { buildRestaurantDetail } from "../data/restaurantDetail";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../components/ui/Toast";
import { EmptyState, ErrorState } from "../components/ui/feedback";
import Icon from "../components/ui/Icon";

import RestaurantBreadcrumb from "../components/restaurants/detail/RestaurantBreadcrumb";
import RestaurantHeader from "../components/restaurants/detail/RestaurantHeader";
import RestaurantGallery from "../components/restaurants/detail/RestaurantGallery";
import AwardBadge from "../components/restaurants/detail/AwardBadge";
import RestaurantDescription from "../components/restaurants/detail/RestaurantDescription";
import FeaturesList from "../components/restaurants/detail/FeaturesList";
import OpeningHours from "../components/restaurants/detail/OpeningHours";
import LocationSection from "../components/restaurants/detail/LocationSection";
import ReviewsSection from "../components/restaurants/detail/ReviewsSection";
import ReviewModal from "../components/restaurants/detail/ReviewModal";
import DetailSkeleton from "../components/restaurants/detail/DetailSkeleton";
import DiningMenu from "../components/restaurants/DiningMenu";
import DiningCart from "../components/restaurants/DiningCart";

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, loading, error, source } = useRestaurant(id);
  const { user, isAuthenticated } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const toast = useToast();

  const restaurant = useMemo(() => buildRestaurantDetail(items[0]), [items]);
  const [guestReviews, setGuestReviews] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  // Order-for-pickup cart. Kept local to the page: a food order is scoped to one
  // restaurant, so it deliberately does not live in the global favorites/trip
  // cart. Rows are `{ id, title, image, price, qty }` — the shape both
  // DiningMenu and DiningCart expect.
  const [order, setOrder] = useState([]);
  const [orderOpen, setOrderOpen] = useState(false);

  const menu = restaurant?.menu || [];
  const orderCount = order.reduce((n, i) => n + i.qty, 0);

  const addDish = (dish) => {
    setOrder((rows) => {
      const hit = rows.find((r) => String(r.id) === String(dish.id));
      if (hit) return rows.map((r) => (String(r.id) === String(dish.id) ? { ...r, qty: r.qty + 1 } : r));
      return [...rows, { id: dish.id, title: dish.title, image: dish.image, price: dish.price, qty: 1 }];
    });
  };

  const setDishQty = (dishId, qty) => {
    setOrder((rows) =>
      qty > 0
        ? rows.map((r) => (String(r.id) === String(dishId) ? { ...r, qty } : r))
        : rows.filter((r) => String(r.id) !== String(dishId))
    );
  };

  const favorite = restaurant ? isSaved("restaurant", restaurant.id) : false;

  useEffect(() => {
    if (!restaurant) return;
    document.title = `${restaurant.title} | SovannDomNour`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      `${restaurant.title} in ${restaurant.city}, Cambodia — photos, reviews, menu, opening hours, features and location.`
    );
    return () => {
      document.title = "SovannDomNour";
    };
  }, [restaurant]);

  const onToggleFavorite = () => {
    const saved = toggle({
      kind: "restaurant",
      id: restaurant.id,
      title: restaurant.title,
      image: restaurant.galleryImages[0]?.url || restaurant.image,
      location: restaurant.city,
      href: `/restaurants/${id}`,
    });
    toast[saved ? "success" : "info"](
      saved ? `Saved ${restaurant.title} to My trips.` : `Removed ${restaurant.title} from My trips.`
    );
  };

  const onReview = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to write a review.");
      navigate("/login", { state: { from: `/restaurants/${id}` } });
      return;
    }
    setReviewOpen(true);
  };

  /* --------------------------- states --------------------------- */
  if (loading) return <DetailSkeleton />;

  if (!restaurant) {
    const container = "mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8";
    if (error && source !== "demo") {
      return (
        <div className={container}>
          <div className="mx-auto max-w-md">
            <ErrorState message="Unable to load this restaurant. Please try again." retry={() => window.location.reload()} />
          </div>
        </div>
      );
    }
    return (
      <div className={container}>
        <div className="mx-auto max-w-md">
          <EmptyState
            title="Restaurant not found"
            message="This restaurant may have been removed or is no longer available."
            icon="utensils"
            action={
              <Link to="/restaurant" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800">
                Back to restaurants
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const full = [restaurant.address, restaurant.city, restaurant.country].filter(Boolean).join(", ");
  const mapsUrl =
    restaurant.latitude != null && restaurant.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.title} ${full}`.trim())}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1320px] px-4 pt-5 sm:px-6 lg:px-8">
        <RestaurantBreadcrumb city={restaurant.city} title={restaurant.title} />

        <RestaurantHeader
          restaurant={restaurant}
          favorite={favorite}
          onToggleFavorite={onToggleFavorite}
          onReview={onReview}
          onJumpReviews={() => scrollToId("reviews")}
        />

        {/* Two-column information section */}
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <RestaurantGallery images={restaurant.galleryImages} award={restaurant.award} title={restaurant.title} />

            <section>
              {restaurant.award && (
                <div className="mb-6">
                  <AwardBadge award={restaurant.award} variant="tile" />
                </div>
              )}
              <RestaurantDescription text={restaurant.description} />
            </section>

            <FeaturesList
              rows={restaurant.featureRows}
              groups={restaurant.allFeatures}
              title={restaurant.title}
            />

            <DiningMenu
              menu={menu}
              cart={order}
              cartCount={orderCount}
              onAdd={addDish}
              onSetQty={setDishQty}
              onOpenCart={() => setOrderOpen(true)}
            />
          </div>

          <aside className="space-y-6 self-start lg:sticky lg:top-[124px]">
            <OpeningHours hours={restaurant.openingHours} open={restaurant.open !== false} />

            {menu.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Order online</p>
                <p className="mt-1 font-display text-lg font-bold text-brand-900">Food for pickup</p>
                <p className="mt-1 text-sm text-muted">
                  {orderCount > 0
                    ? `${orderCount} item${orderCount > 1 ? "s" : ""} in your order — ready in about 20 minutes.`
                    : `Order from the kitchen and pick up when you're ready. ${menu.length} dishes on the menu.`}
                </p>
                <button
                  type="button"
                  onClick={() => setOrderOpen(true)}
                  className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md active:scale-[0.99]"
                >
                  <Icon name="shopping-cart" size={17} />
                  {orderCount > 0 ? `View order (${orderCount})` : "Start your order"}
                </button>
              </div>
            )}

            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Reserve</p>
              <p className="mt-1 font-display text-lg font-bold text-brand-900">Book a table</p>
              <p className="mt-1 text-sm text-muted">
                {restaurant.open !== false ? "Open now — reserve your spot for tonight." : "Send a reservation request and we'll confirm by phone."}
              </p>
              <button
                type="button"
                onClick={() => setReserveOpen(true)}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md active:scale-[0.99]"
              >
                <Icon name="utensils" size={17} />
                Reserve a Table
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                <Icon name="map-pin" size={17} />
                Get Directions
              </a>
            </div>
          </aside>
        </div>

        <div className="pb-12">
          <LocationSection
            address={restaurant.address}
            city={restaurant.city}
            country={restaurant.country}
            lat={restaurant.latitude}
            lng={restaurant.longitude}
            name={restaurant.title}
            phone={restaurant.phone}
            email={restaurant.email}
            parking={restaurant.parking}
          />
        </div>

        <div className="border-t border-line py-12">
          <ReviewsSection
            title={restaurant.title}
            rating={restaurant.rating}
            reviews={restaurant.reviews}
            ratingBreakdown={restaurant.ratingBreakdown}
            reviewList={[...guestReviews, ...restaurant.reviewsList]}
            onReviewsClick={() => scrollToId("reviews")}
          />
        </div>
      </div>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        author={user?.name || user?.fullName || "You"}
        title={restaurant.title}
        onSubmit={(r) => {
          setGuestReviews((prev) => [r, ...prev]);
          toast.success("Thanks! Your review was published.");
          scrollToId("reviews");
        }}
      />

      <ReserveModal
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        title={restaurant.title}
        onConfirm={(payload) => {
          setReserveOpen(false);
          toast.success(
            `Reservation requested for ${payload.guests} guest${payload.guests > 1 ? "s" : ""}${
              payload.date ? ` on ${payload.date}` : ""
            }${payload.time ? ` at ${payload.time}` : ""}.`
          );
        }}
      />

      {menu.length > 0 && (
        <DiningCart
          restaurant={restaurant}
          cart={order}
          source={source}
          open={orderOpen}
          onOpen={() => setOrderOpen(true)}
          onClose={() => setOrderOpen(false)}
          onSetQty={setDishQty}
          onRemove={(dishId) => setDishQty(dishId, 0)}
          onClear={() => setOrder([])}
          onPlaced={() => {
            setOrder([]);
            setOrderOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* --------------------- Compact reservation request --------------------- */
function ReserveModal({ open, onClose, title, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reserve a table">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md animate-scalein rounded-2xl border border-line bg-white p-6 shadow-lift">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-brand-900">Reserve a table</h3>
            {title && <p className="mt-0.5 text-sm text-muted">{title}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-700">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
              <Icon name="calendar" size={14} className="text-brand-500" /> Date
            </span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
              <Icon name="clock" size={14} className="text-brand-500" /> Time
            </span>
            <select value={time} onChange={(e) => setTime(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400">
              {["11:00", "12:00", "13:00", "17:00", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-800">
              <Icon name="users" size={14} className="text-brand-500" /> Guests
            </span>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-3">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Fewer guests" className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50">
                <Icon name="minus" size={16} />
              </button>
              <span className="min-w-[3ch] text-center text-lg font-bold text-brand-800">{guests}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="More guests" className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800">
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50">Cancel</button>
          <button type="button" onClick={() => onConfirm({ date, time, guests })} className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800">
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
