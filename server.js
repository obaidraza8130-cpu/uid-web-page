const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit UID
app.post('/submit', (req, res) => {
    const uid = req.body.uid;
    fs.appendFileSync('data.txt', uid + "\n");
    res.send("UID saved successfully!");
});

// 🔐 Protected UID view
app.get('/uids', (req, res) => {
    const password = req.query.pass;

    if (password !== "admin123") {
        return res.send("Access Denied ❌");
    }

    if (!fs.existsSync('data.txt')) {
        return res.send("No data yet");
    }

    const data = fs.readFileSync('data.txt', 'utf-8');

    res.send(`
        <h2>All UIDs</h2>
        <pre>${data}</pre>
    `);
});

// Server
app.listen(process.env.PORT || 3000);
