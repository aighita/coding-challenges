import asyncio
from sqlalchemy import select
from database import SessionLocal
from models import Challenge

async def seed_challenges():
    print("Starting database seeding...")
    async with SessionLocal() as session:
        challenges_data = [
            {
                "title": "Two Sum",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "difficulty": "Easy",
                "template": "def two_sum(nums, target):\n    # Write your code here\n    pass",
                "tests": [
                    {"input": "nums=[2,7,11,15], target=9", "output": "[0, 1]"},
                    {"input": "nums=[3,2,4], target=6", "output": "[1, 2]"},
                    {"input": "nums=[3,3], target=6", "output": "[0, 1]"}
                ],
                "authorId": "system-seed"
            },
            {
                "title": "Reverse String",
                "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
                "difficulty": "Easy",
                "template": "def reverse_string(s):\n    # Write your code here\n    return s[::-1]",
                "tests": [
                    {"input": "s='hello'", "output": "'olleh'"},
                    {"input": "s='Hannah'", "output": "'hannaH'"}
                ],
                "authorId": "system-seed"
            },
            {
                "title": "Valid Palindrome",
                "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
                "difficulty": "Medium",
                "template": "def is_palindrome(s):\n    # Write your code here\n    pass",
                "tests": [
                    {"input": "s='A man, a plan, a canal: Panama'", "output": "True"},
                    {"input": "s='race a car'", "output": "False"}
                ],
                "authorId": "system-seed"
            },
            {
                "title": "Fibonacci Number",
                "description": "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
                "difficulty": "Easy",
                "template": "def fib(n):\n    # Write your code here\n    pass",
                "tests": [
                    {"input": "n=2", "output": "1"},
                    {"input": "n=3", "output": "2"},
                    {"input": "n=4", "output": "3"}
                ],
                "authorId": "system-seed"
            },
            {
                "title": "Factorial",
                "description": "Given an integer n, return n! (n factorial).",
                "difficulty": "Easy",
                "template": "def factorial(n):\n    # Write your code here\n    pass",
                "tests": [
                    {"input": "n=5", "output": "120"},
                    {"input": "n=0", "output": "1"},
                    {"input": "n=1", "output": "1"}
                ],
                "authorId": "system-seed"
            },
            {
                "title": "FizzBuzz",
                "description": "Given an integer n, return a string representation of numbers from 1 to n. Use 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, and 'FizzBuzz' for multiples of both.",
                "difficulty": "Medium",
                "template": "def fizzbuzz(n):\n    # Write your code here\n    pass",
                "tests": [
                    {"input": "n=3", "output": "['1', '2', 'Fizz']"},
                    {"input": "n=5", "output": "['1', '2', 'Fizz', '4', 'Buzz']"}
                ],
                "authorId": "system-seed"
            }
        ]

        for data in challenges_data:
            # Check if challenge already exists by title
            result = await session.execute(select(Challenge).where(Challenge.title == data['title']))
            existing = result.scalars().first()
            
            if not existing:
                print(f"Adding challenge: {data['title']}")
                challenge = Challenge(**data)
                session.add(challenge)
            else:
                print(f"Challenge already exists: {data['title']}")
        
        await session.commit()
        print("Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_challenges())
