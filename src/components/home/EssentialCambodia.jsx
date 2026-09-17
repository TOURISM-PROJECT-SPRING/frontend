import { useRef, useEffect, useState } from "react";
import Icon from "../ui/Icon";
import SectionHeading from "./SectionHeading";
import { essentialCategories } from "../../data/cambodia";

export default function EssentialCambodia({ active, onChange }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="essentials" className="py-10 mt-5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plan your trip"
          title="Essential Cambodia"
          subtitle="Browse the experiences travellers love most across the Kingdom."
        />

        <div className="relative mt-5 flex items-center group">
          <div
            className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          <button
            onClick={() => scroll("left")}
            className={`absolute -left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brand-800 shadow-md transition-all duration-300 hover:bg-brand-50 lg:-left-5 ${
              canScrollLeft ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex w-full gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-0"
          >
            {essentialCategories.map((c) => {
              const on = active === c.label;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => onChange(c.label)}
                  className={`inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-3xl border px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                    on
                      ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                      : "border-line bg-white text-brand-800 hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  <Icon name={c.icon} size={16} className={on ? "" : "text-brand-500"} />
                  {c.label}
                </button>
              );
            })}
          </div>

          <div
            className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <button
            onClick={() => scroll("right")}
            className={`absolute -right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brand-800 shadow-md transition-all duration-300 hover:bg-brand-50 lg:-right-5 ${
              canScrollRight ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
            }`}
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}