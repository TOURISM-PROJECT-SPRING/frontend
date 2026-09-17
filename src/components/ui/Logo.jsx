export default function Logo({ tone = "dark", showText = true, className = "" }) {
  const textMain = tone === "light" ? "text-white" : "text-brand-800";
  const textSub = tone === "light" ? "text-white/60" : "text-muted";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-8 shrink-0 place-items-center overflow-hidden">
        <img src="/logo.png" alt="SovannDomNour" className="h-full w-full object-contain" />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={`font-sans text-[23px] font-bold tracking-tight ${textMain}`}>SovannDomNour</span>
          <span className={`mt-0.5 text-[11px] font-medium tracking-wide ${textSub}`}>Discover Cambodia</span>
        </span>
      )}
    </span>
  );
}
