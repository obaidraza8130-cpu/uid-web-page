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

    console.log("Saved UID:", uid);

    res.send("UID saved successfully!");
});

// View all UIDs
app.get('/uids', (req, res) => {
    if (!fs.existsSync('data.txt')) {
        return res.send("No data yet");
    }

    const data = fs.readFileSync('data.txt', 'utf-8');

    res.send(`
        <h2>All UIDs</h2>
        <pre>${data}</pre>
        <br>
        <a href="/">Back</a>
    `);
});

// Server start
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
