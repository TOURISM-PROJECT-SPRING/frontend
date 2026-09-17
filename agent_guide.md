# Agent Guide - Tourism Project (Frontend)

## Project Overview

This is the **Cambodia Tourism Platform frontend** built with **React 19**, **Vite**, and **Tailwind CSS v4**. It serves as a full-featured travel, hospitality, and booking web application tailored for Cambodian tourism (destinations, tours, hotels, and dining), featuring public booking portals, user accounts, an **Admin Management Console**, and an **Owner Management Portal**. It integrates with a Spring Boot REST API companion backend located at `../spring_boot_project_api/` and supports **Bakong KHQR** dynamic payment processing.

---

## Tech Stack & Dependencies

| Category | Package / Tool | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.2.8` | UI library (concurrent features, hooks) |
| **DOM Renderer** | React DOM | `^19.2.8` | React DOM bindings |
| **Build Tool & Server** | Vite | `^8.2.0` | Next-generation bundler & dev server (port 5173) |
| **Routing** | React Router DOM | `^7.18.2` | Client-side routing with nested layout routes |
| **Styling** | Tailwind CSS | `^4.3.3` | Utility-first CSS framework (CSS-first `@theme` configuration) |
| **Tailwind Vite Plugin** | `@tailwindcss/vite` | `^4.3.3` | Native Tailwind v4 Vite compiler integration |
| **Tailwind PostCSS** | `@tailwindcss/postcss` | `^4.3.3` | PostCSS processing pipeline |
| **HTTP Client** | Axios | `^1.20.0` | API requests with JWT interceptor & baseURL proxy |
| **Charts & Visuals** | Recharts | `^3.10.1` | Analytics charts (Revenue, Bookings, Channels) |
| **Iconography** | Lucide React | `^1.34.0` | Clean vector iconography across public and admin interfaces |
| **Internationalization** | i18next & react-i18next | `^26.4.0` / `^17.0.12` | Multi-language support (English & Khmer `km`) |
| **Linter** | Oxlint | `^1.75.0` | High-performance linter enforcing React rules |

---

## How to Run & Environment Setup

### Commands

```bash
# Navigate to frontend root
cd tourism-frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173 with proxy to backend)
npm run dev

# Run Oxlint for code quality & React rules check
npm run lint

# Build production bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

### Environment & Proxy Configuration

- **Vite Proxy (`vite.config.js`)**:
  Proxy configured for `^/api/` forwarding to `http://localhost:8080` (Spring Boot backend).
- **Base URL (`src/api/axiosClient.js`)**:
  Uses `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'` with a default 15s timeout.
- **JWT Storage**:
  Stored in `localStorage` key `"token"`. Attached automatically via Axios request interceptor: `Authorization: Bearer <token>`.

---

## Current Project State

| Area | Status | Notes |
|---|---|---|
| **Public Landing & Exploration** | ✅ Implemented | Hero, SearchPanel, CulturalSection, KhmerFood, PopularDestinations, PopularExperiences, RelatedStories |
| **Hotel Module** | ✅ Implemented | `HotelsPage`, `HotelDetailPage` with 20 sub-components (gallery, booking widget, interactive map, reviews) |
| **Tour Module** | ✅ Implemented | `ToursPage`, `TourDetailPage`, `TourPlaceDetailPage`, Tour cards, and detail modals |
| **Dining / Restaurant Module** | ✅ Implemented | `DiningPage`, `RestaurantDetailPage`, Khmer food showcases |
| **Authentication Flow** | ✅ Implemented | `AuthPage`, `LoginPage` (login, register, demo fallback mode for offline backend) |
| **User Profile & Trips** | ✅ Implemented | `ProfilePage`, global `MyTrips` slide-out favorites drawer |
| **Checkout & Payments** | ✅ Implemented | `CheckoutPage`, `BakongKhqrPaymentModal` (Bakong KHQR dynamic QR generation & verification) |
| **Admin Dashboard** | ✅ Implemented | `AdminDashboard` shell + 20 management pages (`/admin/*`) with KPI cards, charts, and table views |
| **Owner Dashboard** | ✅ Implemented | `OwnerDashboard` shell + 13 management pages (`/owner/*`) with analytics, listings, bookings, and payouts |
| **Internationalization (i18n)** | ✅ Implemented | Khmer (`km`) and English (`en`) locale dictionaries in `src/i18n/locales/` |
| **State Management** | ✅ Implemented | Context-based (`AuthContext`, `FavoritesContext`, `ThemeContext`) + custom hooks |
| **API Services Layer** | ✅ Implemented | 33 dedicated service modules in `src/services/` connecting to REST endpoints |

