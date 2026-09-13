export default function Logo({ tone = "dark", showText = true, className = "" }) {
  // tone: "dark" text on light bg, "light" text on dark bg
  const textMain = tone === "light" ? "text-white" : "text-brand-800";
  const textSub = tone === "light" ? "text-white/60" : "text-muted";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 shadow-sm ring-1 ring-black/5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2.5 21 12 12 21.5 3 12 12 2.5Z" fill="#fec700" />
          <path
            d="M12 6.5c1.6 1.9 2.4 3.5 2.4 5.1 0 1.9-1.1 3.2-2.4 4.4-1.3-1.2-2.4-2.5-2.4-4.4 0-1.6.8-3.2 2.4-5.1Z"
            fill="#02462e"
          />
          <circle cx="12" cy="11.4" r="1.05" fill="#fec700" />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-[19px] font-bold tracking-tight ${textMain}`}>SovannDomNour</span>
          <span className={`mt-0.5 text-[11px] font-medium tracking-wide ${textSub}`}>Discover Cambodia</span>
        </span>
      )}
    </span>
  );
}
