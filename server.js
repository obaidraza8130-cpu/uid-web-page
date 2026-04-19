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

<table border="1" style="margin:auto;width:90%">
    <tr>
        <th>Name</th>
        <th>UID</th>
        <th>Email</th>
        <th>Team</th>
        <th>Device</th>
        <th>Game</th>
    </tr>
    <tbody id="table"></tbody>
</table>

<script>
    const socket = io();
    const table = document.getElementById("table");

    socket.on("new-user", (data) => {
        const row = document.createElement("tr");

        row.innerHTML =
            "<td>" + data.name + "</td>" +
            "<td>" + data.uid + "</td>" +
            "<td>" + data.email + "</td>" +
            "<td>" + data.team + "</td>" +
            "<td>" + data.device + "</td>" +
            "<td>" + data.game + "</td>";

        table.prepend(row);
    });
</script>

</body>
</html>
    `);
});
