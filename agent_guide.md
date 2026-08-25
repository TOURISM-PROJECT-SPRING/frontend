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
│   │   ├── admin/                  # Admin route entry points
│   │   │   └── AdminLayout.jsx     # ProtectedRoute + AdminLayout wrapper
│   │   └── owner/                  # Owner route entry points
│   │       └── OwnerLayout.jsx     # ProtectedRoute + OwnerLayout wrapper
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
│   │   ├── components/
│   │   │   ├── layout/             # AdminSidebar, AdminHeader, AdminLayout
│   │   │   ├── common/             # StatusBadge, AdminCard, SearchInput, EmptyState
│   │   │   ├── charts/             # StatsChart, BookingChart, RevenueChart
│   │   │   ├── tables/             # DataTable, TablePagination, TableFilters
│   │   │   ├── forms/              # DestinationForm, CategoryForm, UserForm
│   │   │   ├── modals/             # ConfirmModal, DetailModal, ImageUploadModal
│   │   │   └── dashboard/          # StatCard, RecentBookings, PopularDestinations
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx   # Overview stats, charts, recent activity
│   │   │   ├── DestinationsPage.jsx # CRUD all destinations
│   │   │   ├── BookingsPage.jsx    # View/manage all bookings
│   │   │   ├── UsersPage.jsx       # View/manage all users
│   │   │   ├── CategoriesPage.jsx  # CRUD categories
│   │   │   ├── ReviewsPage.jsx     # Moderate reviews
│   │   │   ├── SettingsPage.jsx    # Site settings
│   │   │   └── LoginPage.jsx       # Admin login
│   │   ├── hooks/
│   │   │   ├── useAdminAuth.js     # Admin auth logic
│   │   │   └── useDataTable.js     # Table sorting, filtering, pagination
│   │   ├── utils/
│   │   │   └── adminHelpers.js     # Admin-specific helpers
│   │   └── data/
│   │       └── mockStats.js        # Mock dashboard data
│   │
│   └── owner/                      # ===== OWNER DASHBOARD MODULE =====
│       ├── components/
│       │   ├── layout/             # OwnerSidebar, OwnerHeader, OwnerLayout
│       │   ├── common/             # OwnerCard, StatusBadge, DateRangePicker, EmptyState
│       │   ├── charts/             # EarningsChart, BookingTrendChart, OccupancyChart
│       │   ├── tables/             # BookingTable, PackageTable, CustomerTable
│       │   ├── forms/              # PackageForm, PricingForm, ScheduleForm
│       │   ├── modals/             # ConfirmModal, BookingDetailModal, PayoutModal
│       │   └── overview/           # EarningsSummary, UpcomingBookings, QuickActions
│       ├── pages/
│       │   ├── OverviewPage.jsx    # Dashboard with earnings, bookings, occupancy stats
│       │   ├── MyPackagesPage.jsx  # Manage own tour packages
│       │   ├── PackageDetailPage.jsx # Single package detail/edit
│       │   ├── BookingsPage.jsx    # Bookings for owner's packages
│       │   ├── BookingDetailPage.jsx # Single booking details
│       │   ├── CustomersPage.jsx   # Customers who booked owner's packages
│       │   ├── EarningsPage.jsx    # Revenue breakdown & payout history
│       │   ├── SchedulePage.jsx    # Manage package availability & capacity
│       │   ├── ReviewsPage.jsx     # View & respond to reviews
│       │   └── ProfilePage.jsx     # Owner profile & business settings
│       ├── hooks/
│       │   ├── useOwnerAuth.js     # Owner auth logic
│       │   ├── useOwnerStats.js    # Fetch owner dashboard stats
│       │   └── useOwnerBookings.js # Booking list with filters
│       ├── utils/
│       │   └── ownerHelpers.js     # Earnings calc, date range helpers
│       └── data/
│           └── mockOwnerData.js    # Mock data for development
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

**Directory structure is ready.** All folders are created with README guides, but no implementation yet:

| Area | Status |
|---|---|
| Folder structure | ✅ Complete — all directories created |
| Documentation | ✅ Complete — each folder has README.md |
| Custom components | ❌ 0 — only default Vite template |
| Pages/routes | ❌ 0 — `react-router-dom` not installed |
| API calls | ❌ 0 — no HTTP client installed |
| State management | ❌ 0 — Redux/Context empty |
| Layout components | ❌ 0 — Navbar, Footer not created |
| Admin dashboard | ❌ 0 — folder structure ready, no components |
| Owner dashboard | ❌ 0 — folder structure ready, no components |
| Backend | ❌ 0 controllers, 0 entities, 0 services |

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

14. **Build admin layout**: AdminSidebar, AdminHeader, AdminLayout
15. **Create admin pages**: Dashboard, Destinations CRUD, Bookings, Users, Categories
16. **Add admin components**: DataTable, Charts, Forms, Modals

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
