
const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";
const FACEBOOK_SCRIPT = "https://connect.facebook.net/en_US/sdk.js";

const GOOGLE_SCOPE = "openid email profile";
const OAUTH_WAIT_MS = 90_000;

let googlePromise = null;
let facebookPromise = null;

// Configuration error
const configError = (provider, envKey) =>
  new Error(
    `${provider} sign-in is not configured (set ${envKey}).`
  );

// =========================
// GOOGLE SDK
// =========================

function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

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

// =========================
// FACEBOOK SDK
// =========================

function loadFacebookScript() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

  if (!appId) {
    return Promise.reject(
      configError("Facebook", "VITE_FACEBOOK_APP_ID")
    );
  }

  if (facebookPromise) return facebookPromise;

  facebookPromise = new Promise((resolve, reject) => {
    if (window.FB) {
      resolve(window.FB);
      return;
    }

    const script = document.createElement("script");

    script.src = FACEBOOK_SCRIPT;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      if (!window.FB) {
        reject(new Error("Facebook SDK is unavailable."));
        return;
      }

      resolve(window.FB);
    };

    script.onerror = () => {
      facebookPromise = null;
      reject(new Error("Could not load Facebook SDK."));
    };

    document.head.appendChild(script);
  }).then((FB) => {
    FB.init({
      appId,
      cookie: false,
      xfbml: false,
      version: "v24.0",
    });

    return FB;
  }).catch((error) => {
    facebookPromise = null;
    throw error;
  });

  return facebookPromise;
}

// =========================
// PRELOAD SOCIAL SDKs
// =========================

export function preloadSocialSdks() {
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    loadGoogleScript().catch(() => {});
  }

  if (import.meta.env.VITE_FACEBOOK_APP_ID) {
    loadFacebookScript().catch(() => {});
  }
}

// =========================
// GOOGLE LOGIN
// =========================

export function getGoogleAccessToken() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return Promise.reject(
      configError("Google", "VITE_GOOGLE_CLIENT_ID")
    );
  }

  return loadGoogleScript().then(
    () =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error("Google sign-in timed out."));
        }, OAUTH_WAIT_MS);

        const client =
          window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GOOGLE_SCOPE,
            prompt: "select_account",

            callback: (response) => {
              clearTimeout(timer);

              if (response?.error) {
                reject(
                  new Error(
                    response.error_description || response.error
                  )
                );
                return;
              }

              if (!response?.access_token) {
                reject(
                  new Error("Google sign-in was cancelled.")
                );
                return;
              }

              resolve(response.access_token);
            },
          });

        client.requestAccessToken();
      })
  );
}

// =========================
// FACEBOOK LOGIN
// =========================

export function getFacebookAccessToken() {
  return loadFacebookScript().then(
    (FB) =>
      new Promise((resolve, reject) => {
        let settled = false;

        const finish = (error, token) => {
          if (settled) return;

          settled = true;
          clearTimeout(timer);

          if (error) reject(error);
          else resolve(token);
        };

        const timer = setTimeout(() => {
          finish(new Error("Facebook sign-in timed out."));
        }, OAUTH_WAIT_MS);

        try {
          FB.login(
            (response) => {
              const token =
                response?.authResponse?.accessToken;

              if (!token) {
                finish(
                  new Error(
                    "Facebook sign-in was cancelled or denied."
                  )
                );
                return;
              }

              finish(null, token);
            },
            {
              scope: "public_profile,email",
              return_scopes: true,
            }
          );
        } catch (error) {
          finish(error);
        }
      })
  );
}

// =========================
// SOCIAL PROVIDERS
// =========================

const providers = {
  google: getGoogleAccessToken,
  facebook: getFacebookAccessToken,
};

export function getSocialToken(provider) {
  const fn = providers[provider];

  if (!fn) {
    return Promise.reject(
      new Error(`Unsupported provider: ${provider}`)
    );
  }

  return fn();
}
