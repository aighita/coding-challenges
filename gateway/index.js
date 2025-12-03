const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Redis Client for Rate Limiting
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    enableOfflineQueue: false,
});

// Rate Limiter Configuration
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 10, // 10 requests
    duration: 1, // per 1 second by default
});

// Rate Limiting Middleware
const rateLimiterMiddleware = (req, res, next) => {
    const key = req.headers['x-user-id'] || req.ip; // Use User ID if available, else IP
    rateLimiter.consume(key)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too Many Requests');
        });
};

app.use(rateLimiterMiddleware);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Proxy Routes
// Auth Service (Keycloak)
app.use('/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://auth:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/auth': '/auth', // Keep /auth prefix for Keycloak
    },
}));

// Users Service
app.use('/users', createProxyMiddleware({
    target: process.env.USERS_SERVICE_URL || 'http://users:3000',
    changeOrigin: true,
}));

// Challenges Service
app.use('/challenges', createProxyMiddleware({
    target: process.env.CHALLENGES_SERVICE_URL || 'http://challenges:3000',
    changeOrigin: true,
}));

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
