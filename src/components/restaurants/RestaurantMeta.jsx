import Icon from "../ui/Icon";

const STATUS_TONE = {
  open: "text-success",
  closing: "text-rose-600",
  closed: "text-danger",
};

// "International, Asian · $ · 🕐 Closes in 51 min" — cuisine, price and a
// colour-coded open/closing/closed status.
export default function RestaurantMeta({ restaurant: r }) {
  const tone = STATUS_TONE[r.status] || "text-muted";
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink">
      <span className="inline-flex items-center gap-1.5">
        <span className="font-medium">{r.cuisines.join(", ")}</span>
      </span>
      <span className="text-muted/50">·</span>
      <span className="font-semibold text-ink">{r.priceLabel}</span>
      <span className="text-muted/50">·</span>
      <span className={`inline-flex items-center gap-1.5 font-semibold ${tone}`}>
        <Icon name="clock" size={15} className="shrink-0" />
        {r.statusText}
      </span>
    </div>
  );
}
