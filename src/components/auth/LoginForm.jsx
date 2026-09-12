import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm({ onSwitchMode, onSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = t("auth.errors.emailRequired") || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("auth.errors.emailInvalid") || "Invalid email";
    if (!form.password) e.password = t("auth.errors.passwordRequired") || "Password is required";
    else if (form.password.length < 6) e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const result = await login({ usernameOrEmail: form.email.trim(), password: form.password });
      if (onSuccess) onSuccess(result.user);
      else navigate("/");
    } catch (err) {
      setFormError(err?.response?.data?.message || t("auth.errors.loginFailed") || "Sign in failed. Please try again.");
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
      hasError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20"
    } rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up" noValidate>
      {formError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
          <X className="w-4 h-4 shrink-0" />
          {formError}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.email") || "Email"}
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder={t("auth.emailPlaceholder") || "you@example.com"}
            className={inputClass(errors.email)}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.password") || "Password"}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
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
        className="w-full py-3.5 bg-gradient-to-r from-gold-light via-primary to-gold-dark text-gray-950 text-sm font-semibold rounded-xl hover:brightness-110 transition-all duration-300 shadow-md shadow-primary/30 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        <span className="text-[11px] text-gray-300 font-medium uppercase">{t("auth.orContinueWith") || "or continue with"}</span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
          <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6">
        {t("auth.noAccount") || "Don't have an account?"}{" "}
        <button type="button" onClick={onSwitchMode} className="text-primary font-semibold hover:text-primary-dark transition">
          {t("auth.signUpFree") || "Sign up free"}
        </button>
      </p>
    </form>
  );
}