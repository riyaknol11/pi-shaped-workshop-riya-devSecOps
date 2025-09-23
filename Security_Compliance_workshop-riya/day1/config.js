// GOOD: Using environment variables instead of hardcoded secrets
require('dotenv').config();

module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'production_db',
        ssl: process.env.DB_SSL === 'true' ? {
            ca: process.env.DB_SSL_CA,
            key: process.env.DB_SSL_KEY,
            cert: process.env.DB_SSL_CERT
        } : false
    },
    
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    },
    
    external_apis: {
        stripe_secret: process.env.STRIPE_SECRET_KEY,
        paypal_secret: process.env.PAYPAL_CLIENT_SECRET,
        sendgrid_api_key: process.env.SENDGRID_API_KEY,
        slack_webhook: process.env.SLACK_WEBHOOK_URL,
        twitter_consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        facebook_app_secret: process.env.FACEBOOK_APP_SECRET
    },
    
    encryption: {
        secret_key: process.env.ENCRYPTION_KEY,
        salt: process.env.ENCRYPTION_SALT,
        iv: process.env.ENCRYPTION_IV
    },
    
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    },
    
    // Validation function
    validate: function() {
        const required = [
            'DB_PASSWORD',
            'JWT_SECRET', 
            'STRIPE_SECRET_KEY',
            'ENCRYPTION_KEY'
        ];
        
        const missing = required.filter(key => !process.env[key]);
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }
};