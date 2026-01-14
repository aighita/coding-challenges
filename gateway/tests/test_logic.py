"""
Unit tests for API Gateway - Logic and helper functions.
Isolated tests that don't import actual modules with Redis connections.
"""
import pytest
from typing import Optional


class RateLimiter:
    """Rate limiter logic for testing."""
    
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict = {}  # In-memory for testing
    
    def is_rate_limited(self, user_id: str) -> bool:
        """Check if user is rate limited."""
        count = self.requests.get(user_id, 0)
        return count >= self.max_requests
    
    def increment(self, user_id: str) -> int:
        """Increment request count for user."""
        count = self.requests.get(user_id, 0) + 1
        self.requests[user_id] = count
        return count
    
    def reset(self, user_id: str) -> None:
        """Reset request count for user."""
        self.requests[user_id] = 0


class TestRateLimiterLogic:
    """Tests for rate limiter logic."""
    
    def test_initial_not_limited(self):
        """Test that new users are not rate limited."""
        limiter = RateLimiter(max_requests=10)
        assert limiter.is_rate_limited("new-user") is False
    
    def test_increment_count(self):
        """Test that increment increases count."""
        limiter = RateLimiter(max_requests=10)
        
        count = limiter.increment("user-1")
        assert count == 1
        
        count = limiter.increment("user-1")
        assert count == 2
    
    def test_rate_limit_at_threshold(self):
        """Test rate limiting at threshold."""
        limiter = RateLimiter(max_requests=5)
        
        for _ in range(5):
            limiter.increment("user-1")
        
        assert limiter.is_rate_limited("user-1") is True
    
    def test_rate_limit_over_threshold(self):
        """Test rate limiting over threshold."""
        limiter = RateLimiter(max_requests=5)
        
        for _ in range(10):
            limiter.increment("user-1")
        
        assert limiter.is_rate_limited("user-1") is True
    
    def test_different_users_independent(self):
        """Test that rate limits are per user."""
        limiter = RateLimiter(max_requests=3)
        
        for _ in range(3):
            limiter.increment("user-1")
        
        assert limiter.is_rate_limited("user-1") is True
        assert limiter.is_rate_limited("user-2") is False
    
    def test_reset_clears_count(self):
        """Test that reset clears the count."""
        limiter = RateLimiter(max_requests=3)
        
        for _ in range(5):
            limiter.increment("user-1")
        
        assert limiter.is_rate_limited("user-1") is True
        
        limiter.reset("user-1")
        
        assert limiter.is_rate_limited("user-1") is False


class RouteResolver:
    """Route resolution logic for testing."""
    
    def __init__(self):
        self.routes = {
            "/users": "http://users:3000",
            "/challenges": "http://challenges:3000",
            "/auth": "http://auth:8080",
        }
    
    def resolve(self, path: str) -> Optional[str]:
        """Resolve path to backend service URL."""
        for prefix, url in self.routes.items():
            if path.startswith(prefix):
                return url
        return None
    
    def build_target_url(self, path: str) -> Optional[str]:
        """Build full target URL for proxying."""
        base_url = self.resolve(path)
        if base_url:
            return f"{base_url}{path}"
        return None


class TestRouteResolver:
    """Tests for route resolution logic."""
    
    def test_users_route(self):
        """Test that /users routes resolve correctly."""
        resolver = RouteResolver()
        
        assert resolver.resolve("/users") == "http://users:3000"
        assert resolver.resolve("/users/me") == "http://users:3000"
        assert resolver.resolve("/users/123") == "http://users:3000"
    
    def test_challenges_route(self):
        """Test that /challenges routes resolve correctly."""
        resolver = RouteResolver()
        
        assert resolver.resolve("/challenges") == "http://challenges:3000"
        assert resolver.resolve("/challenges/123") == "http://challenges:3000"
        assert resolver.resolve("/challenges/123/submit") == "http://challenges:3000"
    
    def test_auth_route(self):
        """Test that /auth routes resolve correctly."""
        resolver = RouteResolver()
        
        assert resolver.resolve("/auth") == "http://auth:8080"
        assert resolver.resolve("/auth/login") == "http://auth:8080"
    
    def test_unknown_route(self):
        """Test that unknown routes return None."""
        resolver = RouteResolver()
        
        assert resolver.resolve("/unknown") is None
        assert resolver.resolve("/api/v1/something") is None
    
    def test_build_target_url(self):
        """Test building full target URLs."""
        resolver = RouteResolver()
        
        assert resolver.build_target_url("/users/me") == "http://users:3000/users/me"
        assert resolver.build_target_url("/challenges/123") == "http://challenges:3000/challenges/123"
    
    def test_build_target_url_unknown(self):
        """Test building URL for unknown route."""
        resolver = RouteResolver()
        
        assert resolver.build_target_url("/unknown") is None


