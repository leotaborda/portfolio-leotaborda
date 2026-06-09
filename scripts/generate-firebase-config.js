const fs = require("fs");
const path = require("path");

const requiredVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

const missingVars = requiredVars.filter((name) => !process.env[name]);

if (missingVars.length > 0) {
  const existingConfigPath = path.join(__dirname, "..", "public", "js", "firebase-config.js");
  if (fs.existsSync(existingConfigPath)) {
    console.log("firebase-config.js ja existe; pulando geracao por variaveis de ambiente.");
    process.exit(0);
  }

  console.error(`Variaveis de ambiente ausentes: ${missingVars.join(", ")}`);
  process.exit(1);
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
};

const output = `// Gerado automaticamente em build/deploy.\nexport const firebaseConfig = ${JSON.stringify(config, null, 2)};\n`;
const outputPath = path.join(__dirname, "..", "public", "js", "firebase-config.js");

fs.writeFileSync(outputPath, output);
console.log("public/js/firebase-config.js gerado com sucesso.");
