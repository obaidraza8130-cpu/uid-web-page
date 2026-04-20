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

<table border="1" style="margin:auto;width:95%">
    <thead>
        <tr>
            <th>Name</th>
            <th>UID</th>
            <th>Email</th>
            <th>Team</th>
            <th>Device</th>
            <th>Game</th>
            <th>Action</th>
        </tr>
    </thead>

    <tbody id="table"></tbody>
</table>

<script>
    const socket = io();
    const table = document.getElementById("table");

    function addRow(data) {
        const row = document.createElement("tr");

        row.innerHTML = \`
            <td>\${data.name}</td>
            <td>\${data.uid}</td>
            <td>\${data.email}</td>
            <td>\${data.team}</td>
            <td>\${data.device}</td>
            <td>\${data.game}</td>
            <td><button onclick="deleteUser(\${data.id})">Delete</button></td>
        \`;

        table.prepend(row);
    }

    // load data
    fetch("/data")
    .then(res => res.json())
    .then(data => {
        table.innerHTML = ""; // ✅ prevent duplicate rows
        data.forEach(addRow);
    });

    // live new user
    socket.on("new-user", (data) => {
        addRow(data);
    });

    // refresh handler
    socket.on("refresh", () => {
        location.reload();
    });

    // ✅ FIX: make global function
    window.deleteUser = function(id) {
        fetch("/delete/" + id)
        .then(res => res.text())
        .then(msg => {
            alert(msg);
        });
    }
</script>

</body>
</html>
    `);
});
