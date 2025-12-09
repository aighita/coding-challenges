from sqlalchemy import Column, String, DateTime, func
from database import Base
import uuid

class User(Base):
    __tablename__ = "User"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    keycloakId = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    role = Column(String, default="student")  # student, editor, admin
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
