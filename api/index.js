require('dotenv').config(); // ← Must be first — loads .env before any process.env reference
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');

// ─── Route modules & security middleware ─────────────────────────────────────
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const savedRoutes = require('./routes/saved');
const { apiLimiter } = require('./middleware/security');

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

// ─── Security headers (Helmet) ────────────────────────────────────────────────
// Sets: X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, etc.
// crossOriginResourcePolicy: 'cross-origin' is needed so /uploads images load from the frontend
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

// ─── Static file serving (uploaded images) ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── General API rate limiter (100 req / 15 min per IP) ──────────────────────
// Auth routes apply their own stricter per-route limiter on top of this
app.use(apiLimiter);

// ─── Database connection ──────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connection established successfully.'))
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

// ─── Mount routes ─────────────────────────────────────────────────────────────
app.use('/', authRoutes);     // /register, /login, /profile, /logout
app.use('/', postRoutes);     // /post, /post/:id, /feed, /search, /generate-blog
app.use('/', commentRoutes);  // /post/:id/comments, /comment/:id
app.use('/', savedRoutes);    // /saved, /post/:id/save, /saved/check/:id

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});