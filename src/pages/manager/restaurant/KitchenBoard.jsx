import { useState, useEffect } from "react";
import Icon from "../../../components/ui/Icon";
import { DemoNote } from "../../../components/ui/feedback";
import { useToast } from "../../../components/ui/Toast";
import { orderService } from "../../../services/orderService";
import { money } from "../../../lib/format";

const COLUMNS = ["Pending", "Confirmed", "Preparing", "Ready", "Completed"];

const COLUMN_ACCENT = {
  Pending: "border-t-warning",
  Confirmed: "border-t-info",
  Preparing: "border-t-brand-400",
  Ready: "border-t-gold-400",
  Completed: "border-t-success",
};

const INITIAL = [
  { id: "FO-5001", customer: "Emma Wilson", items: "Fish Amok, Rice", qty: 2, time: "12:30", total: 18.5, status: "Pending" },
  { id: "FO-5002", customer: "Kenji Tanaka", items: "Beef Lok Lak", qty: 1, time: "12:42", total: 7, status: "Confirmed" },
  { id: "FO-5003", customer: "Ava Chen", items: "Num Banh Chok x2", qty: 2, time: "12:55", total: 7, status: "Preparing" },
  { id: "FO-5004", customer: "Lucas Meyer", items: "Skewer BBQ, Beer", qty: 3, time: "13:05", total: 12, status: "Ready" },
  { id: "FO-5005", customer: "Sokha Dara", items: "Nom Koma", qty: 1, time: "13:10", total: 2.5, status: "Completed" },
  { id: "FO-5006", customer: "Mia Park", items: "Fish Amok, Salad", qty: 2, time: "13:15", total: 11, status: "Pending" },
];

function normalizeStatus(st) {
  if (!st) return "Pending";
  const s = String(st).toLowerCase();
  if (s.includes("confirm")) return "Confirmed";
  if (s.includes("prepar")) return "Preparing";
  if (s.includes("ready")) return "Ready";
  if (s.includes("complete") || s.includes("done")) return "Completed";
  return "Pending";
}

function formatTime(iso) {
  if (!iso) return "12:00";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "12:00";
  }
}

function OrderCard({ order, onMove, dragging, onDragStart, onDragEnd }) {
  const idx = COLUMNS.indexOf(order.status);
  const next = COLUMNS[idx + 1];
  const prev = COLUMNS[idx - 1];
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      onDragEnd={onDragEnd}
      className={`animate-scalein cursor-grab rounded-xl border border-line bg-white p-3 shadow-soft transition-opacity active:cursor-grabbing ${
        dragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-brand-800">{order.id}</span>
        <span className="text-xs text-muted">{order.time}</span>
      </div>
      <p className="mt-1 text-xs font-semibold text-ink">{order.customer}</p>
      <p className="mt-0.5 text-xs text-muted">{order.items}</p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700">×{order.qty}</span>
        <span className="font-bold text-brand-700">{money(order.total)}</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {prev && (
          <button onClick={() => onMove(order.id, prev)} className="grid h-7 w-7 place-items-center rounded-lg border border-line text-muted hover:bg-brand-50" aria-label="Move back">
            <Icon name="chevron-right" size={14} className="rotate-180" />
          </button>
        )}
        {next && (
          <button onClick={() => onMove(order.id, next)} className="flex h-7 flex-1 items-center justify-center gap-1 rounded-lg bg-brand-700 text-xs font-bold text-white hover:bg-brand-800">
            {next} <Icon name="arrow-right" size={13} />
          </button>
        )}
        {!next && (
          <span className="flex h-7 flex-1 items-center justify-center gap-1 rounded-lg bg-success/10 text-xs font-bold text-success">
            <Icon name="check" size={13} /> Done
          </span>
        )}
      </div>
    </div>
  );
}

export default function KitchenBoard() {
  const [orders, setOrders] = useState(INITIAL);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const [isApiBacked, setIsApiBacked] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let alive = true;
    orderService
      .getAllOrders()
      .then((res) => {
        if (!alive || !Array.isArray(res) || res.length === 0) return;
        const mapped = res.map((o) => ({
          id: `FO-${o.id}`,
          rawId: o.id,
          customer: o.userName || "Customer",
          items: o.restaurantName || "Restaurant order",
          qty: 1,
          time: formatTime(o.createdAt || o.pickupTime),
          total: Number(o.totalPrice || 0),
          status: normalizeStatus(o.status),
        }));
        setOrders(mapped);
        setIsApiBacked(true);
      })
      .catch(() => {
        // Fallback to initial demo orders gracefully
      });
    return () => {
      alive = false;
    };
  }, []);

  const move = async (id, status) => {
    const target = orders.find((o) => o.id === id);
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));

    if (target?.rawId) {
      try {
        await orderService.updateOrderStatus(target.rawId, status.toUpperCase());
        toast.success(`Order ${id} updated to ${status}`);
      } catch (err) {
        console.warn("Could not sync order status to server:", err);
        toast.info(`Updated order ${id} to ${status} (local)`);
      }
    } else {
      toast.info(`Moved ${id} to ${status}`);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-800">Kitchen Board</h1>
          <p className="mt-1 text-sm text-muted">
            Drag orders or use the buttons to move them through each stage.
            {isApiBacked && <span className="ml-2 font-semibold text-brand-700">· Connected to live API</span>}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const colOrders = orders.filter((o) => o.status === col);
          return (
            <div
              key={col}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col);
              }}
              onDragLeave={() => setOverCol((c) => (c === col ? null : c))}
              onDrop={() => {
                if (dragId) move(dragId, col);
                setDragId(null);
                setOverCol(null);
              }}
              className={`flex flex-col rounded-2xl border border-line border-t-4 bg-canvas/60 p-3 transition-colors ${COLUMN_ACCENT[col]} ${
                overCol === col ? "ring-2 ring-brand-300" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-sm font-bold text-brand-800">{col}</span>
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-brand-700 shadow-sm">
                  {colOrders.length}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2.5">
                {colOrders.map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onMove={move}
                    dragging={dragId === o.id}
                    onDragStart={(e, id) => {
                      setDragId(id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => setDragId(null)}
                  />
                ))}
                {colOrders.length === 0 && (
                  <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-muted">Drop here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isApiBacked && <DemoNote />}
    </div>
  );
}
