const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { analyzeTextFromFile } = require("./processors/analyze");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// --- replace current POST /api/upload handler with this code ---
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.resolve(req.file.path);
    const mimetype = (req.file.mimetype || "").toLowerCase();
    console.log(`[upload] received file ${req.file.originalname} (${mimetype}) at ${filePath}`);

    let extractedText = "";

    if (mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf")) {
      // PDF parsing
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text || "";
    } else {
      // Image OCR (tesseract.js) with timeout and detailed logging
      const { createWorker } = require("tesseract.js");
      const worker = createWorker({
        logger: m => console.log("[tesseract]", m) // logs progress
      });
      try {
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");

        const ocrPromise = worker.recognize(filePath).then(r => r.data?.text || "");
        // 30s timeout — increase if needed
        extractedText = await Promise.race([
          ocrPromise,
          new Promise((_, rej) => setTimeout(() => rej(new Error("OCR timeout")), 30000))
        ]);
      } finally {
        try { await worker.terminate(); } catch (e) { console.warn("[tesseract] terminate failed", e); }
      }
    }

    // delete the uploaded temp file
    try { fs.unlinkSync(filePath); } catch (e) { console.warn("[upload] unlink failed", e.message); }

    const analysis = analyzeTextFromFile(extractedText || "");
    return res.json({ text: extractedText, analysis });
  } catch (err) {
    console.error("[upload] processing error:", err);
    // return an explicit details field the frontend can display
    return res.status(500).json({ error: "Processing failed", details: err.message || String(err) });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
