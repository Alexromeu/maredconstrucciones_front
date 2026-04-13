# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, default port 5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

There are no tests configured in this project.

## Architecture Overview

This is a React 19 + Vite frontend for a construction company (Mared Construcciones). It talks to a separate backend REST API running at `http://localhost:3000`.

### URL Construction

All API calls go through `src/utiles/url_convert.jsx`, which prepends the base URL (`http://localhost:3000`) to any endpoint path. Always use `convert_url("/api/...")` for fetch calls — never hardcode the full URL.

### Routing (App.jsx)

Two distinct route groups:

1. **Public routes** — wrapped in `<MainLayout>` (Header + Outlet + ContactInfo + Footer): `/`, `/services`, `/aboutus`, `/contactus`, `/account`, `/signin`
2. **Admin routes** — no shared layout, some protected by `<ProtectedRoute>`:
   - `/admin/login` — public
   - `/admin/*` — caught by ProtectedRoute → AdminHub
   - Individual admin pages: `/admin/services`, `/admin/services/create`, `/admin/services/edit`, `/admin/users/create`, `/admin/customers`, `/admin/customers/edit/:id`
3. **Customer-protected**: `/my-account` → `CustomerDashboard` wrapped in `<ProtectedRoute>`.

Note: some admin routes are declared both inside and outside the ProtectedRoute wrapper in `App.jsx` — this is intentional to allow direct navigation.

### Context / State Management

All global state lives in React Context. `src/contexts/AppProviders.jsx` composes them in this nesting order (outermost → innermost):

```
AuthProvider → CustomerProvider → ServiceProvider → QuoteProvider → OfferedServicesProvider
```

Each context exports a named hook (`useAuth`, `useCustomer`, `useService`, etc.) — always use those hooks rather than importing the context object directly.

**Auth** (`AuthContext`): JWT token stored in `sessionStorage` under key `"auth"` as a JSON object with a `token` field. `ProtectedRoute` checks `user.token` to gate admin pages.

**ServiceContext**: Caches services in memory — `fetchServices` is a no-op if `services.length > 0`. Call it on mount in any component that needs the service list.

### Admin Section

`src/components/restrictedPages/` contains all admin UI. Components in this folder don't use `MainLayout` and manage their own styling via `src/components/restrictedPages/styles/`.

### API Endpoints (backend reference)

```
/api/customers          GET, POST
/api/customers/:id      GET, PATCH, DELETE
/api/services           GET, POST
/api/services/:id       GET, PATCH, DELETE
/api/quotes             GET, POST
/api/quotes/:id         GET, PATCH, DELETE
/api/quotes/:id/offered-services   GET, POST
/api/offered-services/:id          PATCH, DELETE
/api/auth/login         POST
/api/auth/logout        POST
/api/auth/me            GET
```

Bearer token authentication is required for protected endpoints — read the token from `sessionStorage.getItem("auth")` and parse it to get `.token`.
