import { useState } from "react";
import { useTranslation } from "react-i18next";
import { contactService } from "../../services/contactService";
import Icon from "../ui/Icon";

export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSubmitting(true);
    setErrorMessage("");

    try {
      await contactService.sendMessage(form);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", subject: "", message: "" });
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || err?.message || t("contact.failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-2xl dark:bg-card dark:border-line">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-ink transition"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-bold text-brand-800">{t("contact.successTitle")}</h3>
            <p className="text-sm text-muted max-w-xs mx-auto">
              {t("contact.successBody")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-50/50">
                <Icon name="mail" size={20} />
              </span>
              <div>
                <h3 className="text-xl font-display font-bold text-brand-800">{t("contact.title")}</h3>
                <p className="text-xs text-muted">{t("contact.subtitle")}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">{t("contact.name")}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t("contact.namePh")}
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">{t("contact.email")}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder={t("contact.emailPh")}
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">{t("contact.subject")}</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder={t("contact.subjectPh")}
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">{t("contact.message")}</label>
                <textarea
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder={t("contact.messagePh")}
                  className="w-full rounded-xl border border-line bg-canvas p-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-line text-sm font-bold text-ink/70 hover:bg-brand-50/50 transition"
                >
                  {t("contact.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? t("contact.sending") : t("contact.send")}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
