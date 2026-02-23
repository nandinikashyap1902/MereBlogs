const jwt = require('jsonwebtoken');

/**
 * authMiddleware — protects routes that require a logged-in user.
 *
 * Reads the JWT from the httpOnly cookie set at login,
 * verifies it with JWT_SECRET from .env, then attaches
 * the decoded payload (id, username) to req.user for
 * downstream route handlers to use.
 */
function authMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username, iat, exp }
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ message: 'Token is invalid or expired.' });
    }
}

module.exports = authMiddleware;
