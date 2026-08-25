# Components

Reusable UI components organized by domain.

## layout/
Global layout components that wrap pages.
- `Navbar.jsx` - Top navigation bar
- `Footer.jsx` - Site footer
- `Sidebar.jsx` - Mobile/sidebar navigation
- `Layout.jsx` - Main layout wrapper (Navbar + Outlet + Footer)

## common/
Shared generic components used across the app.
- `Button.jsx` - Reusable button variants
- `Card.jsx` - Content card
- `Input.jsx` - Form input with label/error
- `Modal.jsx` - Dialog/modal overlay
- `Spinner.jsx` - Loading spinner
- `Alert.jsx` - Alert/notification messages
- `Pagination.jsx` - Page navigation
- `SearchBar.jsx` - Search input
- `Rating.jsx` - Star rating display
- `Breadcrumbs.jsx` - Navigation breadcrumbs

## destination/
Destination-specific components.
- `DestinationCard.jsx` - Destination preview card
- `DestinationGrid.jsx` - Grid of destination cards
- `DestinationFilter.jsx` - Filter sidebar/controls
- `DestinationGallery.jsx` - Image gallery/lightbox

## booking/
Booking-related components.
- `BookingForm.jsx` - Booking reservation form
- `BookingSummary.jsx` - Booking confirmation summary
- `BookingCard.jsx` - Booking list item

## home/
Home page specific components.
- `HeroSection.jsx` - Hero banner with CTA
- `FeaturedDestinations.jsx` - Featured destinations carousel
- `Testimonials.jsx` - Customer reviews
- `Newsletter.jsx` - Email signup section

## auth/
Authentication components.
- `LoginForm.jsx` - Login form
- `RegisterForm.jsx` - Registration form
- `ProtectedRoute.jsx` - Auth guard for routes
