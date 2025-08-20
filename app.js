const express = require("express");
const path = require("path");
const qrcode = require("qrcode");
const multer = require("multer");
const sharp = require("sharp");
const PDFDocument = require("pdfkit");
const axios = require("axios");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// File Upload Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// QR Code Generation
app.post("/qrcode", async (req, res) => {
  try {
    const qr = await qrcode.toDataURL(req.body.text);
    res.json({ qr });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

// Image Processing
app.post("/image-tools", upload.single("image"), async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer).resize(200).png().toBuffer();
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to process image" });
  }
});

// PDF Generation
app.post("/pdf", (req, res) => {
  const { text } = req.body;
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
  doc.text(text);
  doc.pipe(res);
  doc.end();
});

app.get("/joke", async (req, res) => {
  try {
    const data = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );
    res.json({ setup: data.setup, punchline: data.punchline });
  } catch (error) {
    res.json({
      setup: "Why did the server crash?",
      punchline: "Because it had too many requests 😂",
    });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);
