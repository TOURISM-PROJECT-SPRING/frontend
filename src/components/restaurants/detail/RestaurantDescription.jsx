import { useState } from "react";
import Icon from "../../ui/Icon";

// Editorial description with an expand/collapse "Read more" toggle.
export default function RestaurantDescription({ text = "" }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  const needsMore = text.length > 340;

  return (
    <div>
      <p className={`max-w-[800px] text-[17px] leading-relaxed text-ink/80 sm:text-lg ${open || !needsMore ? "" : "line-clamp-4"}`}>
        {text}
      </p>
      {needsMore && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-700 transition-colors hover:text-brand-900"
        >
          {open ? "Read less" : "Read more"}
          <Icon name="chevron-down" size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
