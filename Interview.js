import https from "https";
import express from "express";
import fs from "fs";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1389189178096615596/KEiQADtRrl5r8ykV-5Xoz5Ai2tzR0QuGvPP2ujdhHqDPwKudWW3ai6e7FrjSr8FfQCm7";
const SECRET = "rahasia123";

// Baca file sertifikat dan key
const privateKey = fs.readFileSync("key.pem");
const certificate = fs.readFileSync("cert.pem");

app.post("/interview", async (req, res) => {
  try {
    const { secret, nama, username, kemampuan, alasan } = req.body;

    if (secret !== SECRET) {
      return res.status(403).json({ message: "Forbidden: Invalid secret." });
    }

    const content = `**Interview Baru!**

👤 Nama: ${nama}
🎮 Username Minecraft: ${username}
🛠️ Kemampuan: ${kemampuan}
📝 Alasan Join: ${alasan}
`;

    await axios.post(DISCORD_WEBHOOK_URL, {
      content
    });

    res.json({ message: "Interview berhasil dikirim ke Discord!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan di server." });
  }
});

// Server HTTPS
https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(3000, () => {
  console.log("Server berjalan di https://localhost:3000");
});
