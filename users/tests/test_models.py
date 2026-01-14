"""
Unit tests for Users Service - Testing data structures and logic.
Isolated tests that don't import actual database modules.
"""
import pytest
import uuid
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


# Pydantic schemas that mirror the SQLAlchemy models
class UserSchema(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    keycloakId: str
    email: EmailStr
    username: str
    role: str = "student"
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class TestUserSchema:
    """Tests for the User schema."""
    
    def test_user_creation(self):
        """Test that a User can be created with required fields."""
        user = UserSchema(
            keycloakId="kc-123",
            email="test@example.com",
            username="testuser",
            role="student"
        )
        
        assert user.keycloakId == "kc-123"
        assert user.email == "test@example.com"
        assert user.username == "testuser"
        assert user.role == "student"
    
    def test_user_id_generation(self):
        """Test that User ID is auto-generated as UUID."""
        user = UserSchema(
            keycloakId="kc-123",
            email="test@example.com",
            username="testuser",
            role="student"
        )
        
        assert user.id is not None
        uuid.UUID(user.id)  # Should not raise
    
    def test_user_default_role(self):
        """Test that default role is student."""
        user = UserSchema(
            keycloakId="kc-123",
            email="test@example.com",
            username="testuser"
        )
        
        assert user.role == "student"
    
    def test_user_role_assignment(self):
        """Test different role assignments."""
        roles = ["student", "editor", "admin"]
        
        for role in roles:
            user = UserSchema(
                keycloakId=f"kc-{role}",
                email=f"{role}@example.com",
                username=role,
                role=role
            )
            assert user.role == role
    
    def test_user_email_validation(self):
        """Test email validation."""
        with pytest.raises(Exception):  # Pydantic validates email format
            UserSchema(
                keycloakId="kc-123",
                email="invalid-email",
                username="testuser"
            )
    
    def test_unique_ids_for_different_users(self):
        """Test that different users get different IDs."""
        users = [
            UserSchema(
                keycloakId=f"kc-{i}",
                email=f"user{i}@example.com",
                username=f"user{i}"
            )
            for i in range(5)
        ]
        
        ids = [user.id for user in users]
        assert len(set(ids)) == 5  # All unique


class TestUserRoles:
    """Tests for user role logic."""
    
    def is_admin(self, role: str) -> bool:
        """Check if role is admin."""
        return role == "admin"
    
    def is_editor(self, role: str) -> bool:
        """Check if role is editor."""
        return role == "editor"
    
    def can_edit_challenges(self, role: str) -> bool:
        """Check if user can edit challenges."""
        return role in ["editor", "admin"]
    
    def test_admin_role(self):
        """Test admin role detection."""
        assert self.is_admin("admin") is True
        assert self.is_admin("editor") is False
        assert self.is_admin("student") is False
    
    def test_editor_role(self):
        """Test editor role detection."""
        assert self.is_editor("editor") is True
        assert self.is_editor("admin") is False
        assert self.is_editor("student") is False
    
    def test_can_edit_challenges(self):
        """Test challenge editing permissions."""
        assert self.can_edit_challenges("admin") is True
        assert self.can_edit_challenges("editor") is True
        assert self.can_edit_challenges("student") is False
