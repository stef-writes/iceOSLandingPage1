## Deploy to Vercel (frontend + API)

### Prereqs
- Create a Vercel project and connect this repo.
- In Project Settings → Environment Variables, set:
  - FRONTEND_ORIGIN = https://your-frontend-domain.com
  - ADMIN_KEY = <strong random string>
  - SUPABASE_URL, SUPABASE_SERVICE_ROLE (if using Supabase)
  - REQUIRE_VERIFICATION, REQUIRE_CAPTCHA, TURNSTILE_SECRET_KEY (optional)
  - EMAIL_ENABLED, RESEND_API_KEY, EMAIL_FROM (optional)

### Build & Routes
- `vercel.json` config:
  - Frontend builds via Vite (`@vercel/static-build`), output `frontend/dist`.
  - API functions map `/api/**` to `api/**`. No Express needed.

### Commands
- Install: Vercel auto-installs.
- Build: Vercel runs `npm --prefix frontend run build` from repo root.

### Local test
```
npm run dev:api
npm run dev
```

### Post-deploy checks
- Open the site → network calls to `/api` succeed.
- Admin endpoints require `X-Admin-Key`.
- Waitlist submit returns 201; verification flow works if enabled.
- CSV export works and requires header auth.

### Notes
- Prefer `FRONTEND_ORIGIN` over `CORS_ORIGIN` in production.
- If API and frontend are on different domains, set `VITE_API_BASE` to the API origin.

