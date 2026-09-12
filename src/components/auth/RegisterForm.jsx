import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const strengthOf = (password) => {
  const len = password?.length || 0;
  if (len >= 14) return "veryStrong";
  if (len >= 10) return "strong";
  if (len >= 6) return "fair";
  if (len > 0) return "weak";
  return "";
};

const STRENGTH_COLORS = {
  weak: "bg-red-400",
  fair: "bg-amber-400",
  strong: "bg-blue-400",
  veryStrong: "bg-green-400",
};

export default function RegisterForm({ onSwitchMode, onSuccess }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const strength = strengthOf(form.password);

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

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = t("auth.errors.nameRequired") || "Full name is required";
    if (form.username.trim() && form.username.trim().length < 3) {
      e.username = "Username must be at least 3 characters";
    }
    if (!form.email.trim()) e.email = t("auth.errors.emailRequired") || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("auth.errors.emailInvalid") || "Invalid email";
    if (!form.password) e.password = t("auth.errors.passwordRequired") || "Password is required";
    else if (form.password.length < 6) e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    if (!form.confirmPassword) e.confirmPassword = t("auth.errors.confirmRequired") || "Please confirm";
    else if (form.password !== form.confirmPassword) e.confirmPassword = t("auth.errors.passwordMismatch") || "Passwords don't match";
    if (!form.agreeTerms) e.agreeTerms = t("auth.errors.termsRequired") || "You must agree";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildUsername = (fullName, email) => {
    const base =
      (email.split("@")[0] || "").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (fullName || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) ||
      "user";
    return `${base}${Math.floor(Math.random() * 900 + 100)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    try {
      const computedUsername = form.username.trim() || buildUsername(form.fullName, form.email);
      const result = await register({
        fullname: form.fullName.trim(),
        username: computedUsername,
        email: form.email.trim(),
        password: form.password,
        gender: "Male",
      });
      if (onSuccess) onSuccess(result.user);
      else redirectByUserRole(result.user);
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (typeof data === "string" ? data : data?.message || data?.error) ||
        t("auth.errors.registerFailed") ||
        "Registration failed. Please try again.";
      setFormError(msg);
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
      hasError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20"
    } rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200`;

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 animate-fade-in-up" noValidate>
      {formError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-sm text-red-600 dark:text-red-400">
          <X className="w-4 h-4 shrink-0" />
          {formError}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.fullName") || "Full Name"} *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder={t("auth.fullNamePlaceholder") || "Your full name"}
            className={inputClass(errors.fullName)}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Username
          </label>
          <span className="text-[11px] text-gray-400">Optional</span>
        </div>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="e.g. jondoe99"
            className={inputClass(errors.username)}
          />
        </div>
        {errors.username && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.username}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.email") || "Email"} *
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
          {t("auth.password") || "Password"} *
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder={t("auth.createPasswordPlaceholder") || "Create a password (min 6 chars)"}
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

        {strength && (
          <div className="mt-2 flex gap-1 items-center">
            {["weak", "fair", "strong", "veryStrong"].map((lvl) => (
              <div
                key={lvl}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  strength !== lvl && ["weak", "fair", "strong", "veryStrong"].indexOf(lvl) <= ["weak", "fair", "strong", "veryStrong"].indexOf(strength)
                    ? STRENGTH_COLORS[strength]
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1.5 shrink-0">
              {t(`auth.strength.${strength}`) || strength}
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
          {t("auth.confirmPassword") || "Confirm Password"} *
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder={t("auth.confirmPasswordPlaceholder") || "Confirm your password"}
            className={inputClass(errors.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.confirmPassword}
          </p>
        )}
        {form.confirmPassword && form.password === form.confirmPassword && (
          <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {t("auth.passwordMatch") || "Passwords match"}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={form.agreeTerms}
            onChange={(e) => update("agreeTerms", e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/20"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition leading-snug">
            {t("auth.agreeTo") || "I agree to the"}{" "}
            <a href="#" className="text-primary hover:text-primary-dark font-medium">{t("auth.termsOfService") || "Terms of Service"}</a>
            {" "}{t("auth.and") || "and"}{" "}
            <a href="#" className="text-primary hover:text-primary-dark font-medium">{t("auth.privacyPolicy") || "Privacy Policy"}</a>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <X className="w-3 h-3" />
            {errors.agreeTerms}
          </p>
        )}
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
            {t("auth.createBtn") || "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
        {t("auth.alreadyAccount") || "Already have an account?"}{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-primary font-semibold hover:text-primary-dark transition"
        >
          {t("auth.signInLink") || "Sign in"}
        </button>
      </p>
    </form>
  );
}