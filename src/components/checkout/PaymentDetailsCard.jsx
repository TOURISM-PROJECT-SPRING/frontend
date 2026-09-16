import Icon from "../ui/Icon";
import { COUNTRIES, formatCardNumber, formatExpiry } from "./checkoutData";

const PAY_METHODS = [
  { key: "card", label: "Card", icon: "credit-card" },
  { key: "gpay", label: "Google Pay", icon: "smartphone" },
  { key: "paypal", label: "PayPal", icon: "wallet" },
  { key: "paypal_later", label: "PayPal Pay Later", icon: "wallet" },
];

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

function Radio({ checked }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${checked ? "border-brand-700" : "border-line"}`}>
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-700" />}
    </span>
  );
}

export default function PaymentDetailsCard({
  money, payTiming, setPayTiming, payMethod, setPayMethod,
  card, setCard, country, setCountry, saveInfo, setSaveInfo,
  errors, submitting, onBook, chargeDateLabel, cancelCutoff,
}) {
  const patchCard = (p) => setCard((c) => ({ ...c, ...p }));
  const dueToday = payTiming === "now" ? money.total : 0;

  return (
    <section className="rounded-2xl border-2 border-brand-600/40 bg-white p-6 shadow-[0_0_0_3px_rgba(47,109,81,0.06)] sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">3</span>
        <h2 className="font-display text-2xl font-bold text-brand-800">Payment details</h2>
      </div>

      {/* Choose when to pay */}
      <h3 className="mt-6 font-display text-base font-bold text-brand-800">Choose when to pay</h3>
      <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line">
        <button type="button" onClick={() => setPayTiming("now")} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-brand-50/50">
          <Radio checked={payTiming === "now"} />
          <span className="flex-1 font-bold text-brand-900">Pay now</span>
          <span className="font-display text-lg font-bold text-brand-800">{money.usd(money.total)}</span>
        </button>
        <div className={`p-4 transition-colors ${payTiming === "later" ? "bg-brand-50/40" : ""}`}>
          <button type="button" onClick={() => setPayTiming("later")} className="flex w-full items-center gap-3 text-left">
            <Radio checked={payTiming === "later"} />
            <span className="flex-1 font-bold text-brand-900">Reserve Now, Pay Later</span>
            <span className="font-display text-lg font-bold text-brand-800">{money.usd(0)}</span>
          </button>
          <p className="mt-2 pl-8 text-sm text-muted">No extra fees. You'll be charged {money.usd(money.total)} on {chargeDateLabel}.</p>
        </div>
      </div>

      {/* Pay with */}
      <h3 className="mt-7 font-display text-base font-bold text-brand-800">Pay with</h3>
      <div className="mt-3 space-y-3">
        {PAY_METHODS.map((m) => (
          <div key={m.key} className={`overflow-hidden rounded-xl border transition-colors ${payMethod === m.key ? "border-brand-600 bg-brand-50/30" : "border-line"}`}>
            <button type="button" onClick={() => setPayMethod(m.key)} className="flex w-full items-center gap-3 p-4 text-left">
              <Radio checked={payMethod === m.key} />
              <Icon name={m.icon} size={20} className="text-brand-700" />
              <span className="font-bold text-brand-900">{m.label}</span>
            </button>

            {m.key === "card" && payMethod === "card" && (
              <div className="space-y-4 border-t border-line p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block sm:col-span-1">
                    <span className="mb-1.5 block text-xs font-bold text-brand-800">Card number</span>
                    <input className={inputCls} inputMode="numeric" value={card.number} onChange={(e) => patchCard({ number: formatCardNumber(e.target.value) })} placeholder="1234 1234 1234 1234" />
                    {errors.cardNumber && <span className="mt-1 block text-xs font-semibold text-danger">{errors.cardNumber}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-brand-800">Expiration date</span>
                    <input className={inputCls} inputMode="numeric" value={card.expiry} onChange={(e) => patchCard({ expiry: formatExpiry(e.target.value) })} placeholder="MM / YY" />
                    {errors.expiry && <span className="mt-1 block text-xs font-semibold text-danger">{errors.expiry}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold text-brand-800">Security code</span>
                    <span className="relative block">
                      <input className={`${inputCls} pr-10`} inputMode="numeric" value={card.cvc} onChange={(e) => patchCard({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="CVC" />
                      <Icon name="lock" size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                    </span>
                    {errors.cvc && <span className="mt-1 block text-xs font-semibold text-danger">{errors.cvc}</span>}
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-brand-800">Country</span>
                  <span className="relative block">
                    <select className={`${inputCls} cursor-pointer appearance-none pr-10`} value={country} onChange={(e) => setCountry(e.target.value)}>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  </span>
                </label>
                <label className="flex items-center gap-2.5 text-sm font-semibold text-brand-800">
                  <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} className="h-4 w-4 rounded border-line text-brand-700 focus:ring-brand-500/30" />
                  Save my information for faster checkout
                </label>
              </div>
            )}

            {m.key !== "card" && payMethod === m.key && (
              <p className="border-t border-line p-4 text-sm text-muted">
                You'll complete this purchase with {m.label} in a secure window. No card details are stored here.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Total + action */}
      <div className="mt-8 border-t border-line pt-6">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-brand-900">
            {payTiming === "now" ? "Total price" : "Due today"} <span className="text-brand-700">{money.usd(dueToday)}</span>
          </p>
        </div>
        <p className="mt-3 flex items-start justify-center gap-2 text-center text-sm font-semibold text-brand-700">
          <Icon name="refresh" size={16} className="mt-0.5 shrink-0" />
          <span className="text-left">Free cancellation before {cancelCutoff} (tour local time)</span>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted">
          By clicking "Book Now", you agree to SovannDomNour's{" "}
          <a href="#" className="underline">Terms and Privacy</a> and Cookies Statement, plus the tour operator's rules &amp; regulations.
        </p>

        <button
          type="button"
          data-testid="book-now"
          onClick={onBook}
          disabled={submitting}
          className="mt-5 flex h-[54px] w-full items-center justify-center rounded-full text-base font-bold text-[#123D24] shadow-sm transition-all duration-150 hover:brightness-95 active:scale-[0.99] disabled:opacity-70"
          style={{ backgroundColor: "#70E45F" }}
        >
          {submitting ? "Processing…" : payTiming === "now" ? `Book now • ${money.usd(money.total)}` : "Reserve now, pay later"}
        </button>

        <p className="mt-4 text-center text-xs text-muted">
          Your booking is facilitated by SovannDomNour, but a third-party tour operator provides the tour/activity directly to you.
        </p>
        <p className="mt-1 text-center text-xs text-muted">Your statement will list SovannDomNour as the merchant for this transaction.</p>
      </div>
    </section>
  );
}
