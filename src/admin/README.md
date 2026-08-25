# Admin Dashboard

Separate module for the admin panel. Keeps admin code isolated from the public-facing site.

## Route

All admin routes under `/admin/*` — protected by `ProtectedRoute` with admin role check.

## Structure

```
admin/
├── components/
│   ├── layout/         # AdminSidebar, AdminHeader, AdminLayout
│   ├── common/         # AdminButton, AdminCard, StatusBadge, SearchInput
│   ├── charts/         # StatsChart, BookingChart, RevenueChart
│   ├── tables/         # DataTable, TablePagination, TableFilters
│   ├── forms/          # DestinationForm, CategoryForm, UserForm
│   ├── modals/         # ConfirmModal, DetailModal, ImageUploadModal
│   └── dashboard/      # StatCard, RecentBookings, PopularDestinations
├── pages/
│   ├── DashboardPage.jsx       # Overview with stats & charts
│   ├── DestinationsPage.jsx    # CRUD destinations
│   ├── BookingsPage.jsx        # View/manage all bookings
│   ├── UsersPage.jsx           # View/manage users
│   ├── CategoriesPage.jsx      # Manage destination categories
│   ├── ReviewsPage.jsx         # Moderate reviews
│   ├── SettingsPage.jsx        # Site settings
│   └── LoginPage.jsx           # Admin login
├── hooks/
│   ├── useAdminAuth.js         # Admin auth logic
│   └── useDataTable.js         # Table sorting, filtering, pagination
├── utils/
│   └── adminHelpers.js         # Admin-specific helpers
├── data/
│   └── mockStats.js            # Mock dashboard data
└── README.md
```
