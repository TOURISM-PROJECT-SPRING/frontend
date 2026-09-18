import { useMemo } from "react";
import Icon from "../ui/Icon";
import { COUNTRIES, formatCardNumber, formatExpiry } from "./checkoutData";

// Visual Brand Badges
function BrandBadge({ brand }) {
  switch (brand) {
    case "visa":
      return (
        <span className="inline-flex h-6 items-center justify-center rounded border border-slate-200 bg-white px-1.5 py-0.5 shadow-2xs">
          <svg className="h-3.5 w-auto" viewBox="0 0 36 12" fill="none">
            <path d="M14.6 0.5L9.6 11.5H6.3L3.8 2.5C3.7 1.9 3.5 1.7 3 1.4C2.3 0.9 1.1 0.5 0 0.3L0.1 0.5H5.4C6.1 0.5 6.7 1 6.8 1.8L8.1 8.8L11.4 0.5H14.6ZM27.4 7.8C27.4 4.8 23.3 4.6 23.3 3.3C23.3 2.9 23.7 2.5 24.6 2.4C25 2.3 26.2 2.3 27.5 2.9L28.1 0.6C27.3 0.3 26.3 0 25 0C21.9 0 19.8 1.6 19.8 4C19.8 5.7 21.3 6.7 22.5 7.3C23.6 7.8 24 8.2 24 8.7C24 9.5 23 9.8 22.1 9.8C20.6 9.8 19.7 9.4 19 9.1L18.4 11.5C19.2 11.9 20.6 12.2 22 12.2C25.4 12.2 27.4 10.5 27.4 7.8ZM35.5 11.5H38.3L35.8 0.5H33.2C32.6 0.5 32.1 0.9 31.9 1.4L27.2 11.5H30.6L31.3 9.6H35.1L35.5 11.5ZM32.2 7.2L33.7 3.1L34.6 7.2H32.2ZM19.2 0.5L16.6 11.5H13.4L16 0.5H19.2Z" fill="#1A1F71" />
          </svg>
        </span>
      );
    case "mastercard":
      return (
        <span className="inline-flex h-6 items-center justify-center rounded border border-slate-200 bg-white px-1 py-0.5 shadow-2xs">
          <svg className="h-4 w-auto" viewBox="0 0 32 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="#EB001B" />
            <circle cx="22" cy="10" r="9" fill="#F79E1B" fillOpacity="0.88" />
          </svg>
        </span>
      );
    case "amex":
      return (
        <span className="inline-flex h-6 items-center justify-center rounded border border-[#006FCF] bg-[#006FCF] px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-2xs">
          AMEX
        </span>
      );
    case "jcb":
      return (
        <span className="inline-flex h-6 items-center justify-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-extrabold tracking-tight text-blue-700 shadow-2xs">
          JCB
        </span>
      );
    default:
      return null;
  }
}

const PAY_METHODS = [
  {
    key: "card",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard, Amex, JCB",
    icon: "credit-card",
    brands: ["visa", "mastercard", "amex"],
  },
  {
    key: "gpay",
    label: "Google Pay",
    sublabel: "Fast & secure one-click checkout",
    icon: "smartphone",
    customBadge: (
      <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-700 shadow-2xs">
        <span className="text-blue-500">G</span>
        <span className="text-slate-600">Pay</span>
      </span>
    ),
  },
  {
    key: "paypal",
    label: "PayPal",
    sublabel: "Pay with your PayPal balance or bank",
    icon: "wallet",
    customBadge: (
      <span className="inline-flex items-center rounded-md border border-slate-200 bg-[#003087] px-2 py-0.5 text-xs font-black italic tracking-wide text-white shadow-2xs">
        Pay<span className="text-[#0079C1]">Pal</span>
      </span>
    ),
  },
  {
    key: "paypal_later",
    label: "PayPal Pay Later",
    sublabel: "4 interest-free bi-weekly payments",
    icon: "wallet",
    tag: "0% Interest",
  },
];

