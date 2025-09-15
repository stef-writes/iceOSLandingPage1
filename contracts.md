# API Contracts and Integration Plan (Updated)

Scope: Real waitlist + small UX polish + export + basic abuse protection. Supabase-ready later via adapter.

Frontend base URL: process.env.REACT_APP_BACKEND_URL (never hardcode) with "/api" prefix.
Backend DB: uses os.environ['MONGO_URL'] + DB_NAME; unique index on waitlist.email.

Entity
- WaitlistSubmission
  - id: string (uuid)
  - email: string (Email)
  - role: string | null
  - usecase: string | null
  - created_at: ISO string (UTC)

Endpoints
- POST /api/waitlist
  - Req: { email: Email, role?: string, usecase?: string, hp?: string }
  - Honeypot: if hp non-empty, server ignores and returns success-shaped object
  - Rate limit: basic per-IP (5/min) -> 429
  - Dedup: unique index on email -> 409 with detail "You're already on the waitlist."
  - Res: 201 { id, email, role, usecase, created_at }

- GET /api/waitlist
  - Res: 200 Array<WaitlistSubmission>, newest first

- GET /api/waitlist/export.csv
  - Res: 200 text/csv; header row included

Frontend Integration
- src/lib/api.js -> createWaitlist(payload)
- Landing form includes hidden honeypot input; displays friendly 409 message.

Supabase Future Plan
- Swap persistence via STORAGE_DRIVER (supabase|mongo) with same API; table schema
  waitlist(id uuid pk, email text unique not null, role text, usecase text, created_at timestamptz default now()).

Testing
- Backend tested already; after these updates, retest POST/GET and duplicate/429.