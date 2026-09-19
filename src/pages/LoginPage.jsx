import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/ui/Logo";
import Icon from "../components/ui/Icon";
import { useAuth } from "../context/AuthContext";
import { ROLES, homePathFor } from "../utils/rbac";
import { img } from "../data/site";

const SIDE_IMG = img("Angkor Wat, reflejo 1.jpg", 1400);

function Field({ icon, label, type = "text", placeholder, value, onChange, autoComplete, trailing }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-800">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15">
        <Icon name={icon} size={18} className="text-muted" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="h-11 w-full bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}

export default function LoginPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ fullname: "", username: "", email: "", password: "" });

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

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
            <button className="flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
              EN <Icon name="chevron-down" size={15} />
            </button>
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
            <span className="text-xs font-semibold uppercase tracking-widest text-muted">quick demo access</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-brand-800">
              <Icon name="info" size={13} className="text-gold-600" />
              The backend is a single source of truth — demo buttons use sample accounts when the API is offline.
            </p>
<div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const auth = await login({ username: "demo", password: "demo", role: ROLES.OWNER, forceDemo: true });
                      navigate(homePathFor(auth?.user), { replace: true });
                    } catch (err) {
                      setError(err.message || "Could not start the demo.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                >
                  <Icon name="briefcase" size={17} />
                  Owner demo
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const auth = await login({ username: "demo", password: "demo", role: ROLES.ADMIN, forceDemo: true });
                      navigate(homePathFor(auth?.user), { replace: true });
                    } catch (err) {
                      setError(err.message || "Could not start the demo.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-300 bg-white text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                >
                  <Icon name="shield" size={17} />
                  Admin demo
                </button>
              </div>

              <p className="mt-3 mb-1.5 text-center text-[11px] font-bold uppercase tracking-widest text-muted">
                Owner by vertical
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const auth = await login({ username: "demo", password: "demo", role: ROLES.OWNER_HOTEL, forceDemo: true });
                      navigate(homePathFor(auth?.user), { replace: true });
                    } catch (err) {
                      setError(err.message || "Could not start the demo.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-brand-300 bg-white text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                >
                  <Icon name="bed" size={15} />
                  Hotel owner
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const auth = await login({ username: "demo", password: "demo", role: ROLES.OWNER_TOUR, forceDemo: true });
                      navigate(homePathFor(auth?.user), { replace: true });
                    } catch (err) {
                      setError(err.message || "Could not start the demo.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-brand-300 bg-white text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                >
                  <Icon name="ticket" size={15} />
                  Tour owner
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      const auth = await login({ username: "demo", password: "demo", role: ROLES.OWNER_RESTAURANT, forceDemo: true });
                      navigate(homePathFor(auth?.user), { replace: true });
                    } catch (err) {
                      setError(err.message || "Could not start the demo.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-brand-300 bg-white text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-70"
                >
                  <Icon name="utensils" size={15} />
                  Restaurant owner
                </button>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    const auth = await login({ username: "demo", password: "demo", role: ROLES.SUPEROWNER, forceDemo: true });
                    navigate(homePathFor(auth?.user), { replace: true });
                  } catch (err) {
                    setError(err.message || "Could not start the demo.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-gold-300 bg-gold-50 text-xs font-semibold text-gold-800 transition-colors hover:bg-gold-100 disabled:opacity-70"
              >
                <Icon name="award" size={15} />
                Super owner (all manage pages)
              </button>
            </div>
          </div>

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
