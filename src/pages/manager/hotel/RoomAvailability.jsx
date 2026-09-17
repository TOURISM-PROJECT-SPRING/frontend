import { useState } from "react";
import Icon from "../../../components/ui/Icon";
import { DemoNote } from "../../../components/ui/feedback";
import { useToast } from "../../../components/ui/Toast";

const STATUS = {
  Available: { chip: "bg-success/10 text-success", ring: "border-success/40", dot: "bg-success" },
  Occupied: { chip: "bg-danger/10 text-danger", ring: "border-danger/40", dot: "bg-danger" },
  Reserved: { chip: "bg-warning/15 text-warning", ring: "border-warning/40", dot: "bg-warning" },
  Maintenance: { chip: "bg-brand-100 text-brand-700", ring: "border-brand-200", dot: "bg-brand-400" },
};

const ROOMS = [
  { number: "101", type: "Deluxe King", floor: 1, status: "Available" },
  { number: "102", type: "Twin Garden", floor: 1, status: "Occupied" },
  { number: "103", type: "Standard", floor: 1, status: "Available" },
  { number: "104", type: "Deluxe King", floor: 1, status: "Reserved" },
  { number: "201", type: "Family Suite", floor: 2, status: "Occupied" },
  { number: "202", type: "Twin Garden", floor: 2, status: "Maintenance" },
  { number: "203", type: "Deluxe King", floor: 2, status: "Available" },
  { number: "204", type: "Family Suite", floor: 2, status: "Reserved" },
  { number: "301", type: "Standard", floor: 3, status: "Available" },
  { number: "302", type: "Deluxe King", floor: 3, status: "Occupied" },
  { number: "303", type: "Twin Garden", floor: 3, status: "Available" },
  { number: "304", type: "Family Suite", floor: 3, status: "Maintenance" },
];

const FILTERS = ["All", "Available", "Occupied", "Reserved", "Maintenance"];

export default function RoomAvailability() {
  const [filter, setFilter] = useState("All");
  const toast = useToast();
  const rooms = filter === "All" ? ROOMS : ROOMS.filter((r) => r.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">Room Availability</h1>
        <p className="mt-1 text-sm text-muted">Live status of every room across your properties.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
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
        {rooms.map((r) => {
          const s = STATUS[r.status];
          return (
            <button
              key={r.number}
              onClick={() => toast.info(`Room ${r.number} — ${r.status} (demo)`)}
              className={`group flex flex-col rounded-2xl border-2 bg-white p-4 text-left shadow-soft transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift ${s.ring}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name="bed" size={20} />
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.chip}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {r.status}
                </span>
              </div>
              <p className="mt-3 font-display text-lg font-bold text-brand-800">Room {r.number}</p>
              <p className="text-xs text-muted">{r.type} · Floor {r.floor}</p>
            </button>
          );
        })}
      </div>

      <DemoNote />
    </div>
  );
}
