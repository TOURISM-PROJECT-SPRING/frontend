// Real social login token acquisition.
//
// The login page keeps its own branded buttons. Google uses its official popup
// SDK; the credential is forwarded to the backend (`POST /api/auth/social/
// {provider}`) which verifies it server-side and exchanges it for our JWT.
//
// Client identifiers come from env vars (Vite injects at build time):
//   VITE_GOOGLE_CLIENT_ID  -> Google OAuth 2.0 Web client (Token client type)
//
// The ID is public by design; all verification happens on the backend.

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";
const GOOGLE_SCOPE = "openid email profile";
const OAUTH_WAIT_MS = 90_000;

let googlePromise = null;

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

/** Preload the Google SDK early so its popup opens inside the user gesture. */
export function preloadSocialSdks() {
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) loadGoogleScript();
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

const providers = {
  google: getGoogleAccessToken,
};

export function getSocialToken(provider) {
  const fn = providers[provider];
  if (!fn) return Promise.reject(new Error(`Unsupported provider: ${provider}`));
  return fn();
}