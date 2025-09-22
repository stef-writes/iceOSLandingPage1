## Deploying to Vercel

This repo contains a CRA frontend (`frontend/`) and a FastAPI backend (`backend/`). For a quick Vercel deployment of the frontend, use the included `vercel.json`. The backend should be hosted separately (e.g., Fly.io, Render, Railway) or adapted into Vercel Functions.

### Option A: All on Vercel (Serverless Functions)
- Uses `api/` serverless functions for `/api/*`.
- Set env vars in Vercel Project Settings:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE` (or `SUPABASE_SERVICE_ROLE_KEY`)
  - Optional: `REQUIRE_CONSENT`, `REQUIRE_CAPTCHA`, `TURNSTILE_SECRET_KEY`
- Deploy. Frontend calls relative `/api/*` which is served by Vercel Functions.

### Option B: Frontend on Vercel, Backend elsewhere
- Point the rewrite in `vercel.json` to your backend origin:
  - Replace `https://YOUR_BACKEND_HOST` with your backend base URL.
- Alternatively, skip rewrites and set an env var for the frontend:
  - Set `REACT_APP_BACKEND_URL` in Vercel Project Settings -> Environment Variables to your backend base URL.

Frontend requests will target `/api/*` by default. If `REACT_APP_BACKEND_URL` is set, the frontend will call `https://your-backend/api/*` instead.

### Environment variables

Backend (FastAPI) requires:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE` (or `SUPABASE_SERVICE_ROLE_KEY`)
- Optional: `REQUIRE_CONSENT`, `REQUIRE_CAPTCHA`, `TURNSTILE_SECRET_KEY`, `CORS_ALLOW_ORIGINS`

Frontend (CRA):
- Optional: `REACT_APP_BACKEND_URL` (when not using the rewrite)

Because `.env.example` files are often ignored, define these in your hosting provider's dashboard and locally create `.env` files that are not committed.

### Build settings
`vercel.json` is configured to:
- build the CRA app from `frontend/package.json`
- deploy functions from `api/**/*.js`
- serve static assets from `frontend/build`

### Local testing
1. Start backend locally and expose it (e.g., `localhost:8000`).
2. In `frontend/`, create `.env.local` with `REACT_APP_BACKEND_URL=http://localhost:8000`.
3. `npm start` in `frontend/`.

### Option B: Backend on Render (no code changes)
Use the included `render.yaml` to deploy the FastAPI server.

Steps:
1. Push this repo to GitHub.
2. In Render, create a new Web Service from repo and select the `render.yaml` blueprint.
3. Confirm the build command: `pip install -r backend/requirements.txt`.
4. Confirm start command: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`.
5. Set required env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`.
6. After it deploys, note your backend URL (e.g., `https://iceos-backend.onrender.com`).
7. In Vercel, either:
   - Update `vercel.json` to rewrite `/api/*` to your Render URL, or
   - Set `REACT_APP_BACKEND_URL` to your Render URL.

This path keeps Vercel purely static for the frontend and uses Render for the API.


