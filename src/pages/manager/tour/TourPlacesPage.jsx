import { useMemo, useState } from "react";
import Icon from "../../../components/ui/Icon";
import TourPlaceCard from "../../../components/manager/TourPlaceCard";
import TourPlaceDetailDrawer from "../../../components/manager/TourPlaceDetailDrawer";
import TourPlaceFormModal from "../../../components/manager/TourPlaceFormModal";
import { Skeleton, DemoNote } from "../../../components/ui/feedback";
import { useToast } from "../../../components/ui/Toast";
import { useTourPlaces } from "../../../hooks/useTourPlaces";

function ConfirmDialog({ title, message, onCancel, onConfirm, busy }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-lift animate-scalein">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-danger/10 text-danger">
          <Icon name="trash" size={22} />
        </span>
        <h3 className="mt-4 font-display text-lg font-bold text-brand-800">{title}</h3>
        <p className="mt-1 text-sm text-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-xl border border-line px-4 text-sm font-bold text-brand-800 hover:bg-brand-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-danger px-4 text-sm font-bold text-white hover:bg-danger/90 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TourPlacesPage() {
  const { items, loading, source, create, update, remove } = useTourPlaces();
  const toast = useToast();

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [detail, setDetail] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category).filter((c) => c && c !== "—"));
    return ["All", ...set];
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (needle && !`${p.name} ${p.district} ${p.category}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [items, q, category]);

  const openCreate = () => setCreating(true);
  const closeAll = () => {
    setDetail(null);
    setEditing(null);
    setCreating(false);
    setDeleting(null);
  };

  const handleSave = async (data, images) => {
    if (editing) {
      await update(editing.id, data, images);
      toast.success(`"${data.name}" updated.`);
    } else {
      await create(data, images);
      toast.success(`"${data.name}" added.`);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    await remove(deleting.id);
    setBusy(false);
    toast.success("Place deleted.");
    closeAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">Tour management</p>
          <h1 className="font-display text-2xl font-bold text-brand-800">Tourist Places</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} places across your destinations — click a card to view details.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          <Icon name="plus" size={17} /> Add Place
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-11 items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 shadow-soft focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 sm:max-w-xs">
          <Icon name="search" size={17} className="text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search places…"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </label>
        <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                category === c
                  ? "bg-brand-700 text-white shadow-sm"
                  : "border border-line bg-white text-brand-800 hover:bg-brand-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 mx-auto">
            <Icon name="compass" size={26} />
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-brand-800">No places found</h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
            {q || category !== "All"
              ? "Try a different search or filter."
              : "Add your first tourist place to get started."}
          </p>
          {!q && category === "All" && (
            <button
              onClick={openCreate}
              className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-800"
            >
              <Icon name="plus" size={16} /> Add Place
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <TourPlaceCard
              key={p.id}
              place={p}
              onView={() => setDetail(p)}
              onEdit={() => setEditing(p)}
              onDelete={() => setDeleting(p)}
            />
          ))}
        </div>
      )}

      {!loading && source === "demo" && <DemoNote />}

      {detail && (
        <TourPlaceDetailDrawer
          place={detail}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setEditing(detail);
            setDetail(null);
          }}
          onDelete={() => {
            setDeleting(detail);
            setDetail(null);
          }}
        />
      )}

      {(creating || editing) && (
        <TourPlaceFormModal
          key={editing?.id ?? "new"}
          place={editing}
          onClose={closeAll}
          onSubmit={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this place?"
          message={`"${deleting.name}" will be permanently removed. This can't be undone.`}
          busy={busy}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}