import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/ui/Logo";
import Icon from "../components/ui/Icon";
import { useAuth } from "../context/AuthContext";
import { homePathFor } from "../utils/rbac";
import { img } from "../data/site";
import { getSocialToken, preloadSocialSdks } from "../services/socialAuth";

const SIDE_IMG = img("Angkor Wat, reflejo 1.jpg", 1400);

// Brand glyphs for the social sign-in buttons (kept local so the shared line-
// icon set stays brand-agnostic).
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.57-5.17 3.57-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.97 11.97 0 0 0 1.27 6.6l4 3.1c.94-2.84 3.6-4.94 6.73-4.94Z" />
    </svg>
  );
}

function Field({ icon, label, type = "text", placeholder, value, onChange, autoComplete, trailing }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-800">{label}</span>
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-12 w-full rounded-xl border border-line bg-white pl-11 pr-11 text-[15px] text-ink outline-none transition-all duration-200 placeholder:text-muted/50 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
        />
        {trailing && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
    </label>
  );
}

export default function LoginPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, socialLogin } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ fullname: "", username: "", email: "", password: "" });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // Warm up the Google SDK on mount so its popup can open inside the user
  // gesture when the Google button is clicked.
  useEffect(() => {
    preloadSocialSdks();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = isLogin
        ? await login({ username: form.username || form.email, password: form.password })
        : await register({
            fullname: form.fullname,
            username: form.username,
            email: form.email,
            password: form.password,
          });
      // Deep links (from ProtectedRoute) win; otherwise route by role so an
      // admin lands on /admin, an owner on /owner, and a traveler on /.
      const dest = location.state?.from || homePathFor(auth?.user);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialAuth = async (provider) => {
    setError(null);
    setLoading(true);
    try {
      // 1. Open the provider's official dialog and get a real OAuth token.
      const providerToken = await getSocialToken(provider);
      // 2. Verify it server-side and persist the backend-issued session JWT.
      const auth = await socialLogin({ provider, token: providerToken });
      const dest = location.state?.from || homePathFor(auth?.user);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in with that provider.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Left visual */}
      <div className="relative isolate hidden overflow-hidden lg:block">
        <img src={SIDE_IMG} alt="Angkor Wat at sunset" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950/85 via-brand-900/40 to-brand-950/50" />

        <div className="flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Logo tone="light" />
            </Link>
          </div>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-300 backdrop-blur">
              <Icon name="landmark" size={14} className="text-gold-400" /> SovannDomNour
            </span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-white">
              Welcome to Cambodia
            </h2>
            <p className="mt-3 text-lg text-white/80">Your journey starts here.</p>
            <div className="mt-8 flex items-center gap-2 text-sm text-white/70">
              <Icon name="star" size={15} className="text-gold-400" fill="currentColor" stroke="none" />
              Trusted by 120,000+ travellers across the Kingdom
            </div>
          </div>
        </div>
      </div>


      {/* Right form */}
      <div className="relative flex items-center justify-center bg-cream px-5 py-10 sm:px-10">
        <Link to="/" className="absolute left-5 top-5 lg:hidden">
          <Logo />
        </Link>
        <Link to="/" className="absolute right-5 top-5 text-sm font-semibold text-muted hover:text-brand-700">
          ← Back to site
        </Link>

        <div className="w-full max-w-md pt-14 lg:pt-0 animate-rise">
          <h1 className="font-display text-3xl font-bold text-brand-800">
            {isLogin ? "Welcome Back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isLogin
              ? "Sign in to continue exploring Cambodia."
              : "Join SovannDomNour and start planning your journey."}
          </p>

          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              <Icon name="info" size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && (
              <Field icon="user" label="Full name" placeholder="Sokha Dara" value={form.fullname} onChange={set("fullname")} autoComplete="name" />
            )}
            {isLogin ? (
              <Field icon="user" label="Username or email" placeholder="your username or email" value={form.username} onChange={set("username")} autoComplete="username" />
            ) : (
              <Field icon="user" label="Username" placeholder="sokha.dara" value={form.username} onChange={set("username")} autoComplete="username" />
            )}
            {!isLogin && (
              <Field icon="mail" type="email" label="Email address" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
            )}
            <Field
              icon="shield"
              type={show ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={form.password}
              onChange={set("password")}
              autoComplete={isLogin ? "current-password" : "new-password"}
              trailing={
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label="Toggle password"
                  className="text-muted hover:text-brand-700"
                >
                  <Icon name="eye" size={18} />
                </button>
              }
            />

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" className="h-4 w-4 rounded border-line text-brand-700 focus:ring-brand-500/30" />
                  Remember me
                </label>
                <a href="#forgot" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-700 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-800 hover:shadow-md disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Please wait…
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <Icon name="arrow-right" size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">or continue with</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => socialAuth("google")}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white text-sm font-semibold text-ink shadow-sm transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-70"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/register" : "/login"}
              className="font-bold text-brand-700 hover:text-brand-800"
            >
              {isLogin ? "Create Account" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
