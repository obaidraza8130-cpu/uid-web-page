const express = require("express");
const fs = require("fs");
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 🔐 ADMIN LOGIN
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// ================= HOME =================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ================= SUBMIT =================
app.post("/submit", (req, res) => {
    const { name, uid, email, team, device, game } = req.body;

    const data = `Name:${name}|UID:${uid}|Email:${email}|Team:${team}|Device:${device}|Game:${game}\n`;

    fs.appendFileSync("data.txt", data);

    res.send(`
        <h2 style="text-align:center;color:green;margin-top:50px;">
        ✅ Registration Successful
        </h2>
        <center><a href="/">Go Back</a></center>
    `);
});

// ================= LOGIN PAGE =================
app.get("/login", (req, res) => {
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
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.redirect("/data?auth=true");
    }

    res.send("<h3 style='color:red;text-align:center;'>Wrong Credentials</h3>");
});

// ================= ADMIN PANEL =================
app.get("/data", (req, res) => {
    if (req.query.auth !== "true") {
        return res.redirect("/login");
    }

    if (!fs.existsSync("data.txt")) {
        return res.send("No registrations yet");
    }

    const raw = fs.readFileSync("data.txt", "utf-8").trim();

    const rows = raw.split("\n").map(line => {
        const p = line.split("|");

        return `
        <tr>
            <td>${p[0]?.replace("Name:", "")}</td>
            <td>${p[1]?.replace("UID:", "")}</td>
            <td>${p[2]?.replace("Email:", "")}</td>
            <td>${p[3]?.replace("Team:", "")}</td>
            <td>${p[4]?.replace("Device:", "")}</td>
            <td>${p[5]?.replace("Game:", "")}</td>
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
                    width: 95%;
                    border-collapse: collapse;
                    margin-top: 20px;
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

                .btn {
                    display:inline-block;
                    padding:10px 20px;
                    margin:10px;
                    background:#22c55e;
                    color:black;
                    text-decoration:none;
                    border-radius:8px;
                }
            </style>
        </head>

        <body>

            <h2>🎮 Admin Panel</h2>

            <a class="btn" href="/">⬅ Home</a>
            <a class="btn" href="/login">🔐 Login</a>

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

        </body>
        </html>
    `);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
        </html>
    `);
});

