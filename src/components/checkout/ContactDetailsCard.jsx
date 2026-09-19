import { useLayoutEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";
import { DIAL_CODES, formatPhone, isValidEmail } from "./checkoutData";

function Field({ label, error, icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">{label}</span>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60"
          />
        )}
        {children}
      </div>
      {error && (
        <span className="mt-1 flex animate-slidein items-center gap-1 text-xs font-semibold text-danger">
          <Icon name="x-circle" size={13} />
          {error}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-line bg-white pl-11 pr-3.5 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

function initialsOf(contact = {}) {
  return `${contact.fullname || "?"}`
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function validPhone(v) {
  return /^\d{6,12}$/.test((v || "").replace(/\s/g, ""));
}

// Cursor-aware formatted phone input: formatting runs live but the caret is
// restored right after the same digit the user was editing, so typing and
// backspacing never feel like the field is "fighting" them.
function PhoneInput({ value, onChange, className, ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const caret = ref.current.selectionStart ?? value.length;
    const digitsBefore = value.slice(0, caret).replace(/\D/g, "").length;
    let pos = 0;
    let seen = 0;
    while (pos < value.length && seen < digitsBefore) {
      if (/\d/.test(value[pos])) seen += 1;
      pos += 1;
    }
    ref.current.setSelectionRange(pos, pos);
  }, [value]);

  const handleChange = (e) => {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    const digitsBefore = el.value.slice(0, caret).replace(/\D/g, "").length;
    const digits = el.value.replace(/\D/g, "").slice(0, 12);
    const formatted = formatPhone(digits);
    onChange(formatted);
    // Apply the same cursor math on the formatted string synchronously so
    // there's no flash of a misplaced caret between render and effect.
    requestAnimationFrame(() => {
      if (!ref.current) return;
      let p = 0;
      let s = 0;
      while (p < formatted.length && s < digitsBefore) {
        if (/\d/.test(formatted[p])) s += 1;
        p += 1;
      }
      ref.current.setSelectionRange(p, p);
    });
  };

  return <input ref={ref} className={className} value={value} onChange={handleChange} {...rest} />;
}

export default function ContactDetailsCard({ contact, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(contact);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setForm(contact);
    setErrors({});
    setSaved(false);
    setEditing(true);
  };

  const patch = (p) =>
    setForm((f) => {
      const next = { ...f, ...p };
      setErrors((e) => {
        const clear = { ...e };
        for (const key of Object.keys(p)) delete clear[key];
        return clear;
      });
      return next;
    });

  const save = () => {
    const e = {};
    if (!form.fullname?.trim()) e.fullname = "Required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email";
    if (!validPhone(form.phone)) e.phone = "Enter a valid phone number";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onKeyDown = (ev) => {
    if (ev.key !== "Enter") return;
    ev.preventDefault();
    if (errors.fullname || errors.email || errors.phone) save();
  };

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-soft-md sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">1</span>
        <h2 className="font-display text-2xl font-bold text-brand-800">Contact details</h2>
        {saved && (
          <span className="ml-2 inline-flex animate-scalein items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <Icon name="check" size={13} /> Saved
          </span>
        )}
        {!editing && (
          <button type="button" onClick={startEdit} className="ml-auto text-sm font-bold text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-800">
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div className="mt-6 flex animate-fade items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-lg font-bold text-white shadow-sm">
            {initialsOf(contact)}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate font-display text-2xl font-bold tracking-tight text-brand-900">
              {contact.fullname?.trim() || "Guest"}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="mail" size={15} className="text-brand-500" />
                <span className="truncate">{contact.email || "—"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="phone" size={15} className="text-brand-500" />
                {contact.dialCode} {contact.phone || "—"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div onKeyDown={onKeyDown} className="mt-6 animate-slidein space-y-4">
          <Field label="Full name" icon="user" error={errors.fullname}>
            <input className={inputCls} value={form.fullname} onChange={(e) => patch({ fullname: e.target.value })} placeholder="Sokha Dara" autoComplete="name" autoFocus />
          </Field>
          <Field label="Email" icon="mail" error={errors.email}>
            <input className={inputCls} type="email" value={form.email} onChange={(e) => patch({ email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <div className="flex gap-2">
              <select
                aria-label="Phone country code"
                className="h-12 w-28 shrink-0 cursor-pointer rounded-xl border border-line bg-white px-3 text-[15px] font-medium text-ink outline-none transition-all duration-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
                value={form.dialCode}
                onChange={(e) => patch({ dialCode: e.target.value })}
              >
                {DIAL_CODES.map((d) => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Icon
                  name="phone"
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60"
                />
                <PhoneInput
                  className={inputCls}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={(v) => patch({ phone: v })}
                  placeholder="12 345 678"
                />
              </div>
            </div>
          </Field>
          <div className="flex flex-col-reverse justify-end gap-2 pt-1 sm:flex-row sm:items-center">
            <span className="mr-auto hidden items-center gap-1 text-[11px] text-muted sm:flex">
              <Icon name="shield-check" size={13} className="text-brand-500" /> Details are only used for this booking.
            </span>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditing(false)} className="h-12 flex-1 rounded-xl border border-line px-6 text-sm font-bold text-brand-800 transition-all duration-200 hover:bg-brand-50 hover:border-brand-200 sm:flex-none">
                Cancel
              </button>
              <button type="button" onClick={save} className="h-12 flex-1 rounded-xl bg-brand-700 px-6 text-sm font-bold text-white shadow-md shadow-brand-700/20 transition-all duration-200 hover:bg-brand-800 active:scale-[0.98] sm:flex-none">
                Save details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
