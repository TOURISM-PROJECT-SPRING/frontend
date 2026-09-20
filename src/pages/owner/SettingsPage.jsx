import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Save,
  CheckCircle,
  Lock,
  ShieldCheck,
  Mail,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { primaryRoleLabel } from "../../utils/rbac";
import { useOwnerBusiness, BUSINESS_TYPES } from "../../context/OwnerBusinessContext";

export default function OwnerSettingsPage() {
  const { user } = useAuth();
  const {
    isBusinessLocked,
    activeCount,
    statusSummary,
    isSuspended,
  } = useOwnerBusiness();

  const [activeTab, setActiveTab] = useState("business");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: "business", label: "Business Types & Permissions" },
    { id: "profile", label: "Profile" },
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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          View your assigned businesses, permissions, and account preferences
        </p>
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
            className={`px-4 py-2.5 text-sm font-semibold transition border-b-2 -mb-px cursor-pointer ${
              activeTab === tab.id
                ? "border-[#1b3b2b] text-[#1b3b2b] dark:border-emerald-400 dark:text-emerald-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#1b3b2b] dark:hover:text-emerald-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Types & Permissions Tab (Read-Only, Admin Managed) */}
      {activeTab === "business" && (
        <div className="space-y-6">
          {/* Account Access Status (admin-managed) */}
          {isSuspended ? (
            <div className="p-5 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                    Suspended
                  </span>
                  <span className="text-sm font-bold text-red-900 dark:text-red-200">
                    Account Access Suspended
                  </span>
                </div>
                <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 leading-relaxed">
                  The System Administrator has suspended your owner account. Business operations,
                  offerings management, and booking processing are paused. Your assigned business
                  verticals are preserved and will resume automatically once access is reactivated —
                  please contact the administration team for details.
                </p>
              </div>
              <Link
                to="/owner/help"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Admin</span>
              </Link>
            </div>
          ) : (
            <div className="p-5 bg-[#edf5f0]/70 dark:bg-[#16291e]/60 border border-[#1b3b2b]/20 dark:border-emerald-800/50 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 rounded-2xl bg-[#1b3b2b]/10 border border-[#1b3b2b]/20 dark:border-emerald-700/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#1b3b2b] dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1b3b2b] text-white text-xs font-bold">
                    Active
                  </span>
                  <span className="text-sm font-bold text-[#1b3b2b] dark:text-emerald-200">
                    Account Access Active
                  </span>
                </div>
                <p className="text-xs text-gray-600/80 dark:text-emerald-200/60 mt-1 leading-relaxed">
                  Your account is active. The business verticals you are assigned to manage by the
                  System Administrator are shown below — any vertical without a license remains
                  locked to your account.
                </p>
              </div>
            </div>
          )}

          {/* Admin Managed Overview Banner */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Assigned Business Verticals
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      activeCount === 3
                        ? "bg-[#1b3b2b] text-white border-[#1b3b2b]"
                        : "bg-[#f4b938]/20 text-amber-900 border-[#f4b938]/40 dark:text-amber-200"
                    }`}
                  >
                    {statusSummary}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Business access is governed by platform licenses and managed solely by the System Administrator.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20 text-[#1b3b2b] dark:text-emerald-300 text-xs font-bold select-none">
                <ShieldCheck className="w-4 h-4 text-[#1b3b2b] dark:text-emerald-400" />
                <span>Admin Managed</span>
              </div>
            </div>

            {/* Explanatory Notice */}
            <div className="p-4 bg-[#edf5f0]/50 dark:bg-[#121e17] border border-[#1b3b2b]/15 dark:border-emerald-800/40 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#1b3b2b] dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Ownership Policy:</strong> Business types cannot be modified by owners. If you operate more businesses (e.g. you own a Hotel and wish to add a Restaurant or Tours), contact your administrator to assign and unlock the module.
                </div>
              </div>

              {/* Rule Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs pt-2 border-t border-[#1b3b2b]/10 dark:border-emerald-800/30">
                <div
                  className={`p-3 rounded-xl border ${
                    activeCount === 1
                      ? "bg-white dark:bg-gray-800 border-[#1b3b2b] dark:border-emerald-500 text-[#1b3b2b] dark:text-emerald-300 font-bold shadow-2xs"
                      : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    {activeCount === 1 && "👉 "}1 Business Assigned
                  </div>
                  <div className="text-[11px] font-normal mt-0.5">
                    Other 2 businesses are locked.
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    activeCount === 2
                      ? "bg-white dark:bg-gray-800 border-[#1b3b2b] dark:border-emerald-500 text-[#1b3b2b] dark:text-emerald-300 font-bold shadow-2xs"
                      : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    {activeCount === 2 && "👉 "}2 Businesses Assigned
                  </div>
                  <div className="text-[11px] font-normal mt-0.5">
                    Only 1 remaining business is locked.
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    activeCount === 3
                      ? "bg-white dark:bg-gray-800 border-[#1b3b2b] dark:border-emerald-500 text-[#1b3b2b] dark:text-emerald-300 font-bold shadow-2xs"
                      : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1">
                    {activeCount === 3 && "👉 "}3 Businesses Assigned
                  </div>
                  <div className="text-[11px] font-normal mt-0.5">
                    All 3 businesses unlocked.
                  </div>
                </div>
              </div>
            </div>

            {/* Read-Only Business Cards */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Business Access Status
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BUSINESS_TYPES.map((biz) => {
                  const isLocked = isBusinessLocked(biz.id);
                  const suspended = isSuspended;

                  return (
                    <div
                      key={biz.id}
                      className={`rounded-2xl border p-5 transition relative select-none ${
                        suspended
                          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 opacity-80"
                          : !isLocked
                            ? "bg-[#edf5f0]/70 dark:bg-[#16291e]/80 border-[#1b3b2b] dark:border-emerald-500 shadow-sm"
                            : "bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-65"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{biz.badge.split(" ")[0]}</span>
                        <div
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                            suspended
                              ? "bg-red-600 text-white shadow-2xs"
                              : !isLocked
                                ? "bg-[#1b3b2b] text-white shadow-2xs"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {suspended ? (
                            <>
                              <ShieldAlert className="w-3 h-3 text-white" />
                              <span>Access Suspended</span>
                            </>
                          ) : !isLocked ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-[#f4b938]" />
                              <span>Assigned & Active</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-gray-500" />
                              <span>Locked (Not Owned)</span>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {biz.label}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {biz.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 text-[11px]">
                        {suspended ? (
                          <span className="text-red-700 dark:text-red-300 font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Assignment preserved · frozen
                          </span>
                        ) : !isLocked ? (
                          <span className="text-[#1b3b2b] dark:text-emerald-400 font-bold flex items-center gap-1">
                            ✓ Full Management Access
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Requires Admin Assignment
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Organization Particulars Form */}
          <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
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
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Tab */}
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
              <p className="text-sm text-gray-400 dark:text-gray-500">{primaryRoleLabel(user)}</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Notifications Tab */}
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
    </div>
  );
}
