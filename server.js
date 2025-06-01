const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware Configuration
app.use('/css', express.static(path.join(__dirname, 'public', 'css'))); // Serve CSS directly
app.use(express.static(path.join(__dirname, 'htmls')));  // Serve HTML files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route Handlers
const serveHtml = (fileName) => (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', fileName));
};

app.get('/', serveHtml('index.html'));
app.get('/menu', serveHtml('menu.html'));
app.get('/cart', serveHtml('cart.html'));
app.get('/track', serveHtml('track.html'));
app.get('/feedback', serveHtml('feedback.html'));

// API Endpoints
const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        throw err;
    }
};

app.get('/api/menu', (req, res) => {
    try {
        const menu = readJsonFile(path.join(__dirname, 'data', 'menu.json'));
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load menu' });
    }
});

app.post('/api/feedback', (req, res) => {
    try {
        const feedbackPath = path.join(__dirname, 'data', 'feedback.json');
        const feedback = fs.existsSync(feedbackPath) ? readJsonFile(feedbackPath) : [];
        
        feedback.push(req.body);
        fs.writeFileSync(feedbackPath, JSON.stringify(feedback, null, 2));
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Test CSS access: http://localhost:${PORT}/css/styles.css`);
});