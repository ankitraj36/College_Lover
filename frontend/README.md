# 🎓 College Lover — Study Material Platform

A full-stack MERN (MongoDB, Express, React, Node.js) study material management platform with Firebase authentication.

## 📁 Project Structure

```
frontend/
├── server/           # Express.js backend (API)
│   ├── config/       # Database & Firebase config
│   ├── controllers/  # Route handlers
│   ├── middlewares/   # Auth & error middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── seeds/        # Database seed script
│   ├── utils/        # Utility helpers
│   ├── validations/  # Express-validator rules
│   ├── app.js        # Express app setup
│   └── server.js     # Server entry point
├── src/              # React frontend (Vite)
│   ├── components/   # React components
│   ├── config/       # Firebase client config
│   ├── context/      # Auth context
│   ├── pages/        # Page components
│   ├── services/     # API service (Axios)
│   └── styles/       # CSS files
├── .env              # Environment variables (both server & client)
├── package.json      # Unified dependencies & scripts
└── vite.config.js    # Vite config with API proxy
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a cloud URI
- Firebase project (for social login)

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, and Firebase credentials
   ```

3. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Frontend only (Vite dev server on port 5173)
npm run dev

# Backend only (Express API on port 5000)
npm run dev:server
```

### Production

```bash
# Build the frontend
npm run build

# Start the production server (serves both API & static files)
npm start
```

## 📝 Login Credentials (after seeding)

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@collegelover.com   | admin123    |
| Student | rahul@student.com        | student123  |
| Student | priya@student.com        | student123  |
