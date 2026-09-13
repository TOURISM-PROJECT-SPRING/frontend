export default function SectionHeading({ eyebrow, title, subtitle, center = false, action }) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        center ? "text-center sm:flex-col sm:items-center" : ""
      }`}
    >
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && (
          <div className={`flex items-center gap-2 ${center ? "justify-center" : ""}`}>
            <span className="h-px w-8 bg-gold-400" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">
              {eyebrow}
            </span>
          </div>
        )}
        {title && (
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-[34px]">
            {title}
          </h2>
        )}
        {subtitle && <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
