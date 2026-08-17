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
frontend-tourism-project/
├── index.html                  # Vite SPA entry point
├── package.json                # Dependencies & scripts
├── postcss.config.js           # PostCSS config (Tailwind v4 plugin)
├── vite.config.js              # Vite config (React plugin)
├── .oxlintrc.json              # Linter config
├── public/
│   ├── favicon.svg             # App icon (Vite bolt)
│   └── icons.svg               # SVG sprite (bluesky, discord, github, x, docs, social)
├── src/
│   ├── main.jsx                # JS entry - renders <App /> into #root, imports index.css
│   ├── index.css               # @import "tailwindcss"; (Tailwind v4 entry)
│   ├── App.jsx                 # Root component (currently "Hello world!")
│   ├── App.css                 # @import "tailwindcss";
│   ├── api/                    # [EMPTY] - API client / HTTP calls to backend
│   ├── assets/                 # Static assets
│   │   ├── hero.png            # Hero image
│   │   ├── react.svg           # React logo
│   │   └── vite.svg            # Vite logo
│   ├── components/
│   │   ├── layout/             # [EMPTY] - Layout components (Navbar, Footer, Sidebar)
│   │   └── ui/                 # [EMPTY] - Reusable UI components (Button, Card, Modal)
│   ├── context/                # [EMPTY] - React Context providers (auth, theme)
│   ├── data/                   # [EMPTY] - Static/mock data
│   ├── hook/                   # [EMPTY] - Custom React hooks
│   ├── page/                   # [EMPTY] - Page/route components
│   ├── redux/                  # [EMPTY] - Redux store, slices, middleware
│   ├── service/                # [EMPTY] - Service layer (business logic abstraction)
│   └── utils/                  # [EMPTY] - Utility/helper functions
├── dist/                       # Production build output (pre-built)
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

**This is a freshly scaffolded project.** The directory structure and conventions are planned, but:

- **0 custom components** — only default Vite "Hello world!" template
- **0 pages/routes** — `react-router-dom` is NOT installed yet
- **0 API calls** — no HTTP client (axios/fetch wrapper) installed
- **0 state management** — Redux and Context directories are empty
- **0 layout components** — Navbar, Footer, etc. not yet created
- **Backend has 0 controllers, 0 entities, 0 services** — only the main `@SpringBootApplication` class exists
- **Backend has no database config** — `application.properties` only sets the app name

## What Needs to Be Built

### Frontend (this project)

1. **Install additional dependencies**: `react-router-dom`, `axios`, `@reduxjs/toolkit`, `react-redux` (when ready)
2. **Create routing** in `src/page/` with React Router
3. **Build layout** in `src/components/layout/` (Navbar, Footer)
4. **Build UI components** in `src/components/ui/` (Button, Card, Input, Modal, etc.)
5. **Create API client** in `src/api/` using axios/fetch
6. **Add state management** in `src/redux/` or `src/context/`
7. **Create pages**: Home, Destinations, About, Contact, etc.
8. **Connect to backend API** endpoints

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
