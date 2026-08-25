# Admin Components

## layout/
- `AdminLayout.jsx` - Sidebar + Header + Outlet wrapper
- `AdminSidebar.jsx` - Collapsible navigation sidebar
- `AdminHeader.jsx` - Top bar with user info, notifications

## common/
- `StatusBadge.jsx` - Colored status labels (pending, confirmed, cancelled)
- `AdminCard.jsx` - Dashboard stat card
- `SearchInput.jsx` - Search with debounce
- `EmptyState.jsx` - No data placeholder

## charts/
- `StatsChart.jsx` - Reusable chart wrapper (Chart.js or Recharts)
- `BookingChart.jsx` - Bookings over time
- `RevenueChart.jsx` - Revenue over time

## tables/
- `DataTable.jsx` - Generic sortable/filterable table
- `TablePagination.jsx` - Page controls
- `TableFilters.jsx` - Filter dropdowns

## forms/
- `DestinationForm.jsx` - Add/edit destination
- `CategoryForm.jsx` - Add/edit category
- `UserForm.jsx` - Edit user role/status

## modals/
- `ConfirmModal.jsx` - Delete confirmation
- `DetailModal.jsx` - View details
- `ImageUploadModal.jsx` - Upload/preview images

## dashboard/
- `StatCard.jsx` - Single stat with icon & trend
- `RecentBookings.jsx` - Latest bookings list
- `PopularDestinations.jsx` - Top destinations list
