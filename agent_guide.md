# Agent Guide - Tourism Project (Frontend)

## Project Overview

This is a **tourism website frontend** built with React 19 and Tailwind CSS v4, designed to connect with a Spring Boot REST API backend located at `../spring_boot_project_api/`.

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.8 | UI framework |
| Vite | 8.2.0 | Build tool & dev server |
| Tailwind CSS | 4.3.3 | Utility-first CSS framework |
| @tailwindcss/postcss | 4.3.3 | Tailwind integration via PostCSS |
| PostCSS | 8.5.26 | CSS processing |
| Oxlint | 1.75.0 | Linter (React hooks rules) |

## How to Run

```bash
cd frontend-tourism-project
npm install
npm run dev        # Dev server at http://localhost:5174
npm run build      # Production build to dist/
npm run lint       # Run oxlint
npm run preview    # Preview production build
```

## Directory Structure

```
tourism-frontend/
├── index.html                      # Vite SPA entry point
├── package.json                    # Dependencies & scripts
├── postcss.config.js               # PostCSS config (Tailwind v4 plugin)
├── vite.config.js                  # Vite config (React plugin)
├── .oxlintrc.json                  # Linter config
├── agent_guide.md                  # This file
├── public/
│   ├── favicon.svg                 # App icon
│   └── icons.svg                   # SVG sprite
├── src/
│   ├── main.jsx                    # JS entry - renders <App />, imports index.css
│   ├── index.css                   # @import "tailwindcss" (Tailwind v4 entry)
│   ├── App.jsx                     # Root component - routing will be added here
│   ├── App.css                     # Component-level styles
│   │
│   ├── api/                        # HTTP client & API endpoint functions
│   │   ├── axios.js                # Axios instance with interceptors, base URL
│   │   ├── endpoints.js            # API endpoint constants
│   │   ├── destinations.js         # Destination API calls
│   │   ├── bookings.js             # Booking API calls
│   │   ├── auth.js                 # Authentication API calls
│   │   └── users.js                # User API calls
│   │
│   ├── assets/                     # Static assets
│   │   ├── hero.png                # Hero image
│   │   ├── react.svg               # React logo
│   │   ├── vite.svg                # Vite logo
│   │   ├── images/                 # Additional images
│   │   └── icons/                  # SVG icons
│   │
│   ├── components/                 # Reusable UI components (public-facing)
│   │   ├── layout/                 # Global layout: Navbar, Footer, Sidebar, Layout wrapper
│   │   ├── common/                 # Shared: Button, Card, Input, Modal, Spinner, Alert, Pagination
│   │   ├── home/                   # Home page: HeroSection, FeaturedDestinations, Testimonials
│   │   ├── destination/            # Destination: DestinationCard, DestinationGrid, Filter, Gallery
│   │   ├── booking/                # Booking: BookingForm, BookingSummary, BookingCard
│   │   ├── auth/                   # Auth: LoginForm, RegisterForm, ProtectedRoute
│   │   ├── about/                  # About page components
│   │   └── contact/                # Contact page components
│   │
│   ├── constants/                  # App-wide constants
│   │   ├── routes.js               # Route path constants
│   │   ├── api.js                  # API base URL, timeout
│   │   └── config.js               # App config (pagination limits, etc.)
│   │
│   ├── context/                    # React Context providers
│   │   ├── AuthContext.jsx         # Auth state + provider
│   │   └── ThemeContext.jsx        # Dark/light theme toggle
│   │
│   ├── data/                       # Static & mock data
│   │   ├── destinations.js         # Mock destination data
│   │   ├── testimonials.js         # Mock reviews
│   │   └── faq.js                  # FAQ content
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.js              # Auth convenience hook
│   │   ├── useFetch.js             # Generic data fetching with loading/error
│   │   ├── useDebounce.js          # Debounce value for search
│   │   ├── useLocalStorage.js      # Persist state to localStorage
│   │   └── usePagination.js        # Pagination state
│   │
│   ├── pages/                      # Route-level page components
│   │   ├── HomePage.jsx            # Landing: hero, featured destinations
│   │   ├── DestinationsPage.jsx    # Browse all destinations
│   │   ├── DestinationDetailPage.jsx # Single destination detail
│   │   ├── BookingPage.jsx         # Booking form/checkout
│   │   ├── MyBookingsPage.jsx      # User's booking history
│   │   ├── AboutPage.jsx           # About the company
│   │   ├── ContactPage.jsx         # Contact form
│   │   ├── LoginPage.jsx           # User login
│   │   ├── RegisterPage.jsx        # User registration
│   │   ├── NotFoundPage.jsx        # 404 page
│   │   └── owner/                  # Owner route entry point
│   │       └── OwnerDashboardPage.jsx # Owner dashboard shell
│   │
│   ├── services/                   # Business logic layer (calls api/, used by components)
│   │   ├── destinationService.js   # Destination business logic
│   │   ├── bookingService.js       # Booking business logic
│   │   ├── authService.js          # Login, register, logout
│   │   └── userService.js          # User profile logic
│   │
│   ├── store/                      # Redux Toolkit state management
│   │   ├── store.js                # Configured Redux store
│   │   └── slices/
│   │       ├── authSlice.js        # Authentication state
│   │       ├── destinationSlice.js # Destinations state
│   │       ├── bookingSlice.js     # Bookings state
│   │       └── uiSlice.js          # UI state (modals, sidebar, theme)
│   │
│   ├── types/                      # JSDoc type definitions (if needed)
│   │
│   ├── utils/                      # Pure helper functions
│   │   ├── formatters.js           # Date, currency, number formatters
│   │   ├── validators.js           # Form validation helpers
│   │   └── helpers.js              # General utilities
│   │
│   ├── admin/                      # ===== ADMIN DASHBOARD MODULE =====
│   │   ├── AdminDashboard.jsx      # Shell: sidebar + topbar + nested routes
│   │   ├── index.js                # Barrel export
│   │   ├── components/             # Admin-prefixed components
│   │   │   ├── AdminSidebar.jsx        # Collapsible navigation
│   │   │   ├── AdminTopbar.jsx         # Search, notifications, profile dropdown
│   │   │   ├── AdminKPICards.jsx       # KPI stat cards
│   │   │   ├── AdminBookingsChart.jsx  # Bookings-by-type/weekday chart
│   │   │   ├── AdminRevenueChart.jsx   # Revenue-by-month chart
│   │   │   ├── AdminRecentBookings.jsx # Latest bookings
│   │   │   ├── AdminRecentActivities.jsx
│   │   │   ├── AdminTopPlaces.jsx      # Most-booked tourist places
│   │   │   ├── AdminSystemStats.jsx    # System-wide counters
│   │   │   └── AdminImageField.jsx     # Image upload input
│   │   ├── hooks/
│   │   │   └── useDashboardData.js     # Aggregates dashboard KPIs (2-min cache)
│   │   └── pages/                  # Admin route pages (eager, nested routes)
│   │       ├── AdminUsersPage.jsx       # Users list + detail modal
│   │       ├── AdminOwnersPage.jsx      # Owners / businesses
│   │       ├── AdminPlacesPage.jsx      # CRUD tourist places
│   │       ├── AdminHotelsPage.jsx      # CRUD hotels
│   │       ├── AdminRoomsPage.jsx       # CRUD rooms
│   │       ├── AdminTicketsPage.jsx     # CRUD tickets
│   │       ├── AdminRestaurantsPage.jsx # CRUD restaurants
│   │       ├── AdminFoodOrdersPage.jsx  # Food orders
│   │       ├── AdminPackagesPage.jsx    # Tour packages
│   │       ├── AdminBookingsPage.jsx    # Bookings by type
│   │       ├── AdminPaymentsPage.jsx    # Payments
│   │       ├── AdminReviewsPage.jsx     # Moderate reviews
│   │       ├── AdminPromotionsPage.jsx  # Promotions
│   │       ├── AdminNotificationsPage.jsx
│   │       ├── AdminContactMessagesPage.jsx
│   │       ├── AdminReportsPage.jsx     # KPIs & revenue breakdown
│   │       ├── AdminLogsPage.jsx        # System logs
│   │       ├── AdminSettingsPage.jsx    # Site settings (settingsService)
│   │       ├── AdminProfilePage.jsx     # Profile + password (profileService)
│   │       ├── AdminPlaceholderPage.jsx # "Under construction" fallback
│   │       └── AdminNotFoundPage.jsx    # 404 fallback for /admin/*
│   │
│   └── owner/                      # ===== OWNER DASHBOARD =====
│       └── (OwnerDashboardPage in src/pages/owner/)
│
├── dist/                           # Production build output
└── .gitignore
```

