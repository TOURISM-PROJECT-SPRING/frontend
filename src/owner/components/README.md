# Owner Components

## layout/
- `OwnerLayout.jsx` - Sidebar + Header + Outlet wrapper
- `OwnerSidebar.jsx` - Navigation sidebar for owner panel
- `OwnerHeader.jsx` - Top bar with owner info, notifications

## common/
- `OwnerCard.jsx` - Stat card with owner-specific styling
- `StatusBadge.jsx` - Booking status labels (pending, confirmed, completed, cancelled)
- `SearchInput.jsx` - Search with debounce
- `EmptyState.jsx` - No data placeholder
- `DateRangePicker.jsx` - Date range selection

## charts/
- `EarningsChart.jsx` - Earnings over time (daily/weekly/monthly)
- `BookingTrendChart.jsx` - Booking volume trend
- `OccupancyChart.jsx` - Package occupancy rate

## tables/
- `BookingTable.jsx` - Bookings list with status, customer, dates
- `PackageTable.jsx` - Packages list with price, status, bookings count
- `CustomerTable.jsx` - Customer list with contact info, total bookings

## forms/
- `PackageForm.jsx` - Create/edit tour package (name, description, price, images)
- `PricingForm.jsx` - Set pricing tiers, seasonal rates, discounts
- `ScheduleForm.jsx` - Set available dates, capacity, cutoff times

## modals/
- `ConfirmModal.jsx` - Action confirmation (delete, cancel booking)
- `BookingDetailModal.jsx` - View full booking details
- `PayoutModal.jsx` - Request/view payout details

## overview/
- `EarningsSummary.jsx` - Total/pending/paid earnings cards
- `UpcomingBookings.jsx` - Next 5 upcoming bookings
- `QuickActions.jsx` - Shortcut buttons (add package, view bookings)
