// Lightweight, dependency-free SVG charts tuned to the SovannDomNour palette.
import { useId } from "react";

export function BarChart({ data = [], color = "#02462e", highlight = "#fec700" }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const gap = 2.5;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <div>
      <svg viewBox={`0 0 ${w} 46`} preserveAspectRatio="none" className="h-[200px] w-full">
        {data.map((d, i) => {
          const h = (d.value / max) * 40;
          const x = i * (bw + gap);
          const isHi = i === data.length - 1;
          return (
            <rect
              key={d.label}
              x={x}
              y={44 - h}
              width={bw}
              height={h}
              rx={0.8}
              fill={isHi ? highlight : color}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="flex-1 truncate text-center text-[10px] font-medium text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data = [], color = "#02462e" }) {
  const gradId = useId();
  if (data.length < 2) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const W = 100;
  const H = 42;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.value - min) / (max - min || 1)) * (H - 4) - 2;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[200px] w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="0.9" fill={color} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((d) => (
          <span key={d.label} className="flex-1 truncate text-center text-[10px] font-medium text-muted">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ segments = [], size = 160, thickness = 22, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ef" strokeWidth={thickness} />
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="min-w-0">
        {centerValue != null && (
          <p className="font-display text-2xl font-bold text-brand-800">
            {centerValue}
            <span className="ml-1 text-xs font-medium text-muted">{centerLabel}</span>
          </p>
        )}
        <ul className="mt-2 space-y-1.5">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              <span className="text-muted">{s.label}</span>
              <span className="ml-auto font-bold text-brand-800">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
