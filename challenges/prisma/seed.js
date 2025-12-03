const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const challenges = [
        {
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'EASY',
            inputFormat: 'First line contains n, the size of the array. Second line contains n integers. Third line contains the target.',
            outputFormat: 'Two integers representing the indices.',
            sampleInput: '4\n2 7 11 15\n9',
            sampleOutput: '0 1',
        },
        {
            title: 'Reverse String',
            description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
            difficulty: 'EASY',
            inputFormat: 'A single string.',
            outputFormat: 'The reversed string.',
            sampleInput: 'hello',
            sampleOutput: 'olleh',
        },
        {
            title: 'Palindrome Number',
            description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
            difficulty: 'MEDIUM',
            inputFormat: 'A single integer x.',
            outputFormat: 'true or false.',
            sampleInput: '121',
            sampleOutput: 'true',
        }
    ];

    for (const challenge of challenges) {
        await prisma.challenge.create({
            data: challenge,
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
