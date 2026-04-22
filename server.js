const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const session = require("express-session");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

app.use(session({
    secret: "gaming-secret",
    resave: false,
    saveUninitialized: true
}));

const DATA_FILE = path.join(__dirname, "data.json");

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/admin", (req, res) => {
    if (!req.session.auth) {
        return res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "admin.html"));
});

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.auth = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Data
app.get("/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// Submit
app.post("/submit", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));

    const newUser = {
        id: Date.now(),
        ...req.body
    };

    data.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    io.emit("new-user");

    res.send("<h2 style='color:white;text-align:center'>✅ Registered</h2><center><a href='/'>Back</a></center>");
});

// Delete
app.delete("/delete/:id", (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));

    data = data.filter(u => u.id != req.params.id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    io.emit("refresh");

    res.sendStatus(200);
});

io.on("connection", () => {});

server.listen(3000, () => console.log("🚀 Server running"));
