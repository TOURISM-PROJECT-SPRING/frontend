import { useMemo, useState } from "react";
import Icon from "../../../components/ui/Icon";
import SmartImage from "../../../components/ui/SmartImage";
import { DemoNote } from "../../../components/ui/feedback";
import { useToast } from "../../../components/ui/Toast";
import { useManager } from "../../../hooks/useManager";
import { money } from "../../../lib/format";

export default function MenuManager() {
  const { items: foods, loading, source } = useManager("foods");
  const toast = useToast();
  const [cat, setCat] = useState("all");
  const [avail, setAvail] = useState("all");

  const categories = useMemo(() => ["all", ...new Set(foods.map((f) => f.category).filter(Boolean))], [foods]);
  const filtered = foods.filter(
    (f) => (cat === "all" || f.category === cat) && (avail === "all" || (avail === "in" ? f.available : !f.available))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-800">Menu Management</h1>
          <p className="mt-1 text-sm text-muted">Curate dishes, prices and availability.</p>
        </div>
        <button onClick={() => toast.info("Add food — demo action.")} className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800">
          <Icon name="plus" size={17} /> Add Food
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-soft">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition-all ${
                cat === c ? "bg-brand-700 text-white" : "bg-canvas text-brand-700 hover:bg-brand-50"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Icon name="filter" size={15} className="text-muted" />
          <select value={avail} onChange={(e) => setAvail(e.target.value)} className="h-9 rounded-lg border border-line bg-white px-2 text-sm font-semibold text-brand-800 focus:outline-none">
            <option value="all">All availability</option>
            <option value="in">Available</option>
            <option value="out">Unavailable</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-muted">Loading menu…</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((f) => (
            <div key={f.id} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage src={f.image} alt={f.name} className="h-full w-full" imgClassName="transition-transform duration-700 ease-out group-hover:scale-110" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur ${f.available ? "bg-white/90 text-success" : "bg-white/90 text-danger"}`}>
                  {f.available ? "Available" : "Sold out"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-base font-bold text-brand-800">{f.name}</h4>
                  <span className="font-bold text-brand-700">{money(f.price)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{f.category}</p>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <button onClick={() => toast.info(`Edit ${f.name} — demo.`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-bold text-brand-700 hover:bg-brand-50">
                    <Icon name="pencil" size={14} /> Edit
                  </button>
                  <button onClick={() => toast.warning(`Delete ${f.name}? (demo)`)} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-danger hover:bg-danger/5">
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full py-16 text-center text-sm text-muted">No dishes match these filters.</p>}
        </div>
      )}

      {source === "demo" && !loading && <DemoNote />}
    </div>
  );
}
