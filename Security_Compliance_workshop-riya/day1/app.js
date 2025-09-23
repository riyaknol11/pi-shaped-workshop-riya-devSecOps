const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// GOOD: Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// GOOD: Secure database configuration using environment variables
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'devsecops_demo',
    port: process.env.DB_PORT || 3306
};

// GOOD: Validate required environment variables
const requiredEnvVars = ['API_KEY', 'JWT_SECRET', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

app.get('/', (req, res) => {
    res.json({
        message: "Hello DevSecOps!",
        status: "running",
        version: "1.0.0",
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: "healthy",
        database: dbConfig.password ? "configured" : "not configured",
        timestamp: new Date().toISOString()
    });
});

// GOOD: No longer exposing secrets
app.get('/config', (req, res) => {
    res.json({
        node_env: process.env.NODE_ENV,
        port: process.env.PORT || 3000,
        database_configured: !!process.env.DB_PASSWORD,
        api_key_configured: !!process.env.API_KEY
    });
});

app.post('/login', (req, res) => {
    // GOOD: No longer logging secrets
    console.log('Login attempt received');
    
    if (!JWT_SECRET) {
        return res.status(500).json({ error: 'JWT secret not configured' });
    }
    
    const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
        token, 
        message: "Logged in successfully",
        expiresIn: '1 hour'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // GOOD: No longer logging secrets
});

module.exports = app;