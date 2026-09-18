import Icon from "../ui/Icon";
import { AMENITY_ICONS } from "../../data/hotels";

// Compact icon + label list of hotel amenities (falls back to a bullet for
// amenities without a dedicated icon).
export default function AmenityList({ amenities = [], max = 4, className = "" }) {
  const shown = amenities.slice(0, max);
  const rest = amenities.length - shown.length;
  if (!shown.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      {shown.map((a) => (
        <li key={a} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted">
          <Icon name={AMENITY_ICONS[a] || "check"} size={15} className="text-brand-500" />
          {a}
        </li>
      ))}
      {rest > 0 && <li className="text-[13px] font-semibold text-brand-600">+{rest} more</li>}
    </ul>
  );
}
