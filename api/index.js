require('dotenv').config(); // ← Must be first — loads .env before any process.env reference

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

// ─── Route modules ────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
    origin: ['https://mereblogs.netlify.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

// ─── Static file serving (uploaded images) ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Database connection ──────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connection established successfully.'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit if DB connection fails — no point running without DB
    });

// ─── Mount routes ─────────────────────────────────────────────────────────────
app.use('/', authRoutes);  // /register, /login, /profile, /logout
app.use('/', postRoutes);  // /post, /post/:id, /generate-blog, /improve-blog

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});