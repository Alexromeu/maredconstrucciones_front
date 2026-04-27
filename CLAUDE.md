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

This is a React 19 + Vite frontend for a construction company (Mared Construcciones). It talks to a separate backend REST API; the base URL comes from `VITE_API_URL` (see `.env`), with a hardcoded fallback to the production Render URL in `src/utiles/url_convert.jsx`.

### API calls

Always route API calls through `apiFetch(endpoint, options)` in `src/utiles/api.jsx`. It prepends the base URL via `convert_url`, attaches `Authorization: Bearer <token>` when a token is present in `localStorage`, and on a 401 clears the token and dispatches an `auth:unauthorized` window event. Do not call `fetch()` directly for backend endpoints, and do not set `credentials: "include"` — auth is header-based, not cookie-based.

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
AuthProvider → CustomerProvider → ServiceProvider → QuoteProvider
```

Each context exports a named hook (`useAuth`, `useCustomer`, `useService`, `useQuote`) — always use those hooks rather than importing the context object directly. `fetchMyQuotes` / `fetchQuotes` / `fetchServices` / `updateService` are wrapped in `useCallback`, so they're safe to put in `useEffect` dependency arrays.

**Auth** (`AuthContext`): JWT stored as a raw string in `localStorage` under key `"token"` (managed via `getToken`/`setToken` in `src/utiles/api.jsx`). Login response shape is `{ id, email, name, role_id, token }`; the token is stripped off and stored separately, the rest becomes the `user` state. On app boot, if a token exists, `AuthProvider` calls `GET /auth/me` to rehydrate user state. `ProtectedRoute` checks `user` (not `user.token`) to gate admin/customer pages; when `apiFetch` sees a 401 it clears the token and emits `auth:unauthorized`, and `AuthProvider` listens for that event to null out `user` — which causes `ProtectedRoute` to redirect on the next render. This token-in-localStorage setup is a temporary workaround for mobile browsers blocking cross-site cookies; swap back to HttpOnly cookies once a shared parent domain is in place.

**ServiceContext**: Caches services in `state`. Callers invoke `fetchServices` on mount — it refetches every time (no short-circuit).

### Admin Section

`src/components/restrictedPages/` contains all admin UI. Components in this folder don't use `MainLayout` and manage their own styling via `src/components/restrictedPages/styles/`.

### API Endpoints (backend reference)

Auth (unprotected unless noted):
```
POST /auth/register
POST /auth/login                      → { id, email, name, role_id, token }
POST /auth/logout                     (stateless no-op)
POST /auth/resend-verification
GET  /auth/verify-email/:token
GET  /auth/me                         (protected)
POST /auth/admin/create-user          (protected, admin only)
```

Resources:
```
/api/customers          GET, POST             (protected, admin/employee)
/api/customers/:id      GET, PATCH, DELETE    (protected)
/api/services           GET (public), POST    (protected)
/api/services/:id       GET, PATCH, DELETE    (protected for writes)
/api/quotes             GET, POST             (protected)
/api/quotes/my          GET                   (protected, current user)
/api/quotes/:id         GET, PATCH, DELETE    (protected, ownership-checked for role 3)
/api/quotes/:quoteId/items  GET, POST         (protected, ownership-checked for role 3)
/api/quote-items/:id    PATCH (admin), DELETE (ownership-checked for role 3)
/api/contact            POST                  (public, rate-limited)
```

`/auth/register` creates rows in both `users` and `customers` in a single transaction — the frontend should only hit that endpoint (not POST `/api/customers`) for public sign-up.

Protected endpoints require `Authorization: Bearer <token>`. `apiFetch` handles this automatically — read the raw token with `getToken()` from `src/utiles/api.jsx` only if you need it outside a fetch call.
