import Icon from "../../ui/Icon";

// Original SovannDomNour recognition badge (not any third-party mark).
//   variant="tile"  → rounded-square icon + label/year stack (info section)
//   variant="pill"  → compact pill for gallery / header overlays
export default function AwardBadge({ award, variant = "pill", size = "sm", className = "" }) {
  if (!award) return null;
  const gold = award.tone === "gold";

  if (variant === "tile") {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <span
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-1 ${
            gold ? "bg-gold-400 text-brand-900 ring-gold-500/40" : "bg-brand-700 text-white ring-brand-800/30"
          }`}
        >
          <Icon name="award" size={28} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold text-brand-900">{award.title}</span>
          <span className="block text-sm font-semibold text-muted">{award.year}</span>
        </span>
      </div>
    );
  }

  const dims = size === "lg" ? "gap-2 px-4 py-2 text-sm" : "gap-1.5 px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex items-center rounded-full font-bold shadow-sm ring-1 ${
        gold ? "bg-gold-400 text-brand-900 ring-gold-500/40" : "bg-brand-700 text-white ring-brand-800/30"
      } ${dims} ${className}`}
    >
      <Icon name="award" size={size === "lg" ? 18 : 13} />
      <span className="whitespace-nowrap">
        {award.title} {award.year}
      </span>
    </span>
  );
}
