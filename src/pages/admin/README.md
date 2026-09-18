# Admin Route Pages

Admin route pages rendered inside the `AdminDashboard` layout (sidebar + topbar + nested routes).

- `AdminDashboard.jsx` - Wraps all admin routes; protected by `ProtectedRoute` + `RoleGuard` with `ROLES.ADMIN`
- Each page under this directory maps to a route in `AdminDashboard.jsx` (e.g. `/admin/owners`, `/admin/users`)