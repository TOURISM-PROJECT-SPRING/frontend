import { Link } from "react-router-dom";
import {
  Lock,
  ShieldAlert,
  Building2,
  UtensilsCrossed,
  Compass,
  ArrowLeft,
  Mail,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useOwnerBusiness, BUSINESS_TYPES } from "../../context/OwnerBusinessContext";

export default function BusinessGuard({ business, children }) {
  const {
    isBusinessLocked,
    businessTypes,
    activeCount,
    lockedCount,
  } = useOwnerBusiness();

  const isLocked = isBusinessLocked(business);

  if (!isLocked) {
    return children;
  }

  const currentBizMeta = BUSINESS_TYPES.find((b) => b.id === business) || {
    id: business,
    label: business,
    badge: business,
    description: "Business management features",
  };

  const activeNames = businessTypes
    .map((id) => BUSINESS_TYPES.find((b) => b.id === id)?.label)
    .filter(Boolean)
    .join(" & ");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Top Banner Gradient */}
        <div className="bg-gradient-to-br from-[#12281e] via-[#1b3b2b] to-[#0c1a14] p-7 text-white text-center relative overflow-hidden border-b border-[#2d6a4f]/20">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#f4b938]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#2d6a4f]/25 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f4b938]/15 border border-[#f4b938]/40 flex items-center justify-center mb-3 shadow-inner">
              <Lock className="w-8 h-8 text-[#f4b938]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f4b938]/20 border border-[#f4b938]/35 text-[#f4b938] text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Business Module Locked</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">{currentBizMeta.label}</h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mt-1 font-normal">
              This business module is not assigned to your account.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Admin Managed Notice */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  Access Restricted — Managed by Administrator
                </h3>
                <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-400/90 mt-1 leading-relaxed">
                  Owners cannot self-activate businesses. Your account is currently licensed only for{" "}
                  <strong className="font-semibold underline">{activeNames || "assigned business"}</strong>.
                  Only an <strong>Administrator</strong> can grant or modify business ownership for your account.
                </p>
              </div>
            </div>

            {/* Rule Matrix Card */}
            <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div
                className={`p-3 rounded-xl border transition ${
                  activeCount === 1
                    ? "bg-white dark:bg-gray-800 border-[#1b3b2b] dark:border-emerald-500 shadow-xs font-semibold text-gray-900 dark:text-white"
                    : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#1b3b2b] dark:text-emerald-400 font-bold">
                  {activeCount === 1 && "👉 "}1 Business Owned
                </div>
                <div className="mt-0.5 text-[11px] font-normal">Other 2 businesses remain locked.</div>
              </div>

              <div
                className={`p-3 rounded-xl border transition ${
                  activeCount === 2
                    ? "bg-white dark:bg-gray-800 border-[#1b3b2b]/30 dark:border-emerald-700 shadow-xs font-semibold text-gray-900 dark:text-white"
                    : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#1b3b2b] dark:text-emerald-400 font-bold">
                  {activeCount === 2 && "👉 "}2 Businesses Owned
                </div>
                <div className="mt-0.5 text-[11px] font-normal">Only 1 remaining business is locked.</div>
              </div>

              <div
                className={`p-3 rounded-xl border transition ${
                  activeCount === 3
                    ? "bg-white dark:bg-gray-800 border-[#1b3b2b] dark:border-emerald-500 shadow-xs font-semibold text-gray-900 dark:text-white"
                    : "bg-transparent border-transparent text-gray-400 dark:text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#1b3b2b] dark:text-emerald-400 font-bold">
                  {activeCount === 3 && "👉 "}3 Businesses Owned
                </div>
                <div className="mt-0.5 text-[11px] font-normal">All 3 businesses unlocked.</div>
              </div>
            </div>
          </div>

          {/* Current Status Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Your Business Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BUSINESS_TYPES.map((b) => {
                const bLocked = isBusinessLocked(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      bLocked
                        ? "bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-gray-400"
                        : "bg-[#edf5f0] dark:bg-[#16291e] border-[#1b3b2b]/30 dark:border-emerald-800 text-[#1b3b2b] dark:text-emerald-300 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{b.badge.split(" ")[0]}</span>
                      <span className="text-xs font-bold">{b.label}</span>
                    </div>
                    {bLocked ? (
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#1b3b2b] dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#1b3b2b] dark:text-emerald-400" /> Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Read-Only Admin Notice Box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b3b2b] flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-5 h-5 text-[#f4b938]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Need to expand your business verticals?
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Request an additional vertical license through platform support or your administrator.
                </p>
              </div>
            </div>
            <Link
              to="/owner/help"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1b3b2b] dark:text-emerald-300 bg-[#edf5f0] dark:bg-[#16291e] border border-[#1b3b2b]/20 hover:bg-[#1b3b2b] hover:text-white transition shrink-0"
            >
              Contact Support
            </Link>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Link
              to="/owner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b3b2b] hover:bg-[#12281e] text-white text-xs font-bold transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              to="/owner/help"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Administrator</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
