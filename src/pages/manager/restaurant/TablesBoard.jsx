import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import { DemoNote } from "../../../components/ui/feedback";
import { useToast } from "../../../components/ui/Toast";

const STATUS = {
  Available: { chip: "bg-success/10 text-success", ring: "border-success/40", dot: "bg-success" },
  Occupied: { chip: "bg-danger/10 text-danger", ring: "border-danger/40", dot: "bg-danger" },
  Reserved: { chip: "bg-warning/15 text-warning", ring: "border-warning/40", dot: "bg-warning" },
  Cleaning: { chip: "bg-info/10 text-info", ring: "border-info/40", dot: "bg-info" },
};

const TABLES = [
  { id: 1, number: "T-01", capacity: 2, status: "Occupied", order: "FO-5001", reservation: "—" },
  { id: 2, number: "T-02", capacity: 4, status: "Available", order: "—", reservation: "19:00" },
  { id: 3, number: "T-03", capacity: 6, status: "Reserved", order: "—", reservation: "20:00" },
  { id: 4, number: "T-04", capacity: 2, status: "Cleaning", order: "—", reservation: "—" },
  { id: 5, number: "T-05", capacity: 8, status: "Available", order: "—", reservation: "—" },
  { id: 6, number: "T-06", capacity: 4, status: "Occupied", order: "FO-5003", reservation: "—" },
  { id: 7, number: "T-07", capacity: 2, status: "Available", order: "—", reservation: "—" },
  { id: 8, number: "T-08", capacity: 6, status: "Occupied", order: "FO-5005", reservation: "—" },
];

export default function TablesBoard() {
  const [filter, setFilter] = useState("All");
  const toast = useToast();
  const filters = ["All", "Available", "Occupied", "Reserved", "Cleaning"];
  const tables = filter === "All" ? TABLES : TABLES.filter((t) => t.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">Restaurant Tables</h1>
        <p className="mt-1 text-sm text-muted">Live floor plan with table status, orders and reservations.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${
              filter === f ? "border-brand-700 bg-brand-700 text-white" : "border-line bg-white text-brand-700 hover:bg-brand-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => {
          const s = STATUS[t.status];
          return (
            <div key={t.id} className={`flex flex-col rounded-2xl border-2 bg-white p-4 shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift ${s.ring}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 font-display text-sm font-bold text-brand-700">{t.number}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {t.status}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-muted">
                <p className="flex items-center gap-1.5"><Icon name="users" size={13} /> Capacity {t.capacity}</p>
                <p className="flex items-center gap-1.5"><Icon name="ticket" size={13} /> Order {t.order}</p>
                <p className="flex items-center gap-1.5"><Icon name="calendar" size={13} /> Res. {t.reservation}</p>
              </div>
              <button onClick={() => toast.info(`Manage ${t.number} — demo.`)} className="mt-3 rounded-lg bg-brand-700 py-2 text-xs font-bold text-white hover:bg-brand-800">
                Manage
              </button>
            </div>
          );
        })}
      </div>

      <DemoNote />
    </div>
  );
}
