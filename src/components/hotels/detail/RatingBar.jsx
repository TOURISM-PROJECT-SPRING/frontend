// Reusable horizontal rating meter — light track, green fill.
export default function RatingBar({ label, score = 0, max = 5, className = "" }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="w-28 shrink-0 text-sm font-medium text-muted">{label}</span>
      <span
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-line"
        role="img"
        aria-label={`${label}: ${score.toFixed(1)} out of ${max}`}
      >
        <span className="absolute inset-y-0 left-0 rounded-full bg-success" style={{ width: `${pct}%` }} />
      </span>
      <span className="w-8 shrink-0 text-right text-sm font-bold text-brand-800">{score.toFixed(1)}</span>
    </div>
  );
}
