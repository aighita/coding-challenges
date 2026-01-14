"""
Pytest configuration and fixtures for Challenges Service tests.
Uses mocking to avoid importing actual modules with database connections.
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
def sample_challenge():
    """Sample challenge data for testing."""
    return {
        "title": "Test Challenge",
        "description": "A test challenge description",
        "template": "def solution():\n    pass",
        "tests": [
            {"input": "5", "output": "10"},
            {"input": "10", "output": "20"}
        ],
        "difficulty": "Easy"
    }


@pytest.fixture
def sample_submission():
    """Sample submission data for testing."""
    return {
        "code": "def solution(n):\n    return n * 2"
    }


@pytest.fixture
def mock_user_token():
    """Mock JWT user payload."""
    return {
        "sub": "test-user-id-123",
        "email": "test@example.com",
        "preferred_username": "testuser",
        "realm_access": {
            "roles": ["editor"]
        }
    }


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
