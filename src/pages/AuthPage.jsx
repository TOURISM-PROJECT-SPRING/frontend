import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const features = [
  { icon: MapPin, text: "500+ Destinations" },
  { icon: Star, text: "4.9 Average Rating" },
  { icon: Globe, text: "10,000+ Happy Travelers" },
];

export default function AuthPage({ initialMode = "login" }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberMe: false });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const updateLogin = (field, value) => setLoginForm((p) => ({ ...p, [field]: value }));
  const updateRegister = (field, value) => setRegisterForm((p) => ({ ...p, [field]: value }));

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = t("auth.errors.emailRequired") || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) e.email = t("auth.errors.emailInvalid") || "Invalid email";
    if (!loginForm.password) e.password = t("auth.errors.passwordRequired") || "Password is required";
    else if (loginForm.password.length < 6) e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.fullName.trim()) e.fullName = t("auth.errors.nameRequired") || "Full name is required";
    if (!registerForm.email.trim()) e.email = t("auth.errors.emailRequired") || "Email is required";
    else if (!/\S+@\S+\.\S+/.test(registerForm.email)) e.email = t("auth.errors.emailInvalid") || "Invalid email";
    if (!registerForm.password) e.password = t("auth.errors.passwordRequired") || "Password is required";
    else if (registerForm.password.length < 6) e.password = t("auth.errors.passwordMin") || "Min 6 characters";
    if (!registerForm.confirmPassword) e.confirmPassword = t("auth.errors.confirmRequired") || "Please confirm";
    else if (registerForm.password !== registerForm.confirmPassword) e.confirmPassword = t("auth.errors.passwordMismatch") || "Passwords don't match";
    if (!registerForm.agreeTerms) e.agreeTerms = t("auth.errors.termsRequired") || "You must agree";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateRegister()) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setShowPassword(false);
    setShowConfirm(false);
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 bg-gray-50 border ${
      hasError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-primary focus:ring-primary/20"
    } rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200`;

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
            &ldquo;Smart Tourism Cambodia made our honeymoon absolutely magical. The booking process was seamless and every recommendation was perfect.&rdquo;
          </p>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Form ===== */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Landmark className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900">Smart Tourism</span>
          </Link>

          {/* Mode switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t("auth.login.title") || "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === "register"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t("auth.register.title") || "Create Account"}
            </button>
          </div>

          {/* ===== LOGIN ===== */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 animate-fade-in-up">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.email") || "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => updateLogin("email", e.target.value)}
                    placeholder={t("auth.emailPlaceholder") || "you@example.com"}
                    className={inputClass(errors.email)}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.password") || "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => updateLogin("rememberMe", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition">
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

              {/* Divider */}
              <div className="flex items-center gap-4 my-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-300 font-medium uppercase">{t("auth.orContinueWith") || "or continue with"}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition">
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              {/* Switch to register */}
              <p className="text-center text-sm text-gray-400 mt-6">
                {t("auth.noAccount") || "Don't have an account?"}{" "}
                <button type="button" onClick={() => switchMode("register")} className="text-primary font-semibold hover:text-primary-dark transition">
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.fullName") || "Full Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={registerForm.fullName}
                    onChange={(e) => updateRegister("fullName", e.target.value)}
                    placeholder={t("auth.fullNamePlaceholder") || "Your full name"}
                    className={inputClass(errors.fullName)}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.email") || "Email"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => updateRegister("email", e.target.value)}
                    placeholder={t("auth.emailPlaceholder") || "you@example.com"}
                    className={inputClass(errors.email)}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.password") || "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => updateRegister("password", e.target.value)}
                    placeholder={t("auth.createPasswordPlaceholder") || "Create a password"}
                    className={inputClass(errors.password)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.password}</p>}

                {/* Password strength */}
                {registerForm.password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          registerForm.password.length >= i * 3
                            ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-blue-400" : "bg-green-400"
                            : "bg-gray-100"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1.5 shrink-0">
                      {registerForm.password.length < 6 ? "Weak" : registerForm.password.length < 10 ? "Fair" : registerForm.password.length < 14 ? "Strong" : "Very Strong"}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  {t("auth.confirmPassword") || "Confirm Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => updateRegister("confirmPassword", e.target.value)}
                    placeholder={t("auth.confirmPasswordPlaceholder") || "Confirm your password"}
                    className={inputClass(errors.confirmPassword)}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.confirmPassword}</p>}
                {registerForm.confirmPassword && registerForm.password === registerForm.confirmPassword && (
                  <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Passwords match</p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={registerForm.agreeTerms}
                    onChange={(e) => updateRegister("agreeTerms", e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition leading-snug">
                    {t("auth.agreeTo") || "I agree to the"}{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">{t("auth.termsOfService") || "Terms of Service"}</a>
                    {" "}{t("auth.and") || "and"}{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">{t("auth.privacyPolicy") || "Privacy Policy"}</a>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{errors.agreeTerms}</p>}
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

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-300 font-medium uppercase">{t("auth.orContinueWith") || "or continue with"}</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition">
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              {/* Switch to login */}
              <p className="text-center text-sm text-gray-400 mt-5">
                {t("auth.alreadyAccount") || "Already have an account?"}{" "}
                <button type="button" onClick={() => switchMode("login")} className="text-primary font-semibold hover:text-primary-dark transition">
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
