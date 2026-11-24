import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { getSocialToken, loadFacebookScript } from "../../services/socialAuth";

export default function ConnectedAccounts({ sessionToken, onSignOut }) {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionToken));
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState("");
  const [linking, setLinking] = useState(false);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!sessionToken) return;
    let active = true;
    authService.getConnectedAccounts(sessionToken)
      .then((data) => { if (active) setAccounts(data); })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 401) setNeedsSignIn(true);
        else setError("Could not load connected accounts. Reload your profile to try again.");
      })
      .finally(() => { if (active) setLoading(false); });
    loadFacebookScript()
      .then(() => { if (active) setSdkReady(true); })
      .catch(() => { if (active) setSdkError("Facebook sign-in is unavailable. Reload your profile to try again."); });
    return () => { active = false; };
  }, [sessionToken]);

  async function connectFacebook() {
    if (linking) return;
    setError("");
    setSuccess("");
    if (!(Date.parse(accounts?.canLinkUntil) > Date.now())) {
      setNeedsSignIn(true);
      return;
    }

    setLinking(true);
    try {
      const facebookToken = await getSocialToken("facebook");
      const updated = await authService.linkFacebook(facebookToken, sessionToken);
      setAccounts(updated);
      setSuccess("Facebook is connected.");
    } catch (err) {
      if (err.response?.status === 403 || err.response?.data?.message === "Authentication required") {
        setNeedsSignIn(true);
      } else if ([400, 401, 409].includes(err.response?.status)) {
        setError(err.response.data?.message || "Could not connect Facebook. Try again.");
      } else {
        setError("Could not complete Facebook sign-in or reach the server. Try again.");
      }
    } finally {
      setLinking(false);
    }
  }

  function signInAgain() {
    onSignOut();
    navigate("/login", { state: { from: "/profile" } });
  }

  const facebookConnected = accounts?.providers.includes("facebook");
  const buttonClass = "mt-3 rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60";

  return (
    <section className="mb-5 rounded-2xl border border-emerald-100 bg-white p-5" aria-labelledby="connected-accounts-heading">
      <h2 id="connected-accounts-heading" className="font-display text-lg font-bold">Connected Accounts</h2>
      {!sessionToken && <p className="mt-2 text-sm">Sign in to manage connected accounts.</p>}
      {loading && <p className="mt-2 text-sm" role="status">Loading connected accounts…</p>}
      {accounts && (
        <dl className="mt-2 divide-y divide-emerald-100">
          {[["Google", "google"], ["Facebook", "facebook"]].map(([label, provider]) => (
            <div key={provider} className="flex justify-between gap-4 py-2 text-sm">
              <dt className="font-semibold">{label}</dt>
              <dd>{accounts.providers.includes(provider) ? "Connected" : "Not connected"}</dd>
            </div>
          ))}
        </dl>
      )}
      {accounts && !facebookConnected && !needsSignIn && (
        <>
          <button type="button" className={buttonClass} disabled={linking || !sdkReady} onClick={connectFacebook}>
            {linking ? "Connecting…" : "Connect Facebook"}
          </button>
          {sdkError && <p className="mt-2 text-sm text-red-700" role="alert">{sdkError}</p>}
        </>
      )}
      {needsSignIn && (
        <>
          <p className="mt-2 text-sm" role="status">Sign in again with your password or connected Google account, then return here to connect Facebook.</p>
          <button type="button" className={buttonClass} onClick={signInAgain}>Sign in again</button>
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-700" role="status">{success}</p>}
    </section>
  );
}
