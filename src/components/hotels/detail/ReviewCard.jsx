import { useState } from "react";
import RatingDots from "../RatingDots";

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  if (!review) return null;
  const long = review.text.length > 120;
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <RatingDots rating={review.rating} size={9} />
      <p className="mt-2 text-sm font-bold text-brand-800">
        {review.author}
        <span className="font-medium text-muted"> · {review.date}</span>
      </p>
      <p className={`mt-2 flex-1 text-[15px] leading-relaxed text-ink/80 ${expanded || !long ? "" : "line-clamp-4"}`}>
        {review.text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 self-start text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </article>
  );
}
