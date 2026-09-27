import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/feedback";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import ContactDetailsCard from "../components/checkout/ContactDetailsCard";
import PaymentDetailsCard from "../components/checkout/PaymentDetailsCard";
import RestaurantOrderCard from "../components/checkout/RestaurantOrderCard";
import RestaurantOrderSummary from "../components/checkout/RestaurantOrderSummary";
import { isValidEmail, cardNumberValid, expiryValid, cvcValid, bookingReference } from "../components/checkout/checkoutData";
import {
  FULFILMENT,
  earliestPickupValue,
  orderReference,
  orderTotals,
  pickupLabel,
  pickupSlots,
  tableByNumber,
  tablesForGuests,
} from "../components/checkout/restaurantCheckoutData";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import BakongKhqrPaymentModal from "../components/payment/BakongKhqrPaymentModal";
import SovannAiChat from "../components/ai/SovannAiChat";
import { openInvoicePdf } from "../utils/invoice";
import { rememberFoodOrderPrefs } from "../utils/foodOrderPrefs";

const PROMOCODES = { SAVE10: 0.1 };

function readOrder(state) {
  if (!state || state.kind !== "restaurant") return null;
  const items = Array.isArray(state.items) ? state.items.filter((i) => Number(i.qty) > 0) : [];
  if (!items.length) return null;
  return {
    ...state,
    items: items.map((i) => ({ ...i, price: Number(i.price) || 0, qty: Number(i.qty) || 0 })),
  };
}

