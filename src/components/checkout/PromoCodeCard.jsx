import { useState } from "react";
import Icon from "../ui/Icon";

export default function PromoCodeCard({ promo, onApply, onRemove, hint = "SAVE10", percent = 10 }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const apply = () => {
    const ok = onApply(code.trim().toUpperCase());
    if (ok) {
      setError("");
      setCode("");
    } else {
      setError("Invalid promo code");
    }
  };

  return (
    <div className="border-t border-line py-4">
      <h4 className="font-display text-sm font-bold text-brand-800">Promo code</h4>
      {promo.applied ? (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-50 px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm font-bold text-brand-700">
            <Icon name="check-circle" size={16} /> Promo applied ({promo.code})
          </span>
          <button type="button" onClick={onRemove} className="text-xs font-bold text-danger underline underline-offset-2">Remove</button>
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder="Enter promo code"
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
          />
          <button type="button" onClick={apply} className="h-10 shrink-0 rounded-lg bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800">Apply</button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-semibold text-danger">{error}</p>}
      {!promo.applied && hint && (
        <p className="mt-1.5 text-[11px] text-muted">Try <span className="font-bold">{hint}</span> for {percent}% off.</p>
      )}
    </div>
  );
}
