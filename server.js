const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// ================= FILE =================
const DATA_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

// ================= ERROR SAFETY =================
process.on("uncaughtException", (err) => {
    console.log("❌ Error:", err);
});

// ================= ROUTES =================

// 🟢 REGISTRATION PAGE (HOME)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🔐 LOGIN PAGE
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// 🎮 ADMIN PAGE
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"));
});

// 📦 GET DATA
app.get("/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
});

// 📝 SUBMIT FORM
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

// ❌ DELETE USER
app.get("/delete/:id", (req, res) => {
    const id = Number(req.params.id);

    let data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

    data = data.filter(user => user.id !== id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    io.emit("refresh");

    res.send("Deleted Successfully");
});

// ================= SOCKET =================
io.on("connection", (socket) => {
    console.log("User connected");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});
