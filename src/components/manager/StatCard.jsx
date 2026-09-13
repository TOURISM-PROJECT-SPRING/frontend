import Icon from "../ui/Icon";

const TONES = {
  green: "bg-brand-50 text-brand-700",
  gold: "bg-gold-50 text-gold-600",
  sky: "bg-info/10 text-info",
  rose: "bg-danger/10 text-danger",
};

export default function StatCard({ label, value, icon, tone = "green", delta, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${TONES[tone] || TONES.green}`}>
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
      {hint && <p className="mt-1 text-xs text-muted/80">{hint}</p>}
    </div>
  );
}
