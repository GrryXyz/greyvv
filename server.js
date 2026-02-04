const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post("/daftar", upload.fields([
  { name: "sstiktok", maxCount: 1 },
  { name: "selfie", maxCount: 1 }
]), async (req, res) => {
  try {
    const { nama, umur, wa, gender, kota, nickml, tiktok } = req.body;
    const ss = req.files.sstiktok[0];
    const sf = req.files.selfie[0];

    const form = new FormData();
    form.append("payload_json", JSON.stringify({
      username: "Pendaftaran MLBB",
      embeds: [{
        title: "📥 Pendaftaran NexusGy",
        color: 5793266,
        fields: [
          { name: "Nama", value: nama, inline: true },
          { name: "Umur", value: umur, inline: true },
          { name: "WhatsApp", value: `[Chat WA](https://wa.me/62${wa.substring(1)})`, inline: true },
          { name: "Gender", value: gender, inline: true },
          { name: "Kota", value: kota, inline: true },
          { name: "Nick ML", value: nickml },
          { name: "TikTok", value: tiktok }
        ],
        timestamp: new Date()
      }]
    }));

    form.append(
  "files[0]",
  fs.createReadStream(ss.path),
  { filename: "ss_tiktok.jpg", contentType: "image/jpeg" }
);

form.append(
  "files[1]",
  fs.createReadStream(sf.path),
  { filename: "selfie.jpg", contentType: "image/jpeg" }
);

    form.append("payload_json", JSON.stringify({
  username: "Pendaftaran MLBB",
  embeds: [
    {
      title: "📥 Pendaftaran NexusGy",
      color: 5793266,
      fields: [
        { name: "Nama", value: nama, inline: true },
        { name: "Umur", value: umur, inline: true },
        { name: "WhatsApp", value: `[Chat WA](https://wa.me/62${wa.substring(1)})`, inline: true },
        { name: "Gender", value: gender, inline: true },
        { name: "Kota", value: kota, inline: true },
        { name: "Nick ML", value: nickml },
        { name: "TikTok", value: tiktok }
      ],
      image: { url: "attachment://selfie.jpg" },
      thumbnail: { url: "attachment://ss_tiktok.jpg" },
      timestamp: new Date()
    }
  ]
}));



    await axios.post(WEBHOOK_URL, form, { headers: form.getHeaders() });

    fs.unlinkSync(ss.path);
    fs.unlinkSync(sf.path);

    res.redirect("/success.html");
  } catch (e) {
    console.error(e);
    res.status(500).send("Gagal");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