export default function RestaurantCheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, userId } = useAuth();

  // The order arrives via navigation state from DiningCart. Opened directly
  // there is nothing to pay for, so we prompt instead of faking an order.
  const [order, setOrder] = useState(() => readOrder(location.state));
  const [pickupAt, setPickupAt] = useState(() => location.state?.pickupTime || earliestPickupValue());

  // Takeaway keeps the current behaviour. Dine in additionally requires a table
  // choice; the backend has no table field, so it is stored per order id in
  // localStorage (utils/foodOrderPrefs) and re-read on the voucher.
  const [fulfilment, setFulfilment] = useState(FULFILMENT.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState("");
  const [guests, setGuests] = useState(2);

  const [contact, setContact] = useState(() => ({
    fullname: user?.fullname || user?.username || "",
    email: user?.email || "",
    dialCode: "+855",
    phone: user?.phone || "",
  }));

  const [payTiming, setPayTiming] = useState("now");
  const [payMethod, setPayMethod] = useState("bakong");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [country, setCountry] = useState("Cambodia");
  const [saveInfo, setSaveInfo] = useState(true);
  const [promo, setPromo] = useState({ applied: false, code: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [confirmed, setConfirmed] = useState(null); // { reference, orderId, total }
  const [bakongOrder, setBakongOrder] = useState(null);
  // The backend recomputes the total from its own menu prices, so once the
  // order exists its FoodOrderResponse.totalPrice becomes the payable amount.
  const [serverTotal, setServerTotal] = useState(null);

  // Keep the contact fields in sync with the signed-in user.
  useEffect(() => {
    setContact((prev) => ({
      fullname: user?.fullname || prev.fullname,
      email: user?.email || prev.email,
      dialCode: prev.dialCode || "+855",
      phone: user?.phone || prev.phone,
    }));
  }, [user?.fullname, user?.email, user?.phone, userId]);

  // Re-derive bookable slots on a slow tick and drop a selection that has since
  // elapsed — the backend rejects a pickupTime that is no longer in the future.
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const slots = useMemo(() => pickupSlots(new Date(nowTick)), [nowTick]);
  const tableOptions = useMemo(
    () => (fulfilment === FULFILMENT.DINE_IN ? tablesForGuests(guests) : []),
    [fulfilment, guests]
  );

  // Shrinking the party can leave a previously chosen table too small.
  useEffect(() => {
    if (fulfilment !== FULFILMENT.DINE_IN || !tableNumber) return;
    if (!tablesForGuests(guests).some((t) => t.number === tableNumber)) setTableNumber("");
  }, [fulfilment, guests, tableNumber]);

  // Switching to takeaway has no table to keep.
  useEffect(() => {
    if (fulfilment === FULFILMENT.TAKEAWAY && tableNumber) setTableNumber("");
  }, [fulfilment, tableNumber]);

  const isDineIn = fulfilment === FULFILMENT.DINE_IN;
  const selectedTable = tableByNumber(tableNumber);

  useEffect(() => {
    const floor = earliestPickupValue(new Date(nowTick));
    if (!pickupAt || pickupAt < floor) setPickupAt(floor);
  }, [nowTick, pickupAt]);

  // `readOrder` always populates a non-empty items array, so this stays referentially
  // stable across renders and is safe to depend on from the totals memo below.
  const items = order?.items;
  const menuTotals = useMemo(() => orderTotals(items, promo.applied), [items, promo.applied]);

  const money = useMemo(() => {
    const total = serverTotal != null ? serverTotal : menuTotals.total;
    return {
      subtotal: menuTotals.subtotal,
      discount: menuTotals.discount,
      total,
      usd: (n) => `$${(Number(n) || 0).toFixed(2)}`,
    };
  }, [menuTotals, serverTotal]);

  const totalChanged = serverTotal != null && Math.abs(serverTotal - menuTotals.total) > 0.005;

  const travelerName = contact.fullname?.trim();

  const applyPromo = (code) => {
    if (PROMOCODES[code]) {
      setPromo({ applied: true, code });
      return true;
    }
    return false;
  };
  const removePromo = () => setPromo({ applied: false, code: "" });

  // Any edit invalidates the amount the server already confirmed.
  const patchOrder = (fn) => {
    setServerTotal(null);
    setOrder((o) => (o ? fn(o) : o));
  };

  const setQty = (itemId, qty) =>
    patchOrder((o) => ({
      ...o,
      items:
        qty > 0
          ? o.items.map((i) => (String(i.id) === String(itemId) ? { ...i, qty: Math.min(50, qty) } : i))
          : o.items.filter((i) => String(i.id) !== String(itemId)),
    }));

  const setPickup = (value) => {
    setServerTotal(null);
    setPickupAt(value);
  };

  const validate = () => {
    const e = {};
    if (!contact.fullname?.trim()) e.contact = "Add your full name.";
    else if (!isValidEmail(contact.email)) e.contact = "Add a valid email address.";
    else if (!/^\d{6,12}$/.test((contact.phone || "").replace(/\s/g, ""))) e.contact = "Add a valid phone number.";
    if (payMethod === "card") {
      if (!cardNumberValid(card.number)) e.cardNumber = "Enter the 16-digit card number.";
      if (!expiryValid(card.expiry)) e.expiry = "MM/YY";
      if (!cvcValid(card.cvc)) e.cvc = "3–4 digits";
    }
    return e;
  };

  const onOrder = async () => {
    if (!items.length) {
      toast.error("Your order is empty.");
      return;
    }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(e.contact || "Please complete your payment details.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!userId) {
      toast.error("Please sign in to complete your order.");
      navigate("/login", { state: { from: "/restaurant-checkout" } });
      return;
    }
    if (!pickupAt || pickupAt < earliestPickupValue()) {
      toast.error("Please choose a pickup time that is still in the future.");
      return;
    }
    const table = fulfilment === FULFILMENT.DINE_IN ? tableByNumber(tableNumber) : null;
    if (fulfilment === FULFILMENT.DINE_IN && !table) {
      toast.error("Please choose a table for your dine-in order.");
      return;
    }

    setSubmitting(true);
    try {
      const isDemo = order.source === "demo";
      const isBakong = payMethod === "bakong";
      const paymentMethod = isBakong ? "BAKONG_KHQR" : payMethod === "card" ? "CARD" : "CASH";

      let created;
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 700));
        created = { id: `DEMO${Date.now().toString().slice(-6)}`, totalPrice: menuTotals.total };
      } else {
        created = await orderService.placeOrder({
          userId,
          restaurantId: Number(order.restaurantId),
          pickupTime: pickupAt,
          items: items.map((i) => ({ foodId: Number(i.id) || i.id, quantity: Number(i.qty) || 1 })),
        });
      }

      const payable = Number(created?.totalPrice);
      const total = Number.isFinite(payable) && payable > 0 ? payable : menuTotals.total;
      setServerTotal(total);
      const reference = orderReference(created?.id) || bookingReference();

      if (isDemo) {
        setConfirmed({ reference, orderId: created?.id, total });
        return;
      }

      // The order DTO carries no payment method, fulfilment or table, so persist
      // them now for the inbox voucher and receipt.
      rememberFoodOrderPrefs(created?.id, {
        paymentMethod,
        fulfilment,
        tableNumber: table?.number || null,
        guests: fulfilment === FULFILMENT.DINE_IN ? guests : null,
      });

      if (isBakong) {
        // The order exists as PENDING with a BAKONG_KHQR method — open the KHQR
        // scan modal instead of settling here. The backend confirms the order
        // once the NHQR transaction is verified.
        setSubmitting(false);
        setBakongOrder({
          bookingId: created?.id,
          bookingType: "FOOD_ORDER",
          amount: total,
          currency: "USD",
          description: `Pickup order at ${order.restaurantName}`,
          customerPhone: `${contact.dialCode || "+855"} ${contact.phone || ""}`.trim(),
        });
        return;
      }

      const payment = await paymentService.processPayment({
        foodOrderIds: [created?.id],
        paymentMethod,
      });
      if (payment) {
        setConfirmed({ reference, orderId: created?.id, total });
      } else {
        toast.error("The payment was rejected. Please try again.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Your order couldn't be placed — please try again."
      );
    }
    setSubmitting(false);
  };

  const onBakongSuccess = (res) => {
    const reference = orderReference(bakongOrder?.bookingId) || bookingReference();
    setBakongOrder(null);
    setConfirmed({ reference, orderId: bakongOrder?.bookingId, total: res?.amount ?? serverTotal ?? money.total });
  };

  const goBack = () => navigate(order?.returnTo || "/restaurant");

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {!order ? (
          <div className="grid min-h-[55vh] place-items-center">
            <EmptyState
              icon="utensils"
              title="No order selected"
              message="Add dishes from a restaurant menu and your order will show up here, ready for payment and pickup."
              action={
                <Link
                  to="/restaurant"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand-700 px-6 font-display text-sm font-bold text-white transition-colors hover:bg-brand-800"
                >
                  Browse restaurants
                </Link>
              }
            />
          </div>
        ) : !items.length ? (
          <div className="grid min-h-[55vh] place-items-center">
            <EmptyState
              icon="shopping-cart"
              title="Your order is empty"
              message="Every dish was removed. Head back to the menu to pick what you'd like to eat."
              action={
                <Link
                  to={order.returnTo || "/restaurant"}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-700 px-6 font-display text-sm font-bold text-white transition-colors hover:bg-brand-800"
                >
                  <Icon name="utensils" size={16} /> Back to the menu
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={goBack}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
            >
              <Icon name="arrow-left" size={16} /> Back to {order.restaurantName}
            </button>

            <div className="mb-6">
              <h1 className="font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">
                Complete your order
              </h1>
              <p className="mt-1 text-sm text-muted">
                {menuTotals.count} {menuTotals.count === 1 ? "item" : "items"} for{" "}
                {fulfilment === FULFILMENT.DINE_IN ? "dining in" : "pickup"} at {pickupLabel(pickupAt)} — confirm and pay in a
                minute.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Steps */}
              <div className="order-2 space-y-6 lg:order-1">
                <ContactDetailsCard contact={contact} onSave={setContact} />
                <RestaurantOrderCard
                  order={order}
                  items={items}
                  count={menuTotals.count}
                  slots={slots}
                  pickupAt={pickupAt}
                  onSetPickupTime={setPickup}
                  fulfilment={fulfilment}
                  onSetFulfilment={setFulfilment}
                  guests={guests}
                  onSetGuests={setGuests}
                  tableNumber={tableNumber}
                  onSetTable={setTableNumber}
                  tableOptions={tableOptions}
                  onSetQty={setQty}
                  onRemove={(id) => setQty(id, 0)}
                  travelerName={travelerName}
                  contactPhone={contact.phone}
                  dialCode={contact.dialCode}
                />
                <PaymentDetailsCard
                  money={money}
                  payTiming={payTiming} setPayTiming={setPayTiming}
                  payMethod={payMethod} setPayMethod={setPayMethod}
                  card={card} setCard={setCard}
                  country={country} setCountry={setCountry}
                  saveInfo={saveInfo} setSaveInfo={setSaveInfo}
                  errors={errors} submitting={submitting} onBook={onOrder}
                  chargeDateLabel={pickupLabel(pickupAt)}
                  cancelCutoff="the kitchen starts cooking"
                  allowPayLater={false}
                />
              </div>

              {/* Sticky summary */}
              <aside className="order-1 lg:order-2">
                <div className="lg:sticky lg:top-6">
                  <RestaurantOrderSummary
                    order={order}
                    items={items}
                    count={menuTotals.count}
                    money={money}
                    promo={promo}
                    onApplyPromo={applyPromo}
                    onRemovePromo={removePromo}
                    pickupAt={pickupAt}
                    fulfilment={fulfilment}
                    table={tableByNumber(tableNumber)}
                    guests={guests}
                    returnTo={order.returnTo || "/restaurant"}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-line bg-white py-6">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-2 px-4 text-center text-xs text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>© 2026 SovannDomNour All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="underline">Terms of Use</a>
            <a href="#" className="underline">Privacy and Cookies Statement</a>
          </span>
        </div>
      </footer>

      {/* Bakong KHQR payment modal */}
      <BakongKhqrPaymentModal
        isOpen={!!bakongOrder}
        onClose={() => {
          setBakongOrder(null);
          setSubmitting(false);
        }}
        onSuccess={onBakongSuccess}
        amount={bakongOrder?.amount || money.total}
        currency={bakongOrder?.currency || "USD"}
        bookingId={bakongOrder?.bookingId}
        bookingType={bakongOrder?.bookingType || "FOOD_ORDER"}
        description={bakongOrder?.description || "Pickup order"}
      />

      {/* Success confirmation modal */}
      <Modal open={!!confirmed} onClose={goBack} title="Order confirmed">
        {confirmed && (
          <div className="space-y-4 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="check-circle" size={34} />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-brand-800">The kitchen has your order!</h3>
              <p className="mt-1 text-sm text-muted">
                A receipt has been sent to {contact.email}. {order.restaurantName} will call {contact.phone || "you"} when it's boxed and ready.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Order reference</p>
              <p className="font-display text-lg font-bold text-brand-800">{confirmed.reference}</p>
              <p className="mt-2 text-sm font-bold text-brand-800">{order.restaurantName}</p>
              <p className="text-xs text-muted">
                {menuTotals.count} {menuTotals.count === 1 ? "item" : "items"} •{" "}
                {isDineIn ? `Table ${selectedTable?.number || "—"}` : "Takeaway"} •{" "}
                {isDineIn ? "Seated" : "Pickup"} {pickupLabel(pickupAt)}
              </p>
              <p className="mt-1 text-sm font-bold text-brand-700">
                {payMethod === "cash"
                  ? `Pay ${money.usd(confirmed.total)} in cash on collection`
                  : `Paid ${money.usd(confirmed.total)}`}
              </p>
              {totalChanged && (
                <p className="mt-1 text-xs text-muted">
                  Final amount set by the kitchen at {money.usd(confirmed.total)}.
                </p>
              )}
              {order.source === "demo" && (
                <p className="mt-2 text-xs font-semibold text-gold-700">
                  Demo order — no payment was taken and nothing was sent to the kitchen.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 justify-center" onClick={goBack}>Back to the menu</Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={() => navigate("/profile")}>View my orders</Button>
            </div>
            {order.source !== "demo" && (
              <button
                type="button"
                onClick={() =>
                  openInvoicePdf({
                    booking: {
                      title: order.restaurantName,
                      subtitle: order.restaurantAddress,
                      date: (pickupAt || "").slice(0, 10),
                      time: pickupLabel(pickupAt),
                      guests: menuTotals.count,
                    },
                    lineItems: items.map((i) => ({
                      title: i.title,
                      qty: i.qty,
                      unit: i.price,
                      amount: i.price * i.qty,
                    })),
                    money,
                    contact,
                    reference: confirmed.reference,
                    payMethod,
                    payTiming,
                    chargeDateLabel: pickupLabel(pickupAt),
                    scheduleLine: isDineIn
                      ? `Dine in — Table ${selectedTable?.number || "—"}, seated at ${pickupLabel(pickupAt)}`
                      : `Pickup ${pickupLabel(pickupAt)}`,
                    summaryLine: `${menuTotals.count} ${menuTotals.count === 1 ? "item" : "items"} ${isDineIn ? "to be served" : "for pickup"}`,
                    dueLabel:
                      payMethod === "cash"
                        ? "Payable in cash on collection (USD or KHR)"
                        : "Paid in full online",
                    footNote: isDineIn
                      ? `Your table is ${selectedTable?.number || "—"}. Show this reference to your host on arrival.`
                      : "Show this reference at the counter when you collect your order.",
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-5 py-3 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
              >
                <Icon name="download" size={16} className="text-brand-600" />
                Download receipt (PDF)
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Floating My AI (Sovann) */}
      <SovannAiChat />
    </div>
  );
}
