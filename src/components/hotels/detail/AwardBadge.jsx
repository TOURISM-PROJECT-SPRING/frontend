import Icon from "../../ui/Icon";

// Original SovannDomNour recognition badge (not any third-party mark).
export default function AwardBadge({ award, tone, size = "sm", className = "" }) {
  if (!award) return null;
  const gold = (tone || award.tone) === "gold";
  const dims =
    size === "lg"
      ? "gap-2 px-4 py-2 text-sm"
      : "gap-1.5 px-2.5 py-1 text-[11px]";
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
