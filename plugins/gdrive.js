const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types"); // <-- added for MIME detection

// Extract file ID from user-provided Google Drive URL
function extractFileId(url) {
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{10,})/);
  return match ? match[1] : null;
}

// Detect file MIME type based on filename
function getMimeType(filename) {
  return mime.lookup(filename) || "application/octet-stream";
}

// Extract download link, bypassing confirmation page if needed
async function downloadFile(fileId) {
  const baseURL = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const res = await axios.get(baseURL, { responseType: "text" });

  // Direct download if content-disposition exists
  if (res.headers['content-disposition']) {
    const fileName = getFileNameFromHeader(res.headers['content-disposition']);
    return {
      url: baseURL,
      fileName,
    };
  }

  // Handle "download anyway" confirmation
  const $ = cheerio.load(res.data);
  const confirmToken = $('form').attr('action')?.split('confirm=')[1]?.split('&')[0];
  const fileName = $("title").text().replace(" - Google Drive", "").trim() || "file";

  if (!confirmToken) throw new Error("Failed to extract confirmation token.");

  const downloadUrl = `https://drive.google.com/uc?export=download&confirm=${confirmToken}&id=${fileId}`;
  return {
    url: downloadUrl,
    fileName,
  };
}

// Parse filename from content-disposition header
function getFileNameFromHeader(header) {
  const match = /filename="(.+?)"/.exec(header);
  return match ? match[1] : "file";
}

// Command registration
cmd({
  pattern: "gdrive",
  desc: "Download actual Google Drive file",
  react: "📂",
  category: "download",
  filename: __filename,
}, async (robin, mek, m, { q, reply, from }) => {
  try {
    if (!q) return reply("❌ *Please provide a Google Drive file link.*");

    const fileId = extractFileId(q);
    if (!fileId) return reply("❌ *Invalid Google Drive URL.*");

    const { url, fileName } = await downloadFile(fileId);

    // Create temp folder if it doesn't exist
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const tmpPath = path.join(tempDir, `${Date.now()}_${fileName}`);
    const writer = fs.createWriteStream(tmpPath);

    const response = await axios({
      method: "GET",
      url,
      responseType: "stream",
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // Get correct MIME type
    const mimetype = getMimeType(fileName);

    // Send file to user
    await robin.sendMessage(from, {
      document: fs.readFileSync(tmpPath),
      fileName,
      mimetype,
      caption: `📥 *Google Drive File:* ${fileName}`,
    }, { quoted: mek });

    fs.unlinkSync(tmpPath); // Clean up temp file
  } catch (err) {
    console.error("GDrive Error:", err);
    reply("❌ *Download failed. Make sure the link is public and the file isn't restricted.*");
  }
});