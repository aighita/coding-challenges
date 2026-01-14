"""
Pytest configuration and fixtures for Gateway Service tests.
"""
import pytest
import asyncio


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def sample_headers():
    """Sample request headers."""
    return {
        "x-user-id": "test-user-123",
        "authorization": "Bearer test-token",
        "content-type": "application/json"
    }


@pytest.fixture
def rate_limit_config():
    """Rate limiting configuration for tests."""
    return {
        "max_requests": 10,
        "window_seconds": 60
    }
