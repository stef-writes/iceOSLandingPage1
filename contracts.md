# API Contracts and Integration Plan

Scope: Replace mock waitlist with real backend + add Philosophy page (static).

Frontend uses process.env.REACT_APP_BACKEND_URL and MUST prefix all routes with /api.
Backend uses os.environ['MONGO_URL'] and os.environ['DB_NAME'].

Entities
- WaitlistSubmission
  - id: string (uuid)
  - email: string (Email)
  - role: string | null
  - usecase: string | null
  - created_at: ISO string (UTC)

Endpoints (FastAPI, prefixed with /api)
1) POST /api/waitlist
   - Req: { email: Email, role?: string, usecase?: string }
   - Res: 201 { id, email, role, usecase, created_at }
   - Errors: 422 (validation)

2) GET /api/waitlist
   - Res: 200 Array<WaitlistSubmission>
   - Notes: for internal/admin use; simple list (no auth yet)

Frontend Integration
- File: src/lib/api.js
  - API_BASE = `${process.env.REACT_APP_BACKEND_URL}/api`
  - createWaitlist(payload) -> POST /waitlist

Migration from Mock
- Removed localStorage usage on submit; toast confirms server result
- UI unchanged: Email, Role, Use-case

Philosophy Page
- Route: /philosophy (static content)
- No backend calls

Testing Plan
- Backend first via deep_testing_backend_v2
- Verify POST + GET
- Then optionally run automated UI tests on waitlist flow if user requests