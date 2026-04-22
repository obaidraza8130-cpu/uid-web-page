const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

const DATA_FILE = "data.json";
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.auth = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// LOGOUT
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

// CHECK AUTH
app.get("/check-auth", (req, res) => {
    res.json({ auth: req.session.auth || false });
});

// DATA
app.get("/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// REGISTER
app.post("/submit", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));

    const newUser = { id: Date.now(), ...req.body };
    data.push(newUser);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    io.emit("update");

    res.json({ success: true });
});

// DELETE
app.delete("/delete/:id", (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    data = data.filter(u => u.id != req.params.id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    io.emit("update");

    res.sendStatus(200);
});

io.on("connection", () => {});

server.listen(3000, () => console.log("🚀 Running on 3000"));
