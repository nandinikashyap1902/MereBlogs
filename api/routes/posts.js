const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');
const { sanitizeContent } = require('../middleware/security');

const uploadMiddleware = multer({ dest: 'uploads/' });

// ─── Validation helpers ───────────────────────────────────────────────────────

const postValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 200 }).withMessage('Title can be at most 200 characters.'),
    body('summary').trim().notEmpty().withMessage('Summary is required.').isLength({ max: 500 }).withMessage('Summary can be at most 500 characters.'),
    body('content').trim().notEmpty().withMessage('Content is required.'),
];

function validate(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ message: errors.array()[0].msg, errors: errors.array() });
        return false;
    }
    return true;
}

// ─── POST /post — Create a new post ──────────────────────────────────────────
router.post(
    '/post',
    authMiddleware,
    uploadMiddleware.single('file'),
    postValidation,
    async (req, res) => {
        if (!validate(req, res)) return;

        if (!req.file) {
            return res.status(400).json({ message: 'Cover image is required.' });
        }

        try {
            const { originalname, path } = req.file;
            const ext = originalname.split('.').pop();
            const newPath = `${path}.${ext}`;
            await fs.promises.rename(path, newPath);

            const { title, summary, content } = req.body;
           
            // Sanitize HTML content before storing — strips XSS payloads
            const safeContent = sanitizeContent(content);

            const postDoc = await Post.create({
                title: title.trim(),
                summary: summary.trim(),
                content: safeContent,
                cover: newPath,
                author: req.user.id,
            });

            res.status(201).json(postDoc);
        } catch (err) {
            console.error('Create post error:', err);
            res.status(500).json({ message: 'Failed to create post.' });
        }
    }
);

// ─── GET /post — Get all posts for the logged-in user ────────────────────────
router.get('/post', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id })
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(posts);
    } catch (err) {
        console.error('Fetch posts error:', err);
        res.status(500).json({ message: 'Failed to fetch posts.' });
    }
});

// ─── GET /post/:id — Get a single post by ID (public) ───────────────────────
router.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);
        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(postDoc);
    } catch (err) {
        console.error('Fetch post error:', err);
        res.status(500).json({ message: 'Failed to fetch post.' });
    }
});

// ─── PUT /post — Update an existing post ─────────────────────────────────────
router.put(
    '/post',
    authMiddleware,
    uploadMiddleware.single('file'),
    postValidation,
    async (req, res) => {
        if (!validate(req, res)) return;

        try {
            let newPath = null;

            if (req.file) {
                const { originalname, path } = req.file;
                const ext = originalname.split('.').pop();
                newPath = `${path}.${ext}`;
                fs.renameSync(path, newPath);
            }

            const { id, title, summary, content } = req.body;
            const postDoc = await Post.findById(id);

            if (!postDoc) {
                return res.status(404).json({ message: 'Post not found.' });
            }
            if (postDoc.author.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not the author.' });
            }

            // Sanitize updated HTML content
            const safeContent = sanitizeContent(content);

            postDoc.title = title.trim();
            postDoc.summary = summary.trim();
            postDoc.content = safeContent;
            if (newPath) postDoc.cover = newPath;

            await postDoc.save();
            res.json(postDoc);
        } catch (err) {
            console.error('Update post error:', err);
            res.status(500).json({ message: 'Failed to update post.' });
        }
    }
);

// ─── DELETE /post/:id — Delete a post ────────────────────────────────────────
router.delete('/post/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (postDoc.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this post.' });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (err) {
        console.error('Delete post error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});

// ─── POST /generate-blog — AI blog draft generator ───────────────────────────
router.post('/generate-blog', async (req, res) => {
    const { title, keywords, tone, wordLimit } = req.body;

    if (!title || !keywords) {
        return res.status(400).json({ error: 'Title and keywords are required.' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key is missing.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Write a blog post draft with the following details:
    Title: ${title}
    Keywords: ${keywords}
    Tone: ${tone}
    Word Limit: ${wordLimit} words.
    
    Format the output with appropriate HTML tags for a blog post (e.g., <h2>, <p>, <ul>, <strong>), but do not include the <html>, <head>, or <body> tags. Just the structured content suitable for a rich text editor.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ content: text });
    } catch (error) {
        console.error('Error generating blog:', error);
        res.status(500).json({ error: 'Failed to generate blog post.' });
    }
});

// ─── POST /improve-blog — AI blog improver ───────────────────────────────────
router.post('/improve-blog', async (req, res) => {
    const { content, instruction } = req.body;

    if (!content || !instruction) {
        return res.status(400).json({ error: 'Content and instruction are required.' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'API Key is missing.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Rewrite the following blog content based on this instruction: "${instruction}".
    
    Current Content:
    ${content}
    
    Keep the HTML structure intact where possible, but improve the text. Do not mistakenly remove necessary tags. Output only the HTML body content.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ content: text });
    } catch (error) {
        console.error('Error improving blog:', error);
        res.status(500).json({ error: 'Failed to improve blog post.' });
    }
});

module.exports = router;