## Backend Companion (Spring Boot API)

Located at `../spring_boot_project_api/`. Read `../spring_boot_project_api/agent_guide_ai.md` for full backend conventions.

| Aspect | Value |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 4.0.8-SNAPSHOT |
| Build | Maven (`./mvnw`) |
| Database | MySQL (configured via `application.properties`) |
| ORM | Spring Data JPA |
| Validation | Jakarta Bean Validation |
| API Docs | SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`) |
| Lombok | Yes (constructor injection) |

### Backend Layered Architecture

```
controller/  →  service/ (interface)  →  service/impl/  →  repository/  →  model/ (Entity)
      ↓                                        ↓
dto/request/                              mapper/  ↔  dto/response/
      ↓
exception/
```

### Backend Conventions (must follow)

1. **Never expose JPA entities directly** in API responses — always use DTOs + mappers
2. **Constructor injection** only (no `@Autowired` field injection)
3. **Lombok annotations**: `@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`
4. **Jakarta Bean Validation** on all request DTOs (`@NotNull`, `@NotBlank`, `@Size`, etc.)
5. **Service pattern**: interface in `service/`, implementation in `service/impl/`
6. **Package structure**: `com.example.spring_boot_project_api.*`

## Current State

The app is substantially built. Public pages, auth, layout, the admin dashboard, and API/services layers are implemented:

| Area | Status |
|---|---|
| Folder structure | ✅ Complete |
| Documentation | ✅ Complete — READMEs updated to match code |
| Routing | ✅ `react-router-dom` v7 with public + `/admin/*` routes |
| API client | ✅ Axios instance with token interceptor (`src/api/axiosClient.js`) |
| State management | ✅ React Context (`AuthContext`) + hooks (no Redux) |
| Layout components | ✅ Navbar, Footer, ProtectedRoute |
| Admin dashboard | ✅ Full module in `src/admin/` — 20+ pages, shell, charts, RBAC |
| Owner dashboard | 🟡 Minimal — `OwnerDashboardPage` in `src/pages/owner/` |
| Backend | ✅ companion Spring Boot API in `../spring_boot_project_api/` |

Admin dashboard specifics:
- Shell + layout: `src/admin/AdminDashboard.jsx`, `AdminSidebar`, `AdminTopbar`
- Dashboard KPIs/charts via `src/admin/hooks/useDashboardData.js` (2-min in-memory cache)
- Full CRUD for places, hotels, rooms, tickets, restaurants (with image upload)
- Read/list for users, owners, payments, promotions, notifications, reviews, packages, food orders, logs
- Settings persist via `src/services/settingsService.js` (localStorage; backend endpoint TBD)
- Profile reads `GET /management/users/:id`, password via `POST /auth/change-password`
- Unknown `/admin/*` paths fall back to `AdminNotFoundPage`

## What Needs to Be Built

### Phase 1 — Foundation

1. **Install dependencies**: `react-router-dom`, `axios`, `@reduxjs/toolkit`, `react-redux`, `react-hot-toast`
2. **Create API client** in `src/api/axios.js` with interceptors, base URL, auth headers
3. **Add state management** in `src/store/` with Redux Toolkit slices
4. **Create routing** in `src/App.jsx` with React Router

### Phase 2 — Layout & Common Components

5. **Build layout** in `src/components/layout/` (Navbar, Footer, Layout wrapper)
6. **Build common components** in `src/components/common/` (Button, Card, Input, Modal, Spinner, Alert)
7. **Add context providers** in `src/context/` (AuthContext, ThemeContext)

### Phase 3 — Public Pages

8. **Create pages** in `src/pages/`: Home, Destinations, DestinationDetail, Booking, About, Contact
9. **Build page-specific components**: HeroSection, DestinationCard, BookingForm, etc.
10. **Connect to backend API** via services layer

### Phase 4 — Auth & User Features

11. **Build auth components**: LoginForm, RegisterForm, ProtectedRoute
12. **Add auth flow**: login, register, logout, token refresh
13. **Create user pages**: MyBookings, Profile

### Phase 5 — Admin Dashboard

14. **Admin module** ✅ Done — `src/admin/` with `AdminDashboard.jsx` shell, `AdminSidebar`, `AdminTopbar`
15. **Admin pages** ✅ Done — Dashboard, Users, Owners, Places, Hotels, Rooms, Tickets, Restaurants, Food Orders, Packages, Bookings, Payments, Reviews, Promotions, Notifications, Contact Messages, Reports, Logs, Profile, Settings
16. **Admin components** ✅ Done — KPI cards, charts, tables (inline), forms, modals, 404 fallback

Remaining admin work: backend CRUD endpoints for users/promotions/notifications (currently read-only), a backend settings persistence endpoint, and a real Help Center page.

### Phase 6 — Owner Dashboard

17. **Build owner layout**: OwnerSidebar, OwnerHeader, OwnerLayout
18. **Create owner pages**: Overview, MyPackages, Bookings, Earnings, Schedule
19. **Add owner components**: PackageForm, PricingForm, EarningsChart

### Backend (companion project)

1. Configure `application.properties` with MySQL connection
2. Create JPA entities in `model/`
3. Create repositories in `repository/`
4. Create services in `service/` + `service/impl/`
5. Create controllers in `controller/`
6. Create DTOs in `dto/request/` and `dto/response/`
7. Create mappers in `mapper/`
8. Create exception handlers in `exception/`
9. Run `./mvnw test` to verify

## Key Files to Know

| File | Why It Matters |
|---|---|
| `src/main.jsx` | Entry point — renders App, imports `index.css` (Tailwind) |
| `src/App.jsx` | Root component — where routing will be added |
| `src/index.css` | Tailwind CSS v4 import — all utility classes available |
| `src/App.css` | Tailwind CSS v4 import — component-level styles |
| `postcss.config.js` | Tailwind v4 PostCSS plugin config |
| `vite.config.js` | Vite build config — React plugin only |
| `package.json` | Dependencies — check before adding new packages |
| `index.html` | SPA shell — loads `/src/main.jsx` |

## User Roles & Dashboards

| Role | Dashboard | Route | Access |
|---|---|---|---|
| **User** | Public site | `/` | Browse destinations, book tours, view bookings |
| **Owner** | Owner panel | `/owner/*` | Manage own packages, bookings, earnings, schedules |
| **Admin** | Admin panel | `/admin/*` | Manage all destinations, users, bookings, categories, settings |

### Route Structure

```
/                          → HomePage (public)
/destinations              → DestinationsPage (public)
/destinations/:id          → DestinationDetailPage (public)
/booking/:id               → BookingPage (public)
/my-bookings               → MyBookingsPage (auth required)
/about                     → AboutPage (public)
/contact                   → ContactPage (public)
/login                     → LoginPage (public)
/register                  → RegisterPage (public)

/admin                     → DashboardPage (admin only)
/admin/destinations        → DestinationsPage (admin only)
/admin/bookings            → BookingsPage (admin only)
/admin/users               → UsersPage (admin only)
/admin/categories          → CategoriesPage (admin only)
/admin/reviews             → ReviewsPage (admin only)
/admin/settings            → SettingsPage (admin only)

/owner                     → OverviewPage (owner only)
/owner/packages            → MyPackagesPage (owner only)
/owner/packages/:id        → PackageDetailPage (owner only)
/owner/bookings            → BookingsPage (owner only)
/owner/earnings            → EarningsPage (owner only)
/owner/schedule            → SchedulePage (owner only)
/owner/reviews             → ReviewsPage (owner only)
/owner/profile             → ProfilePage (owner only)
```

## Tailwind CSS v4 Notes

- **No `tailwind.config.js`** — Tailwind v4 uses CSS-first config via `@theme` in CSS files
- **No `postcss.config.js` needed for basic usage** — already configured with `@tailwindcss/postcss`
- **Import**: Use `@import "tailwindcss";` in CSS files (NOT the old `@tailwind base/components/utilities`)
- **Usage in JSX**: `<div className="text-blue-500 font-bold">` (always `className`, NOT `class`)
- **Custom theme**: Add `@theme { --color-primary: #xxx; }` in CSS files to extend the default theme

## Code Style Rules

- **React**: Use functional components with hooks (no class components)
- **JSX**: Always use `className` not `class`
- **Linter**: Oxlint enforces `react/rules-of-hooks` (error) and `react/only-export-components` (warn)
- **Imports**: Use ES module syntax (`import/export`)
- **File naming**: lowercase with dashes for components (`my-component.jsx`) or PascalCase (`MyComponent.jsx`) — be consistent
- **Component naming**: PascalCase for component files (`MyComponent.jsx`)

## Component Naming Conventions

To avoid naming conflicts between public, admin, and owner components:

| Area | Convention | Example |
|---|---|---|
| **Public** | Generic names | `Card.jsx`, `BookingForm.jsx`, `Navbar.jsx` |
| **Admin** | Prefix with `Admin` | `AdminSidebar.jsx`, `AdminCard.jsx`, `AdminDataTable.jsx` |
| **Owner** | Prefix with `Owner` | `OwnerSidebar.jsx`, `OwnerCard.jsx`, `OwnerBookingTable.jsx` |
| **Shared** | Generic names in `components/common/` | `Button.jsx`, `Modal.jsx`, `Spinner.jsx` |
