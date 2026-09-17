import axiosClient from "../api/axiosClient";

// Profile + password management for the admin account.
//
// The backend exposes a read-only profile via GET /management/users/{id} and a
// password change via POST /auth/change-password. There is no profile-update
// endpoint yet, so edits are persisted locally (they take effect immediately
// in the UI and survive reloads). When the backend adds a user-update
// endpoint, wire `updateProfile` to axiosClient too.

const PROFILE_KEY = "sdn.admin.profile";

export const profileService = {
  get(id) {
    return axiosClient.get(`/management/users/${id}`).then((r) => r.data);
  },

  // Best-effort fetch that never throws: falls back to the local profile
  // (or empty object) when the backend is unreachable.
  async load(id, fallback = {}) {
    try {
      const data = await this.get(id);
      return { ...fallback, ...data };
    } catch {
      return fallback;
    }
  },

  update(id, changes) {
    // Persist locally until a backend update endpoint exists.
    const key = `${PROFILE_KEY}:${id}`;
    const current = this.readProfile(id);
    const next = { ...current, ...changes };
    try {
      localStorage.setItem(key, JSON.stringify(next));
      return Promise.resolve(next);
    } catch {
      return Promise.reject(new Error("Could not save profile locally."));
    }
  },

  readProfile(id) {
    try {
      const raw = localStorage.getItem(`${PROFILE_KEY}:${id}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  changePassword({ currentPassword, newPassword, confirmPassword }) {
    return axiosClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  },
};