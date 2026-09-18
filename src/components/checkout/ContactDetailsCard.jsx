import { useState } from "react";
import Icon from "../ui/Icon";
import { DIAL_CODES, isValidEmail } from "./checkoutData";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-brand-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-danger">{error}</span>}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-lg border border-line bg-white px-3.5 text-[15px] text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

export default function ContactDetailsCard({ contact, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(contact);
  const [errors, setErrors] = useState({});

  const startEdit = () => {
    setForm(contact);
    setErrors({});
    setEditing(true);
  };
  const patch = (p) => setForm((f) => ({ ...f, ...p }));

  const save = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = "Required";
    if (!form.lastName?.trim()) e.lastName = "Required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email";
    if (!/^\d{6,12}$/.test((form.phone || "").replace(/\s/g, ""))) e.phone = "Enter a valid phone number";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
    setEditing(false);
  };

  return (
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">1</span>
        <h2 className="font-display text-2xl font-bold text-brand-800">Contact details</h2>
        {!editing && (
          <button type="button" onClick={startEdit} className="ml-auto text-sm font-bold text-brand-700 underline underline-offset-4 hover:text-brand-800">
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-5 space-y-1.5 text-[15px]">
          <p className="font-bold text-brand-900">{`${contact.firstName} ${contact.lastName}`.trim() || "—"}</p>
          <p className="flex items-center gap-2 text-muted">
            <Icon name="mail" size={15} className="text-brand-500" /> {contact.email}
          </p>
          <p className="flex items-center gap-2 text-muted">
            <Icon name="phone" size={15} className="text-brand-500" /> {contact.dialCode} {contact.phone}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName}>
              <input className={inputCls} value={form.firstName} onChange={(e) => patch({ firstName: e.target.value })} placeholder="e.g. Sokha" autoFocus />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <input className={inputCls} value={form.lastName} onChange={(e) => patch({ lastName: e.target.value })} placeholder="e.g. Dara" />
            </Field>
          </div>
          <Field label="Email" error={errors.email}>
            <input className={inputCls} type="email" value={form.email} onChange={(e) => patch({ email: e.target.value })} placeholder="you@example.com" />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <div className="flex gap-2">
              <select
                aria-label="Phone country code"
                className={`${inputCls} w-28 shrink-0 cursor-pointer`}
                value={form.dialCode}
                onChange={(e) => patch({ dialCode: e.target.value })}
              >
                {DIAL_CODES.map((d) => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
              <input
                className={inputCls}
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => patch({ phone: e.target.value.replace(/[^\d\s-]/g, "") })}
                placeholder="12 345 678"
              />
            </div>
          </Field>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={() => setEditing(false)} className="h-11 rounded-xl border border-line px-5 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-50">
              Cancel
            </button>
            <button type="button" onClick={save} className="h-11 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-800">
              Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
