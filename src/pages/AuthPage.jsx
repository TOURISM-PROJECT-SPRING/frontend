import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Landmark,
  Star,
  MapPin,
  Globe,
  CheckCircle,
  X,
  ShieldCheck,
  Building2,
  Compass,
} from "lucide-react";

const features = [
  { icon: MapPin, text: "500+ Destinations" },
  { icon: Star, text: "4.9 Average Rating" },
  { icon: Globe, text: "10,000+ Happy Travelers" },
];

export default function AuthPage({ initialMode = "login" }) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const updateLogin = (field, value) => setLoginForm((p) => ({ ...p, [field]: value }));
  const updateRegister = (field, value) => setRegisterForm((p) => ({ ...p, [field]: value }));

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

  const validateLogin = () => {
    const e = {};
    if (!loginForm.usernameOrEmail.trim()) {
      e.usernameOrEmail = t("auth.errors.emailRequired") || "Username or email is required";
    }
    if (!loginForm.password) {
      e.password = t("auth.errors.passwordRequired") || "Password is required";
    } else if (loginForm.password.length < 6) {
      e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.fullName.trim()) {
      e.fullName = t("auth.errors.nameRequired") || "Full name is required";
    }
    if (registerForm.username.trim() && registerForm.username.trim().length < 3) {
      e.username = "Username must be at least 3 characters";
    }
    if (!registerForm.email.trim()) {
      e.email = t("auth.errors.emailRequired") || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      e.email = t("auth.errors.emailInvalid") || "Invalid email format";
    }
    if (!registerForm.password) {
      e.password = t("auth.errors.passwordRequired") || "Password is required";
    } else if (registerForm.password.length < 6) {
      e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    }
    if (!registerForm.confirmPassword) {
      e.confirmPassword = t("auth.errors.confirmRequired") || "Please confirm your password";
    } else if (registerForm.password !== registerForm.confirmPassword) {
      e.confirmPassword = t("auth.errors.passwordMismatch") || "Passwords don't match";
    }
    if (!registerForm.agreeTerms) {
      e.agreeTerms = t("auth.errors.termsRequired") || "You must agree to the Terms of Service";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getApiError = (err) => {
    if (err?.response?.data) {
      const data = err.response.data;
      if (typeof data === "string") return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors.map((e) => e.defaultMessage || e.message || e).join(", ");
      }
      if (data.errors && typeof data.errors === "object") {
        return Object.values(data.errors).join(", ");
      }
    }
    return err?.message || "Authentication failed. Please try again.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      setLoading(true);
      setFormError("");
      try {
        const res = await login({
          usernameOrEmail: loginForm.usernameOrEmail.trim(),
          password: loginForm.password,
        });
        redirectByUserRole(res?.user);
      } catch (err) {
        setFormError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const buildUsername = (fullName, email) => {
    const base =
      (email.split("@")[0] || "").toLowerCase().replace(/[^a-z0-9]/g, "") ||
      (fullName || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 12) ||
      "user";
    return `${base}${Math.floor(Math.random() * 900 + 100)}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateRegister()) {
      setLoading(true);
      setFormError("");
      try {
        const computedUsername =
          registerForm.username.trim() || buildUsername(registerForm.fullName, registerForm.email);

        const res = await register({
          fullname: registerForm.fullName.trim(),
          username: computedUsername,
          email: registerForm.email.trim(),
          password: registerForm.password,
          gender: "Male",
        });
        redirectByUserRole(res?.user);
      } catch (err) {
        setFormError(getApiError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const fillDemoAccount = (username, password) => {
    setLoginForm((p) => ({
      ...p,
      usernameOrEmail: username,
      password: password,
    }));
    setFormError("");
    setErrors({});
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setFormError("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-primary/20"
    } rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200`;

  return (
    <div className="min-h-screen w-full flex">
      {/* ===== LEFT PANEL — Branding ===== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gray-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1569949381669-ecf31ae866fd?w=1200&h=1600&fit=crop&q=80"
          alt="Cambodia"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-gray-900/70 to-gray-900/90" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/20 transition">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Smart Tourism</span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
              {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              {mode === "login" ? t("auth.signInSubtitle") : t("auth.createSubtitle")}
            </p>

            {/* Features */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-slide-right"
                  style={{ animationDelay: `${i * 100 + 300}ms` }}
                >
                  <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="text-sm text-white/70 font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <p className="text-xs text-white/30 max-w-sm">
            &ldquo;Smart Tourism Cambodia made our journey seamless. All-in-one portal for stays, tours, and culinary adventures.&rdquo;
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Landmark className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white">Smart Tourism</span>
          </Link>

          {/* Mode switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white dark:shadow-black/30"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              {t("auth.login.title") || "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "register"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white dark:shadow-black/30"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              {t("auth.register.title") || "Create Account"}
            </button>
          </div>

          {formError && (
            <div className="mb-5 flex items-start gap-2 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs sm:text-sm text-red-600 dark:text-red-400">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* ===== LOGIN ===== */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in-up">
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
                    <span className="text-[10px] text-gray-400">admin / admin123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("owner", "owner123")}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-center"
                  >
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-primary" /> Owner
                    </span>
                    <span className="text-[10px] text-gray-400">owner / owner123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("tourist", "tourist123")}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-gray-900 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-center"
                  >
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-500" /> Tourist
                    </span>
                    <span className="text-[10px] text-gray-400">tourist / tourist123</span>
                  </button>
                </div>
              </div>

              {/* Username or Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={loginForm.usernameOrEmail}
                    onChange={(e) => updateLogin("usernameOrEmail", e.target.value)}
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

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {t("auth.password") || "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => updateLogin("password", e.target.value)}
                    placeholder={t("auth.passwordPlaceholder") || "Enter your password"}
                    className={inputClass(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => updateLogin("rememberMe", e.target.checked)}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {/* Switch to register */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                {t("auth.noAccount") || "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-primary font-semibold hover:text-primary-dark transition"
                >
                  {t("auth.signUpFree") || "Sign up free"}
                </button>
              </p>
            </form>
          )}

          {/* ===== REGISTER ===== */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5 animate-fade-in-up">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {t("auth.fullName") || "Full Name"} *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={registerForm.fullName}
                    onChange={(e) => updateRegister("fullName", e.target.value)}
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

              {/* Username (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </label>
                  <span className="text-[11px] text-gray-400">Optional (Auto-generated if empty)</span>
                </div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => updateRegister("username", e.target.value)}
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

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {t("auth.email") || "Email"} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => updateRegister("email", e.target.value)}
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

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {t("auth.password") || "Password"} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => updateRegister("password", e.target.value)}
                    placeholder={t("auth.createPasswordPlaceholder") || "Create a password (min 6 chars)"}
                    className={inputClass(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
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

                {/* Password strength */}
                {registerForm.password && (
                  <div className="mt-2 flex gap-1 items-center">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          registerForm.password.length >= i * 3
                            ? i <= 1
                              ? "bg-red-400"
                              : i <= 2
                              ? "bg-amber-400"
                              : i <= 3
                              ? "bg-blue-400"
                              : "bg-green-400"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1.5 shrink-0">
                      {registerForm.password.length < 6
                        ? "Weak"
                        : registerForm.password.length < 10
                        ? "Fair"
                        : registerForm.password.length < 14
                        ? "Strong"
                        : "Very Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  {t("auth.confirmPassword") || "Confirm Password"} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => updateRegister("confirmPassword", e.target.value)}
                    placeholder={t("auth.confirmPasswordPlaceholder") || "Confirm your password"}
                    className={inputClass(errors.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
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
                {registerForm.confirmPassword &&
                  registerForm.password === registerForm.confirmPassword && (
                    <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Passwords match
                    </p>
                  )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={registerForm.agreeTerms}
                    onChange={(e) => updateRegister("agreeTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition leading-snug">
                    {t("auth.agreeTo") || "I agree to the"}{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">
                      {t("auth.termsOfService") || "Terms of Service"}
                    </a>{" "}
                    {t("auth.and") || "and"}{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">
                      {t("auth.privacyPolicy") || "Privacy Policy"}
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {/* Switch to login */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                {t("auth.alreadyAccount") || "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-primary font-semibold hover:text-primary-dark transition"
                >
                  {t("auth.signInLink") || "Sign in"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

