// server.js
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static("public"));

// Serve admin panel at /xpanel
app.get("/xpanel", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Painel admin em http://localhost:${PORT}/xpanel`);
});

