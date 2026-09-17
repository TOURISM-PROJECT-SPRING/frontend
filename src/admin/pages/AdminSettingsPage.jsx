import { useState, useEffect } from "react";
import { Save, Globe, Shield, Bell, CreditCard } from "lucide-react";
import { settingsService } from "../../services/settingsService";
import { useToast } from "../../components/ui/Toast";

export default function AdminSettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(() => settingsService.load());

  useEffect(() => {
    setSettings(settingsService.load());
  }, []);

  const updateGeneral = (key, value) => {
    setSettings((s) => ({ ...s, general: { ...s.general, [key]: value } }));
  };

  const updateSecurity = (key, value) => {
    setSettings((s) => ({ ...s, security: { ...s.security, [key]: value } }));
  };

  const updateNotification = (key, value) => {
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [key]: value } }));
  };

  const updatePayment = (key, value) => {
    setSettings((s) => ({ ...s, payment: { ...s.payment, [key]: value } }));
  };

  const saveTab = () => {
    const ok = settingsService.save(settings);
    toast[ok ? "success" : "error"](ok ? "Settings saved successfully." : "Could not save settings.");
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition";
  const selectClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition";
  const toggleClass = "relative inline-flex cursor-pointer";
  const toggleInput = "sr-only peer";
  const toggleTrack = "w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Configure platform-wide settings and preferences</p>
      </div>

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Site Name</label>
              <input type="text" value={settings.general.siteName} onChange={(e) => updateGeneral("siteName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Site URL</label>
              <input type="url" value={settings.general.siteUrl} onChange={(e) => updateGeneral("siteUrl", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Support Email</label>
              <input type="email" value={settings.general.supportEmail} onChange={(e) => updateGeneral("supportEmail", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
              <select value={settings.general.timezone} onChange={(e) => updateGeneral("timezone", e.target.value)} className={selectClass}>
                <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (ICT, UTC+7)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (ICT, UTC+7)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
                <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <select value={settings.general.language} onChange={(e) => updateGeneral("language", e.target.value)} className={selectClass}>
                <option value="en">English</option>
                <option value="km">Khmer (ភាសាខ្មែរ)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="ko">Korean (한국어)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button onClick={saveTab} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security Settings</h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Require 2FA for all admin accounts</p>
            </div>
            <label className={toggleClass}>
              <input type="checkbox" checked={settings.security.twoFactorAuth} onChange={(e) => updateSecurity("twoFactorAuth", e.target.checked)} className={toggleInput} />
              <div className={toggleTrack} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Timeout</label>
              <select value={settings.security.sessionTimeout} onChange={(e) => updateSecurity("sessionTimeout", e.target.value)} className={selectClass}>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="480">8 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password Policy</label>
              <select value={settings.security.passwordPolicy} onChange={(e) => updateSecurity("passwordPolicy", e.target.value)} className={selectClass}>
                <option value="basic">Basic (8+ characters)</option>
                <option value="medium">Medium (8+ chars, mixed case)</option>
                <option value="strong">Strong (8+ chars, mixed case, numbers, symbols)</option>
                <option value="enterprise">Enterprise (12+ chars, complexity rules)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">IP Whitelist</label>
            <textarea
              rows={4}
              value={settings.security.ipWhitelist}
              onChange={(e) => updateSecurity("ipWhitelist", e.target.value)}
              placeholder="One IP or CIDR range per line"
              className={`${inputClass} resize-none font-mono text-xs`}
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Leave empty to allow all IPs. One entry per line.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={saveTab} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Notification Preferences</h3>
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive email alerts for important events" },
            { key: "smsNotifications", label: "SMS Notifications", desc: "Receive text message alerts for critical events" },
            { key: "pushNotifications", label: "Push Notifications", desc: "Browser push notifications for real-time updates" },
            { key: "bookingAlerts", label: "Booking Alerts", desc: "Get notified for new bookings, cancellations, and modifications" },
            { key: "paymentAlerts", label: "Payment Alerts", desc: "Get notified for payment confirmations, failures, and refunds" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <label className={toggleClass}>
                <input type="checkbox" checked={settings.notifications[item.key]} onChange={(e) => updateNotification(item.key, e.target.checked)} className={toggleInput} />
                <div className={toggleTrack} />
              </label>
            </div>
          ))}
          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button onClick={saveTab} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-5">Payment Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
              <select value={settings.payment.currency} onChange={(e) => updatePayment("currency", e.target.value)} className={selectClass}>
                <option value="USD">USD - US Dollar</option>
                <option value="KHR">KHR - Cambodian Riel</option>
                <option value="EUR">EUR - Euro</option>
                <option value="THB">THB - Thai Baht</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tax Rate (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={settings.payment.taxRate} onChange={(e) => updatePayment("taxRate", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Platform Commission (%)</label>
              <input type="number" min="0" max="50" step="0.5" value={settings.payment.commissionRate} onChange={(e) => updatePayment("commissionRate", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Minimum Payout Amount</label>
              <input type="number" min="0" step="1" value={settings.payment.minimumPayout} onChange={(e) => updatePayment("minimumPayout", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button onClick={saveTab} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}