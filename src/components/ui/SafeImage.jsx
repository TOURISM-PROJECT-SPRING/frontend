import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function SafeImage({
  src,
  alt = "",
  fallback,
  className = "",
  iconClassName = "",
  ...rest
}) {
  const [current, setCurrent] = useState(src || null);
  const [errored, setErrored] = useState(false);

  if (!current || errored) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
        <ImageOff className={`w-8 h-8 text-gray-300 dark:text-gray-600 ${iconClassName}`} />
      </div>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => {
        if (fallback && current !== fallback) {
          setCurrent(fallback);
        } else {
          setErrored(true);
        }
      }}
      {...rest}
    />
  );
}