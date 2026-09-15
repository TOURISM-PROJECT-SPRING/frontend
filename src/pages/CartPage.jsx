import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SmartImage from "../components/ui/SmartImage";
import Button from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useTripCart } from "../context/TripCartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { ticketBookingService } from "../services/ticketBookingService";
import { roomBookingService } from "../services/roomBookingService";
import { buildTicketBookingPayload, buildRoomBookingPayload, cartItemBlockers } from "../lib/cartBooking";
import { money } from "../lib/format";

const KIND_ICON = { tour: "binoculars", hotel: "bed", restaurant: "utensils" };

export function CartItemRow({ item, onQty, onRemove }) {
  return (
    <div className="group flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft transition-shadow hover:shadow-lift">
      <span className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
        {item.image ? (
          <SmartImage src={item.image} alt={item.title} className="h-full w-full" imgClassName="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-800 text-gold-400">
            <Icon name={KIND_ICON[item.kind] || "ticket"} size={24} />
          </span>
        )}
        <span className="absolute left-2 top-2 rounded bg-brand-900/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-300">
          {item.kind}
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={item.kind === "tour" ? `/tours/${item.id}` : item.kind === "hotel" ? `/hotels/${item.id}` : "#"}
              className="font-display text-base font-bold text-brand-800 hover:text-brand-600"
            >
              {item.title}
            </Link>
            {item.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Icon name="map-pin" size={12} className="shrink-0 text-brand-400" />
                {item.location}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.key)}
            aria-label="Remove item"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div>
            {item.kind === "hotel" && item.meta?.roomType && (
              <p className="text-xs font-medium text-muted">
                {item.meta.roomType} · {item.meta.nights || item.qty} night{item.qty > 1 ? "s" : ""}
              </p>
            )}
            {item.kind === "tour" && item.meta?.date && (
              <p className="text-xs font-medium text-muted">Trip date {item.meta.date}</p>
            )}
            <p className="mt-1 text-sm font-bold text-brand-700">
              {money((item.price || 0) * item.qty)}
              {item.price != null && (
                <span className="text-[11px] font-medium text-muted">
                  {" "}· {money(item.price)}{item.priceUnit}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQty(item.key, item.qty - 1)}
              aria-label="Decrease quantity"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-brand-700 transition-colors hover:bg-brand-50"
            >
              <Icon name="minus" size={14} />
            </button>
            <span className="min-w-[2ch] text-center text-base font-bold text-brand-800">{item.qty}</span>
            <button
              type="button"
              onClick={() => onQty(item.key, item.qty + 1)}
              aria-label="Increase quantity"
              className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-white transition-colors hover:bg-brand-800"
            >
              <Icon name="plus" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, setQty, removeItem, clear, province, subtotal, count } = useTripCart();
  const { isAuthenticated, user, userId } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);

  const tours = items.filter((i) => i.kind === "tour");
  const hotels = items.filter((i) => i.kind === "hotel");

  const placeBooking = async () => {
    setPlacing(true);
    const results = { ok: [], fail: [] };

    for (const item of items) {
      const blockers = cartItemBlockers(item);
      if (blockers.length > 0) {
        results.fail.push({ key: item.key, reason: blockers.join(" and ") });
        continue;
      }
      try {
        if (item.kind === "tour") {
          const res = await ticketBookingService.createTicketBooking(buildTicketBookingPayload(item, userId));
          if (res) results.ok.push(item.key);
          else results.fail.push({ key: item.key, reason: "booking was rejected" });
        } else if (item.kind === "hotel") {
          const res = await roomBookingService.createRoomBooking(buildRoomBookingPayload(item, userId));
          if (res) results.ok.push(item.key);
          else results.fail.push({ key: item.key, reason: "booking was rejected" });
        } else {
          results.fail.push({ key: item.key, reason: "this item isn't bookable here" });
        }
      } catch {
        results.fail.push({ key: item.key, reason: "backend is unreachable" });
      }
    }

    setPlacing(false);
    setCheckout(false);

    const failed = results.fail.length;
    if (failed === 0 && results.ok.length > 0) {
      toast.success(`Booking confirmed — ${results.ok.length} item${results.ok.length > 1 ? "s" : ""} on your trip.`);
      clear();
      navigate("/profile");
    } else if (results.ok.length > 0) {
      toast.success(`${results.ok.length} booking confirmed.`);
      results.fail.forEach((f) => removeItem(f.key));
      const missing = results.fail.map((f) => f.reason).join("; ");
      toast.error(`Some items couldn't be booked (${missing}).`);
    } else {
      const missing = results.fail.map((f) => f.reason).join("; ");
      toast.error(`Booking couldn't be placed — ${missing}.`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">Your trip planner</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">
            My Cart
          </h1>
          <p className="mt-2 text-sm text-muted">Review your tours and hotel stays before booking.</p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear all items from your cart?")) clear();
            }}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-danger/30 bg-danger/5 px-4 py-2 text-sm font-bold text-danger transition-colors hover:bg-danger/10"
          >
            <Icon name="trash" size={15} /> Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 py-20 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-400">
            <Icon name="shopping-cart" size={30} />
          </span>
          <h3 className="mt-5 font-display text-xl font-bold text-brand-800">Your cart is empty</h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Explore tours, hotels and restaurants to start planning your Cambodian journey.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/tour">
              <Button variant="primary">Explore Tours <Icon name="arrow-right" size={16} /></Button>
            </Link>
            <Link to="/hotel">
              <Button variant="secondary">Find Hotels</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <div className="space-y-6">
            {tours.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-brand-800">
                  <Icon name="binoculars" size={19} className="text-gold-600" /> Tours
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">{tours.length}</span>
                </h2>
                <div className="space-y-3">
                  {tours.map((i) => (
                    <CartItemRow key={i.key} item={i} onQty={setQty} onRemove={removeItem} />
                  ))}
                </div>
              </div>
            )}

            {hotels.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-brand-800">
                  <Icon name="bed" size={19} className="text-gold-600" /> Hotels
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">{hotels.length}</span>
                </h2>
                <div className="space-y-3">
                  {hotels.map((i) => (
                    <CartItemRow key={i.key} item={i} onQty={setQty} onRemove={removeItem} />
                  ))}
                </div>
              </div>
            )}

            {province && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gold-300 bg-gold-50 px-4 py-3">
                <Icon name="map-pin" size={16} className="text-gold-600" />
                <span className="text-sm font-bold text-brand-800">Trip destination</span>
                <span className="text-sm font-semibold text-gold-700">{province}</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
              <h2 className="font-display text-xl font-bold text-brand-800">Booking Summary</h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Items</span>
                  <span className="font-bold text-brand-800">{count}</span>
                </div>
                {province && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Destination</span>
                    <span className="font-bold text-brand-800">{province}</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-line pt-3 text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-bold text-brand-800">{money(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-700 px-4 py-3 text-white">
                  <span className="text-sm font-bold">Estimated total</span>
                  <span className="font-display text-xl font-bold text-gold-400">{money(subtotal)}</span>
                </div>
                <p className="text-[11px] text-muted">Taxes and fees may apply at check-in.</p>
              </div>

              <Button
                variant="primary"
                className="mt-5 w-full justify-center"
                onClick={() => (isAuthenticated ? setCheckout(true) : navigate("/login", { state: { from: "/cart" } }))}
              >
                {isAuthenticated ? (
                  <>
                    Continue to booking <Icon name="arrow-right" size={16} />
                  </>
                ) : (
                  <>Sign in to book</>
                )}
              </Button>
              {!isAuthenticated && (
                <p className="mt-3 text-center text-xs text-muted">You'll need an account to place a booking.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      <Modal open={checkout} onClose={() => setCheckout(false)} title="Confirm your booking" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Review your trip and place the booking. It uses your logged-in account
            {user?.email ? ` (${user.email})` : ""}.
          </p>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.key} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-brand-800">{i.title}</p>
                  <p className="text-xs text-muted">
                    {i.kind === "hotel"
                      ? `${i.meta?.roomType || "Room"} · ${i.qty} night${i.qty > 1 ? "s" : ""}`
                      : `${i.qty} guest${i.qty > 1 ? "s" : ""}`}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-brand-700">{money((i.price || 0) * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl bg-brand-700 px-4 py-3 text-white">
            <span className="text-sm font-bold">Total</span>
            <span className="font-display text-xl font-bold text-gold-400">{money(subtotal)}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setCheckout(false)}>
              Back
            </Button>
            <Button variant="primary" className="flex-1 justify-center" disabled={placing} onClick={placeBooking}>
              {placing ? "Placing booking…" : "Place booking"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}