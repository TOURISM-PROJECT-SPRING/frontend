import { useState } from "react";

// Image with graceful fallback: if src is empty or fails to load, show a
// branded gradient placeholder so cards never look broken.
export default function SmartImage({ src, alt = "", className = "", imgClassName = "", ratio, glyphClassName }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className={`relative overflow-hidden bg-brand-100 ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {showFallback && (
        <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-brand-700 to-brand-500 ${glyphClassName || ""}`}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="text-gold-400/80">
            <path d="M12 3 20 12 12 21 4 12 12 3Z" fill="currentColor" opacity="0.9" />
            <path d="M12 7c1.2 1.5 1.9 2.7 1.9 4 0 1.5-.9 2.6-1.9 3.6-1-1-1.9-2.1-1.9-3.6 0-1.3.7-2.5 1.9-4Z" fill="#02462e" />
          </svg>
        </div>
      )}
    </div>
  );
}
