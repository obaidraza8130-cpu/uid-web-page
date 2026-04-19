const express = require("express");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// ================= HOME =================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ================= SUBMIT =================
app.post("/submit", (req, res) => {
    const { name, uid, email, team, device, game } = req.body;

    const data = {
        name,
        uid,
        email,
        team,
        device,
        game
    };

    // save in file
    fs.appendFileSync("data.txt", JSON.stringify(data) + "\n");

    // 🔥 REAL-TIME PUSH TO ADMIN
    io.emit("new-user", data);

    res.send(`
        <h2 style="color:green;text-align:center;margin-top:50px;">
        ✅ Registered Successfully
        </h2>
        <center><a href="/">Go Back</a></center>
    `);
});

// ================= LOGIN PAGE =================
app.get("/login", (req, res) => {
    res.send(`
        <h2 style="text-align:center;margin-top:100px;">Admin Login</h2>
        <form action="/login" method="POST" style="text-align:center;">
            <input name="username" placeholder="Username"><br><br>
            <input name="password" type="password" placeholder="Password"><br><br>
            <button>Login</button>
        </form>
    `);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        return res.redirect("/admin");
    }

    res.send("Wrong credentials");
});

// ================= ADMIN PANEL =================
app.get("/admin", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Admin Panel</title>
            <script src="/socket.io/socket.io.js"></script>
        </head>

        <body style="background:#020617;color:white;font-family:Arial;text-align:center">

        <h2>🎮 LIVE ADMIN PANEL</h2>

        <table border="1" style="margin:auto;width:90%">
            <tr>
                <th>Name</th>
                <th>UID</th>
                <th>Email</th>
                <th>Team</th>
                <th>Device</th>
                <th>Game</th>
            </tr>
            <tbody id="table"></tbody>
        </table>

        <script>
            const socket = io();

            const table = document.getElementById("table");

            socket.on("new-user", (data) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.uid}</td>
                    <td>${data.email}</td>
                    <td>${data.team}</td>
                    <td>${data.device}</td>
                    <td>${data.game}</td>
                `;

                table.prepend(row);
            });
        </script>

        </body>
        </html>
    `);
});

// ================= START =================
server.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});
