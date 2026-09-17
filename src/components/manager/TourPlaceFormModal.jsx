import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";

const CATEGORIES = ["Temple", "Island", "Landmark", "Nature", "Beach", "Mountain"];
const STATUSES = ["Active", "Inactive", "Draft"];

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-800">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

export default function TourPlaceFormModal({ place, onClose, onSubmit }) {
  const isEdit = Boolean(place);
  const [form, setForm] = useState(() => ({
    name: place?.name || "",
    category: place?.category && place.category !== "—" ? place.category : CATEGORIES[0],
    district: place?.district && place.district !== "—" ? place.district : "",
    rating: place?.rating != null ? String(place.rating) : "",
    status: place?.status || "Active",
    description: place?.description || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(place?._image || null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const pickImage = () => fileRef.current?.click();

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please add a name for this place.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(
        {
          name: form.name.trim(),
          category: form.category,
          district: form.district.trim() || "—",
          rating: form.rating ? Number(form.rating) : null,
          status: form.status,
          description: form.description.trim(),
        },
        image ? [image] : undefined
      );
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-lift animate-scalein">
        <div className="flex items-start justify-between border-b border-line bg-cream px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">
              {isEdit ? "Edit place" : "New place"}
            </p>
            <h3 className="mt-0.5 font-display text-xl font-bold text-brand-800">
              {isEdit ? "Update tourist place" : "Add a tourist place"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white text-brand-800 hover:bg-brand-50"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <Field label="Name" required>
            <input className={inputCls} value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="e.g. Angkor Wat" autoFocus />
          </Field>

          <Field label="Photo">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImageChange} tabIndex={-1} aria-hidden="true" />
            <div className="flex items-center gap-4">
              <span className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-brand-50">
                {preview ? (
                  <img src={preview} alt="Place preview" className="h-full w-full object-cover" />
                ) : (
                  <Icon name="camera" size={22} className="text-brand-400" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={pickImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-bold text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <Icon name="camera" size={15} />
                  {preview ? "Replace photo" : "Upload photo"}
                </button>
                {image && <span className="mt-1.5 block truncate text-xs text-muted">{image.name}</span>}
              </span>
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={(e) => set("category")(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="District">
              <input className={inputCls} value={form.district} onChange={(e) => set("district")(e.target.value)} placeholder="e.g. Siem Reap" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rating">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className={inputCls}
                value={form.rating}
                onChange={(e) => set("rating")(e.target.value)}
                placeholder="0.0 – 5.0"
              />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => set("status")(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={3}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Why should travelers visit this place?"
            />
          </Field>

          {error && (
            <p className="rounded-xl border border-danger/25 bg-danger/10 px-3.5 py-2.5 text-sm font-semibold text-danger">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2.5 border-t border-line pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-line px-4 text-sm font-bold text-brand-800 hover:bg-brand-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-700 px-5 text-sm font-bold text-white shadow-sm hover:bg-brand-800 disabled:opacity-60"
            >
              {saving ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Icon name="check" size={16} />
              )}
              {isEdit ? "Save changes" : "Create place"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}