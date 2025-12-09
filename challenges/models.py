from sqlalchemy import Column, String, DateTime, func, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import uuid

class Challenge(Base):
    __tablename__ = "Challenge"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    template = Column(String, nullable=False)       # Starter code
    tests = Column(JSON, nullable=False)            # Array of { input, output }
    difficulty = Column(String, nullable=False)     # Easy, Medium, Hard
    authorId = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class Submission(Base):
    __tablename__ = "Submission"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    challengeId = Column(String, ForeignKey("Challenge.id"), nullable=False)
    userId = Column(String, nullable=False)
    code = Column(String, nullable=False)
    status = Column(String, default="PENDING")      # PENDING, RUNNING, COMPLETED, FAILED
    verdict = Column(String, nullable=True)         # PASSED, FAILED_TESTS, COMPILATION_ERROR
    output = Column(String, nullable=True)          # Console output or error message
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
