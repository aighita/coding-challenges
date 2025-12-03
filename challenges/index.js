const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const amqp = require('amqplib');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:password@broker:5672';

app.use(cors());
app.use(express.json());

let channel;

// Connect to RabbitMQ
async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('submissions', { durable: true });
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
}
connectRabbitMQ();

// Middleware to extract user info
const extractUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No authorization header' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.decode(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// List Challenges
app.get('/', async (req, res) => {
    const challenges = await prisma.challenge.findMany({
        select: { id: true, title: true, difficulty: true, authorId: true }
    });
    res.json(challenges);
});

// Get Challenge Details
app.get('/:id', async (req, res) => {
    const challenge = await prisma.challenge.findUnique({
        where: { id: req.params.id }
    });
    if (!challenge) return res.status(404).json({ error: 'Challenge not found' });
    res.json(challenge);
});

// Create Challenge (Editor/Admin only)
app.post('/', extractUser, async (req, res) => {
    const { realm_access } = req.user;
    if (!realm_access?.roles?.includes('editor') && !realm_access?.roles?.includes('admin')) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, description, template, tests, difficulty } = req.body;
    try {
        const challenge = await prisma.challenge.create({
            data: {
                title,
                description,
                template,
                tests,
                difficulty,
                authorId: req.user.sub
            }
        });
        res.json(challenge);
    } catch (error) {
        res.status(500).json({ error: 'Error creating challenge' });
    }
});

// Submit Solution
app.post('/:id/submit', extractUser, async (req, res) => {
    const { code } = req.body;
    const challengeId = req.params.id;
    const userId = req.user.sub; // Keycloak ID

    try {
        const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
        if (!challenge) return res.status(404).json({ error: 'Challenge not found' });

        // Create Submission Record
        const submission = await prisma.submission.create({
            data: {
                challengeId,
                userId,
                code,
                status: 'PENDING'
            }
        });

        // Publish to RabbitMQ
        if (channel) {
            const payload = {
                submissionId: submission.id,
                code,
                tests: challenge.tests
            };
            channel.sendToQueue('submissions', Buffer.from(JSON.stringify(payload)), { persistent: true });
            console.log(`Submitted job for submission ${submission.id}`);
        } else {
            console.error('RabbitMQ channel not available');
            return res.status(500).json({ error: 'Submission service unavailable' });
        }

        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing submission' });
    }
});

// Get Submissions for a Challenge (User history)
app.get('/:id/submissions', extractUser, async (req, res) => {
    const submissions = await prisma.submission.findMany({
        where: {
            challengeId: req.params.id,
            userId: req.user.sub
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(submissions);
});

// Get specific submission
app.get('/submissions/:id', async (req, res) => {
    const submission = await prisma.submission.findUnique({
        where: { id: req.params.id }
    });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json(submission);
});


app.listen(PORT, () => {
    console.log(`Challenges service running on port ${PORT}`);
});
