const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ================= FIX: BODY PARSER =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// ================= FIX: SAFE FILE PATH =================
const DATA_FILE = path.join(__dirname, "data.json");

// create file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// ================= ERROR HANDLER =================
process.on("uncaughtException", (err) => {
    console.log("❌ Error:", err);
});

// ================= HOME =================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ================= GET DATA =================
app.get("/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
});

// ================= SUBMIT =================
app.post("/submit", (req, res) => {
    const { name, uid, email, team, device, game } = req.body;

    let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    const newUser = {
        id: Date.now(),
        name,
        uid,
        email,
        team,
        device,
        game
    };

    data.push(newUser);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    io.emit("new-user", newUser);

    res.send(`
        <h2 style="color:green;text-align:center;margin-top:50px;">
        ✅ Registered Successfully
        </h2>
        <center><a href="/">Go Back</a></center>
    `);
});

// ================= DELETE =================
app.get("/delete/:id", (req, res) => {
    const id = Number(req.params.id);

    let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    data = data.filter(user => user.id !== id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    io.emit("refresh");

    res.send("Deleted Successfully");
});

// ================= ADMIN PANEL =================
app.get("/admin", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel</title>
    <script src="/socket.io/socket.io.js"></script>
</head>

<body style="background:#020617;color:white;font-family:Arial;text-align:center">

<h2>🎮 LIVE ADMIN PANEL</h2>

<table border="1" style="margin:auto;width:95%">
    <thead>
        <tr>
            <th>Name</th>
            <th>UID</th>
            <th>Email</th>
            <th>Team</th>
            <th>Device</th>
            <th>Game</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody id="table"></tbody>
</table>

<script>
    const socket = io();
    const table = document.getElementById("table");

    function addRow(data) {
        const row = document.createElement("tr");

        row.innerHTML = \`
            <td>\${data.name}</td>
            <td>\${data.uid}</td>
            <td>\${data.email}</td>
            <td>\${data.team}</td>
            <td>\${data.device}</td>
            <td>\${data.game}</td>
            <td><button onclick="deleteUser(\${data.id})">Delete</button></td>
        \`;

        table.prepend(row);
    }

    // load data
    fetch("/data")
    .then(res => res.json())
    .then(data => {
        table.innerHTML = "";
        data.forEach(addRow);
    });

    // live update
    socket.on("new-user", (data) => {
        addRow(data);
    });

    socket.on("refresh", () => {
        location.reload();
    });

    window.deleteUser = function(id) {
        fetch("/delete/" + id)
        .then(res => res.text())
        .then(msg => {
            alert(msg);
        });
    }
</script>

</body>
</html>
    `);
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});