---

## Architecture & Design System

### 1. Theming & Tailwind CSS v4 System (`src/index.css`)

The project adopts a rich Cambodian aesthetic with customized tokens:

- **Brand Green (Primary)**:
  - `--color-brand-50` (`#eef5f1`) to `--color-brand-950` (`#00150e`)
  - Primary anchor: `--color-brand-700` (`#02462e`)
- **Khmer Gold (Accent)**:
  - `--color-gold-50` (`#fffbe6`) to `--color-gold-700` (`#8f6a00`)
  - Vibrant accent: `--color-gold-400` (`#fec700`)
- **Surface & Ink Tokens**:
  - Light mode: `--color-canvas: #f8faf8`, `--color-card: #ffffff`, `--color-ink: #14201a`, `--color-muted: #68736d`, `--color-line: #e5eae7`
  - Dark mode (`.dark`): `--color-canvas: #09120e`, `--color-card: #13241c`, `--color-ink: #f0f7f3`, `--color-muted: #8ea398`, `--color-line: #1d3429`
- **Typography**:
  - Display: `DM Sans`, `Kantumruy Pro`, `Noto Sans Khmer`
  - Khmer text styling: `font-khmer` class (`Kantumruy Pro`, `Noto Serif Khmer`)
- **Dark Mode**:
  - Class-based dark mode configured via `@custom-variant dark (&:where(.dark, .dark *));`

### 2. State Management Architecture

Instead of heavy external boilerplate, the application relies on focused React Contexts and hooks:

1. **`AuthContext.jsx`**:
   - Stores `user` and `token` (`localStorage.getItem("token")`).
   - Supports backend JWT login/register as well as graceful **demo fallbacks** (`DEMO_USER`) when backend is offline or during mock presentations.
2. **`FavoritesContext.jsx`**:
   - Manages trip wishlists and favorites across hotels, tours, and destinations.
   - Synchronized with `MyTrips` global drawer and navbar quick access.
3. **`ThemeContext.jsx`**:
   - Toggles light and dark modes, synchronizing the `.dark` root class and user preferences.
4. **Custom Data Hooks**:
   - `useDashboardData`: Fetches aggregated metrics for admin and manager screens with partial failure resilience.
   - `useTourPlaces`: Handles tour place search, district filtering, and category selection.
   - `useResource`: Generic data-fetching hook with loading and error states.

### 3. Role-Based Access Control (RBAC) (`src/utils/rbac.js`)

User permissions are evaluated using the user's `roles` array:

- **Roles**:
  - `ROLES.ADMIN`: Full access to `/admin/*` and administrative data.
  - `ROLES.OWNER`: Access to `/owner/*` for managing registered properties, packages, and earnings.
  - `ROLES.MANAGER`: Access to operational management views.
  - `ROLES.USER`: Standard traveler account (browsing, booking, profile, reviews).
- **Protection**:
  - `ProtectedRoute.jsx`: Enforces authentication and redirects unauthenticated visitors to `/login`.

---

## Directory Structure

