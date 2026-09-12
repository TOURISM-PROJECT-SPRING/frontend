import { useState } from "react";
import { Camera, Save, CheckCircle, Building2, UtensilsCrossed, Compass, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOwnerBusiness } from "../../context/OwnerBusinessContext";

export default function OwnerSettingsPage() {
  const { user } = useAuth();
  const { businessTypes, toggleBusinessType, BUSINESS_TYPES } = useOwnerBusiness();
  const [activeTab, setActiveTab] = useState("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "business", label: "Business Types & Operations" },
    { id: "notifications", label: "Notifications" },
  ];

  const displayName = user?.fullname || user?.username || "Business Owner";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BO";

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your owner account and preferences</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          Settings have been saved successfully.
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{initials}</span>
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{displayName}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500">{user?.roles?.[0] || "Property Owner"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                defaultValue={user?.fullname || ""}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
              <input
                type="text"
                disabled
                defaultValue={user?.username || ""}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
              <input
                type="tel"
                defaultValue={user?.phone || "+855 12 345 678"}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <input
                type="text"
                defaultValue={user?.address || "Siem Reap, Cambodia"}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
          {[
            { label: "New Booking Alerts", desc: "Get notified when a guest places a new room or ticket reservation", default: true },
            { label: "Review & Rating Notifications", desc: "Get notified when a customer submits a new review", default: true },
            { label: "Payment & Settlement Alerts", desc: "Get notified for successful booking payouts and settlements", default: true },
            { label: "Promotion Activity", desc: "Get notified about seasonal promotion voucher performance", default: false },
            { label: "Weekly Performance Digest", desc: "Receive a weekly occupancy and revenue summary", default: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "business" && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Active Business Verticals Multi-Select */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Active Business Types
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Select the businesses you operate. Your sidebar and management dashboard will dynamically adapt to show the corresponding menus.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUSINESS_TYPES.map((biz) => {
                const isSelected = businessTypes.includes(biz.id);
                return (
                  <div
                    key={biz.id}
                    onClick={() => toggleBusinessType(biz.id)}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all relative ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-sm"
                        : "bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg">{biz.badge.split(" ")[0]}</span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          isSelected
                            ? "bg-primary text-white"
                            : "border-2 border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {biz.label}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {biz.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Info Form */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Organization Particulars
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name</label>
                <input
                  type="text"
                  defaultValue="Smart Tourism Hospitality Group"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business License / Tax ID</label>
                <input
                  type="text"
                  defaultValue="KH-BIZ-2026-08492"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Website</label>
                <input
                  type="url"
                  defaultValue="https://smarttourism.cambodia.gov.kh"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Phone</label>
                <input
                  type="tel"
                  defaultValue="+855 12 345 678"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Operating Address</label>
                <input
                  type="text"
                  defaultValue="National Road 6, Krong Siem Reap, Cambodia"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
