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

        const name = parts[0]?.replace("Name:", "").trim();
        const uid = parts[1]?.replace("UID:", "").trim();
        const email = parts[2]?.replace("Email:", "").trim();
        const team = parts[3]?.replace("Team:", "").trim();
        const device = parts[4]?.replace("Device:", "").trim();
        const game = parts[5]?.replace("Game:", "").trim();

        return `
        <tr>
            <td>${name}</td>
            <td>${uid}</td>
            <td>${email}</td>
            <td>${team}</td>
            <td>${device}</td>
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
                    margin: 0;
                    padding: 20px;
                }

                h2 {
                    color: #22c55e;
                    margin-bottom: 20px;
                }

                table {
                    margin: auto;
                    border-collapse: collapse;
                    width: 95%;
                    margin-top: 20px;
                    background: #0f172a;
                    border-radius: 10px;
                    overflow: hidden;
                }

                th, td {
                    border: 1px solid #334155;
                    padding: 10px;
                }

                th {
                    background: #22c55e;
                    color: black;
                }

                tr:nth-child(even) {
                    background: #1e293b;
                }

                tr:hover {
                    background: #334155;
                }

                .btn {
                    display: inline-block;
                    padding: 10px 18px;
                    margin: 10px 5px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: 0.3s;
                }

                .home {
                    background: #22c55e;
                    color: black;
                }

                .login {
                    background: #1e293b;
                    color: white;
                    border: 1px solid #22c55e;
                }

                .btn:hover {
                    transform: scale(1.05);
                }

                @media(max-width:768px){
                    table {
                        font-size: 12px;
                    }
                }
            </style>
        </head>

        <body>

            <h2>🎮 Player Registrations Admin Panel</h2>

            <!-- BUTTONS -->
            <a href="/" class="btn home">⬅ Back to Home</a>
            <a href="/login" class="btn login">🔐 Login Page</a>

            <!-- TABLE -->
            <table>
                <tr>
                    <th>Name</th>
                    <th>UID</th>
                    <th>Email</th>
                    <th>Team</th>
                    <th>Device</th>
                    <th>Game</th>
                </tr>
                ${rows}
            </table>

        </body>
        </html>
    `);
});

