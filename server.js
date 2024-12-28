import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import 'dotenv/config';
import { verifyToken, requireAdmin, rateLimitAuth, generateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// Enhanced compression
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// Cache control middleware
const cacheControl = (duration) => {
    return (req, res, next) => {
        if (req.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${duration}`);
        }
        next();
    };
};

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    const adminKey = process.env.ADMIN_KEY;
    const authHeader = req.headers.authorization;

    if (!adminKey) {
        console.warn('Warning: ADMIN_KEY not set in environment variables');
        return res.status(401).json({ error: 'Admin authentication not configured' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (token !== adminKey) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

// CORS and JSON parsing
app.use(cors({
    origin: ['http://localhost:3002', 'https://hook.us1.make.com'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin'],
    credentials: false
}));
app.use(express.json());
app.use('/images', cacheControl(86400), express.static(join(__dirname, 'public/images')));
app.use(express.static(join(__dirname, 'public'), {
    maxAge: '1h',
    etag: true,
    lastModified: true
}));
app.use('/src', express.static('src'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Admin login endpoint
app.post('/admin/login', rateLimitAuth, async (req, res) => {
    const { username, password } = req.body;
    
    // Replace with your actual admin credentials check
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        const token = generateToken(username, 'admin');
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Protected admin routes
app.use('/admin', verifyToken, requireAdmin);

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'admin', 'index.html'));
});

app.post('/api/save-prompts', adminAuth, async (req, res) => {
    try {
        const promptsPath = join(__dirname, 'public', 'data', 'fixed-prompts.json');
        const backupPath = join(__dirname, 'public', 'data', `fixed-prompts.backup.${Date.now()}.json`);

        // Create backup of current file
        try {
            const currentData = await fs.readFile(promptsPath, 'utf8');
            await fs.writeFile(backupPath, currentData);
        } catch (err) {
            console.log('No existing prompts file to backup');
        }

        // Save new prompts
        await fs.writeFile(promptsPath, JSON.stringify(req.body, null, 4));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving prompts:', error);
        res.status(500).json({ error: 'Failed to save prompts' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Admin interface available at http://localhost:${PORT}/admin`);
});
