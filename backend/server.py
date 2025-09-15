from fastapi import FastAPI, APIRouter, HTTPException, status, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from pymongo.errors import DuplicateKeyError


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

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
    role: Optional[str] = None
    usecase: Optional[str] = None
    hp: Optional[str] = None  # honeypot field

class WaitlistSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: Optional[str] = None
    usecase: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


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


# -------------------- ROUTES --------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Health/Status sample routes (kept)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Waitlist endpoints
@api_router.post("/waitlist", response_model=WaitlistSubmission, status_code=status.HTTP_201_CREATED)
async def create_waitlist(input: WaitlistCreate, request: Request):
    # honeypot: if filled, pretend success but do nothing
    if input.hp:
        return WaitlistSubmission(email=input.email or "obfuscated@example.com")

    # rate limit by IP
    ip = request.client.host if request.client else "unknown"
    if is_rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again shortly.")

    submission = WaitlistSubmission(email=input.email, role=input.role, usecase=input.usecase)
    try:
        await db.waitlist.insert_one(submission.dict())
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="You're already on the waitlist.")
    return submission

@api_router.get("/waitlist", response_model=List[WaitlistSubmission])
async def list_waitlist():
    docs = await db.waitlist.find().sort("created_at", -1).to_list(1000)
    return [WaitlistSubmission(**doc) for doc in docs]

@api_router.get("/waitlist/export.csv")
async def export_waitlist_csv():
    from fastapi import Response
    import csv
    import io

    docs = await db.waitlist.find().sort("created_at", -1).to_list(10000)
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["id", "email", "role", "usecase", "created_at"])
    for d in docs:
        writer.writerow([
            d.get("id"),
            d.get("email"),
            d.get("role", ""),
            (d.get("usecase", "") or "").replace("\n", " "),
            d.get("created_at").isoformat() if d.get("created_at") else "",
        ])
    csv_content = buffer.getvalue()
    return Response(content=csv_content, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=waitlist.csv"
    })


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_tasks():
    # ensure unique index on email
    await db.waitlist.create_index("email", unique=True)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()