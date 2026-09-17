import { useRef, useState } from "react";
import Icon from "../../ui/Icon";

// Header actions: "Save" (heart, toggles state) + outlined "Review" pill.
export default function ActionButtons({ favorite, onSave, onReview, className = "" }) {
  const [pop, setPop] = useState(false);
  const timer = useRef(null);
  const handleSave = () => {
    onSave?.();
    setPop(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPop(false), 320);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleSave}
        aria-pressed={favorite}
        className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-all duration-200 ${
          favorite ? "border-rose-300 bg-rose-50 text-rose-600" : "border-brand-300 bg-white text-brand-800 hover:bg-brand-50"
        }`}
      >
        <Icon
          name="heart"
          size={17}
          fill={favorite ? "currentColor" : "none"}
          className={`transition-transform duration-300 ${pop ? "scale-[1.18]" : ""}`}
        />
        {favorite ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-300 bg-white px-4 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50"
      >
        <Icon name="pencil" size={16} />
        Write a Review
      </button>
    </div>
  );
}
