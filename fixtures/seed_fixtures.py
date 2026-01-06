import asyncio
import os
import random
import uuid
import string
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, func, text

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/coding_challenges")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

Base = declarative_base()

# --- Models (Simplified for Seeding) ---

class User(Base):
    __tablename__ = "User"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    keycloakId = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    role = Column(String, default="student")
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class Challenge(Base):
    __tablename__ = "Challenge"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=False)
    template = Column(String, nullable=False)
    tests = Column(JSON, nullable=False)
    difficulty = Column(String, nullable=False)
    authorId = Column(String, nullable=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class Submission(Base):
    __tablename__ = "Submission"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    challengeId = Column(String, ForeignKey("Challenge.id"), nullable=False)
    userId = Column(String, nullable=False)
    code = Column(String, nullable=False)
    status = Column(String, default="PENDING")
    verdict = Column(String, nullable=True)
    output = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())

# --- Generators ---

def generate_random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def generate_users(count=100):
    users = []
    roles = ["student", "student", "student", "editor", "admin"] # Weighted
    for _ in range(count):
        uid = str(uuid.uuid4())
        username = f"user_{generate_random_string(6)}"
        users.append(User(
            id=uid,
            keycloakId=str(uuid.uuid4()), # Fake Keycloak ID
            email=f"{username}@example.com",
            username=username,
            role=random.choice(roles)
        ))
    return users

def generate_challenges():
    challenges_data = [
        {
            "title": "Binary Search",
            "description": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.",
            "template": "def search(nums, target):\n    pass",
            "tests": [{"input": "nums = [-1,0,3,5,9,12], target = 9", "output": "4"}, {"input": "nums = [-1,0,3,5,9,12], target = 2", "output": "-1"}],
            "difficulty": "Easy"
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "description": "Given a string s, find the length of the longest substring without repeating characters.",
            "template": "def lengthOfLongestSubstring(s):\n    pass",
            "tests": [{"input": "s = 'abcabcbb'", "output": "3"}, {"input": "s = 'bbbbb'", "output": "1"}],
            "difficulty": "Medium"
        },
        {
            "title": "Median of Two Sorted Arrays",
            "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            "template": "def findMedianSortedArrays(nums1, nums2):\n    pass",
            "tests": [{"input": "nums1 = [1,3], nums2 = [2]", "output": "2.00000"}],
            "difficulty": "Hard"
        },
        {
            "title": "Valid Parentheses",
            "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            "template": "def isValid(s):\n    pass",
            "tests": [{"input": "s = '()'", "output": "true"}, {"input": "s = '()[]{}'", "output": "true"}],
            "difficulty": "Easy"
        },
        {
            "title": "Merge Two Sorted Lists",
            "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
            "template": "def mergeTwoLists(list1, list2):\n    pass",
            "tests": [],
            "difficulty": "Easy"
        },
        {
            "title": "Climbing Stairs",
            "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            "template": "def climbStairs(n):\n    pass",
            "tests": [{"input": "n = 2", "output": "2"}, {"input": "n = 3", "output": "3"}],
            "difficulty": "Easy"
        },
        {
            "title": "Maximum Subarray",
            "description": "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
            "template": "def maxSubArray(nums):\n    pass",
            "tests": [{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6"}],
            "difficulty": "Medium"
        },
        {
            "title": "Merge Intervals",
            "description": "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
            "template": "def merge(intervals):\n    pass",
            "tests": [{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"}],
            "difficulty": "Medium"
        },
        {
            "title": "Trapping Rain Water",
            "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            "template": "def trap(height):\n    pass",
            "tests": [{"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6"}],
            "difficulty": "Hard"
        },
        {
            "title": "N-Queens",
            "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.",
            "template": "def solveNQueens(n):\n    pass",
            "tests": [{"input": "n = 4", "output": "[[...]]"}],
            "difficulty": "Hard"
        }
    ]
    
    challenges = []
    for data in challenges_data:
        challenges.append(Challenge(
            id=str(uuid.uuid4()),
            title=data["title"],
            description=data["description"],
            template=data["template"],
            tests=data["tests"],
            difficulty=data["difficulty"],
            authorId="system"
        ))
    return challenges

def generate_submissions(users, challenges, count=500):
    submissions = []
    statuses = ["COMPLETED", "COMPLETED", "COMPLETED", "FAILED", "PENDING"]
    verdicts = ["PASSED", "PASSED", "FAILED", "ERROR", "TLE"]
    
    for _ in range(count):
        user = random.choice(users)
        challenge = random.choice(challenges)
        
        status = random.choice(statuses)
        verdict = random.choice(verdicts) if status == "COMPLETED" else None
        
        # Random date in the last 30 days
        days_ago = random.randint(0, 30)
        created_at = datetime.now() - timedelta(days=days_ago)
        
        submissions.append(Submission(
            id=str(uuid.uuid4()),
            challengeId=challenge.id,
            userId=user.id,
            code="# Random code\ndef solution():\n    pass",
            status=status,
            verdict=verdict,
            output="Sample output",
            createdAt=created_at
        ))
    return submissions

async def seed():
    print(f"Connecting to {DATABASE_URL}...")
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with async_session() as session:
        # 1. Create Users
        print("Generating users...")
        users = generate_users(100)
        session.add_all(users)
        
        # 2. Create Challenges
        print("Generating challenges...")
        challenges = generate_challenges()
        # Check for existing challenges to avoid duplicates by title
        for ch in challenges:
            result = await session.execute(text("SELECT id FROM \"Challenge\" WHERE title = :title"), {"title": ch.title})
            if not result.scalar():
                session.add(ch)
            else:
                # If exists, we need the ID for submissions
                # But for simplicity in this script, we might skip or fetch.
                # Let's fetch all challenges after insertion to be sure.
                pass
        
        await session.commit()
        
        # Fetch all challenges and users from DB to ensure we have IDs
        print("Fetching data for submissions...")
        result = await session.execute(text("SELECT id FROM \"User\""))
        user_ids = [row[0] for row in result.fetchall()]
        
        result = await session.execute(text("SELECT id FROM \"Challenge\""))
        challenge_ids = [row[0] for row in result.fetchall()]
        
        # Re-map to objects with just IDs for the generator
        user_objs = [type('obj', (object,), {'id': uid}) for uid in user_ids]
        challenge_objs = [type('obj', (object,), {'id': cid}) for cid in challenge_ids]
        
        if not user_objs or not challenge_objs:
            print("Not enough users or challenges to generate submissions.")
            return

        # 3. Create Submissions
        print("Generating submissions...")
        submissions = generate_submissions(user_objs, challenge_objs, 500)
        session.add_all(submissions)
        
        await session.commit()
        print("Seeding completed successfully!")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
