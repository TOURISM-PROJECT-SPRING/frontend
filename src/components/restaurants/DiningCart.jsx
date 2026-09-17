import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";
import { useToast } from "../ui/Toast";
import { useAuth } from "../../context/AuthContext";
import { cartService } from "../../services/cartService";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

function CartRow({ item, onSetQty, onRemove }) {
  const line = (Number(item.price) || 0) * item.qty;
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3 shadow-soft">
      <SmartImage src={item.image} alt={item.title} className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-bold text-brand-800">{item.title}</p>
        <p className="mt-0.5 text-xs font-semibold text-brand-700">{money(item.price)} each</p>
        <div className="mt-2 inline-flex items-center gap-1 rounded-lg border border-line bg-canvas p-0.5">
          <button
            type="button"
            aria-label={`Remove one ${item.title}`}
            onClick={() => onSetQty(item.id, item.qty - 1)}
            className="grid h-7 w-7 place-items-center rounded-md text-brand-700 transition-colors hover:bg-white"
          >
            <Icon name="minus" size={14} />
          </button>
          <span className="min-w-[2ch] text-center text-sm font-bold text-brand-800">{item.qty}</span>
          <button
            type="button"
            aria-label={`Add one ${item.title}`}
            onClick={() => onSetQty(item.id, item.qty + 1)}
            className="grid h-7 w-7 place-items-center rounded-md bg-brand-700 text-white transition-colors hover:bg-brand-800"
          >
            <Icon name="plus" size={14} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-bold text-brand-800">{money(line)}</span>
        <button
          type="button"
          aria-label={`Remove ${item.title} from order`}
          onClick={() => onRemove(item.id)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line text-danger transition-colors hover:bg-danger/5"
        >
          <Icon name="trash" size={15} />
        </button>
      </div>
    </div>
  );
}

// Dining cart for restaurant detail pages: a floating trigger pill (like the
// trip cart) plus a slide-over order drawer. Checkout posts the food order via
// cartService + orderService and settles it with the unified payment endpoint.
export default function DiningCart({
  restaurant,
  cart = [],
  source,
  open,
  onOpen,
  onClose,
  onSetQty,
  onRemove,
  onClear,
  onPlaced,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { userId } = useAuth();
  const [placing, setPlacing] = useState(false);

  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((n, i) => n + (Number(i.price) || 0) * i.qty, 0);

  useEffect(() => {
    if (!open) return undefined;
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  const checkout = async () => {
    if (!cart.length) return;
    if (!userId) {
      toast.info("Please sign in to place your order.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setPlacing(true);
    try {
      if (source === "demo") {
        await new Promise((r) => setTimeout(r, 700));
      } else {
        const created = await cartService.getOrCreateCart(userId, restaurant.id);
        for (const item of cart) {
          await cartService.addItem(created.id, {
            foodId: Number(item.id) || item.id,
            quantity: item.qty,
          });
        }
        const order = await orderService.placeOrderFromCart(userId, restaurant.id, new Date());
        await paymentService.processPayment({ foodOrderIds: [order.id], paymentMethod: "Card" });
      }
      toast.success(`Order placed at ${restaurant.title}!`);
      onPlaced();
    } catch (err) {
      toast.error(err?.message || "Couldn't place your order — please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      {count > 0 && !open && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open your order, ${count} ${count === 1 ? "item" : "items"}`}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-brand-900/95 px-4 py-2.5 text-white shadow-lift ring-2 ring-gold-400/50 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gold-400 text-brand-950">
            <Icon name="shopping-cart" size={15} />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
              {count}
            </span>
          </span>
          <div className="text-left">
            <p className="text-xs font-bold leading-none">Your order</p>
            <p className="text-[10px] font-medium leading-tight text-gold-300">
              {money(subtotal)} · {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <Icon name="chevron-right" size={14} className="text-gold-400" />
        </button>
      )}

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100]">
            <div className="absolute inset-0 animate-fade bg-brand-950/50 backdrop-blur-sm" onClick={onClose} />

            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Your order"
              className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slidein flex-col bg-white shadow-lift"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name="shopping-cart" size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-bold leading-tight text-brand-800">Your order</p>
                    <p className="truncate text-xs text-muted">{restaurant.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-brand-900 transition-colors hover:bg-brand-50"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                {cart.length === 0 ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                        <Icon name="shopping-cart" size={28} />
                      </span>
                      <h2 className="mt-4 font-display text-xl font-bold text-brand-800">Your order is empty</h2>
                      <p className="mt-1.5 text-sm text-muted">
                        Add dishes from the menu to order for pickup.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-5 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
                      >
                        Browse the menu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <CartRow key={item.id} item={item} onSetQty={onSetQty} onRemove={onRemove} />
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="shrink-0 border-t border-line bg-canvas px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted">Subtotal</span>
                    <span className="font-display text-xl font-bold text-brand-800">{money(subtotal)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={checkout}
                    disabled={placing}
                    className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {placing ? (
                      "Placing order…"
                    ) : (
                      <>
                        Place order <Icon name="arrow-right" size={17} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClear}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-bold text-muted transition-colors hover:text-danger"
                  >
                    <Icon name="trash" size={13} /> Clear order
                  </button>
                </div>
              )}
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}
