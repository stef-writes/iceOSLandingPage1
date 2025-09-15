from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime


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

class WaitlistSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: Optional[str] = None
    usecase: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


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
async def create_waitlist(input: WaitlistCreate):
    submission = WaitlistSubmission(**input.dict())
    await db.waitlist.insert_one(submission.dict())
    return submission

@api_router.get("/waitlist", response_model=List[WaitlistSubmission])
async def list_waitlist():
    docs = await db.waitlist.find().sort("created_at", -1).to_list(1000)
    return [WaitlistSubmission(**doc) for doc in docs]


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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()