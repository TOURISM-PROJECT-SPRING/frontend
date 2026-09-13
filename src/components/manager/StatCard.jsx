import Icon from "../ui/Icon";

const TONES = {
  green: "bg-brand-700 text-gold-400",
  gold: "bg-gold-400 text-brand-900",
  sky: "bg-info/10 text-info",
  rose: "bg-danger/10 text-danger",
};

const SPARK_COLORS = {
  green: "#02462e",
  gold: "#b98a00",
  sky: "#2f6d9e",
  rose: "#d1483b",
};

function Spark({ data, tone = "green" }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 100;
  const H = 26;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - 2 - ((v - min) / range) * (H - 4);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-7 w-20" aria-hidden="true">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={SPARK_COLORS[tone] || SPARK_COLORS.green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function StatCard({
  label,
  value,
  icon,
  tone = "green",
  delta,
  hint,
  spark,
  period = "last 6 months",
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white p-5 shadow-soft transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-lift ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${TONES[tone] || TONES.green}`}>
          <Icon name={icon} size={22} />
        </span>
        {delta != null && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
              String(delta).startsWith("-") ? "bg-danger/10 text-danger" : "bg-success/10 text-success"
            }`}
          >
            <Icon name="trending-up" size={12} className={String(delta).startsWith("-") ? "rotate-180" : ""} />
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-800">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-muted">{label}</p>
      {spark ? (
        <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
          <Spark data={spark} tone={tone} />
          <span className="text-[11px] font-medium text-muted">{hint || period}</span>
        </div>
      ) : hint ? (
        <p className="mt-3 text-xs text-muted/80">{hint}</p>
      ) : null}
    </div>
  );
}