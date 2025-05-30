const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', 'index.html'));
});

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', 'menu.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', 'cart.html'));
});

app.get('/track', (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', 'track.html'));
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'htmls', 'feedback.html'));
});

// API Endpoints
app.get('/api/menu', (req, res) => {
    const menu = JSON.parse(fs.readFileSync('./data/menu.json'));
    res.json(menu);
});

app.post('/api/feedback', (req, res) => {
    const feedbackData = req.body;
    const feedbackPath = './data/feedback.json';
    
    let feedback = [];
    if (fs.existsSync(feedbackPath)) {
        feedback = JSON.parse(fs.readFileSync(feedbackPath));
    }
    
    feedback.push(feedbackData);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedback, null, 2));
    
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});