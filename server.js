const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));

// 🔐 ADMIN CREDENTIALS
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// ================= HOME PAGE =================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// ================= REGISTER =================
app.post('/submit', (req, res) => {
    const { name, uid, email, team, device, game } = req.body;

    const data = `Name:${name}|UID:${uid}|Email:${email}|Team:${team}|Device:${device}|Game:${game}\n`;

    fs.appendFileSync('data.txt', data);

    res.send(`
        <h2 style="color:green;text-align:center;margin-top:50px;">
        ✅ Registration Successful!
        </h2>
        <center><a href="/">Go Back</a></center>
    `);
});

// ================= LOGIN PAGE =================
app.get('/login', (req, res) => {
    res.send(`
        <html>
        <body style="background:#020617;color:white;text-align:center;margin-top:100px;font-family:Arial">

        <h2>🔐 Admin Login</h2>

        <form action="/login" method="POST">
            <input name="username" placeholder="Username" required style="padding:10px;margin:5px;"><br>
            <input type="password" name="password" placeholder="Password" required style="padding:10px;margin:5px;"><br><br>

            <button style="padding:10px 20px;background:#22c55e;border:none;">
                Login
            </button>
        </form>

        </body>
        </html>
    `);
});

// ================= LOGIN CHECK =================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.redirect('/data?auth=true');
    }

    res.send(`
        <h3 style="color:red;text-align:center;margin-top:100px;">
        ❌ Wrong Username or Password
        </h3>
        <center><a href="/login">Try Again</a></center>
    `);
});

// ================= ADMIN PANEL =================
app.get('/data', (req, res) => {
    if (req.query.auth !== "true") {
        return res.redirect('/login');
    }

    if (!fs.existsSync('data.txt')) {
        return res.send("No registrations yet");
    }

    const raw = fs.readFileSync('data.txt', 'utf-8').trim();

    const rows = raw.split("\n").map(line => {
        const parts = line.split("|");

        const name = parts[0]?.replace("Name:", "").trim();
        const uid = parts[1]?.replace("UID:", "").trim();
        const email = parts[2]?.replace("Email:", "").trim();
        const team = parts[3]?.replace("Team:", "").trim();
        const device = parts[4]?.replace("Device:", "").trim();
        const game = parts[5]?.replace("Game:", "").trim();

        return `
        <tr>
            <td>${name}</td>
            <td>${uid}</td>
            <td>${email}</td>
            <td>${team}</td>
            <td>${device}</td>
            <td>${game}</td>
        </tr>`;
    }).join("");

    res.send(`
        <html>
        <head>
            <style>
                body {
                    font-family: Arial;
                    background: #020617;
                    color: white;
                    text-align: center;
                }
                table {
                    margin: auto;
                    border-collapse: collapse;
                    width: 90%;
                    margin-top: 30px;
                }
                th, td {
                    border: 1px solid #444;
                    padding: 10px;
                }
                th {
                    background: #22c55e;
                    color: black;
                }
                tr:nth-child(even) {
                    background: #1e293b;
                }
                a {
                    color: #22c55e;
                }
            </style>
        </head>

        <body>
            <h2>🎮 Player Registrations</h2>

            <table>
                <tr>
                    <th>Name</th>
                    <th>UID</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Device</th>
                    <th>Game</th>
                </tr>
                ${rows}
            </table>

            <br><br>
            <a href="/">Back</a>
        </body>
        </html>
    `);
});

// ================= START SERVER =================
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