```
tourism-frontend/
├── index.html                           # Vite SPA entry point
├── package.json                         # Dependencies & scripts
├── postcss.config.js                    # PostCSS config (Tailwind v4 integration)
├── vite.config.js                       # Vite config (proxy, port 5173, React plugin)
├── .oxlintrc.json                       # Linter config
├── agent_guide.md                       # This file
│
├── public/
│   ├── favicon.svg                      # App favicon
│   └── icons.svg                        # SVG sprite assets
│
└── src/
    ├── main.jsx                         # App bootstrap (StrictMode, Router, Providers)
    ├── App.jsx                          # Top-level routing (PublicLayout, Admin, Owner)
    ├── index.css                        # Tailwind v4 `@theme`, color palette & typography
    │
    ├── api/
    │   └── axiosClient.js               # Axios instance with baseURL and auth interceptor
    │
    ├── assets/                          # Static assets and images
    │
    ├── components/
    │   ├── admin/                       # Admin dashboard UI widgets
    │   │   ├── AdminSidebar.jsx         # Collapsible admin navigation
    │   │   ├── AdminTopbar.jsx          # Admin user header & quick notifications
    │   │   ├── AdminKPICards.jsx        # Metrics summary cards
    │   │   ├── AdminBookingsChart.jsx   # Booking trend visualizations
    │   │   ├── AdminRevenueChart.jsx    # Revenue analytics chart
    │   │   ├── AdminRecentBookings.jsx  # Recent reservations table
    │   │   ├── AdminTopPlaces.jsx       # High-performing tourist spots
    │   │   ├── AdminSystemStats.jsx     # System health and server metrics
    │   │   └── AdminRecentActivities.jsx# Audit log timeline
    │   │
    │   ├── dashboard/                   # Owner dashboard UI widgets
    │   │   ├── Sidebar.jsx              # Owner navigation sidebar
    │   │   ├── Topbar.jsx               # Owner topbar
    │   │   ├── KPICards.jsx             # Owner earnings & occupancy KPIs
    │   │   ├── RevenueChart.jsx         # Revenue timeline
    │   │   ├── BookingsChannelChart.jsx # Direct vs OTA booking source chart
    │   │   ├── RecentBookingsTable.jsx  # Owner booking table
    │   │   ├── TopPropertiesTable.jsx   # Top listing performance
    │   │   ├── PropertyForm.jsx         # Property creation/editing form
    │   │   ├── QuickActions.jsx         # Fast action triggers
    │   │   └── InsightsCards.jsx        # Performance tips & insights
    │   │
    │   ├── explore/                     # Explore & booking widgets
    │   │   ├── HotelCard.jsx            # Hotel presentation card
    │   │   ├── TourCard.jsx             # Tour listing card
    │   │   ├── ProvinceSidebar.jsx      # Cambodian province selector
    │   │   ├── HotelDetailModal.jsx     # Quick hotel modal
    │   │   ├── TourDetailModal.jsx      # Quick tour modal
    │   │   ├── TripCart.jsx             # Booking cart panel
    │   │   ├── MyTrips.jsx              # Favorites slide-over drawer
    │   │   └── GuideInfo.jsx            # Local guide profile snippet
    │   │
    │   ├── hotels/                      # Hotel browsing & detailed view
    │   │   ├── HotelSearchBar.jsx       # Destination, dates, guest filter bar
    │   │   ├── FilterSidebar.jsx        # Price, amenities, stars filter
    │   │   ├── HotelListingCard.jsx     # List card with ratings & pricing
    │   │   └── detail/                  # 20 detailed hotel components
    │   │       ├── HotelHeader.jsx      # Title, badges, address
    │   │       ├── HotelGallery.jsx     # Photo showcase grid
    │   │       ├── DateGuestSelector.jsx# Interactive reservation selector
    │   │       ├── MapCard.jsx          # Location & nearby highlights
    │   │       ├── StickyBookingBar.jsx # Sticky mobile booking bar
    │   │       ├── ReviewModal.jsx      # User review submission modal
    │   │       └── ...                  # (AboutSection, RatingBar, etc.)
    │   │
    │   ├── home/                        # Landing page sections
    │   │   ├── Hero.jsx                 # Search banner & dynamic background
    │   │   ├── SearchPanel.jsx          # Multi-tab search (Stays, Tours, Food)
    │   │   ├── CulturalSection.jsx      # Cambodian cultural heritage showcase
    │   │   ├── KhmerFood.jsx            # Authentic food & gastronomy
    │   │   ├── PopularDestinations.jsx  # Siem Reap, Phnom Penh, coastal gems
    │   │   ├── PopularExperiences.jsx   # Curated cultural excursions
    │   │   ├── EssentialCambodia.jsx    # Practical travel tips
    │   │   └── FinalCta.jsx             # Call-to-action banner
    │   │
    │   ├── checkout/                    # Booking checkout steps
    │   │   ├── ActivityDetailsCard.jsx  # Selected experience/room details
    │   │   ├── ContactDetailsCard.jsx   # Guest contact information
    │   │   ├── PaymentDetailsCard.jsx   # Payment method selector
    │   │   └── BookingSummary.jsx       # Price breakdown, taxes, total
    │   │
    │   ├── payment/                     # Payment processing components
    │   │   └── BakongKhqrPaymentModal.jsx # Dynamic KHQR modal with status polling
    │   │
    │   ├── layout/                      # Global public layout
    │   │   ├── Navbar.jsx               # Navigation, language switcher, auth buttons
    │   │   ├── Footer.jsx               # Multi-column footer & newsletter signup
    │   │   └── ProtectedRoute.jsx       # Route guard for authenticated areas
    │   │
    │   ├── auth/                        # Auth forms
    │   │   ├── LoginForm.jsx            # Sign-in form
    │   │   └── RegisterForm.jsx         # Sign-up form
    │   │
    │   └── ui/                          # Reusable UI primitives
    │       ├── Button.jsx, Modal.jsx, Toast.jsx, Rating.jsx, StatusBadge.jsx,
    │       ├── ThemeToggle.jsx, LanguageSwitcher.jsx, SmartImage.jsx, Icon.jsx
    │
    ├── context/                         # React contexts
    │   ├── AuthContext.jsx              # JWT auth state & demo accounts
    │   ├── FavoritesContext.jsx         # Saved destinations & trips
    │   └── ThemeContext.jsx             # Light/dark theme toggle
    │
    ├── hooks/                           # Custom React hooks
    │   ├── useDashboardData.js          # Aggregated dashboard metrics fetcher
    │   ├── useTourPlaces.js             # Tour places search & filters
    │   └── useResource.js               # Generic resource CRUD hook
    │
    ├── i18n/                            # Localization
    │   ├── i18n.js                      # i18next configuration
    │   └── locales/
    │       ├── en.json                  # English translations
    │       └── km.json                  # Khmer translations
    │
    ├── lib/                             # Core utilities & domain logic
    │   ├── cartBooking.js               # Cart calculation logic
    │   ├── explore.js                   # Explore filters & categories
    │   └── format.js                    # Currency ($ USD / ៛ KHR) & date formatters
    │
    ├── pages/                           # Application route pages
    │   ├── HomePage.jsx                 # Public landing page
    │   ├── DestinationsPage.jsx         # Destinations catalog
    │   ├── HotelsPage.jsx               # Hotel listings with filters
    │   ├── HotelDetailPage.jsx          # Comprehensive hotel detail page
    │   ├── ToursPage.jsx                # Tour listings
    │   ├── TourDetailPage.jsx           # Tour detail & package booking
    │   ├── TourPlaceDetailPage.jsx      # Individual place/attraction details
    │   ├── DiningPage.jsx               # Restaurants and food listings
    │   ├── RestaurantDetailPage.jsx     # Restaurant menu & detail
    │   ├── AboutCambodiaPage.jsx        # History, culture, travel advice
    │   ├── AboutPage.jsx                # Company information
    │   ├── ContactPage.jsx              # Contact & support form
    │   ├── OffersPage.jsx               # Special promotions & discounts
    │   ├── FeaturedExperiencesPage.jsx  # Curated experiences
    │   ├── LoginPage.jsx / AuthPage.jsx # Authentication screens
    │   ├── CheckoutPage.jsx             # Checkout & order processing
    │   ├── ProfilePage.jsx              # User profile & booking history
    │   │
    │   ├── AdminDashboard.jsx           # Admin console layout wrapper
    │   ├── admin/                       # Admin console pages (20 pages)
    │   │   ├── AdminUsersPage.jsx       # User accounts management
    │   │   ├── AdminOwnersPage.jsx      # Business owners directory
    │   │   ├── AdminPlacesPage.jsx      # Destination & attraction CRUD
    │   │   ├── AdminHotelsPage.jsx      # Hotel property management
    │   │   ├── AdminRoomsPage.jsx       # Room inventory
    │   │   ├── AdminTicketsPage.jsx     # Attraction tickets
    │   │   ├── AdminRestaurantsPage.jsx # Restaurant listings
    │   │   ├── AdminFoodOrdersPage.jsx  # Dining orders
    │   │   ├── AdminPackagesPage.jsx    # Tour package configurations
    │   │   ├── AdminBookingsPage.jsx    # System-wide reservations
    │   │   ├── AdminPaymentsPage.jsx    # Payment ledger & transactions
    │   │   ├── AdminReviewsPage.jsx     # Moderation of reviews
    │   │   ├── AdminPromotionsPage.jsx  # Site promotions & coupons
    │   │   ├── AdminNotificationsPage.jsx # Broadcast notifications
    │   │   ├── AdminReportsPage.jsx     # Exportable analytics reports
    │   │   ├── AdminLogsPage.jsx        # System audit logs
    │   │   ├── AdminSettingsPage.jsx    # Global platform settings
    │   │   ├── AdminProfilePage.jsx     # Admin profile
    │   │   └── AdminContactMessagesPage.jsx # Inquiries from contact page
    │   │
    │   ├── OwnerDashboard.jsx           # Owner console layout wrapper
    │   └── owner/                       # Owner console pages (13 pages)
    │       ├── PropertiesPage.jsx       # Owner property listings
    │       ├── BookingsPage.jsx         # Bookings for owner properties
    │       ├── PackagesPage.jsx         # Custom tour packages
    │       ├── PricingPage.jsx          # Seasonal pricing & discounts
    │       ├── ReviewsPage.jsx          # Guest review responses
    │       ├── PromotionsPage.jsx       # Owner-specific deals
    │       ├── ReportsPage.jsx          # Revenue & occupancy reports
    │       ├── InsightsPage.jsx         # Business analytics & tips
    │       ├── PayoutsPage.jsx          # Bank/Bakong payout history
    │       ├── SettingsPage.jsx         # Business settings
    │       ├── TeamPage.jsx             # Staff management
    │       ├── HelpPage.jsx             # Partner support
    │       └── OwnerProfilePage.jsx     # Owner account & contact info
    │
    ├── services/                        # Business logic & API clients (33 services)
    │   ├── index.js                     # Centralized service barrel export
    │   ├── authService.js               # Login, register, logout, password resets
    │   ├── bakongService.js             # Bakong KHQR dynamic QR & status checks
    │   ├── tourPlaceService.js          # Tour places CRUD & image attachments
    │   ├── hotelService.js              # Hotel property CRUD
    │   ├── hotelRoomService.js          # Hotel room associations
    │   ├── roomBookingService.js        # Room reservation workflows
    │   ├── ticketBookingService.js      # Attraction ticket bookings
    │   ├── restaurantService.js         # Restaurants management
    │   ├── foodService.js               # Restaurant menus & food items
    │   ├── orderService.js              # Dining order management
    │   ├── cartService.js               # Local & remote cart persistence
    │   ├── paymentService.js            # General payment records
    │   ├── promotionService.js          # Deals & promo codes
    │   ├── provinceService.js           # Cambodian province data
    │   ├── districtService.js           # District hierarchical data
    │   ├── contactService.js            # Contact message delivery
    │   ├── managementService.js         # Unified management endpoints
    │   └── ... (Attachment services for hotels, rooms, food, places, users)
    │
    └── utils/
        ├── rbac.js                      # Role checks (hasRole, canAccess, allowedRoles)
        └── helpers.js                   # Date, format, and helper utilities
```

