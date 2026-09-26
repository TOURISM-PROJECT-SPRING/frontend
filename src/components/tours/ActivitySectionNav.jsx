import { useEffect, useState } from "react";

// Sticky "on this page" jump nav. Sits directly under the 72px site header, so
// anchors need a matching scroll offset — see SECTION_SCROLL_MT in the page.
export default function ActivitySectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id ?? null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      // Bias the trigger line toward the top third so the active pill changes
      // where the heading actually sits on screen, not when it first peeks in.
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-18 z-40 -mx-4 border-y border-line/70 bg-white/90 px-4 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto py-2.5">
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={on ? "true" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
                on ? "bg-brand-700 text-white" : "text-ink/70 hover:bg-brand-50 hover:text-brand-800"
              }`}
            >
              {s.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