function detectCardBrand(num = "") {
  const digits = num.replace(/\s+/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^35/.test(digits)) return "jcb";
  return null;
}

function Radio({ checked }) {
  return (
    <span
      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all duration-200 ${
        checked
          ? "border-brand-700 bg-white shadow-[0_0_0_2px_rgba(2,70,46,0.15)]"
          : "border-line bg-white hover:border-brand-400"
      }`}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand-700 animate-scalein" />}
    </span>
  );
}

export default function PaymentDetailsCard({
  money,
  payTiming,
  setPayTiming,
  payMethod,
  setPayMethod,
  card,
  setCard,
  country,
  setCountry,
  saveInfo,
  setSaveInfo,
  errors,
  submitting,
  onBook,
  chargeDateLabel,
  cancelCutoff,
}) {
  const patchCard = (p) => setCard((c) => ({ ...c, ...p }));
  const dueToday = payTiming === "now" ? money.total : 0;
  const currentCardBrand = useMemo(() => detectCardBrand(card?.number), [card?.number]);

  const inputBase =
    "h-12 w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink outline-none transition-all placeholder:text-muted/60";

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      {/* Header */}
      <div className="border-b border-line/80 bg-white p-6 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white shadow-2xs">
              3
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-brand-800">Payment details</h2>
              <p className="text-xs text-muted">All transactions are encrypted, secure, and PCI compliant.</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50/80 px-3 py-1 text-xs font-bold text-brand-700">
            <Icon name="shield-check" size={15} className="text-brand-600" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Step 1: Choose when to pay */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-brand-900">1. Choose when to pay</h3>
            <span className="text-xs font-semibold text-brand-600">Flexible options</span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {/* Pay Now Option */}
            <button
              type="button"
              onClick={() => setPayTiming("now")}
              className={`group relative flex flex-col justify-between rounded-xl border-2 p-4 text-left transition-all ${
                payTiming === "now"
                  ? "border-brand-700 bg-brand-50/40 shadow-xs ring-1 ring-brand-700/20"
                  : "border-line bg-white hover:border-brand-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Radio checked={payTiming === "now"} />
                  <span className="font-display text-base font-bold text-brand-900">Pay now</span>
                </div>
                <span className="font-display text-lg font-extrabold text-brand-800">{money.usd(money.total)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Complete full payment now with instant booking confirmation.
              </p>
              <div className="mt-3 flex items-center gap-1.5 border-t border-line/60 pt-2 text-[11px] font-semibold text-brand-700">
                <Icon name="check" size={13} className="text-brand-600" />
                <span>Instant confirmed receipt</span>
              </div>
            </button>

            {/* Pay Later Option */}
            <button
              type="button"
              onClick={() => setPayTiming("later")}
              className={`group relative flex flex-col justify-between rounded-xl border-2 p-4 text-left transition-all ${
                payTiming === "later"
                  ? "border-brand-700 bg-brand-50/40 shadow-xs ring-1 ring-brand-700/20"
                  : "border-line bg-white hover:border-brand-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Radio checked={payTiming === "later"} />
                  <div>
                    <span className="font-display text-base font-bold text-brand-900">Reserve now, pay later</span>
                  </div>
                </div>
                <span className="font-display text-lg font-extrabold text-brand-800">{money.usd(0)}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Zero fees today. Automatically charged {money.usd(money.total)} on <span className="font-semibold text-ink">{chargeDateLabel}</span>.
              </p>
              <div className="mt-3 flex items-center gap-1.5 border-t border-line/60 pt-2 text-[11px] font-semibold text-emerald-700">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>$0 due today • Cancel anytime</span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Choose Payment Method */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-brand-900">2. Select payment method</h3>
            <div className="flex items-center gap-1.5">
              <BrandBadge brand="visa" />
              <BrandBadge brand="mastercard" />
              <BrandBadge brand="amex" />
              <BrandBadge brand="jcb" />
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {PAY_METHODS.map((m) => {
              const isSelected = payMethod === m.key;
              return (
                <div
                  key={m.key}
                  className={`overflow-hidden rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-brand-700 bg-white shadow-sm ring-1 ring-brand-700/10"
                      : "border-line bg-white hover:border-brand-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPayMethod(m.key)}
                    className={`flex w-full items-center justify-between gap-3 p-4 text-left transition-colors ${
                      isSelected ? "bg-brand-50/20" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Radio checked={isSelected} />
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                        <Icon name={m.icon} size={20} />
                      </div>
                      <div>
                        <span className="block font-display text-sm font-bold text-brand-900">{m.label}</span>
                        <span className="block text-xs text-muted">{m.sublabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {m.tag && (
                        <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-700">
                          {m.tag}
                        </span>
                      )}
                      {m.customBadge}
                      {m.brands && (
                        <div className="hidden items-center gap-1 sm:flex">
                          {m.brands.map((b) => (
                            <BrandBadge key={b} brand={b} />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Credit Card Details Form */}
                  {m.key === "card" && isSelected && (
                    <div className="border-t border-line/70 bg-gradient-to-b from-brand-50/15 to-white p-5 sm:p-6">
                      <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                          <div className="mb-1.5 flex items-center justify-between">
                            <label htmlFor="card-number-input" className="text-xs font-bold uppercase tracking-wider text-brand-800">
                              Card number
                            </label>
                            {currentCardBrand && <BrandBadge brand={currentCardBrand} />}
                          </div>
                          <div className="relative">
                            <input
                              id="card-number-input"
                              className={`${inputBase} ${
                                errors.cardNumber
                                  ? "border-danger bg-red-50/10 focus:border-danger focus:ring-2 focus:ring-danger/15"
                                  : "border-line focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                              } pl-10 pr-12 font-mono text-[15px] tracking-wider`}
                              inputMode="numeric"
                              value={card.number}
                              onChange={(e) => patchCard({ number: formatCardNumber(e.target.value) })}
                              placeholder="1234  5678  9012  3456"
                              maxLength={19}
                            />
                            <Icon
                              name="credit-card"
                              size={18}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/70"
                            />
                            {currentCardBrand && (
                              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                <BrandBadge brand={currentCardBrand} />
                              </div>
                            )}
                          </div>
                          {errors.cardNumber && (
                            <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger">
                              <Icon name="x-circle" size={13} />
                              <span>{errors.cardNumber}</span>
                            </p>
                          )}
                        </div>

                        {/* Expiry & CVC Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Expiry Date */}
                          <div>
                            <label htmlFor="expiry-input" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                              Expiration date
                            </label>
                            <div className="relative">
                              <input
                                id="expiry-input"
                                className={`${inputBase} ${
                                  errors.expiry
                                    ? "border-danger bg-red-50/10 focus:border-danger focus:ring-2 focus:ring-danger/15"
                                    : "border-line focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                } pl-10 font-mono text-[15px]`}
                                inputMode="numeric"
                                value={card.expiry}
                                onChange={(e) => patchCard({ expiry: formatExpiry(e.target.value) })}
                                placeholder="MM / YY"
                                maxLength={5}
                              />
                              <Icon
                                name="calendar"
                                size={18}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/70"
                              />
                            </div>
                            {errors.expiry && (
                              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger">
                                <Icon name="x-circle" size={13} />
                                <span>{errors.expiry}</span>
                              </p>
                            )}
                          </div>

                          {/* Security Code (CVC) */}
                          <div>
                            <div className="mb-1.5 flex items-center justify-between">
                              <label htmlFor="cvc-input" className="text-xs font-bold uppercase tracking-wider text-brand-800">
                                Security code (CVC)
                              </label>
                              <span className="text-[11px] text-muted">3-4 digits on back</span>
                            </div>
                            <div className="relative">
                              <input
                                id="cvc-input"
                                className={`${inputBase} ${
                                  errors.cvc
                                    ? "border-danger bg-red-50/10 focus:border-danger focus:ring-2 focus:ring-danger/15"
                                    : "border-line focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                                } pl-10 pr-10 font-mono text-[15px]`}
                                inputMode="numeric"
                                value={card.cvc}
                                onChange={(e) => patchCard({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                                placeholder="CVC / CVV"
                                maxLength={4}
                              />
                              <Icon
                                name="lock"
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/70"
                              />
                            </div>
                            {errors.cvc && (
                              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-danger">
                                <Icon name="x-circle" size={13} />
                                <span>{errors.cvc}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Country / Billing Region */}
                        <div>
                          <label htmlFor="billing-country-select" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">
                            Billing country or region
                          </label>
                          <div className="relative">
                            <select
                              id="billing-country-select"
                              className={`${inputBase} cursor-pointer appearance-none border-line pr-10 font-sans text-[15px] font-medium text-ink focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15`}
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <Icon
                              name="chevron-down"
                              size={17}
                              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                            />
                          </div>
                        </div>

                        {/* Save info checkbox */}
                        <div className="pt-1">
                          <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-line/60 bg-white p-3 transition-colors hover:bg-slate-50/70">
                            <input
                              type="checkbox"
                              checked={saveInfo}
                              onChange={(e) => setSaveInfo(e.target.checked)}
                              className="h-4 w-4 rounded border-line text-brand-700 focus:ring-brand-500/30"
                            />
                            <span className="text-xs font-semibold text-brand-900 group-hover:text-brand-950">
                              Save card details securely for 1-click checkout in future bookings
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Non-card Redirect Notice */}
                  {m.key !== "card" && isSelected && (
                    <div className="border-t border-line/70 bg-brand-50/20 p-4 text-xs text-muted">
                      <div className="flex items-center gap-2 font-semibold text-brand-800">
                        <Icon name="shield-check" size={16} className="text-brand-600" />
                        <span>Seamless &amp; Encrypted Authorization</span>
                      </div>
                      <p className="mt-1 pl-6">
                        You will be safely routed to <strong className="text-brand-900">{m.label}</strong> to authorize your payment. No account or card numbers are exposed.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Cancellation Policy Strip */}
        <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50/50 p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-xs font-bold text-brand-800">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-200 text-brand-800">
                <Icon name="refresh" size={13} />
              </span>
              <span>
                Free cancellation before <span className="underline">{cancelCutoff}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Icon name="lock" size={13} className="text-brand-600" />
              <span>No booking fees • Bank-grade encryption</span>
            </div>
          </div>
        </div>

        {/* Total & Action Button */}
        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-baseline justify-between rounded-xl bg-canvas p-4 sm:px-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                {payTiming === "now" ? "Total amount" : "Amount due today"}
              </span>
              <p className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
                {money.usd(dueToday)}
              </p>
            </div>
            {payTiming === "later" && (
              <div className="text-right text-xs text-muted">
                <span>Total booking: </span>
                <span className="font-bold text-ink">{money.usd(money.total)}</span>
                <span className="block text-[11px] text-brand-700">Charged on {chargeDateLabel}</span>
              </div>
            )}
          </div>

          <p className="mx-auto mt-4 max-w-xl text-center text-xs text-muted">
            By clicking &quot;{payTiming === "now" ? "Confirm & Pay" : "Reserve spot"}&quot;, you agree to SovannDomNour&apos;s{" "}
            <a href="#" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
              Privacy Policy
            </a>
            .
          </p>

          <button
            type="button"
            data-testid="book-now"
            onClick={onBook}
            disabled={submitting}
            className="group relative mt-4 flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-brand-700 px-6 font-display text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-brand-800 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing secure transaction…
              </span>
            ) : (
              <>
                <Icon name="lock" size={17} className="transition-transform group-hover:scale-110" />
                <span>
                  {payTiming === "now"
                    ? `Confirm & Pay ${money.usd(money.total)}`
                    : `Reserve Now • Pay ${money.usd(0)} Today`}
                </span>
              </>
            )}
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[11px] text-muted">
            <span>Guaranteed Safe &amp; Secure Checkout</span>
            <span>•</span>
            <span>Official Tourism Merchant</span>
            <span>•</span>
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

