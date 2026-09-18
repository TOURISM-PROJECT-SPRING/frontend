// Green circular rating indicators — e.g. ● ● ● ● ○ 4.0+

export default function RatingDots({ rating = 0, size = 8, className = "", showValue = false }) {
  const filled = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`inline-block rounded-full ${i < filled ? "bg-success" : "bg-line"}`}
          style={{ width: size, height: size }}
        />
      ))}
      {showValue && <span className="ml-1 text-sm font-bold text-success">{rating.toFixed(1)}</span>}
    </span>
  );
}