class RequestProcessor:
    """Request processing logic for testing."""
    
    def extract_user_id(self, headers: dict) -> str:
        """Extract user ID from headers or use IP."""
        return headers.get("x-user-id") or headers.get("x-forwarded-for") or "anonymous"
    
    def should_skip_rate_limit(self, path: str) -> bool:
        """Check if path should skip rate limiting."""
        skip_paths = ["/health", "/metrics", "/favicon.ico"]
        return path in skip_paths
    
    def should_skip_auth(self, path: str) -> bool:
        """Check if path should skip authentication."""
        skip_paths = ["/health", "/auth/login", "/auth/register"]
        return any(path.startswith(p) for p in skip_paths)
    
    def is_write_operation(self, method: str) -> bool:
        """Check if request is a write operation."""
        return method.upper() in ["POST", "PUT", "PATCH", "DELETE"]


class TestRequestProcessor:
    """Tests for request processing logic."""
    
    def test_extract_user_id_from_header(self):
        """Test extracting user ID from x-user-id header."""
        processor = RequestProcessor()
        
        headers = {"x-user-id": "user-123"}
        assert processor.extract_user_id(headers) == "user-123"
    
    def test_extract_user_id_from_forwarded(self):
        """Test extracting user ID from x-forwarded-for header."""
        processor = RequestProcessor()
        
        headers = {"x-forwarded-for": "192.168.1.1"}
        assert processor.extract_user_id(headers) == "192.168.1.1"
    
    def test_extract_user_id_fallback(self):
        """Test fallback to anonymous when no headers."""
        processor = RequestProcessor()
        
        headers = {}
        assert processor.extract_user_id(headers) == "anonymous"
    
    def test_skip_rate_limit_health(self):
        """Test that health endpoint skips rate limiting."""
        processor = RequestProcessor()
        
        assert processor.should_skip_rate_limit("/health") is True
        assert processor.should_skip_rate_limit("/users") is False
    
    def test_skip_auth_health(self):
        """Test that health endpoint skips auth."""
        processor = RequestProcessor()
        
        assert processor.should_skip_auth("/health") is True
        assert processor.should_skip_auth("/auth/login") is True
        assert processor.should_skip_auth("/users/me") is False
    
    def test_is_write_operation(self):
        """Test detection of write operations."""
        processor = RequestProcessor()
        
        assert processor.is_write_operation("POST") is True
        assert processor.is_write_operation("PUT") is True
        assert processor.is_write_operation("PATCH") is True
        assert processor.is_write_operation("DELETE") is True
        assert processor.is_write_operation("GET") is False
        assert processor.is_write_operation("HEAD") is False


class TestCORSConfiguration:
    """Tests for CORS configuration logic."""
    
    def is_allowed_origin(self, origin: str, allowed: list) -> bool:
        """Check if origin is allowed."""
        if "*" in allowed:
            return True
        return origin in allowed
    
    def test_wildcard_allows_all(self):
        """Test that wildcard allows all origins."""
        assert self.is_allowed_origin("http://example.com", ["*"]) is True
        assert self.is_allowed_origin("http://localhost:3000", ["*"]) is True
    
    def test_specific_origin_allowed(self):
        """Test that specific origins are allowed."""
        allowed = ["http://localhost:3000", "https://example.com"]
        
        assert self.is_allowed_origin("http://localhost:3000", allowed) is True
        assert self.is_allowed_origin("https://example.com", allowed) is True
    
    def test_specific_origin_blocked(self):
        """Test that non-allowed origins are blocked."""
        allowed = ["http://localhost:3000"]
        
        assert self.is_allowed_origin("http://evil.com", allowed) is False
