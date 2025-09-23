const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Validate required environment variables
const requiredEnvVars = ['API_KEY', 'DB_PASSWORD', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Make sure .env file exists in the Security/ folder');
    process.exit(1);
}

app.get('/', (req, res) => {
    res.json({
        message: "Hello DevSecOps!",
        status: "running",
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    console.log('Health check requested');
    
    res.json({
        status: "healthy",
        database: DB_PASSWORD ? "configured" : "not configured",
        api_configured: !!API_KEY,
        timestamp: new Date().toISOString()
    });
});

app.get('/config', (req, res) => {
    res.json({
        node_env: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000,
        database_configured: !!DB_PASSWORD,
        api_key_configured: !!API_KEY,
        jwt_configured: !!JWT_SECRET,
        stripe_configured: !!STRIPE_SECRET_KEY
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            error: 'Missing credentials'
        });
    }
    
    if (!JWT_SECRET) {
        return res.status(500).json({
            error: 'JWT not configured'
        });
    }
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 1, username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({
        message: "Login successful",
        token: token
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('Loading .env from parent directory');
});

module.exports = app;