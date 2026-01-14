// Mock data for offline/demo mode

export const MOCK_CHALLENGES = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Constraints:**
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        template: `def solution(nums, target):
    # Your code here
    pass`,
        difficulty: 'Easy',
        tests: [
            { input: '[2,7,11,15], 9', output: '[0,1]' },
            { input: '[3,2,4], 6', output: '[1,2]' }
        ]
    },
    {
        id: 'reverse-string',
        title: 'Reverse String',
        description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

**Example 1:**
\`\`\`
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
\`\`\`

**Example 2:**
\`\`\`
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]
\`\`\``,
        template: `def solution(s):
    # Your code here
    pass`,
        difficulty: 'Easy',
        tests: [
            { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }
        ]
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**
\`\`\`
Input: s = "()"
Output: true
\`\`\`

**Example 2:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

**Example 3:**
\`\`\`
Input: s = "(]"
Output: false
\`\`\``,
        template: `def solution(s):
    # Your code here
    pass`,
        difficulty: 'Easy',
        tests: [
            { input: '"()"', output: 'true' },
            { input: '"()[]{}"', output: 'true' },
            { input: '"(]"', output: 'false' }
        ]
    },
    {
        id: 'merge-sorted-arrays',
        title: 'Merge Two Sorted Arrays',
        description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.

Merge nums1 and nums2 into a single array sorted in non-decreasing order.

**Example 1:**
\`\`\`
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
\`\`\``,
        template: `def solution(nums1, m, nums2, n):
    # Your code here
    pass`,
        difficulty: 'Medium',
        tests: [
            { input: '[1,2,3,0,0,0], 3, [2,5,6], 3', output: '[1,2,2,3,5,6]' }
        ]
    },
    {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        description: `Given a string s, find the length of the longest substring without repeating characters.

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

**Example 2:**
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

**Example 3:**
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
\`\`\``,
        template: `def solution(s):
    # Your code here
    pass`,
        difficulty: 'Medium',
        tests: [
            { input: '"abcabcbb"', output: '3' },
            { input: '"bbbbb"', output: '1' }
        ]
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

**Example 1:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1
\`\`\``,
        template: `def solution(nums, target):
    # Your code here
    pass`,
        difficulty: 'Easy',
        tests: [
            { input: '[-1,0,3,5,9,12], 9', output: '4' },
            { input: '[-1,0,3,5,9,12], 2', output: '-1' }
        ]
    },
    {
        id: 'max-subarray',
        title: 'Maximum Subarray',
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

**Example 1:**
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

**Example 2:**
\`\`\`
Input: nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.
\`\`\`

**Example 3:**
\`\`\`
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.
\`\`\``,
        template: `def solution(nums):
    # Your code here
    pass`,
        difficulty: 'Medium',
        tests: [
            { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' }
        ]
    },
    {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example 1:**
\`\`\`
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
\`\`\`

**Example 2:**
\`\`\`
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
\`\`\``,
        template: `def solution(n):
    # Your code here
    pass`,
        difficulty: 'Easy',
        tests: [
            { input: '2', output: '2' },
            { input: '3', output: '3' }
        ]
    },
    {
        id: 'lru-cache',
        title: 'LRU Cache',
        description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if the key exists, otherwise return -1.
- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions get and put must each run in O(1) average time complexity.

**Example:**
\`\`\`
Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output
[null, null, null, 1, null, -1, null, -1, 3, 4]
\`\`\``,
        template: `class LRUCache:
    def __init__(self, capacity: int):
        pass
    
    def get(self, key: int) -> int:
        pass
    
    def put(self, key: int, value: int) -> None:
        pass`,
        difficulty: 'Hard',
        tests: []
    },
    {
        id: 'median-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

**Example 1:**
\`\`\`
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
\`\`\`

**Example 2:**
\`\`\`
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
\`\`\``,
        template: `def solution(nums1, nums2):
    # Your code here
    pass`,
        difficulty: 'Hard',
        tests: [
            { input: '[1,3], [2]', output: '2.0' },
            { input: '[1,2], [3,4]', output: '2.5' }
        ]
    }
];

export const MOCK_USERS = [
    {
        id: 'mock-student-1',
        username: 'student',
        email: 'student@demo.com',
        role: 'student'
    },
    {
        id: 'mock-editor-1',
        username: 'editor',
        email: 'editor@demo.com',
        role: 'editor'
    },
    {
        id: 'mock-admin-1',
        username: 'admin',
        email: 'admin@demo.com',
        role: 'admin'
    }
];

export const MOCK_SUBMISSIONS = [
    {
        id: 'mock-submission-1',
        status: 'COMPLETED',
        verdict: 'PASSED',
        output: 'All tests passed!',
        createdAt: new Date().toISOString()
    }
];

// GitHub repository URL
export const GITHUB_REPO_URL = 'https://github.com/aighita/coding-challenges';
