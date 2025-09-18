from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from urllib.parse import urlparse, parse_qs
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase REST config
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_SERVICE_ROLE:
    raise RuntimeError("Missing SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY")
REST_URL = f"{SUPABASE_URL}/rest/v1"
TABLE = "waitlist_submissions"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# -------------------- MODELS --------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class WaitlistCreate(BaseModel):
    email: EmailStr
    usecase: Optional[str] = None
    hp: Optional[str] = None  # honeypot field
    # marketing & attribution
    source: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None
    # consent & abuse controls
    consent: Optional[bool] = False
    captcha_token: Optional[str] = None

class WaitlistSubmission(BaseModel):
    id: str
    email: EmailStr
    role: Optional[str] = None
    usecase: Optional[str] = None
    created_at: datetime


# -------------------- RATE LIMIT (simple) --------------------
RATE_LIMIT_WINDOW = timedelta(minutes=1)
RATE_LIMIT_MAX = 5
rate_bucket = {}

def is_rate_limited(ip: str) -> bool:
    now = datetime.utcnow()
    bucket = rate_bucket.get(ip, [])
    # prune
    bucket = [t for t in bucket if now - t < RATE_LIMIT_WINDOW]
    allowed = len(bucket) < RATE_LIMIT_MAX
    if allowed:
        bucket.append(now)
    rate_bucket[ip] = bucket
    return not allowed


# -------------------- HTTP CLIENT LIFECYCLE --------------------
@app.on_event("startup")
async def startup_http_client():
    app.state.http = httpx.AsyncClient(
        headers={
            "apikey": SUPABASE_SERVICE_ROLE,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}",
        },
        timeout=10.0,
    )

@app.on_event("shutdown")
async def shutdown_http_client():
    client = getattr(app.state, "http", None)
    if client is not None:
        await client.aclose()

# -------------------- ROUTES --------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Health/Status sample routes (kept)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    # Echo a status object without persisting to a database
    return StatusCheck(client_name=input.client_name)

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # No persistence; return empty list for now
    return []

# Waitlist endpoints
@api_router.post("/waitlist", response_model=WaitlistSubmission, status_code=status.HTTP_201_CREATED)
async def create_waitlist(input: WaitlistCreate, request: Request):
    # honeypot: if filled, pretend success but do nothing
    if input.hp:
        return WaitlistSubmission(
            id=str(uuid.uuid4()),
            email=input.email,
            role=input.role,
            usecase=input.usecase,
            created_at=datetime.utcnow(),
        )

    # rate limit by IP
    ip = request.client.host if request.client else "unknown"
    if is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")

    # optional consent requirement (off by default)
    require_consent = os.getenv("REQUIRE_CONSENT", "false").lower() == "true"
    if require_consent and not input.consent:
        raise HTTPException(status_code=400, detail="Consent required.")

    # optional captcha verification (Cloudflare Turnstile)
    turnstile_secret = os.getenv("TURNSTILE_SECRET_KEY")
    require_captcha = os.getenv("REQUIRE_CAPTCHA", "false").lower() == "true"
    if require_captcha:
        if not (turnstile_secret and input.captcha_token):
            raise HTTPException(status_code=400, detail="Captcha required.")
        verify_resp = await app.state.http.post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            data={"secret": turnstile_secret, "response": input.captcha_token, "remoteip": ip},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        ok = False
        try:
            ok = bool(verify_resp.json().get("success"))
        except Exception:
            ok = False
        if not ok:
            raise HTTPException(status_code=400, detail="Captcha verification failed.")

    user_agent = request.headers.get("user-agent")
    # Derive source and UTM from Referer when not provided by client
    referer = request.headers.get("referer") or ""
    derived_source = "landing"
    derived_utm = {"utm_source": None, "utm_medium": None, "utm_campaign": None, "utm_term": None, "utm_content": None}
    try:
        parsed = urlparse(referer)
        qs = parse_qs(parsed.query)
        derived_source = (qs.get("source", [None])[0] or derived_source)
        for key in list(derived_utm.keys()):
            derived_utm[key] = qs.get(key, [None])[0]
    except Exception:
        pass
    payload = {
        "email": input.email,
        "usecase": input.usecase,
        # marketing & attribution
        "source": input.source or derived_source,
        "utm_source": input.utm_source or derived_utm["utm_source"],
        "utm_medium": input.utm_medium or derived_utm["utm_medium"],
        "utm_campaign": input.utm_campaign or derived_utm["utm_campaign"],
        "utm_term": input.utm_term or derived_utm["utm_term"],
        "utm_content": input.utm_content or derived_utm["utm_content"],
        # consent & audit
        "consent": True if input.consent is None else bool(input.consent),
        "ip": ip,
        "user_agent": user_agent,
    }
    resp = await app.state.http.post(
        f"{REST_URL}/{TABLE}",
        params={
            "select": "id,email,role,usecase,created_at",
            "on_conflict": "email",
        },
        json=payload,
        headers={"Prefer": "resolution=ignore-duplicates,return=representation"},
    )
    if resp.status_code == 409:
        # unique violation (should not happen with ignore-duplicates but keep for safety)
        raise HTTPException(status_code=409, detail="You're already on the waitlist.")
    if resp.is_error:
        raise HTTPException(status_code=500, detail=f"Insert failed: {resp.text}")

    data = resp.json()
    row = data[0] if isinstance(data, list) else data
    return WaitlistSubmission(**row)

@api_router.get("/waitlist", response_model=List[WaitlistSubmission])
async def list_waitlist():
    resp = await app.state.http.get(
        f"{REST_URL}/{TABLE}",
        params={
            "select": "id,email,role,usecase,created_at",
            "order": "created_at.desc",
        },
    )
    if resp.is_error:
        raise HTTPException(status_code=500, detail=f"Fetch failed: {resp.text}")
    rows = resp.json()
    return [WaitlistSubmission(**row) for row in rows]

@api_router.get("/waitlist/export.csv")
async def export_waitlist_csv():
    from fastapi import Response
    import csv
    import io

    resp = await app.state.http.get(
        f"{REST_URL}/{TABLE}",
        params={
            "select": "id,email,role,usecase,created_at",
            "order": "created_at.desc",
            "limit": 10000,
        },
    )
    if resp.is_error:
        raise HTTPException(status_code=500, detail=f"Export fetch failed: {resp.text}")
    rows = resp.json()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["id", "email", "role", "usecase", "created_at"])
    for d in rows:
        writer.writerow([
            d.get("id"),
            d.get("email"),
            d.get("role") or "",
            (d.get("usecase") or "").replace("\n", " "),
            d.get("created_at") or "",
        ])
    csv_content = buffer.getvalue()
    return Response(content=csv_content, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=waitlist.csv"
    })


# Include the router in the main app
app.include_router(api_router)

cors_origins = os.getenv("CORS_ALLOW_ORIGINS", "*")
origins = [o.strip() for o in cors_origins.split(",")] if cors_origins else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)