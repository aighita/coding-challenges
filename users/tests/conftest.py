"""
Pytest configuration and fixtures for Users Service tests.
"""
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_admin_token():
    """Mock JWT admin payload."""
    return {
        "sub": "admin-user-id-456",
        "email": "admin@example.com",
        "preferred_username": "admin",
        "realm_access": {
            "roles": ["admin"]
        }
    }


@pytest.fixture
def mock_user_token():
    """Mock JWT regular user payload."""
    return {
        "sub": "user-id-123",
        "email": "user@example.com",
        "preferred_username": "testuser",
        "realm_access": {
            "roles": ["student"]
        }
    }


@pytest.fixture
def sample_user():
    """Sample user data."""
    return {
        "id": "user-123",
        "keycloakId": "kc-user-123",
        "email": "test@example.com",
        "username": "testuser",
        "role": "student"
    }
