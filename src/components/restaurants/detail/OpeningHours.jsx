import Icon from "../../ui/Icon";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Clean opening-hours card. Today's row is emphasised (bold, forest green).
export default function OpeningHours({ hours = [], open = true, className = "" }) {
  const today = DAY_NAMES[new Date().getDay()];
  if (!hours.length) return null;

  return (
    <div className={`rounded-2xl border border-line bg-white p-6 shadow-soft ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900">
          <Icon name="clock" size={18} className="text-brand-500" />
          Opening Hours
        </h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            open ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
          }`}
        >
          {open ? "Open now" : "Closed"}
        </span>
      </div>

      <dl className="mt-4 space-y-1">
        {hours.map((row) => {
          const isToday = row.day === today;
          return (
            <div
              key={row.day}
              className={`flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-[15px] ${
                isToday ? "bg-brand-50/70" : ""
              }`}
            >
              <dt className={`flex items-center gap-2 ${isToday ? "font-bold text-brand-900" : "font-medium text-ink/75"}`}>
                {row.day}
                {isToday && <span className="text-[11px] font-bold uppercase tracking-wide text-success">Today</span>}
              </dt>
              <dd className={isToday ? "font-bold text-brand-900" : "text-ink/75"}>{row.hours}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
