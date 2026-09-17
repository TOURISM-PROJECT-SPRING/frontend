# Admin Route Pages

Route-level page components for the admin dashboard, mounted inside the nested `<Routes>` in `src/admin/AdminDashboard.jsx`.

| File | Purpose |
|---|---|
| `AdminUsersPage.jsx` | List all users with role/status filters and a detail modal |
| `AdminOwnersPage.jsx` | List owners / businesses |
| `AdminPlacesPage.jsx` | CRUD for tourist places (with image upload) |
| `AdminHotelsPage.jsx` | CRUD for hotels (with image upload) |
| `AdminRoomsPage.jsx` | CRUD for rooms linked to hotels & room types |
| `AdminTicketsPage.jsx` | CRUD for tickets linked to tourist places |
| `AdminRestaurantsPage.jsx` | CRUD for restaurants (with image upload) |
| `AdminFoodOrdersPage.jsx` | List food orders |
| `AdminPackagesPage.jsx` | List tour packages |
| `AdminBookingsPage.jsx` | Booking list grouped by type (Room / Ticket / Food) |
| `AdminPaymentsPage.jsx` | List payments |
| `AdminReviewsPage.jsx` | List and moderate reviews |
| `AdminPromotionsPage.jsx` | List promotions |
| `AdminNotificationsPage.jsx` | List notifications |
| `AdminContactMessagesPage.jsx` | List contact messages |
| `AdminReportsPage.jsx` | KPIs and revenue breakdown |
| `AdminLogsPage.jsx` | System logs |
| `AdminSettingsPage.jsx` | Site-wide settings (persisted via `settingsService`) |
| `AdminProfilePage.jsx` | Profile + password change (via `profileService`) |
| `AdminPlaceholderPage.jsx` | Generic "under construction" fallback (used by Help Center) |
| `AdminNotFoundPage.jsx` | 404 fallback for unknown `/admin/*` routes |

Routing is eager (not lazy-loaded). The shell and layout logic live in `src/admin/AdminDashboard.jsx`, with `AdminSidebar` / `AdminTopbar` in `src/admin/components/`.