const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Form submit
app.post('/submit', (req, res) => {
    const uid = req.body.uid;
    console.log("Received UID:", uid);
    res.send("UID received!");
});

// IMPORTANT for Render
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running...");
});