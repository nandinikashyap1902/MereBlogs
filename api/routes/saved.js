const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// ─── POST /post/:id/save — Toggle save/unsave a post ─────────────────────────
router.post('/post/:id/save', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        // Use findById with a safe fallback for savedPosts — handles existing users
        // whose documents pre-date the savedPosts field
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Ensure savedPosts exists — safety net for old documents
        if (!Array.isArray(user.savedPosts)) {
            user.savedPosts = [];
        }

        const alreadySaved = user.savedPosts.some(id => id.toString() === postId);

        if (alreadySaved) {
            user.savedPosts.pull(postId);   // unsave
        } else {
            user.savedPosts.push(postId);   // save
        }

        await user.save();

        res.json({
            saved: !alreadySaved,
            message: alreadySaved ? 'Post removed from saved.' : 'Post saved for later!',
        });
    } catch (err) {
        console.error('Save toggle error — full detail:', err);
        res.status(500).json({ message: 'Failed to update saved posts.', detail: err.message });
    }
});

// ─── GET /saved/check/:id — Check if a post is saved ─────────────────────────
// IMPORTANT: This must be defined BEFORE GET /saved — otherwise Express
// treats "check" as a dynamic :id segment and matches GET /saved/:id instead
router.get('/saved/check/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'savedPosts');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const savedPosts = user.savedPosts ?? [];
        const isSaved = savedPosts.some(id => id.toString() === req.params.id);
        res.json({ saved: isSaved });
    } catch (err) {
        console.error('Check saved error:', err);
        res.status(500).json({ message: 'Failed to check saved status.', detail: err.message });
    }
});

// ─── GET /saved — Fetch all saved posts for the logged-in user ───────────────
router.get('/saved', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'savedPosts',
                populate: { path: 'author', select: 'username' },
            });

        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Sort newest first — populate options.sort doesn't always work, sort in JS instead
        const sorted = (user.savedPosts ?? []).slice().sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.json(sorted);
    } catch (err) {
        console.error('Fetch saved posts error:', err);
        res.status(500).json({ message: 'Failed to fetch saved posts.', detail: err.message });
    }
});

module.exports = router;
