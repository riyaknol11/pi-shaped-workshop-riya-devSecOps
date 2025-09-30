const express = require('express');
const { exec } = require('child_process');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// VULNERABILITY 1: Hardcoded secrets (for Gitleaks to detect)
const API_KEY = "sk-1234567890abcdef-HARDCODED-SECRET-KEY";
const DATABASE_PASSWORD = "admin123password";
const JWT_SECRET = "super-secret-jwt-token-12345";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Initialize database
const db = new sqlite3.Database(':memory:');

// Create table and insert data with proper callback chain
db.serialize(() => {
    db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');
    db.run("INSERT INTO users VALUES (1, 'John Doe', 'john@example.com')");
    db.run("INSERT INTO users VALUES (2, 'Jane Smith', 'jane@example.com')");
    console.log('Database initialized with sample users');
});

// VULNERABILITY 2: SQL Injection vulnerability
app.get('/user', (req, res) => {
    const userId = req.query.id;
    // Vulnerable to SQL injection - not using parameterized queries
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send('Database error');
            return;
        }
        res.json(rows);
    });
});

// VULNERABILITY 3: Command Injection vulnerability
app.get('/ping', (req, res) => {
    const host = req.query.host || 'localhost';
    // Vulnerable to command injection
    exec(`ping -c 1 ${host}`, (error, stdout, stderr) => {
        if (error) {
            res.send(`Error: ${error.message}`);
            return;
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// VULNERABILITY 4: Path Traversal vulnerability
app.get('/file', (req, res) => {
    const filename = req.query.name;
    // Vulnerable to path traversal
    const filePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filePath);
});

// VULNERABILITY 5: Eval injection
app.post('/calculate', (req, res) => {
    const expression = req.body.expr;
    // Vulnerable to code injection via eval
    try {
        const result = eval(expression);
        res.json({ result: result });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// VULNERABILITY 6: Insecure deserialization
app.post('/load', (req, res) => {
    const data = req.body.data;
    // Vulnerable to prototype pollution
    try {
        const obj = JSON.parse(data);
        Object.assign({}, obj); // Can lead to prototype pollution
        res.json(obj);
    } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
    }
});

// VULNERABILITY 7: Sensitive data exposure
app.get('/debug', (req, res) => {
    res.json({
        apiKey: API_KEY,
        dbPassword: DATABASE_PASSWORD,
        jwtSecret: JWT_SECRET,
        awsKey: AWS_SECRET_KEY,
        env: process.env
    });
});

// VULNERABILITY 8: No input validation
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    // No validation, sanitization, or password hashing
    db.run(
        `INSERT INTO users (name, email) VALUES ('${username}', '${email}')`,
        (err) => {
            if (err) {
                res.status(500).send('Registration failed');
                return;
            }
            res.send('User registered successfully');
        }
    );
});

// VULNERABILITY 9: Weak cryptography
app.get('/encrypt', (req, res) => {
    const crypto = require('crypto');
    const text = req.query.text || 'secret';
    // Using weak MD5 algorithm
    const hash = crypto.createHash('md5').update(text).digest('hex');
    res.json({ encrypted: hash });
});

// VULNERABILITY 10: Information disclosure
app.use((err, req, res, next) => {
    // Exposing full error stack trace
    res.status(500).json({
        error: err.message,
        stack: err.stack
    });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable Express App</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                h1 { color: #d9534f; }
                a { display: block; margin: 10px 0; color: #0275d8; }
                .warning { 
                    background: #fcf8e3; 
                    border: 1px solid #faebcc; 
                    padding: 15px; 
                    margin: 20px 0;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <h1>⚠️ Vulnerable Express App</h1>
            <div class="warning">
                <strong>Warning:</strong> This app contains intentional vulnerabilities for security scanning demo.
                <br>DO NOT deploy to production!
            </div>
            <h2>Test Endpoints:</h2>
            <a href="/user?id=1">👤 User Query (SQL Injection)</a>
            <a href="/ping?host=localhost">🏓 Ping (Command Injection)</a>
            <a href="/file?name=test.txt">📁 File Access (Path Traversal)</a>
            <a href="/debug">🐛 Debug Info (Sensitive Data Exposure)</a>
            <a href="/encrypt?text=password">🔐 Encrypt (Weak Crypto)</a>
        </body>
        </html>
    `);
});

// VULNERABILITY 11: Server running without security headers
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Key: ${API_KEY}`); // VULNERABILITY: Logging secrets
});