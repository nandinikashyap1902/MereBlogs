const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// ─── Validation ───────────────────────────────────────────────────────────────
const commentValidation = [
    body('content')
        .trim()
        .notEmpty().withMessage('Comment cannot be empty.')
        .isLength({ max: 1000 }).withMessage('Comment must be under 1000 characters.'),
];

// ─── GET /post/:id/comments — Fetch all comments for a post (public) ─────────
router.get('/post/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', ['username'])
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (err) {
        console.error('Fetch comments error:', err);
        res.status(500).json({ message: 'Failed to fetch comments.' });
    }
});

// ─── POST /post/:id/comments — Add a comment (auth required) ─────────────────
router.post('/post/:id/comments', authMiddleware, commentValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array()[0].msg });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        const comment = await Comment.create({
            post: req.params.id,
            author: req.user.id,
            content: req.body.content,
        });

        // Return the comment populated with author username — frontend needs it immediately
        await comment.populate('author', ['username']);
        res.status(201).json(comment);
    } catch (err) {
        console.error('Create comment error:', err);
        res.status(500).json({ message: 'Failed to post comment.' });
    }
});

// ─── DELETE /comment/:id — Delete a comment (author only) ────────────────────
router.delete('/comment/:id', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found.' });

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete your own comments.' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted.' });
    } catch (err) {
        console.error('Delete comment error:', err);
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
});

module.exports = router;
