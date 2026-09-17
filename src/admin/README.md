# Admin Dashboard Module

Self-contained admin console for the SovannDomNour platform. Mounted at `/admin/*` and guarded by `ProtectedRoute` with `roles={[ROLES.ADMIN]}`.

## Structure

```
src/admin/
├── AdminDashboard.jsx    # Shell: sidebar + topbar + nested <Routes>
├── index.js              # Barrel export
├── components/
│   ├── AdminSidebar.jsx        # Collapsible navigation sidebar
│   ├── AdminTopbar.jsx         # Search, notifications, profile dropdown
│   ├── AdminKPICards.jsx       # KPI stat cards (from useDashboardData)
│   ├── AdminBookingsChart.jsx  # Bookings-by-type/weekday chart
│   ├── AdminRevenueChart.jsx   # Revenue-by-month chart
│   ├── AdminRecentBookings.jsx # Latest bookings list
│   ├── AdminRecentActivities.jsx
│   ├── AdminTopPlaces.jsx      # Most-booked tourist places
│   ├── AdminSystemStats.jsx    # System-wide counters
│   └── AdminImageField.jsx     # Reusable image upload input
├── hooks/
│   └── useDashboardData.js     # Aggregates dashboard KPIs from 9 services
└── pages/                      # Route-level page components
    └── README.md               # Page inventory
```

## Conventions

- All components are prefixed with `Admin` to avoid collisions with public/owner components.
- Page components are mounted by `AdminDashboard.jsx`; never import `AdminDashboard` from a page.
- Dashboard data is cached in memory for 2 minutes via `useDashboardData` (share a single request across consumers).
- Services live in `src/services/` (e.g. `settingsService`, `profileService`, `managementService`).
- `AdminSettingsPage` persists via `settingsService` (localStorage until a backend settings endpoint exists).
- `AdminProfilePage` reads `GET /management/users/:id` and updates password via `POST /auth/change-password`.
- Unknown `/admin/*` paths hit `AdminNotFoundPage` (404 fallback).

## Navigation

Routes: `/admin`, `/admin/users`, `/admin/owners`, `/admin/places`, `/admin/hotels`, `/admin/rooms`, `/admin/tickets`, `/admin/restaurants`, `/admin/food-orders`, `/admin/packages`, `/admin/bookings`, `/admin/payments`, `/admin/reviews`, `/admin/promotions`, `/admin/notifications`, `/admin/contact-messages`, `/admin/reports`, `/admin/logs`, `/admin/profile`, `/admin/settings`, `/admin/help`.