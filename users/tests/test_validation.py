"""
Unit tests for Users Service - Request/Response validation and helper functions.
Isolated tests that don't import actual database modules.
"""
import pytest
from pydantic import BaseModel, Field, EmailStr, ValidationError
from typing import Optional, List


# Pydantic request/response schemas
class RoleUpdateRequest(BaseModel):
    role: str
    
    def validate_role(self) -> bool:
        """Validate that role is allowed."""
        allowed_roles = ["student", "editor", "admin"]
        return self.role in allowed_roles


class UserResponse(BaseModel):
    id: str
    keycloakId: str
    email: EmailStr
    username: str
    role: str


class UsersListResponse(BaseModel):
    users: List[UserResponse]
    total: int


class TestRoleValidation:
    """Tests for role validation logic."""
    
    def test_valid_student_role(self):
        """Test that student role is valid."""
        req = RoleUpdateRequest(role="student")
        assert req.validate_role() is True
    
    def test_valid_editor_role(self):
        """Test that editor role is valid."""
        req = RoleUpdateRequest(role="editor")
        assert req.validate_role() is True
    
    def test_valid_admin_role(self):
        """Test that admin role is valid."""
        req = RoleUpdateRequest(role="admin")
        assert req.validate_role() is True
    
    def test_invalid_role(self):
        """Test that invalid role is rejected."""
        req = RoleUpdateRequest(role="superadmin")
        assert req.validate_role() is False
    
    def test_empty_role(self):
        """Test that empty role is rejected."""
        req = RoleUpdateRequest(role="")
        assert req.validate_role() is False


class TestUserResponseValidation:
    """Tests for user response schema validation."""
    
    def test_valid_user_response(self):
        """Test valid user response creation."""
        user = UserResponse(
            id="user-123",
            keycloakId="kc-123",
            email="test@example.com",
            username="testuser",
            role="student"
        )
        
        assert user.id == "user-123"
        assert user.email == "test@example.com"
    
    def test_invalid_email_in_response(self):
        """Test that invalid email raises error."""
        with pytest.raises(ValidationError):
            UserResponse(
                id="user-123",
                keycloakId="kc-123",
                email="not-an-email",
                username="testuser",
                role="student"
            )
    
    def test_missing_required_field(self):
        """Test that missing required field raises error."""
        with pytest.raises(ValidationError):
            UserResponse(
                id="user-123",
                email="test@example.com",
                # Missing keycloakId, username, role
            )


class TestUsersListResponse:
    """Tests for users list response."""
    
    def test_empty_list(self):
        """Test empty users list response."""
        response = UsersListResponse(users=[], total=0)
        assert len(response.users) == 0
        assert response.total == 0
    
    def test_populated_list(self):
        """Test populated users list response."""
        users = [
            UserResponse(
                id=f"user-{i}",
                keycloakId=f"kc-{i}",
                email=f"user{i}@example.com",
                username=f"user{i}",
                role="student"
            )
            for i in range(3)
        ]
        
        response = UsersListResponse(users=users, total=3)
        assert len(response.users) == 3
        assert response.total == 3


class TestJWTPayloadExtraction:
    """Tests for JWT token handling logic."""
    
    def extract_roles(self, payload: dict) -> list:
        """Extract roles from JWT payload."""
        realm_access = payload.get("realm_access", {})
        return realm_access.get("roles", [])
    
    def is_admin(self, payload: dict) -> bool:
        """Check if user is admin from JWT payload."""
        roles = self.extract_roles(payload)
        return "admin" in roles
    
    def get_user_id(self, payload: dict) -> Optional[str]:
        """Get user ID from JWT payload."""
        return payload.get("sub")
    
    def get_email(self, payload: dict) -> Optional[str]:
        """Get email from JWT payload."""
        return payload.get("email")
    
    def test_extract_roles(self):
        """Test role extraction from JWT payload."""
        payload = {
            "sub": "user-123",
            "realm_access": {
                "roles": ["student", "default-roles"]
            }
        }
        
        roles = self.extract_roles(payload)
        assert "student" in roles
    
    def test_is_admin(self):
        """Test admin detection."""
        admin_payload = {
            "sub": "admin-123",
            "realm_access": {
                "roles": ["admin"]
            }
        }
        
        user_payload = {
            "sub": "user-123",
            "realm_access": {
                "roles": ["student"]
            }
        }
        
        assert self.is_admin(admin_payload) is True
        assert self.is_admin(user_payload) is False
    
    def test_get_user_id(self):
        """Test user ID extraction."""
        payload = {"sub": "user-123", "email": "test@example.com"}
        assert self.get_user_id(payload) == "user-123"
    
    def test_get_email(self):
        """Test email extraction."""
        payload = {"sub": "user-123", "email": "test@example.com"}
        assert self.get_email(payload) == "test@example.com"
    
    def test_missing_realm_access(self):
        """Test handling of missing realm_access."""
        payload = {"sub": "user-123"}
        roles = self.extract_roles(payload)
        assert roles == []
        assert self.is_admin(payload) is False


class TestAuthorizationLogic:
    """Tests for authorization helper functions."""
    
    def can_access_user_list(self, role: str) -> bool:
        """Check if role can access user list."""
        return role == "admin"
    
    def can_update_user_role(self, requester_role: str, target_role: str) -> bool:
        """Check if requester can update a user to target role."""
        if requester_role != "admin":
            return False
        return target_role in ["student", "editor", "admin"]
    
    def can_view_own_profile(self, user_id: str, profile_id: str) -> bool:
        """Check if user can view a profile."""
        return user_id == profile_id
    
    def test_admin_can_access_user_list(self):
        """Test that admin can access user list."""
        assert self.can_access_user_list("admin") is True
    
    def test_non_admin_cannot_access_user_list(self):
        """Test that non-admin cannot access user list."""
        assert self.can_access_user_list("editor") is False
        assert self.can_access_user_list("student") is False
    
    def test_admin_can_update_role(self):
        """Test that admin can update user roles."""
        assert self.can_update_user_role("admin", "student") is True
        assert self.can_update_user_role("admin", "editor") is True
        assert self.can_update_user_role("admin", "admin") is True
    
    def test_non_admin_cannot_update_role(self):
        """Test that non-admin cannot update roles."""
        assert self.can_update_user_role("editor", "student") is False
        assert self.can_update_user_role("student", "editor") is False
    
    def test_user_can_view_own_profile(self):
        """Test that user can view their own profile."""
        assert self.can_view_own_profile("user-123", "user-123") is True
    
    def test_user_cannot_view_other_profile(self):
        """Test that user cannot view other's profile."""
        assert self.can_view_own_profile("user-123", "user-456") is False
