const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── POST /register ───────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({ username, password: hashedPassword });
        res.status(201).json({ id: userDoc._id, username: userDoc.username });
    } catch (e) {
        // Duplicate username (MongoDB unique index violation)
        if (e.code === 11000) {
            return res.status(400).json({ message: 'Username already taken. Please choose another.' });
        }
        console.error('Register error:', e);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const passOk = await bcrypt.compare(password, userDoc.password);
        if (!passOk) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        jwt.sign(
            { username, id: userDoc._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return res.status(500).json({ message: 'Authentication failed. Please try again.' });
                }
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    maxAge: 3600000, // 1 hour
                    path: '/',
                }).json({ id: userDoc._id, username });
            }
        );
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

// ─── GET /profile ─────────────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
        if (err) {
            return res.status(403).json({ error: 'Token is invalid or expired' });
        }
        res.json(info);
    });
});

// ─── POST /logout ─────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
