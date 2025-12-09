from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import redis
from starlette.background import BackgroundTask
from starlette.datastructures import MutableHeaders
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth:8080")
USERS_SERVICE_URL = os.getenv("USERS_SERVICE_URL", "http://users:3000")
CHALLENGES_SERVICE_URL = os.getenv("CHALLENGES_SERVICE_URL", "http://challenges:3000")

REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

# Redis Client
try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        decode_responses=True
    )
except Exception as e:
    print(f"Redis connection failed: {e}")
    redis_client = None

# Rate Limiter Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/health":
        return await call_next(request)

    if redis_client:
        user_id = request.headers.get("x-user-id") or request.client.host
        key = f"rate_limit:{user_id}"
        
        try:
            # Simple rate limiter: 10 requests per second
            current = redis_client.incr(key)
            if current == 1:
                redis_client.expire(key, 1)
            
            if current > 10:
                return Response("Too Many Requests", status_code=429)
        except Exception:
            # Fail open if Redis has issues
            pass

    # TODO: Should check if user is authenticated already through keycloack? How?

    response = await call_next(request)
    return response

@app.get("/health")
async def health_check():
    return {"status": "OK"}

# Proxy Helper
async def proxy_request(url: str, request: Request, target_url_base: str):
    client = httpx.AsyncClient(base_url=target_url_base)
    
    # Forward headers
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None) # Let httpx handle this
    
    try:
        req_body = await request.body()
        rp_req = client.build_request(
            request.method,
            url,
            headers=headers,
            content=req_body
        )
        rp_resp = await client.send(rp_req, stream=True)
        
        return Response(
            content=await rp_resp.aread(),
            status_code=rp_resp.status_code,
            headers=rp_resp.headers,
            background=BackgroundTask(rp_resp.aclose)
        )
    finally:
        await client.aclose()

async def _proxy_auth(request: Request):
    target_path = request.url.path.replace("/auth", "", 1)
    if not target_path.startswith("/"):
        target_path = "/" + target_path
    
    if request.url.query:
        target_path += "?" + request.url.query
        
    return await proxy_request(target_path, request, AUTH_SERVICE_URL)

@app.api_route("/auth", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_auth(request: Request, path: str = ""):
    return await _proxy_auth(request)


async def _proxy_users(request: Request):
    target_path = request.url.path.replace("/users", "", 1)
    if not target_path.startswith("/"):
        target_path = "/" + target_path
    
    if request.url.query:
        target_path += "?" + request.url.query
        
    return await proxy_request(target_path, request, USERS_SERVICE_URL)

@app.api_route("/users", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
@app.api_route("/users/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_users(request: Request, path: str = ""):
    return await _proxy_users(request)

async def _proxy_challenges(request: Request):
    target_path = request.url.path.replace("/challenges", "", 1)
    if not target_path.startswith("/"):
        target_path = "/" + target_path
    
    if request.url.query:
        target_path += "?" + request.url.query

    return await proxy_request(target_path, request, CHALLENGES_SERVICE_URL)

@app.api_route("/challenges", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
@app.api_route("/challenges/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_challenges(request: Request, path: str = ""):
    return await _proxy_challenges(request)

@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_auth(path: str, request: Request):
    target_path = request.url.path.replace("/auth", "", 1)
    if not target_path.startswith("/"):
        target_path = "/" + target_path
    
    if request.url.query:
        target_path += "?" + request.url.query

    return await proxy_request(target_path, request, AUTH_SERVICE_URL)

