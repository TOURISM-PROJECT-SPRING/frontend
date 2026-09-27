import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
            >
              <Icon name="map-pin" size={17} />
              Get Directions
            </a>
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

