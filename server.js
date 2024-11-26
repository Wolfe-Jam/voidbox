import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the root directory

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Handle contact form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    // Here you would typically integrate with an email service or database
    console.log('Contact form submission:', { name, email, message });
    res.json({ success: true, message: 'Message received!' });
});

// Serve the single-page application
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
