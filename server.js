const fs = require('fs');

// UID save
app.post('/submit', (req, res) => {
    const uid = req.body.uid;
    console.log(uid);
    res.send("Saved");
});
});

// UID list dekhne ke liye route
app.get('/uids', (req, res) => {
    const data = fs.readFileSync('data.txt', 'utf-8');
    res.send(`<pre>${data}</pre>`);
});
