import Icon from "./Icon";

export default function Rating({ value, reviews, size = 14, showNumber = true }) {
  if (value == null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
      <Icon name="star" size={size} className="text-gold-400" fill="currentColor" stroke="none" />
      {showNumber && <span>{Number(value).toFixed(1)}</span>}
      {reviews != null && <span className="font-medium text-muted">({reviews})</span>}
    </span>
  );
}
