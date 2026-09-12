import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User, ArrowRight, X, ShieldCheck, Building2, Compass } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitchMode, onSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ usernameOrEmail: "", password: "", rememberMe: false });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.usernameOrEmail.trim()) {
      e.usernameOrEmail = t("auth.errors.emailRequired") || "Username or email is required";
    }
    if (!form.password) {
      e.password = t("auth.errors.passwordRequired") || "Password is required";
    } else if (form.password.length < 6) {
      e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const redirectByUserRole = (user) => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const upperRoles = roles.map((r) => String(r).toUpperCase());
    if (upperRoles.some((r) => r.includes("ADMIN"))) {
      navigate("/admin");
    } else if (upperRoles.some((r) => r.includes("OWNER"))) {
      navigate("/owner");
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const result = await login({
        usernameOrEmail: form.usernameOrEmail.trim(),
        password: form.password,
      });
      if (onSuccess) onSuccess(result.user);
      else redirectByUserRole(result.user);
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (typeof data === "string" ? data : data?.message || data?.error) ||
        t("auth.errors.loginFailed") ||
        "Sign in failed. Please try again.";
      setFormError(msg);
    }
  };

  const fillDemoAccount = (username, password) => {
    setForm((p) => ({ ...p, usernameOrEmail: username, password: password }));
    setFormError("");
    setErrors({});
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20"
    } rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" noValidate>
      {formError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
          <X className="w-4 h-4 shrink-0" />
          {formError}
        </div>
      )}

      {/* Demo Account Quick Pills */}
      <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 rounded-xl">
        <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Quick Demo Accounts
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => fillDemoAccount("admin", "admin123")}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-center"
          >
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-red-500" /> Admin
            </span>
            <span className="text-[10px] text-gray-400">admin123</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("owner", "owner123")}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-center"
          >
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-primary" /> Owner
            </span>
            <span className="text-[10px] text-gray-400">owner123</span>
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount("tourist", "tourist123")}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-center"
          >
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
              <Compass className="w-3 h-3 text-emerald-500" /> Tourist
            </span>
            <span className="text-[10px] text-gray-400">tourist123</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          Username or Email
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={form.usernameOrEmail}
            onChange={(e) => update("usernameOrEmail", e.target.value)}
            placeholder="Enter your username or email"
            className={inputClass(errors.usernameOrEmail)}
          />
        </div>
        {errors.usernameOrEmail && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.usernameOrEmail}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.password") || "Password"}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder={t("auth.passwordPlaceholder") || "Enter your password"}
            className={inputClass(errors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={form.rememberMe}
            onChange={(e) => update("rememberMe", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition">
            {t("auth.rememberMe") || "Remember me"}
          </span>
        </label>
        <a href="#" className="text-sm text-primary hover:text-primary-dark font-medium transition">
          {t("auth.forgotPassword") || "Forgot password?"}
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-md shadow-primary/30 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {t("auth.signIn") || "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t("auth.noAccount") || "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-primary font-semibold hover:text-primary-dark transition"
        >
          {t("auth.signUpFree") || "Sign up free"}
        </button>
      </p>
    </form>
  );
}