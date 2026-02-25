const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');

// ─── Rate Limiters ────────────────────────────────────────────────────────────

/**
 * authLimiter — strict limit for login/register to prevent brute-force.
 * 10 attempts per 15 minutes per IP.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts from this IP. Please try again in 15 minutes.' },
});

/**
 * apiLimiter — general limit for all other API routes.
 * 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP. Please slow down.' },
});

// ─── HTML Sanitizer ───────────────────────────────────────────────────────────

/**
 * sanitizeContent — strips dangerous HTML while keeping safe blog formatting.
 * Allows: headings, paragraphs, lists, inline styles, links (safe href), images
 * Blocks: <script>, event handlers (onclick, onerror, etc.), javascript: hrefs
 */
const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'blockquote',
    'ul', 'ol', 'li',
    'a', 'img',
    'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'div', 'span',
];

const allowedAttributes = {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'width', 'height'],
    '*': ['class', 'style'],
};

function sanitizeContent(dirty) {
    return sanitizeHtml(dirty, {
        allowedTags,
        allowedAttributes,
        // Block javascript: and data: URIs in href/src
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['http', 'https', 'data'], // allow data: URIs only for images
        },
    });
}

module.exports = { authLimiter, apiLimiter, sanitizeContent };
