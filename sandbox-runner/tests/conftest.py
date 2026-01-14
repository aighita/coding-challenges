"""
Pytest configuration and fixtures for Sandbox Runner tests.
"""
import pytest


@pytest.fixture
def sample_code():
    """Sample Python code for testing."""
    return """
def add(a, b):
    return a + b
"""


@pytest.fixture
def sample_tests():
    """Sample test cases."""
    return [
        {"input": "a=1\nb=2", "output": "3"},
        {"input": "a=5\nb=5", "output": "10"}
    ]


@pytest.fixture
def buggy_code():
    """Code with a bug for testing."""
    return """
def add(a, b):
    return a  # Bug: not adding b
"""


@pytest.fixture
def infinite_loop_code():
    """Code with infinite loop for testing timeout."""
    return """
def solution():
    while True:
        pass
"""
