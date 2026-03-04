const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const connectDB = require('../backend/config/db');
const app = require('../backend/app');

// Cache the DB connection across serverless invocations
let isConnected = false;

const ensureConnection = async () => {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
};

// Vercel Serverless Function handler
module.exports = async (req, res) => {
    await ensureConnection();
    return app(req, res);
};
