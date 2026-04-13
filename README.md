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

The base API URL is configured in `src/utiles/url_convert.jsx`. All API calls go through `convert_url("/api/...")`.

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

- Sessions are cookie-based (HTTP-only). `fetch` calls use `credentials: "include"`.
- The logged-in user object is cached in `sessionStorage` under key `auth_user` so a refresh doesn't require re-login.
- `ProtectedRoute` (in `src/components/restrictedPages/`) gates `/admin/*` and `/my-account`.

## Backend endpoints

```
/api/customers                       GET, POST
/api/customers/:id                   GET, PATCH, DELETE
/api/services                        GET, POST
/api/services/:id                    GET, PATCH, DELETE
/api/quotes                          GET, POST
/api/quotes/:id                      GET, PATCH, DELETE
/api/quotes/:id/offered-services     GET, POST
/api/offered-services/:id            PATCH, DELETE
/auth/login                          POST
/auth/logout                         POST
/auth/register                       POST
/auth/me                             GET
```
