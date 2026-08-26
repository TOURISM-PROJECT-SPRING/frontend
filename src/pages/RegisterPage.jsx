import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Landmark,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-green-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            Smart Tourism
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1 gap-2">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold transition ${
                  step >= s ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                {s < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full transition ${step > 1 ? "bg-primary" : "bg-gray-100"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-xl font-semibold text-gray-900 text-center">
            {step === 1
              ? (t("auth.register.title") || "Create your account")
              : "Set your password"}
          </h1>
          <p className="text-sm text-gray-400 text-center mt-1.5">
            {step === 1
              ? (t("auth.register.subtitle") || "Start your journey with us")
              : "Choose a strong password to secure your account"}
          </p>

          <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("auth.register.firstName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        placeholder={t("auth.register.firstNamePlaceholder")}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("auth.register.lastName")}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder={t("auth.register.lastNamePlaceholder")}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("auth.register.email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t("auth.register.emailPlaceholder")}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("auth.register.phone")}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder={t("auth.register.phonePlaceholder")}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                  <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-200 text-primary focus:ring-primary/20" />
                  <span className="text-sm text-gray-500">
                    {t("auth.register.terms") || "I agree to the"}{" "}
                    <a href="#" className="text-primary hover:text-primary-dark font-medium">
                      {t("auth.register.termsLink") || "Terms & Conditions"}
                    </a>
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition mt-1"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("auth.register.password")}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder={t("auth.register.passwordPlaceholder")}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength */}
                  {formData.password && (
                    <div className="mt-2.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition ${i <= strength ? strengthColors[strength] : "bg-gray-100"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs mt-1.5 font-medium ${
                        strength <= 1 ? "text-red-400" : strength <= 2 ? "text-orange-400" : strength <= 3 ? "text-amber-500" : "text-green-500"
                      }`}>
                        {strengthLabels[strength]}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
                  >
                    {t("auth.register.submit") || "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Sign In */}
        <p className="text-center text-sm text-gray-400 mt-6">
          {t("auth.register.hasAccount") || "Already have an account?"}{" "}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition">
            {t("auth.register.signIn") || "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