---

## Route Structure

### 1. Public Routes (`src/App.jsx`)

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Hero, search panel, cultural spots, featured destinations |
| `/hotel` | `HotelsPage` | Search, filter, and browse hotels |
| `/hotels/:id` | `HotelDetailPage` | Full hotel profile, room selection, reviews, map |
| `/tour` | `ToursPage` | Tour catalog across Cambodia |
| `/tours/:id` | `TourDetailPage` | Tour details, itinerary, ticket booking |
| `/restaurant` | `DiningPage` | Cambodian dining & cuisine directory |
| `/restaurants/:id` | `RestaurantDetailPage`| Restaurant menu, hours, and reservation |
| `/about-cambodia`| `AboutCambodiaPage` | Cultural guide, history, regions |
| `/about` | `AboutPage` | About the platform and mission |
| `/contact` | `ContactPage` | Contact inquiries |
| `/offers` | `OffersPage` | Special promotions and holiday deals |
| `/checkout` | `CheckoutPage` | Guest details, order review, payment modal trigger |
| `/profile` | `ProfilePage` | User profile & booking history (*Protected*) |
| `/login` | `LoginPage (mode="login")` | User sign-in |
| `/register` | `LoginPage (mode="register")`| User sign-up |

### 2. Admin Management Console (`/admin/*`)

