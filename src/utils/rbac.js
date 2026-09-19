// Role-based access control for the management console.
// The console is split into workspaces (tour / hotel / restaurant / admin)
// plus owner-only pages. Access is derived from the user's `roles` array
// (as returned by the backend) and rules defined per path prefix below.

export const ROLES = {
  ADMIN: "ADMIN",
  SUPEROWNER: "SUPEROWNER",
  OWNER: "OWNER",
  OWNER_HOTEL: "OWNER_HOTEL",
  OWNER_TOUR: "OWNER_TOUR",
  OWNER_RESTAURANT: "OWNER_RESTAURANT",
  MANAGER: "MANAGER",
  USER: "USER",
};

// Business-scoped owner roles are locked to exactly one vertical in the owner
// console (/owner/*). Generic OWNER manages up to two verticals based on admin
// assignment (assignedBusinesses). SUPEROWNER unlocks all three.
export const OWNER_ROLE_BIZ = {
  [ROLES.OWNER_HOTEL]: "hotel",
  [ROLES.OWNER_TOUR]: "tour",
  [ROLES.OWNER_RESTAURANT]: "restaurant",
};

export const ALL_BUSINESS_IDS = ["hotel", "restaurant", "tour"];

export function hasRole(user, role) {
  return Array.isArray(user?.roles) && user.roles.includes(role);
}

export function hasAnyRole(user, roles = []) {
  return roles.some((role) => hasRole(user, role));
}

// Every role that may open the owner console (/owner/*).
export const OWNER_ROLES = [
  ROLES.SUPEROWNER,
  ROLES.OWNER,
  ROLES.OWNER_HOTEL,
  ROLES.OWNER_TOUR,
  ROLES.OWNER_RESTAURANT,
];

// Any role that may open the owner console at all.
export function isOwnerRole(user) {
  return hasAnyRole(user, OWNER_ROLES);
}

// The business verticals a user is licensed to manage in the owner console.
// SUPEROWNER gets everything; business-scoped roles are locked to their single
// vertical; generic OWNER falls back to admin-assigned businesses (up to two).
export function ownerBusinessScope(user) {
  if (hasRole(user, ROLES.SUPEROWNER)) return [...ALL_BUSINESS_IDS];
  for (const [role, biz] of Object.entries(OWNER_ROLE_BIZ)) {
    if (hasRole(user, role)) return [biz];
  }
  return null;
}

const ROLE_LABELS = {
  ADMIN: "Administrator",
  SUPEROWNER: "Super Owner",
  OWNER: "Business Owner",
  OWNER_HOTEL: "Hotel Owner",
  OWNER_TOUR: "Tour Owner",
  OWNER_RESTAURANT: "Restaurant Owner",
  MANAGER: "Operations Manager",
  USER: "Traveler",
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

export function primaryRoleLabel(user) {
  const role = Array.isArray(user?.roles) ? user.roles[0] : user?.role;
  return roleLabel(role);
}

// ---------------------------------------------------------------------------
// Owner role override — a local mirror of the role the admin assigned to a
// specific user (keyed by user id and username). The owner console honors it
// above the (possibly stale / differently-shaped) auth payload, so a role
// change in the admin dashboard takes effect immediately.
//
// Every place the session role is established (login, backend refresh, admin
// editor) also syncs this mirror, so it never goes stale.
// ---------------------------------------------------------------------------
const OWNER_ROLE_KEY_PREFIX = "smart_tourism_owner_role_";

export function ownerRoleOverrideKeys(currentUser) {
  return [
    `${OWNER_ROLE_KEY_PREFIX}${currentUser?.id ?? ""}`,
    `${OWNER_ROLE_KEY_PREFIX}${(currentUser?.username || "").toLowerCase()}`,
  ].filter((k) => k && k.length > OWNER_ROLE_KEY_PREFIX.length);
}

export function isOwnerRoleOverrideKey(key) {
  return Boolean(key && key.startsWith(OWNER_ROLE_KEY_PREFIX));
}

export function readOwnerRoleOverride(currentUser) {
  for (const key of ownerRoleOverrideKeys(currentUser)) {
    const stored = localStorage.getItem(key);
    if (stored) return stored;
  }
  return null;
}

export function setOwnerRoleOverride(editedUser, role) {
  try {
    ownerRoleOverrideKeys(editedUser).forEach((key) => {
      if (role) localStorage.setItem(key, role);
      else localStorage.removeItem(key);
    });
  } catch {}
}

export function clearOwnerRoleOverride(editedUser) {
  try {
    ownerRoleOverrideKeys(editedUser).forEach((key) => localStorage.removeItem(key));
  } catch {}
}

// Who may open the management console at all.
export function canUseManager(user) {
  return hasAnyRole(user, [ROLES.ADMIN, ROLES.OWNER]);
}

// The landing page a user should be sent to after signing in (or when they
// revisit a login/register page while already authenticated).
export function homePathFor(user) {
  if (hasRole(user, ROLES.ADMIN)) return "/admin";
  if (isOwnerRole(user)) return "/owner";
  return "/";
}

// Path-based rules. More specific prefixes win (checked first).
const PATH_RULES = [
  { prefix: "/manager/admin", roles: [ROLES.ADMIN] },
  { prefix: "/manager/owner", roles: [ROLES.OWNER] },
  { prefix: "/manager/tour", roles: [ROLES.ADMIN] },
  { prefix: "/manager/hotel", roles: [ROLES.ADMIN, ROLES.OWNER] },
  { prefix: "/manager/restaurant", roles: [ROLES.ADMIN, ROLES.OWNER] },
];

// Profile/settings are workspace-agnostic and shared by every console role,
// even when the underlying workspace is otherwise restricted to admins.
// Admin settings stay admin-only regardless.
export function allowedRolesFor(path) {
  if (path.endsWith("/settings") || path.endsWith("/profile")) {
    if (path.startsWith("/manager/admin")) return [ROLES.ADMIN];
    return [ROLES.ADMIN, ROLES.OWNER];
  }
  for (const rule of PATH_RULES) {
    if (path.startsWith(rule.prefix)) return rule.roles;
  }
  return [ROLES.ADMIN, ROLES.OWNER];
}

export function canAccess(user, path) {
  return hasAnyRole(user, allowedRolesFor(path));
}