const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Dummy login credentials
const USER = "admin";
const PASS = "12345";

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
    res.send(`
        <h2>Admin Login</h2>
        <form method="POST" action="/login">
            <input type="text" name="username" placeholder="Username" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// Login check
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === USER && password === PASS) {
        res.redirect('/uids?auth=true');
    } else {
        res.send("Wrong credentials ❌");
    }
});

// Submit UID
app.post('/submit', (req, res) => {
    const uid = req.body.uid;
    fs.appendFileSync('data.txt', uid + "\n");
    res.send("UID saved successfully!");
});

// Protected UID page
app.get('/uids', (req, res) => {
    if (req.query.auth !== "true") {
        return res.redirect('/login');
    }

    if (!fs.existsSync('data.txt')) {
        return res.send("No data yet");
    }

    const data = fs.readFileSync('data.txt', 'utf-8');

    res.send(`
        <h2>All UIDs</h2>
        <pre>${data}</pre>
        <br><a href="/">Back</a>
    `);
});

// Server start
app.listen(process.env.PORT || 3000);
