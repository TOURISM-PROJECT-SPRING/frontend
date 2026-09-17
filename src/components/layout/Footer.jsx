import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { useToast } from "../ui/Toast";

const FOOTER_SECTIONS = [
  {
    title: "Destinations",
    links: [
      { label: "Siem Reap & Angkor", to: "/tour?q=Siem+Reap" },
      { label: "Phnom Penh Capital", to: "/tour?q=Phnom+Penh" },
      { label: "Koh Rong & Sanloem", to: "/hotel?q=Koh+Rong" },
      { label: "Kampot River & Pepper", to: "/tour?q=Kampot" },
      { label: "Kep Beach & National Park", to: "/tour?q=Kep" },
      { label: "Mondulkiri Highlands", to: "/tour?q=Mondulkiri" },
    ],
  },
  {
    title: "Experiences",
    links: [
      { label: "Angkor Sunrise Guided Tours", to: "/tour" },
      { label: "Island Beach Escapes", to: "/hotel" },
      { label: "Authentic Khmer Cooking", to: "/restaurant" },
      { label: "Tonle Sap Floating Villages", to: "/tour" },
      { label: "Bokor Mountain Trekking", to: "/tour" },
      { label: "Phnom Penh Sunset Cruises", to: "/tour" },
    ],
  },
  {
    title: "Accommodations",
    links: [
      { label: "Luxury Boutique Resorts", to: "/hotel" },
      { label: "Eco-Lodge Rainforest Stays", to: "/hotel" },
      { label: "Private Island Beach Villas", to: "/hotel" },
      { label: "Heritage Colonial Hotels", to: "/hotel" },
      { label: "Riverside Bungalows", to: "/hotel" },
      { label: "Special Offers & Deals", to: "/hotel" },
    ],
  },
  {
    title: "Company & Trust",
    links: [
      { label: "About SovannDomNour", to: "/" },
      { label: "Sustainable Travel Pledge", to: "/" },
      { label: "Verified Local Operators", to: "/" },
      { label: "Traveler Reviews & Stories", to: "/" },
      { label: "Partner With Us", to: "/login" },
      { label: "Careers & Press", to: "/" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to SovannDomNour travel updates!");
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-gradient-to-b from-[#011e14] via-[#012a1c] to-[#00140d] text-white">
      {/* Subtle Khmer Star Pattern */}
      <div className="khmer-motif absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        
        {/* ================= TOP: NEWSLETTER SUBSCRIPTION CARD ================= */}
        <div className="mb-14 overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-300 ring-1 ring-gold-400/30">
                <Icon name="sparkles" size={13} />
                Traveler Newsletter
              </span>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-white">
                Unlock Exclusive Cambodian Secrets &amp; Offers
              </h3>
              <p className="mt-2 text-sm text-emerald-100/80 leading-relaxed">
                Join over 25,000 discerning travelers who receive our curated temple itineraries, secret beach guides, and member-only hotel discounts.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50">
                  <Icon name="mail" size={17} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-2xl border border-white/20 bg-white/10 pl-10 pr-4 text-xs sm:text-sm font-medium text-white outline-none placeholder:text-white/50 transition-all focus:border-gold-400 focus:bg-white/15 focus:ring-2 focus:ring-gold-400/20"
                />
              </div>
              <button
                type="submit"
                className="h-12 shrink-0 rounded-2xl bg-gold-400 px-6 font-display text-xs sm:text-sm font-bold text-brand-950 shadow-md transition-all hover:bg-gold-300 active:scale-95"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>

        {/* ================= MIDDLE: 5 CLEAN CATEGORIZED COLUMNS ================= */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] border-b border-white/10 pb-14">
          
          {/* Brand Info & Support */}
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              The premier Cambodian tourism and hospitality portal. Discover ancient temples, pristine islands, luxury boutique resorts, and authentic Khmer cuisine.
            </p>

            {/* Direct Travel Concierge Helpline */}
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-3.5 max-w-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-300">24/7 Travel Desk</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                <Icon name="phone" size={15} className="text-emerald-400" />
                <a href="tel:+8552755071" className="hover:text-gold-300 transition-colors">+855 275 5071</a>
              </div>
              <p className="mt-0.5 text-[11px] text-white/60">English &amp; Khmer multilingual support</p>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-2">
              {["globe", "mail", "phone", "at-sign"].map((n) => (
                <span
                  key={n}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-gold-300 transition-colors hover:bg-white/15 hover:text-white cursor-pointer"
                >
                  <Icon name={n} size={16} />
                </span>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs sm:text-sm text-white/70 transition-colors hover:text-white hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= PAYMENT & ACCREDITATION STRIP ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 border-b border-white/10 text-xs text-white/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white">Accepted Payments:</span>
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              VISA
            </span>
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              MASTERCARD
            </span>
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              AMEX
            </span>
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-bold text-gold-300">
              ABA KHQR
            </span>
            <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-bold text-blue-300">
              PayPal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Icon name="shield-check" size={15} />
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
              <Icon name="badge-check" size={15} />
              Accredited Tourism Operator
            </span>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} SovannDomNour Inc. All rights reserved. Discover Cambodia.</p>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">Cookies Statement</Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-gold-400 font-semibold">
              <Icon name="globe" size={13} />
              EN (US) • USD ($)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}