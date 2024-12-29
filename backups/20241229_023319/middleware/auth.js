import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Admin role check middleware
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// Rate limiting for auth attempts (simple in-memory implementation)
const loginAttempts = new Map();

export const rateLimitAuth = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const attempts = loginAttempts.get(ip) || [];

    // Clean up old attempts
    const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000);

    if (recentAttempts.length >= 5) {
        return res.status(429).json({ 
            error: 'Too many login attempts. Please try again later.' 
        });
    }

    recentAttempts.push(now);
    loginAttempts.set(ip, recentAttempts);
    next();
};
