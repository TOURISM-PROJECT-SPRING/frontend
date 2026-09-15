import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Modal } from "../ui/Modal";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Button from "../ui/Button";
import { useTripCart } from "../../context/TripCartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import { ticketBookingService } from "../../services/ticketBookingService";
import { roomBookingService } from "../../services/roomBookingService";
import { buildTicketBookingPayload, buildRoomBookingPayload, cartItemBlockers } from "../../lib/cartBooking";
import { money } from "../../lib/format";

const KIND_ICON = { tour: "binoculars", hotel: "bed", restaurant: "utensils" };

function ItemRow({ item, onQty, onRemove }) {
  return (
    <div className="flex gap-3 rounded-xl border border-line bg-white p-3">
      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
        {item.image ? (
          <SmartImage src={item.image} alt={item.title} className="h-full w-full" imgClassName="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-800 text-gold-400">
            <Icon name={KIND_ICON[item.kind] || "ticket"} size={20} />
          </span>
        )}
        <span className="absolute left-1 top-1 rounded bg-brand-900/80 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold-300">
          {item.kind}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-brand-800">{item.title}</p>
        {item.location && <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted"><Icon name="map-pin" size={11} className="text-brand-400 shrink-0" /> {item.location}</p>}
        {item.kind === "hotel" && item.meta?.roomType && (
          <p className="mt-0.5 text-xs font-medium text-muted">{item.meta.roomType} · {item.meta.nights || item.qty} night{item.qty > 1 ? "s" : ""}</p>
        )}
        {item.kind === "tour" && item.meta?.date && (
          <p className="mt-0.5 text-xs font-medium text-muted">Trip date {item.meta.date}</p>
        )}
        {Number(item.price) > 0 && (
          <p className="mt-1 text-sm font-bold text-brand-700">{money((item.price || 0) * item.qty)} <span className="text-[11px] font-medium text-muted">({money(item.price)}{item.priceUnit})</span></p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <button type="button" onClick={() => onRemove(item.key)} aria-label="Remove" className="grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger">
          <Icon name="trash" size={15} />
        </button>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onQty(item.key, item.qty - 1)} aria-label="Decrease" className="grid h-7 w-7 place-items-center rounded-lg border border-line text-brand-700 hover:bg-brand-50">
            <Icon name="minus" size={13} />
          </button>
          <span className="min-w-[1.5ch] text-center text-sm font-bold text-brand-800">{item.qty}</span>
          <button type="button" onClick={() => onQty(item.key, item.qty + 1)} aria-label="Increase" className="grid h-7 w-7 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800">
            <Icon name="plus" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartButton() {
  const { count, flashed, openCart } = useTripCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open trip cart, ${count} items`}
      className="relative grid h-10 w-10 place-items-center rounded-xl text-ink/70 transition-colors hover:bg-brand-100 hover:text-brand-700"
    >
      <Icon name="shopping-cart" size={19} />
      {count > 0 && (
        <span
          key={`badge-${count}-${flashed ? 1 : 0}`}
          className="animate-cartpop absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-brand-900 ring-2 ring-white"
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function TripCart() {
  const { items, isOpen, closeCart, setQty, removeItem, clear, province, subtotal, count } = useTripCart();
  const { isAuthenticated, user, userId } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [checkout, setCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);

  const GROUP_DEFS = [
    { kind: "tour", label: "Tours", icon: "binoculars" },
    { kind: "hotel", label: "Hotels", icon: "bed" },
    { kind: "restaurant", label: "Restaurants", icon: "utensils" },
  ];
  const groups = GROUP_DEFS.map((g) => ({ ...g, items: items.filter((i) => i.kind === g.kind) })).filter((g) => g.items.length > 0);

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
      toast.success(`Booking confirmed — ${items.length} item${items.length > 1 ? "s" : ""} on your trip.`);
      clear();
      closeCart();
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
    <Drawer open={isOpen} onClose={closeCart} title="Your trip" width="max-w-md">
      {/* Header meta */}
      <div className="mb-4 flex items-center gap-2">
        {province ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
            <Icon name="map-pin" size={13} className="text-gold-600" /> {province}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-canvas px-3 py-1.5 text-xs font-bold text-muted">No province selected</span>
        )}
        <span className="ml-auto rounded-full bg-canvas px-3 py-1.5 text-xs font-bold text-brand-800">{count} item{count === 1 ? "" : "s"}</span>
        {items.length > 0 && (
          <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs font-bold text-danger hover:underline">
            <Icon name="trash" size={13} /> Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-400">
            <Icon name="shopping-cart" size={26} />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-brand-800">Your trip is empty</h3>
          <p className="mt-1 max-w-xs text-sm text-muted">Add a tour, hotel or restaurant to start planning your journey.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.kind}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted"><Icon name={g.icon} size={14} className="text-brand-500" /> {g.label}</p>
              <div className="space-y-2">{g.items.map((i) => <ItemRow key={i.key} item={i} onQty={setQty} onRemove={removeItem} />)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer summary */}
      <div className="mt-5 rounded-2xl border border-line bg-canvas p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-bold text-brand-800">{money(subtotal)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-muted">Estimated total</span>
          <span className="flex items-center gap-1 font-display text-lg font-bold text-brand-700">
            <Icon name="star" size={13} className="text-gold-400" fill="currentColor" stroke="none" />
            {money(subtotal)}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-muted">Taxes and fees may apply at check-in.</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button variant="primary" className="w-full justify-center" onClick={() => (isAuthenticated ? setCheckout(true) : navigate("/login"))}>
          {isAuthenticated ? <>Continue to booking <Icon name="arrow-right" size={16} /></> : <>Sign in to book</>}
        </Button>
        {!isAuthenticated && <p className="text-center text-xs text-muted">You'll need an account to place a booking.</p>}
      </div>

      {/* Checkout modal */}
      <Modal open={checkout} onClose={() => setCheckout(false)} title="Confirm your booking" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-muted">Review your trip and place the booking. It uses your logged-in account ({user?.email || user?.username}).</p>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.key} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-brand-800">{i.title}</p>
                  <p className="text-xs text-muted">
                    {i.kind === "hotel" ? `${i.meta?.roomType || "Room"} · ${i.qty} night(s)` : `${i.qty} guest(s)`}
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
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setCheckout(false)}>Back</Button>
            <Button variant="primary" className="flex-1 justify-center" disabled={placing} onClick={placeBooking}>
              {placing ? "Placing booking…" : "Place booking"}
            </Button>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
}