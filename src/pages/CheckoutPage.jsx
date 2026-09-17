import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../context/AuthContext";
import ContactDetailsCard from "../components/checkout/ContactDetailsCard";
import ActivityDetailsCard from "../components/checkout/ActivityDetailsCard";
import PaymentDetailsCard from "../components/checkout/PaymentDetailsCard";
import BookingSummary from "../components/checkout/BookingSummary";
import { MOCK_BOOKING, isValidEmail, cardNumberValid, expiryValid, cvcValid, bookingReference, longDate } from "../components/checkout/checkoutData";

const HOLD_SECONDS = 11 * 60 + 30; // 11:30
const TIME_OPTIONS = ["4:30 AM", "6:00 AM", "9:00 AM", "12:00 PM", "3:00 PM", "5:30 PM"];

function splitName(fullname = "") {
  const parts = fullname.trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [booking, setBooking] = useState(() => ({ ...MOCK_BOOKING, ...(location.state || {}) }));

  const [contact, setContact] = useState(() => {
    const { firstName, lastName } = splitName(user?.fullname || user?.username || "");
    return { firstName, lastName, email: user?.email || "", dialCode: "+855", phone: "" };
  });

  const [payTiming, setPayTiming] = useState("now");
  const [payMethod, setPayMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [country, setCountry] = useState("Cambodia");
  const [saveInfo, setSaveInfo] = useState(true);
  const [promo, setPromo] = useState({ applied: false, code: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [confirmed, setConfirmed] = useState(null); // { reference }
  const [changeOpen, setChangeOpen] = useState(false);
  const [changeForm, setChangeForm] = useState(() => ({ date: booking.date, time: booking.time, guests: booking.guests }));

  // Countdown hold timer.
  const [seconds, setSeconds] = useState(HOLD_SECONDS);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    if (seconds <= 0) { setExpired(true); return undefined; }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const money = useMemo(() => {
    const unit = Number(booking.price) || 0;
    const subtotal = unit * (Number(booking.guests) || 1);
    const discount = promo.applied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
    const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
    return {
      unit, subtotal, discount, total,
      usd: (n) => `$${(Number(n) || 0).toFixed(2)}`,
    };
  }, [booking.price, booking.guests, promo.applied]);

  // Charge date for "Reserve now, pay later" = day before the tour.
  const chargeDateLabel = useMemo(() => {
    const d = new Date(`${booking.date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "the tour date";
    d.setDate(d.getDate() - 2);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }, [booking.date]);

  const travelerName = `${contact.firstName} ${contact.lastName}`.trim();

  const applyPromo = (code) => {
    if (code === "SAVE10") { setPromo({ applied: true, code }); return true; }
    return false;
  };
  const removePromo = () => setPromo({ applied: false, code: "" });

  const validate = () => {
    const e = {};
    if (!contact.firstName?.trim()) e.contact = "Add your first and last name.";
    else if (!contact.lastName?.trim()) e.contact = "Add your last name.";
    else if (!isValidEmail(contact.email)) e.contact = "Add a valid email address.";
    else if (!/^\d{6,12}$/.test((contact.phone || "").replace(/\s/g, ""))) e.contact = "Add a valid phone number.";
    if (payMethod === "card") {
      if (!cardNumberValid(card.number)) e.cardNumber = "Enter the 16-digit card number.";
      if (!expiryValid(card.expiry)) e.expiry = "MM/YY";
      if (!cvcValid(card.cvc)) e.cvc = "3–4 digits";
    }
    return e;
  };

  const onBook = () => {
    if (expired) { toast.error("Your reservation hold expired. Please start again."); return; }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error(e.contact || "Please complete your payment details.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);
    // Front-end only: simulate a short processing delay, then confirm.
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed({ reference: bookingReference(booking.date) });
    }, 900);
  };

  const applyChange = () => {
    setBooking((b) => ({ ...b, date: changeForm.date, time: changeForm.time, guests: Math.max(1, Number(changeForm.guests) || 1) }));
    setChangeOpen(false);
    toast.success("Booking details updated.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink">
      {/* Minimal checkout header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="flex items-center gap-2 text-sm font-bold text-brand-700">
            <Icon name="lock" size={16} className="text-brand-600" />
            <span className="hidden sm:inline">Secure checkout</span>
            <span className="sm:hidden">Secure</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">Complete your booking</h1>
          <p className="mt-1 text-sm text-muted">Review your details and confirm — it only takes a minute.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Steps */}
          <div className="order-2 space-y-6 lg:order-1">
            <ContactDetailsCard contact={contact} onSave={setContact} />
            <ActivityDetailsCard booking={booking} travelerName={travelerName} onEdit={() => setChangeOpen(true)} />
            <PaymentDetailsCard
              money={money}
              payTiming={payTiming} setPayTiming={setPayTiming}
              payMethod={payMethod} setPayMethod={setPayMethod}
              card={card} setCard={setCard}
              country={country} setCountry={setCountry}
              saveInfo={saveInfo} setSaveInfo={setSaveInfo}
              errors={errors} submitting={submitting} onBook={onBook}
              chargeDateLabel={chargeDateLabel}
              cancelCutoff={booking.cancelCutoff}
            />
          </div>

          {/* Sticky summary */}
          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-6">
              <BookingSummary
                booking={booking}
                money={money}
                promo={promo}
                onApplyPromo={applyPromo}
                onRemovePromo={removePromo}
                onOpenChange={() => setChangeOpen(true)}
                seconds={seconds}
                expired={expired}
              />
            </div>
          </aside>
        </div>
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

      {/* Change booking modal */}
      <Modal open={changeOpen} onClose={() => setChangeOpen(false)} title="Change booking">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-brand-800">Date</span>
            <input type="date" value={changeForm.date} onChange={(e) => setChangeForm((f) => ({ ...f, date: e.target.value }))}
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-brand-800">Time</span>
            <select value={changeForm.time} onChange={(e) => setChangeForm((f) => ({ ...f, time: e.target.value }))}
              className="h-11 w-full cursor-pointer rounded-xl border border-line bg-canvas px-3 text-sm outline-none focus:border-brand-400">
              {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-bold text-brand-800">Guests</span>
            <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-3">
              <button type="button" onClick={() => setChangeForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))} className="grid h-10 w-10 place-items-center rounded-lg text-brand-700 hover:bg-brand-50"><Icon name="minus" size={16} /></button>
              <span className="min-w-[3ch] text-center text-lg font-bold text-brand-800">{changeForm.guests}</span>
              <button type="button" onClick={() => setChangeForm((f) => ({ ...f, guests: Math.min(20, f.guests + 1) }))} className="grid h-10 w-10 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800"><Icon name="plus" size={16} /></button>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => setChangeOpen(false)}>Cancel</Button>
            <Button variant="primary" className="flex-1 justify-center" onClick={applyChange}>Apply</Button>
          </div>
        </div>
      </Modal>

      {/* Success confirmation modal */}
      <Modal open={!!confirmed} onClose={() => navigate("/")} title="Booking confirmed">
        {confirmed && (
          <div className="space-y-4 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="check-circle" size={34} />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-brand-800">You're all set!</h3>
              <p className="mt-1 text-sm text-muted">Your booking is confirmed. A receipt has been sent to {contact.email}.</p>
            </div>
            <div className="rounded-xl border border-line bg-canvas px-4 py-3 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Booking reference</p>
              <p className="font-display text-lg font-bold text-brand-800">{confirmed.reference}</p>
              <p className="mt-2 text-sm text-brand-800">{booking.title}</p>
              <p className="text-xs text-muted">{longDate(booking.date)} • {booking.time} • {booking.guests} adult{booking.guests > 1 ? "s" : ""}</p>
              <p className="mt-1 text-sm font-bold text-brand-700">{payTiming === "now" ? `Paid ${money.usd(money.total)}` : `${money.usd(money.total)} due ${chargeDateLabel}`}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => navigate("/")}>Back to home</Button>
              <Button variant="primary" className="flex-1 justify-center" onClick={() => navigate("/profile")}>View my bookings</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
