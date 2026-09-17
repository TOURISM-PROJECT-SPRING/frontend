// Renders a review excerpt with **keyword** markers turned into bold text,
// clamped to two lines like the reference.
function renderRich(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function ReviewExcerpt({ text }) {
  if (!text) return null;
  return (
    <p className="line-clamp-2 text-[15px] leading-relaxed text-muted">
      &ldquo; {renderRich(text)} &rdquo;
    </p>
  );
}
