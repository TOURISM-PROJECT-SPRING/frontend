// Real social login token acquisition.
//
// The login page keeps its own branded buttons; clicking one opens the
// provider's official dialog via their SDK, and the resulting credential is
// forwarded to the backend (`POST /api/auth/social/{provider}`) which verifies
// it server-side and exchanges it for our JWT.
//
// Client identifiers come from env vars (Vite injects at build time):
//   VITE_GOOGLE_CLIENT_ID  -> Google OAuth 2.0 Web client (Token client type)
//   VITE_FACEBOOK_APP_ID   -> Facebook App id
//
// Both IDs are public by design and only enable the OAuth dialog; all
// verification happens on the backend.

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";
const FACEBOOK_SCRIPT = "https://connect.facebook.net/en_US/sdk.js";
const FACEBOOK_API_VERSION = "v19.0";
const FACEBOOK_SCOPE = "email";
const GOOGLE_SCOPE = "openid email profile";
const OAUTH_WAIT_MS = 90_000;

let googlePromise = null;
let facebookPromise = null;
let facebookInitDone = false;

const configError = (provider, envKey) =>
  new Error(`${provider} sign-in is not configured on this build (set ${envKey}).`);

function loadGoogleScript() {
  if (window.google?.accounts) return Promise.resolve();
  if (googlePromise) return googlePromise;
  googlePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      googlePromise = null;
      reject(new Error("Could not load Google sign-in."));
    };
    document.head.appendChild(script);
  });
  return googlePromise;
}

/** Preload both SDKs early so the OAuth popup opens inside the user gesture. */
export function preloadSocialSdks() {
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) loadGoogleScript();
  if (import.meta.env.VITE_FACEBOOK_APP_ID) ensureFacebookSdk(import.meta.env.VITE_FACEBOOK_APP_ID);
}

export function getGoogleAccessToken() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) return Promise.reject(configError("Google", "VITE_GOOGLE_CLIENT_ID"));

  return loadGoogleScript().then(
    () =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Google sign-in timed out.")),
          OAUTH_WAIT_MS
        );
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: GOOGLE_SCOPE,
          prompt: "select_account",
          callback: (response) => {
            clearTimeout(timer);
            if (response?.error) {
              reject(new Error(response.error_description || response.error));
              return;
            }
            if (!response?.access_token) {
              reject(new Error("Google sign-in was cancelled."));
              return;
            }
            resolve(response.access_token);
          },
        });
        client.requestAccessToken();
      })
  );
}

function ensureFacebookSdk(appId) {
  if (facebookInitDone && window.FB) return Promise.resolve();
  if (facebookPromise) return facebookPromise;

  facebookPromise = new Promise((resolve, reject) => {
    const ready = () => {
      if (!window.FB) return;
      if (facebookInitDone) {
        resolve();
        return;
      }
      window.FB.init({ appId, version: FACEBOOK_API_VERSION, cookie: false, xfbml: false });
      facebookInitDone = true;
      resolve();
    };

    window.fbAsyncInit = ready;

    const script = document.querySelector(`script[src="${FACEBOOK_SCRIPT}"]`);
    if (script) {
      // Already loading or loaded — if loaded, fbAsyncInit was already consumed.
      if (window.FB) setTimeout(ready, 0);
      return;
    }
    const el = document.createElement("script");
    el.src = FACEBOOK_SCRIPT;
    el.async = true;
    el.defer = true;
    el.onerror = () => {
      facebookPromise = null;
      reject(new Error("Could not load Facebook login."));
    };
    document.head.appendChild(el);
  });
  return facebookPromise;
}

export function getFacebookAccessToken() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
  if (!appId) return Promise.reject(configError("Facebook", "VITE_FACEBOOK_APP_ID"));

  return ensureFacebookSdk(appId).then(
    () =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Facebook login timed out.")),
          OAUTH_WAIT_MS
        );
        window.FB.login(
          (response) => {
            clearTimeout(timer);
            if (response?.authResponse?.accessToken) {
              resolve(response.authResponse.accessToken);
              return;
            }
            const cancelled =
              response?.status === "unknown" || response?.status === "not_authorized";
            reject(
              cancelled
                ? new Error("Facebook login was cancelled.")
                : new Error("Facebook login failed. Please try again.")
            );
          },
          { scope: FACEBOOK_SCOPE }
        );
      })
  );
}

const providers = {
  google: getGoogleAccessToken,
  facebook: getFacebookAccessToken,
};

export function getSocialToken(provider) {
  const fn = providers[provider];
  if (!fn) return Promise.reject(new Error(`Unsupported provider: ${provider}`));
  return fn();
}