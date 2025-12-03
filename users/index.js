const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware to extract user info from JWT (passed by Gateway)
const extractUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    try {
        // We decode without verification because Gateway already validated it.
        // In a zero-trust env, we would verify with Keycloak public key.
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

// Get or Create User Profile
app.get('/me', extractUser, async (req, res) => {
    try {
        const { sub: keycloakId, email, preferred_username: username, realm_access } = req.user;

        // Determine role from Keycloak roles
        let role = 'student';
        if (realm_access?.roles?.includes('admin')) role = 'admin';
        else if (realm_access?.roles?.includes('editor')) role = 'editor';

        let user = await prisma.user.findUnique({
            where: { keycloakId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    keycloakId,
                    email: email || '',
                    username: username || '',
                    role,
                },
            });
            console.log(`Created new user: ${username}`);
        } else {
            // Update role if changed in Keycloak
            if (user.role !== role) {
                user = await prisma.user.update({
                    where: { keycloakId },
                    data: { role }
                });
            }
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching/creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user by ID (internal or admin use)
app.get('/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
