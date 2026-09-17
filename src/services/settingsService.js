// Settings persistence for the admin dashboard.
// The backend has no settings endpoint yet, so values are persisted to
// localStorage under "sdn.admin.settings". When the backend adds a settings
// controller, swap `persist` / `load` to use axiosClient instead.

const SETTINGS_KEY = "sdn.admin.settings";

export const DEFAULT_SETTINGS = {
  general: {
    siteName: "SovannDomNour",
    siteUrl: "https://smarttourism.com",
    supportEmail: "support@smarttourism.com",
    timezone: "Asia/Phnom_Penh",
    language: "en",
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: "30",
    passwordPolicy: "strong",
    ipWhitelist: "192.168.1.0/24\n10.0.0.0/8\n172.16.0.0/12",
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
  },
  payment: {
    currency: "USD",
    taxRate: "10",
    commissionRate: "12",
    minimumPayout: "100",
  },
};

export const settingsService = {
  load() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return structuredClone(DEFAULT_SETTINGS);
      const parsed = JSON.parse(raw);
      return {
        general: { ...DEFAULT_SETTINGS.general, ...(parsed.general || {}) },
        security: { ...DEFAULT_SETTINGS.security, ...(parsed.security || {}) },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...(parsed.notifications || {}) },
        payment: { ...DEFAULT_SETTINGS.payment, ...(parsed.payment || {}) },
      };
    } catch {
      return structuredClone(DEFAULT_SETTINGS);
    }
  },

  save(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  },
};