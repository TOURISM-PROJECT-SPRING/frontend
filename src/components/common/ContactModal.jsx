import { useState } from "react";
import { contactService } from "../../services/contactService";
import Icon from "../ui/Icon";

export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage(err?.response?.data?.message || err?.message || "Failed to send message. Please try again.");
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
            <h3 className="text-xl font-bold text-brand-800">Message Received!</h3>
            <p className="text-sm text-muted max-w-xs mx-auto">
              Thank you for contacting SovannDomNour. Our support team will get back to you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-50/50">
                <Icon name="mail" size={20} />
              </span>
              <div>
                <h3 className="text-xl font-display font-bold text-brand-800">Contact Us</h3>
                <p className="text-xs text-muted">We'd love to hear from you. Send us your inquiry.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Sokha Chan"
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Trip inquiry, booking support, or feedback"
                  className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="How can we help your Cambodian adventure?"
                  className="w-full rounded-xl border border-line bg-canvas p-3 text-sm text-ink outline-none transition focus:border-brand-400 focus:bg-white dark:focus:bg-card"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-line text-sm font-bold text-ink/70 hover:bg-brand-50/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