Accessible to users with the `ADMIN` role. Features a collapsible sidebar, breadcrumbs, search, and data tables:

- `/admin` → Overview with KPI cards, revenue charts, booking activity, top places.
- `/admin/users` → User directory and permission grants.
- `/admin/owners` → Registered business owners and approval workflows.
- `/admin/places` → Tourist attraction and place management.
- `/admin/hotels` & `/admin/rooms` → Accommodation listings and room types.
- `/admin/tickets` → Ticket pricing, quotas, and validation.
- `/admin/restaurants` & `/admin/food-orders` → Dining partners and active food orders.
- `/admin/packages` → Multi-day and themed travel packages.
- `/admin/bookings` → System-wide booking records.
- `/admin/payments` → Transactions, gateway status, and reconciliations.
- `/admin/reviews` → Moderation of customer feedback.
- `/admin/promotions` → Global discount codes and campaigns.
- `/admin/notifications` → Broadcast alerts to users and partners.
- `/admin/reports` → Comprehensive financial and operational exports.
- `/admin/logs` → Security and system audit trail.
- `/admin/settings` → System configuration parameters.
- `/admin/profile` → Admin profile and credentials.

### 3. Owner Management Portal (`/owner/*`)

Accessible to users with the `OWNER` role (e.g. hotel operators, tour organizers):

