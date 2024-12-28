import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

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

// Middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static('public'));
app.use('/src', express.static('src'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Admin routes
app.get('/admin', adminAuth, (req, res) => {
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
