// Role-based access control for the management console.
// The console is split into workspaces (tour / hotel / restaurant / admin)
// plus owner-only pages. Access is derived from the user's `roles` array
// (as returned by the backend) and rules defined per path prefix below.

export const ROLES = {
  ADMIN: "ADMIN",
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  USER: "USER",
};

export function hasRole(user, role) {
  return Array.isArray(user?.roles) && user.roles.includes(role);
}

export function hasAnyRole(user, roles = []) {
  return roles.some((role) => hasRole(user, role));
}

// Who may open the management console at all.
export function canUseManager(user) {
  return hasAnyRole(user, [ROLES.ADMIN, ROLES.OWNER]);
}

// The landing page a user should be sent to after signing in (or when they
// revisit a login/register page while already authenticated).
export function homePathFor(user) {
  if (hasRole(user, ROLES.ADMIN)) return "/admin";
  if (hasRole(user, ROLES.OWNER)) return "/owner";
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