- `/owner` → Operational overview (earnings, upcoming bookings, occupancy trends).
- `/owner/properties` → Manage own hotel or attraction listings.
- `/owner/bookings` → Reservations made for owner-managed properties.
- `/owner/packages` → Create and edit custom packages.
- `/owner/pricing` → Set seasonal pricing, weekend surges, and discounts.
- `/owner/reviews` → View and reply to customer reviews.
- `/owner/promotions` → Launch special owner discounts.
- `/owner/reports` & `/owner/insights` → Revenue breakdown and booking trends.
- `/owner/payouts` → Payout history and Bakong settlement status.
- `/owner/settings` & `/owner/team` → Business profile and staff permissions.
- `/owner/profile` → Business owner contact and credential management.

---

## Services & Payment Integration

### Bakong KHQR Integration (`src/services/bakongService.js`)

The application includes first-class support for **National Bank of Cambodia's Bakong KHQR**:

1. **QR Generation**:
   `bakongService.generateQr({ bookingId, bookingType, amount, currency, description, customerPhone })` calls `/v1/bakong/generate-qr`.
   Returns `qrString`, `qrImage` (base64 / URL), `md5` transaction hash, and `expiresAt`.
2. **Payment Modal (`src/components/payment/BakongKhqrPaymentModal.jsx`)**:
   Renders the generated KHQR, countdown timer, and continuously polls payment status via:
   `bakongService.checkStatus({ md5, bookingId, bookingType })` calling `/v1/bakong/check-status`.
3. **Sandbox Testing**:
   Supports simulation in development to approve payments instantly without live banking requests.

### Backend Companion API Overview

- **Location**: `../spring_boot_project_api/`
- **Stack**: Java 21, Spring Boot 4.x, Spring Data JPA, MySQL, SpringDoc OpenAPI.
- **Documentation**: Swagger UI accessible at `http://localhost:8080/swagger-ui.html`.
- **API Conventions**:
  - DTOs for all requests and responses (no raw entity exposure).
  - Jakarta Bean Validation on request payloads.
  - Consistent REST URLs (e.g., `/api/tour-places`, `/api/hotels`, `/api/bookings`, `/api/v1/bakong/*`).

---

## Code Style & Development Conventions

1. **Component Naming**:
   - PascalCase for React component files (`HotelCard.jsx`, `AdminSidebar.jsx`).
   - Suffix pages with `Page` (`HomePage.jsx`, `TourDetailPage.jsx`).
   - Domain sub-folders under `components/` for specialized domains (`hotels/`, `explore/`, `admin/`, `dashboard/`, `home/`).
2. **Imports**:
   - Explicit ES module imports.
   - Use Lucide icons: `import { MapPin, Calendar, Heart } from 'lucide-react'`.
3. **Styling & Colors**:
   - Always use CSS variables and Tailwind v4 classes: `text-brand-700`, `bg-gold-400`, `bg-canvas`, `text-ink`.
   - Dark mode variants must be supported for both backgrounds and text: `bg-white dark:bg-gray-900 text-gray-900 dark:text-white`.
4. **State & Effects**:
   - Keep state local where possible; use Context (`useAuth()`, `useFavorites()`, `useTheme()`) for cross-cutting state.
   - Guard against missing data with optional chaining (`item?.title`) and fallback arrays (`data || []`).
