const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();

// ✅ Render needs this
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}));

// File
const DATA_FILE = "data.json";
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.auth = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Check auth
app.get("/check-auth", (req, res) => {
    res.json({ auth: req.session.auth || false });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => res.json({ success: true }));
});

// Get data
app.get("/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// Register
app.post("/submit", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));

    const newUser = { id: Date.now(), ...req.body };
    data.push(newUser);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

// Delete
app.delete("/delete/:id", (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    data = data.filter(u => u.id != req.params.id);

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => console.log("Server running on " + PORT));
