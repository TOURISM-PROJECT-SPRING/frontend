export default function Logo({ tone = "dark", showText = true, className = "", smooth = false, collapsed = false }) {
  const textMain = tone === "light" ? "text-white" : "text-brand-800";
  const textSub = tone === "light" ? "text-white/70" : "text-brand-600";
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="grid h-10 w-8 shrink-0 place-items-center overflow-hidden">
        <img src="/logo.png" alt="SovannDomNour" className="h-full w-full object-contain" />
      </span>
      {showText && (
        <span
          className={`flex flex-col leading-none overflow-hidden ${
            smooth ? "transition-all duration-300 ease-in-out" : ""
          } ${smooth ? (collapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[180px] opacity-100 ml-2.5") : "ml-2.5"}`}
        >
          <span className={`font-sans text-[20px] font-bold tracking-tight whitespace-nowrap ${textMain}`}>SovannDomNour</span>
          <span className={`mt-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap ${textSub}`}>Discover Cambodia</span>
        </span>
      )}
    </span>
  );
}
