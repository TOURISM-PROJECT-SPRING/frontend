# Owner Dashboard

For tour/package owners to manage their own listings, bookings, earnings, and customers.

## Route

All owner routes under `/owner/*` — protected by `ProtectedRoute` with owner role check.

## Structure

```
owner/
├── components/
│   ├── layout/           # OwnerSidebar, OwnerHeader, OwnerLayout
│   ├── common/           # OwnerCard, StatusBadge, SearchInput, EmptyState
│   ├── charts/           # EarningsChart, BookingTrendChart, OccupancyChart
│   ├── tables/           # BookingTable, PackageTable, CustomerTable
│   ├── forms/            # PackageForm, PricingForm, ScheduleForm
│   ├── modals/           # ConfirmModal, BookingDetailModal, PayoutModal
│   └── overview/         # EarningsSummary, UpcomingBookings, QuickActions
├── pages/
│   ├── OverviewPage.jsx            # Dashboard overview with stats
│   ├── MyPackagesPage.jsx          # Manage own tour packages
│   ├── PackageDetailPage.jsx       # Single package detail/edit
│   ├── BookingsPage.jsx            # View bookings for own packages
│   ├── BookingDetailPage.jsx       # Single booking detail
│   ├── CustomersPage.jsx           # View own customers
│   ├── EarningsPage.jsx            # Revenue & payout history
│   ├── SchedulePage.jsx            # Manage availability/schedules
│   ├── ReviewsPage.jsx             # View & respond to reviews
│   └── ProfilePage.jsx             # Owner profile settings
├── hooks/
│   ├── useOwnerAuth.js             # Owner auth logic
│   ├── useOwnerStats.js            # Fetch owner dashboard stats
│   └── useOwnerBookings.js         # Booking list with filters
├── utils/
│   └── ownerHelpers.js             # Earnings calc, date range helpers
├── data/
│   └── mockOwnerData.js            # Mock data for development
└── README.md
```
