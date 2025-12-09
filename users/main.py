from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import jwt
from database import get_db, engine, Base
from models import User
from pydantic import BaseModel

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

# Pydantic models for response
class UserResponse(BaseModel):
    id: str
    keycloakId: str
    email: str
    username: str
    role: str

    class Config:
        from_attributes = True

# Middleware-like dependency to extract user info
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        token = authorization.split(" ")[1]
        # We decode without verification because Gateway already validated it.
        # In a zero-trust env, we would verify with Keycloak public key.
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/health")
async def health_check():
    return {"status": "OK"}

@app.get("/me", response_model=UserResponse)
async def get_me(user_payload: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    keycloak_id = user_payload.get("sub")
    email = user_payload.get("email", "")
    username = user_payload.get("preferred_username", "")
    realm_access = user_payload.get("realm_access", {})
    
    # Determine role
    role = "student"
    roles = realm_access.get("roles", [])
    if "admin" in roles:
        role = "admin"
    elif "editor" in roles:
        role = "editor"

    # Find user
    result = await db.execute(select(User).where(User.keycloakId == keycloak_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            keycloakId=keycloak_id,
            email=email,
            username=username,
            role=role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"Created new user: {username}")
    else:
        # Update role if changed
        if user.role != role:
            user.role = role
            await db.commit()
            await db.refresh(user)
    
    return user

@app.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
