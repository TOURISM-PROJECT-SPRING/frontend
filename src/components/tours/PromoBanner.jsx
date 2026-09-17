import Icon from "../ui/Icon";

// Promo strip: outlined price-tag + discount code, deadline, terms link.
export default function PromoBanner() {
  return (
    <div className="flex min-h-[80px] flex-wrap items-center gap-x-8 gap-y-2 rounded-2xl border border-line bg-white px-6 py-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger">
        <Icon name="tag" size={24} strokeWidth={1.6} />
      </span>
      <p className="text-[17px] text-ink/85">
        <span className="font-bold text-brand-900">$25 off with code ENJOYTTD25</span>
      </p>
      <p className="text-[16px] text-ink/70">Book before September 30</p>
      <a href="#" className="text-[16px] font-medium text-ink/70 underline underline-offset-4 transition hover:text-brand-700">
        Terms apply
      </a>
    </div>
  );
}
