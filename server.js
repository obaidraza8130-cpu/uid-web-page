const fs = require('fs');

// UID save
app.post('/submit', (req, res) => {
    const uid = req.body.uid;

    fs.appendFileSync('data.txt', uid + "\n");

    res.send("UID saved!");
});

// UID list dekhne ke liye route
app.get('/uids', (req, res) => {
    const data = fs.readFileSync('data.txt', 'utf-8');
    res.send(`<pre>${data}</pre>`);
});
