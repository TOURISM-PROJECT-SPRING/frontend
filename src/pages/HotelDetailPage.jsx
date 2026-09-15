import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Rating from "../components/ui/Rating";
import { Skeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useToast } from "../components/ui/Toast";
import { useHotel } from "../hooks/useResource";
import { useTripCart } from "../context/TripCartContext";
import { useAuth } from "../context/AuthContext";
import { money } from "../lib/format";

function nightsBetween(a, b) {
  if (!a || !b) return 1;
  const start = new Date(a);
  const end = new Date(b);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 86400000));
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: hotels, loading, source } = useHotel(id);
  const { addItem } = useTripCart();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const hotel = hotels[0];

  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [showBookingPrompt, setShowBookingPrompt] = useState(false);

  const rooms = hotel?.rooms || [];
  const room = rooms.find((r) => String(r.id) === String(roomId)) || rooms[0];
  const nights = nightsBetween(checkIn, checkOut);
  const total = room ? (Number(room.price) || 0) * nights : 0;
  const price = hotel?.price != null ? money(hotel.price) : null;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to book this hotel.");
      navigate("/login", { state: { from: `/hotels/${id}` } });
      return;
    }
    setShowBookingPrompt(true);
  };

  const handleAddToTrip = () => {
    if (!hotel || !room) return;
    addItem({
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location,
      province: hotel.province,
      price: Number(room.price) || 0,
      priceUnit: "/night",
      qty: nights,
      meta: { roomId: room.id, roomType: room.roomType, guests, checkIn, checkOut, nights },
    });
    toast.success(`"${hotel.title}" added to your trip.`);
    setShowBookingPrompt(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="aspect-[3/1] w-full" />
        <Skeleton className="mt-6 h-10 w-1/3" />
        <Skeleton className="mt-4 h-6 w-2/3" />
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Hotel not found" message="This hotel may have been removed or is unavailable." icon="bed" />
        <div className="mt-6 text-center">
          <Link to="/hotel" className="font-bold text-brand-700 hover:text-brand-800">
            ← Back to hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <div className="relative isolate">
        {hotel.image ? (
          <div className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
            <SmartImage src={hotel.image} alt={hotel.title} className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
          </div>
        ) : (
          <div className="relative h-[50vh] min-h-[360px] w-full bg-gradient-to-br from-brand-700 to-brand-500" />
        )}

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <nav className="mb-3 flex items-center gap-1.5 text-sm text-white/70">
              <Link to="/" className="hover:text-white">Home</Link>
              <Icon name="chevron-right" size={14} />
              <Link to="/hotel" className="hover:text-white">Hotels</Link>
              <Icon name="chevron-right" size={14} />
              <span className="font-semibold text-white">{hotel.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {hotel.badge && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur ring-1 ring-white/20">
                  {hotel.badge}
                </span>
              )}
              {hotel.status && (
                <span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-brand-900">
                  {hotel.status}
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{hotel.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {hotel.rating != null && <Rating value={hotel.rating} reviews={hotel.reviews} light />}
              {hotel.location && (
                <span className="flex items-center gap-1.5">
                  <Icon name="map-pin" size={15} className="text-gold-300" />
                  {hotel.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {/* Description */}
            {hotel.description && (
              <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <h2 className="font-display text-xl font-bold text-brand-800">About this hotel</h2>
                <p className="mt-3 leading-relaxed text-muted">{hotel.description}</p>
              </section>
            )}

            {/* Contact Info */}
            <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold text-brand-800">Contact information</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {hotel.phone && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="phone" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Phone</p>
                      <p className="text-sm font-semibold text-brand-800">{hotel.phone}</p>
                    </div>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="mail" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Email</p>
                      <p className="text-sm font-semibold text-brand-800">{hotel.email}</p>
                    </div>
                  </div>
                )}
                {hotel.location && (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <Icon name="map-pin" size={17} className="text-brand-500" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Location</p>
                      <p className="text-sm font-semibold text-brand-800">{hotel.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {source === "demo" && <DemoNote />}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-gold-300 bg-white p-6 shadow-lift">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Starting from</p>
                  <p className="font-display text-3xl font-bold text-brand-800">
                    {price || "On request"}
                    {price && <span className="text-sm font-medium text-muted"> {hotel.priceUnit}</span>}
                  </p>
                </div>
                {hotel.rating != null && (
                  <div className="flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5">
                    <Icon name="star" size={14} className="text-gold-500" fill="currentColor" stroke="none" />
                    <span className="text-sm font-bold text-brand-800">{Number(hotel.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Room Selection */}
              {rooms.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold text-brand-800">Select a room</p>
                  <div className="space-y-2">
                    {rooms.map((r) => {
                      const selected = String(r.id) === String(roomId);
                      const available = Number(r.total) > 0;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          disabled={!available}
                          onClick={() => setRoomId(String(r.id))}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                            selected
                              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/15"
                              : "border-line bg-canvas hover:border-brand-300/60"
                          } ${!available ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <div>
                            <p className="text-sm font-bold text-brand-800">{r.roomType}</p>
                            <p className="text-xs text-muted">
                              {r.capacity ? `Sleeps ${r.capacity}` : "Standard"}
                              {r.total != null ? ` · ${r.total} left` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-brand-700">{money(r.price)}<span className="text-xs font-medium text-muted">/n</span></p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-brand-800">
                      <Icon name="calendar" size={12} className="text-brand-500" /> Check-in
                    </span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="h-10 w-full rounded-xl border border-line bg-canvas px-2.5 text-xs outline-none focus:border-brand-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-brand-800">
                      <Icon name="calendar" size={12} className="text-brand-500" /> Check-out
                    </span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="h-10 w-full rounded-xl border border-line bg-canvas px-2.5 text-xs outline-none focus:border-brand-400"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-bold text-brand-800">
                    <Icon name="users" size={12} className="text-brand-500" /> Guests
                  </span>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-line bg-canvas px-2.5 text-xs outline-none focus:border-brand-400"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </label>
              </div>

              {room && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-muted">Stay total</p>
                    <p className="font-display text-lg font-bold text-brand-800">
                      {money(total)}
                      <span className="text-xs font-medium text-muted"> · {nights} night{nights > 1 ? "s" : ""}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium text-muted">{room.roomType}</span>
                </div>
              )}

              <button
                type="button"
                disabled={!room}
                onClick={handleBookNow}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="bed" size={18} />
                Book Now
              </button>

              <button
                type="button"
                disabled={!room}
                onClick={handleAddToTrip}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-gold-300 bg-gold-50 text-sm font-bold text-brand-800 transition-colors hover:bg-gold-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon name="plus" size={17} />
                Add to Trip
              </button>

              <div className="mt-4 space-y-1.5 text-[11px] font-medium text-muted">
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Best-price guarantee
                </p>
                <p className="flex items-center gap-1.5">
                  <Icon name="check-circle" size={13} className="text-success" /> Free cancellation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Prompt Modal */}
      {showBookingPrompt && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-brand-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowBookingPrompt(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-lift animate-scalein"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Icon name="bed" size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-brand-800">Book this hotel?</h3>
            <p className="mt-2 text-sm text-muted">
              You&apos;re about to book <strong>{hotel.title}</strong> — {room?.roomType} for {nights} night{nights > 1 ? "s" : ""}
              {checkIn ? ` from ${new Date(checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
              {checkOut ? ` to ${new Date(checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}.
            </p>
            {room && (
              <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-800">Total</span>
                  <span className="font-display text-xl font-bold text-brand-800">{money(total)}</span>
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowBookingPrompt(false)}
                className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToTrip}
                className="flex-1 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
              >
                Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
