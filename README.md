# Mared Construcciones

Frontend for Mared Construcciones — a construction company website with a public marketing site and a restricted admin area for managing services, customers, and quotes.

Built with **React 19 + Vite**, using React Router v7 and React Context for state management. The backend is a separate REST API.

## Stack

- React 19 (React Compiler enabled)
- Vite 7
- React Router DOM 7
- ESLint 9

## Deployment

- **Frontend**: https://maredconstrucciones-front.onrender.com
- **Backend**: https://maredconstrucciones-back.onrender.com

## Getting started

```bash
npm install
npm run dev        # starts Vite on http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

The base API URL is driven by `VITE_API_URL` (set in `.env`). It falls back to the production Render URL if unset. All API calls go through `apiFetch(...)` in `src/utiles/api.jsx`, which handles the `Authorization` header and 401 redirects.

## Routes

### Public

- `/` — landing page (hero, presentation, projects)
- `/services` — services catalog
- `/aboutus`
- `/contactus`
- `/account` — create customer account
- `/signin` — customer login

### Protected

- `/my-account` — customer dashboard (requires login)
- `/admin/*` — admin area (requires admin login)

## Admin access

Admin login lives at `/admin/login`. Once authenticated, the admin hub is available at `/admin/*` with individual pages for:

- Services: `/admin/services`, `/admin/services/create`, `/admin/services/edit`
- Customers: `/admin/customers`, `/admin/customers/edit/:id`

### Creating users

User creation (admin, employee, or customer) is done from the admin user-creation page:

**https://maredconstrucciones-front.onrender.com/admin/users/create**

The form accepts a role (`Admin`, `Employee`, or `Customer`) and posts to the backend `/auth/register` endpoint via the `register()` function on `AuthContext`. Creating an **Admin** user requires being authenticated as an admin — the client-side guard is in `AuthContext.registerAdmin()`, and the backend must also enforce this.

## Project layout

```
src/
  App.jsx                  # route declarations
  main.jsx                 # entry point
  components/
    MainLayout.jsx         # Header + Outlet + ContactInfo + Footer
    Header.jsx
    main/                  # landing-page sections
    pages/                 # public pages (services, aboutus, contactus, account)
    restrictedPages/       # admin UI (no shared layout)
    footer/, contactHome/
  contexts/
    AppProviders.jsx       # composes all providers
    AuthContext.jsx
    CustomerContext.jsx
    ServiceContext.jsx
    QuoteContext.jsx
    OfferedServicesContext.jsx
  utiles/
    url_convert.jsx        # prepends the backend base URL to endpoints
```

## Auth

- JWT is stored in `localStorage` under the key `token`. Every request through `apiFetch` attaches `Authorization: Bearer <token>`.
- On boot, if a token exists, `AuthProvider` calls `GET /auth/me` to rehydrate the user.
- A 401 response clears the token and dispatches an `auth:unauthorized` event; `AuthProvider` listens for it and nulls the user, which bounces protected routes to their login page.
- `ProtectedRoute` (in `src/components/restrictedPages/`) gates `/admin/*` and `/my-account`.
- This header-based setup is a stopgap while the frontend and backend live on different `onrender.com` subdomains (cross-site per the Public Suffix List — mobile browsers block third-party cookies). Revisit once both services share a registrable domain.

## Backend endpoints

```
/api/customers                       GET, POST (admin/employee)
/api/customers/:id                   GET, PATCH, DELETE
/api/services                        GET (public), POST
/api/services/:id                    GET, PATCH, DELETE
/api/quotes                          GET, POST
/api/quotes/my                       GET
/api/quotes/:id                      GET, PATCH, DELETE (ownership-checked for customers)
/api/quotes/:quoteId/items           GET, POST
/api/quote-items/:id                 PATCH, DELETE
/api/contact                         POST (rate-limited, public)
/auth/login                          POST
/auth/logout                         POST
/auth/register                       POST (creates both users + customers rows)
/auth/resend-verification            POST
/auth/verify-email/:token            GET
/auth/me                             GET
/auth/admin/create-user              POST (admin only)
```
