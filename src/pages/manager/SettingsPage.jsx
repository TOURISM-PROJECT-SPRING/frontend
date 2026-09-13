import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ui/Toast";

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-semibold text-brand-800">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-700" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage({ profile = false }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ bookings: true, emails: true, autoConfirm: false, maintenance: false });
  const set = (k) => (v) => setSettings((s) => ({ ...s, [k]: v }));

  const name = user?.fullname || user?.username || "Manager";
  const email = user?.email || "manager@sovannomnour.app";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-800">{profile ? "My Profile" : "Settings"}</h1>
        <p className="mt-1 text-sm text-muted">
          {profile ? "Your account details." : "Manage your workspace preferences."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-line bg-white p-6 text-center shadow-soft">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-700 text-2xl font-bold text-gold-400">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <p className="mt-3 font-display text-lg font-bold text-brand-800">{name}</p>
            <p className="text-sm text-muted">{email}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1 text-xs font-bold text-gold-700">
              <Icon name="shield" size={13} /> {user?.roles?.[0] || "Manager"}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-bold text-danger hover:bg-danger/5"
            >
              <Icon name="logout" size={16} /> Sign out
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-bold text-brand-800">Account</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Full name</span>
                <input defaultValue={name} className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">Email</span>
                <input defaultValue={email} className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15" />
              </label>
            </div>

            <h2 className="mt-8 font-display text-lg font-bold text-brand-800">Preferences</h2>
            <div className="mt-2 divide-y divide-line">
              <Toggle label="New booking alerts" hint="Notify me when a booking comes in" checked={settings.bookings} onChange={set("bookings")} />
              <Toggle label="Email notifications" hint="Summaries and receipts by email" checked={settings.emails} onChange={set("emails")} />
              <Toggle label="Auto-confirm bookings" hint="Accept bookings without review" checked={settings.autoConfirm} onChange={set("autoConfirm")} />
              <Toggle label="Maintenance mode" hint="Temporarily pause new bookings" checked={settings.maintenance} onChange={set("maintenance")} />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => toast.info("Changes discarded.")} className="rounded-xl border border-line px-4 py-2.5 text-sm font-bold text-brand-700 hover:bg-brand-50">
                Cancel
              </button>
              <button onClick={() => toast.success("Settings saved (demo).")} className="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-800">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
