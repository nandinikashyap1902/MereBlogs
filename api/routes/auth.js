const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authLimiter } = require('../middleware/security');

// ─── Validation rules ─────────────────────────────────────────────────────────

const registerValidation = [
    body('username')
        .trim()
        .isEmail().withMessage('Username must be a valid email address.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6, max: 72 }).withMessage('Password must be between 6 and 72 characters.'),
];

const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required.').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required.'),
];

// Helper — returns 422 with validation errors if any field fails
function validate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ message: errors.array()[0].msg, errors: errors.array() });
        return false;
    }
    return true;
}

// ─── POST /register ───────────────────────────────────────────────────────────
router.post('/register', authLimiter, registerValidation, async (req, res) => {
    if (!validate(req, res)) return;

    const { username, password } = req.body;

    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const userDoc = await User.create({ username, password: hashedPassword });
        res.status(201).json({ id: userDoc._id, username: userDoc.username });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({ message: 'This email is already registered.' });
        }
        console.error('Register error:', e);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post('/login', authLimiter, loginValidation, async (req, res) => {
    if (!validate(req, res)) return;

    try {
        const { username, password } = req.body;

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
