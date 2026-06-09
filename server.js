// server.js
const express = require("express");
const path = require("path");

const app = express();

app.get("/js/firebase-config.js", (req, res) => {
    const normalizeProjectId = (value = "") => value.replace(/\.firebaseapp\.com$/, "");
    const projectId = normalizeProjectId(process.env.FIREBASE_PROJECT_ID || "");

    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || (projectId ? `${projectId}.firebaseapp.com` : ""),
        projectId,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
    };

    const missing = Object.entries(config)
        .filter(([key, value]) => key !== "measurementId" && !value)
        .map(([key]) => key);

    if (missing.length > 0) {
        const localConfigPath = path.join(__dirname, "public", "js", "firebase-config.js");
        res.sendFile(localConfigPath, (err) => {
            if (err) {
                res.status(500).type("text/javascript").send(`console.error("Firebase env vars missing: ${missing.join(", ")}");`);
            }
        });
        return;
    }

    res.type("text/javascript").send(`export const firebaseConfig = ${JSON.stringify(config, null, 2)};`);
});

app.use(express.static("public"));

// Serve admin panel at /xpanel
app.get("/xpanel", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});

const PORT = process.env.PORT || 7000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
        console.log(`Painel admin em http://localhost:${PORT}/xpanel`);
    });
}

module.exports = app;
