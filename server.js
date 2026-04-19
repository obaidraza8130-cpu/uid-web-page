app.get('/data', (req, res) => {
    if (req.query.auth !== "true") {
        return res.redirect('/login');
    }

    if (!fs.existsSync('data.txt')) {
        return res.send("No registrations yet");
    }

    const raw = fs.readFileSync('data.txt', 'utf-8').trim();

    const rows = raw.split("\n").map(line => {
        const parts = line.split("|");

        const name = parts[0].replace("Name:", "").trim();
        const uid = parts[1].replace("UID:", "").trim();
        const game = parts[2].replace("Game:", "").trim();

        return `<tr>
                    <td>${name}</td>
                    <td>${uid}</td>
                    <td>${game}</td>
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
                    border-collapse: collapse;
                    width: 80%;
                    margin-top: 30px;
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
            </style>
        </head>

        <body>
            <h2>🎮 Player Registrations</h2>

            <table>
                <tr>
                    <th>Name</th>
                    <th>UID</th>
                    <th>Game</th>
                </tr>
                ${rows}
            </table>

            <br><br>
            <a href="/">Back</a>
        </body>
        </html>
    `);
});
});

// Server start
app.listen(process.env.PORT || 3000);
