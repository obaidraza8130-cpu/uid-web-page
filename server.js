const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Admin login
const USER = "admin";
const PASS = "12345";

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Submit registration
app.post('/submit', (req, res) => {
    const { name, uid, game } = req.body;

    const data = `Name: ${name} | UID: ${uid} | Game: ${game}\n`;

    fs.appendFileSync('data.txt', data);

    res.send("Registration Successful 🎮");
});

// Login page
app.get('/login', (req, res) => {
    res.send(`
        <h2>Admin Login</h2>
        <form method="POST" action="/login">
            <input name="username" placeholder="Username" required><br><br>
            <input type="password" name="password" placeholder="Password" required><br><br>
            <button>Login</button>
        </form>
    `);
});

// Login check
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === USER && password === PASS) {
        res.redirect('/data?auth=true');
    } else {
        res.send("Wrong credentials ❌");
    }
});

// View registrations (protected)
app.get('/data', (req, res) => {
    if (req.query.auth !== "true") {
        return res.redirect('/login');
    }

    if (!fs.existsSync('data.txt')) {
        return res.send("No registrations yet");
    }

    const data = fs.readFileSync('data.txt', 'utf-8');

    res.send(`
        <h2>🎮 Player Registrations</h2>
        <pre>${data}</pre>
        <br><a href="/">Back</a>
    `);
});

// Server start
app.listen(process.env.PORT || 3000);
