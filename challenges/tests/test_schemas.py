"""
Unit tests for Challenges Service - isolated tests without database.
"""
import pytest
from pydantic import BaseModel, ValidationError
from typing import List, Optional
from datetime import datetime
import uuid


# Re-define Pydantic schemas here to test them in isolation
class ChallengeBase(BaseModel):
    title: str
    description: str
    template: str
    tests: List[dict]
    difficulty: str


class ChallengeCreate(ChallengeBase):
    pass


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


class TestChallengeSchemas:
    """Tests for Challenge Pydantic schemas."""
    
    def test_challenge_create_valid(self, sample_challenge):
        """Test creating a valid challenge."""
        challenge = ChallengeCreate(**sample_challenge)
        assert challenge.title == "Test Challenge"
        assert challenge.difficulty == "Easy"
        assert len(challenge.tests) == 2
    
    def test_challenge_create_missing_title(self, sample_challenge):
        """Test that missing title raises validation error."""
        data = sample_challenge.copy()
        del data["title"]
        
        with pytest.raises(ValidationError):
            ChallengeCreate(**data)
    
    def test_challenge_create_missing_tests(self, sample_challenge):
        """Test that missing tests raises validation error."""
        data = sample_challenge.copy()
        del data["tests"]
        
        with pytest.raises(ValidationError):
            ChallengeCreate(**data)
    
    def test_challenge_create_empty_tests(self, sample_challenge):
        """Test that empty tests list is valid."""
        data = sample_challenge.copy()
        data["tests"] = []
        
        challenge = ChallengeCreate(**data)
        assert challenge.tests == []


class TestSubmissionSchemas:
    """Tests for Submission Pydantic schemas."""
    
    def test_submission_create_valid(self, sample_submission):
        """Test creating a valid submission."""
        submission = SubmissionCreate(**sample_submission)
        assert "def solution" in submission.code
    
    def test_submission_create_empty_code(self):
        """Test submission with empty code."""
        submission = SubmissionCreate(code="")
        assert submission.code == ""
    
    def test_submission_create_missing_code(self):
        """Test that missing code raises validation error."""
        with pytest.raises(ValidationError):
            SubmissionCreate()
    
    def test_submission_response_valid(self):
        """Test creating a valid submission response."""
        response = SubmissionResponse(
            id=str(uuid.uuid4()),
            challengeId=str(uuid.uuid4()),
            userId="user-123",
            code="def solution(): pass",
            status="COMPLETED",
            verdict="PASSED",
            output="All tests passed",
            createdAt=datetime.now()
        )
        assert response.status == "COMPLETED"
        assert response.verdict == "PASSED"
    
    def test_submission_response_pending(self):
        """Test submission response in pending state."""
        response = SubmissionResponse(
            id=str(uuid.uuid4()),
            challengeId=str(uuid.uuid4()),
            userId="user-123",
            code="def solution(): pass",
            status="PENDING",
            verdict=None,
            output=None,
            createdAt=datetime.now()
        )
        assert response.status == "PENDING"
        assert response.verdict is None


class TestDifficultyValidation:
    """Tests for difficulty level handling."""
    
    def test_valid_difficulties(self, sample_challenge):
        """Test all valid difficulty levels."""
        for difficulty in ["Easy", "Medium", "Hard"]:
            data = sample_challenge.copy()
            data["difficulty"] = difficulty
            challenge = ChallengeCreate(**data)
            assert challenge.difficulty == difficulty
    
    def test_custom_difficulty(self, sample_challenge):
        """Test custom difficulty (schema allows any string)."""
        data = sample_challenge.copy()
        data["difficulty"] = "Expert"
        challenge = ChallengeCreate(**data)
        assert challenge.difficulty == "Expert"


class TestTestCaseFormat:
    """Tests for test case format validation."""
    
    def test_valid_test_case(self, sample_challenge):
        """Test valid test case format."""
        challenge = ChallengeCreate(**sample_challenge)
        assert challenge.tests[0]["input"] == "5"
        assert challenge.tests[0]["output"] == "10"
    
    def test_test_case_with_extra_fields(self, sample_challenge):
        """Test test case with extra fields (should be allowed)."""
        data = sample_challenge.copy()
        data["tests"] = [{"input": "5", "output": "10", "description": "Test 1"}]
        challenge = ChallengeCreate(**data)
        assert "description" in challenge.tests[0]
