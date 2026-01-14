from fastapi import FastAPI, Depends, HTTPException, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime
import jwt
import os
import json
import aio_pika
import database
from database import get_db
from models import Challenge, Submission
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Pydantic Schemas
class ChallengeBase(BaseModel):
    title: str
    description: str
    template: str
    tests: List[dict]
    difficulty: str

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeResponse(ChallengeBase):
    id: str
    authorId: str
    
    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    code: str

class SubmissionResponse(BaseModel):
    id: str
    challengeId: str
    userId: str
    code: str
    status: str
    verdict: Optional[str]
    output: Optional[str]
    createdAt: datetime
    
    class Config:
        from_attributes = True

# --- RabbitMQ Setup ---
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://user:password@broker:5672")
rmq_connection = None
rmq_channel = None

async def get_rabbitmq():
    global rmq_connection, rmq_channel
    if rmq_channel and not rmq_channel.is_closed:
        return rmq_channel
    
    import asyncio
    retries = 5
    while retries > 0:
        try:
            if rmq_connection is None or rmq_connection.is_closed:
                rmq_connection = await aio_pika.connect_robust(RABBITMQ_URL)
            rmq_channel = await rmq_connection.channel()
            await rmq_channel.declare_queue("submissions", durable=True)
            print("Connected to RabbitMQ")
            return rmq_channel
        except Exception as e:
            print(f"RabbitMQ connection failed: {e}. Retrying in 2s...")
            retries -= 1
            await asyncio.sleep(2)
    print("Failed to connect to RabbitMQ after retries")
    return None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables with retry
    import asyncio
    retries = 10
    while retries > 0:
        try:
            async with database.engine.begin() as conn:
                await conn.run_sync(database.Base.metadata.create_all)
            print("Database connected and tables created.")
            break
        except Exception as e:
            print(f"Database connection failed: {e}. Retrying in 5s...")
            retries -= 1
            await asyncio.sleep(5)
    
    await get_rabbitmq()
    yield
    if rmq_connection and not rmq_connection.is_closed:
        await rmq_connection.close()

app = FastAPI(lifespan=lifespan)

# --- Auth Helper ---
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/health")
async def health_check():
    return {"status": "OK"}

@app.get("/", response_model=List[ChallengeResponse])
async def list_challenges(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Challenge))
    return result.scalars().all()

@app.get("/{id}", response_model=ChallengeResponse)
async def get_challenge(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Challenge).where(Challenge.id == id))
    challenge = result.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@app.post("/", response_model=ChallengeResponse)
async def create_challenge(challenge_data: ChallengeCreate, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    roles = user.get("realm_access", {}).get("roles", [])
    if "editor" not in roles and "admin" not in roles:
        raise HTTPException(status_code=403, detail="Forbidden")

    new_challenge = Challenge(
        **challenge_data.dict(),
        authorId=user.get("sub")
    )
    db.add(new_challenge)
    await db.commit()
    await db.refresh(new_challenge)
    return new_challenge

@app.post("/{id}/submit", response_model=SubmissionResponse)
async def submit_solution(id: str, submission_data: SubmissionCreate, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_id = user.get("sub")
    
    # Verify challenge exists
    result = await db.execute(select(Challenge).where(Challenge.id == id))
    challenge = result.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # MODUL AVANSAT 2
    # Check for cached submission - same code, same challenge, same user, already completed
    cached_result = await db.execute(
        select(Submission).where(
            Submission.challengeId == id,
            Submission.userId == user_id,
            Submission.code == submission_data.code,
            Submission.status == "COMPLETED"
        ).order_by(Submission.createdAt.desc()).limit(1)
    )
    cached_submission = cached_result.scalar_one_or_none()
    
    if cached_submission:
        # Return cached result - create a new submission record with the cached verdict
        new_submission = Submission(
            challengeId=id,
            userId=user_id,
            code=submission_data.code,
            status="COMPLETED",
            verdict=cached_submission.verdict,
            output=f"[Cached] {cached_submission.output}" if cached_submission.output else "[Cached result]"
        )
        db.add(new_submission)
        await db.commit()
        await db.refresh(new_submission)
        print(f"Returning cached result for submission {new_submission.id} (original: {cached_submission.id})")
        return new_submission

    # Create new submission
    submission = Submission(
        challengeId=id,
        userId=user_id,
        code=submission_data.code,
        status="PENDING"
    )
    
    # Extract data before commit (commit expires objects)
    challenge_tests = challenge.tests
    
    db.add(submission)
    await db.commit()
    await db.refresh(submission)

    # Publish to RabbitMQ - ensure connection
    channel = await get_rabbitmq()
    if channel:
        payload = {
            "submissionId": submission.id,
            "code": submission_data.code,
            "tests": challenge_tests
        }
        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(payload).encode(), delivery_mode=aio_pika.DeliveryMode.PERSISTENT),
            routing_key="submissions"
        )
        print(f"Submitted job for submission {submission.id}")
    else:
        # Fallback or error if RMQ is down
        print("RabbitMQ channel not available")
        # In production, we might want to return an error or retry later.
        # For now, we accept it but it won't run.
    
    return submission

@app.get("/{id}/submissions", response_model=List[SubmissionResponse])
async def get_submissions(id: str, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_id = user.get("sub")
    result = await db.execute(
        select(Submission).where(Submission.challengeId == id, Submission.userId == user_id).order_by(Submission.createdAt.desc())
    )
    return result.scalars().all()

@app.get("/submissions/{id}", response_model=SubmissionResponse)
async def get_submission(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Submission).where(Submission.id == id))
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@app.delete("/{id}")
async def delete_challenge(id: str, user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    roles = user.get("realm_access", {}).get("roles", [])
    if "editor" not in roles and "admin" not in roles:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    result = await db.execute(select(Challenge).where(Challenge.id == id))
    challenge = result.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Delete associated submissions first
    await db.execute(select(Submission).where(Submission.challengeId == id))
    from sqlalchemy import delete
    await db.execute(delete(Submission).where(Submission.challengeId == id))
    
    await db.delete(challenge)
    await db.commit()
    return {"message": "Challenge deleted successfully"}
