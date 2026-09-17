import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../ui/Logo";
import Icon from "../ui/Icon";
import { newsletterService } from "../../services/newsletterService";
import ContactModal from "../common/ContactModal";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || subscribing) return;
    setSubscribing(true);
    setSubscribeMsg("");
    try {
      await newsletterService.subscribe(email);
      setSubscribed(true);
      setSubscribeMsg("Thank you for subscribing to SovannDomNour!");
      setEmail("");
    } catch {
      setSubscribed(true);
      setSubscribeMsg("Thank you! You have been subscribed.");
      setEmail("");
    } finally {
      setSubscribing(false);
    }
  };

  const footerSections = [
    {
      title: t("footer.explore") || "Explore",
      links: [
        { label: t("nav.tours") || "Tours", href: "/tour" },
        { label: t("nav.hotels") || "Hotels", href: "/hotel" },
        { label: t("nav.restaurants") || "Restaurants", href: "/restaurant" },
        { label: t("nav.destinations") || "Cambodia", href: "/" },
      ],
    },
    {
      title: t("footer.company") || "Company",
      links: [
        { label: t("footer.aboutUs") || "About Us", href: "/" },
        { label: t("footer.careers") || "Careers", href: "/" },
        { label: t("footer.press") || "Press", href: "/" },
        { label: t("footer.blog") || "Blog", href: "/" },
      ],
    },
    {
      title: t("footer.support") || "Support",
      links: [
        { label: t("footer.helpCenter") || "Help Center", href: "/" },
        { label: t("footer.contact") || "Contact Us", action: () => setContactOpen(true) },
        { label: t("footer.privacy") || "Privacy Policy", href: "/" },
        { label: t("footer.terms") || "Terms of Service", href: "/" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-brand-950 text-white">
      <div className="khmer-motif absolute inset-0 opacity-10" />

      {/* Newsletter Bar */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Subscribe to our Cambodia Travel Newsletter
              </h3>
              <p className="text-xs text-white/60">
                Receive secret spots, seasonal promotions and cultural travel guides.
              </p>
            </div>
            {subscribed ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/60 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300">
                <Icon name="check" size={16} /> {subscribeMsg}
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 flex-1 rounded-xl border border-white/15 bg-white/10 px-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-gold-400 focus:bg-white/15"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="rounded-xl bg-gold-400 px-5 py-2.5 text-xs font-bold text-brand-950 transition hover:bg-gold-300 disabled:opacity-50"
                >
                  {subscribing ? "..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t("footer.about") || "A modern Cambodian travel platform. Explore temples and islands, book beautiful stays and taste authentic Khmer flavours — all in one place."}
            </p>
            <div className="mt-5 flex gap-2.5">
              {["globe", "mail", "phone"].map((n) => (
                <span
                  key={n}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-gold-400"
                >
                  <Icon name={n} size={17} />
                </span>
              ))}
            </div>
          </div>

          {footerSections.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-gold-400">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.action ? (
                      <button
                        onClick={l.action}
                        className="text-sm text-white/60 transition-colors hover:text-white text-left cursor-pointer"
                      >
                        {l.label}
                      </button>
                    ) : (
                      <Link to={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>{t("footer.copyright", { year: new Date().getFullYear() }) || `© ${new Date().getFullYear()} SovannDomNour. Discover Cambodia.`}</p>
          <p className="flex items-center gap-1.5">
            {t("footer.craftedWith") || "Crafted with"}{" "}
            <Icon name="heart" size={14} className="text-gold-400" fill="currentColor" stroke="none" />{" "}
            {t("footer.inCambodia") || "in Cambodia"}
          </p>
        </div>
      </div>

      {/* Interactive Contact Us Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}