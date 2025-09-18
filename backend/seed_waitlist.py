import asyncio
import os
from pathlib import Path
from typing import List, Dict

import httpx
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE = os.getenv("SUPABASE_SERVICE_ROLE") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_SERVICE_ROLE:
    raise SystemExit("Missing SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY in env")
REST_URL = f"{SUPABASE_URL}/rest/v1"
TABLE = "waitlist_submissions"

SAMPLE_ROWS: List[Dict[str, str]] = [
    {"email": "alice@example.com", "role": "Founder / Creator", "usecase": "Prototype knowledge workflows"},
    {"email": "bob@example.com", "role": "Engineer", "usecase": "Automate operational runbooks"},
    {"email": "chris@example.com", "role": "Operator / Ops", "usecase": "Standardize incident responses"},
]

async def insert_rows(rows: List[Dict[str, str]]) -> None:
    async with httpx.AsyncClient(
        headers={
            "apikey": SUPABASE_SERVICE_ROLE,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE}",
        },
        timeout=10.0,
    ) as client:
        resp = await client.post(
            f"{REST_URL}/{TABLE}",
            params={
                "on_conflict": "email",
                "select": "id,email,created_at",
            },
            json=rows,
            headers={"Prefer": "resolution=ignore-duplicates,return=representation"},
        )
        if resp.is_error:
            raise SystemExit(f"Seed insert failed: {resp.status_code} {resp.text}")
        data = resp.json()
        print(f"Upserted {len(data)} rows into {TABLE}")

        # verify by fetching most recent 10
        verify = await client.get(
            f"{REST_URL}/{TABLE}",
            params={
                "select": "id,email,created_at",
                "order": "created_at.desc",
                "limit": 10,
            },
        )
        if verify.is_error:
            raise SystemExit(f"Verification fetch failed: {verify.status_code} {verify.text}")
        rows = verify.json()
        print("Recent rows:")
        for r in rows:
            print(f" - {r.get('email')} @ {r.get('created_at')}")

if __name__ == "__main__":
    asyncio.run(insert_rows(SAMPLE_ROWS))
