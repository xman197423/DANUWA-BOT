const { cmd } = require("../command");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mime = require("mime-types");

puppeteer.use(StealthPlugin());

async function mediafireDlStealth(url) {
  if (!url.includes("mediafire.com")) throw new Error("❌ Invalid MediaFire URL!");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await page.waitForSelector("#downloadButton", { timeout: 20000 });

    // Extract file info from the page
    const result = await page.evaluate(() => {
      const name = document.querySelector(".download_file_title")?.innerText.trim();
      const size = document.querySelector("ul.dl-info > li:nth-child(2)")?.innerText.trim();
      const downloadUrl = document.querySelector("#downloadButton")?.href;
      return { name, size, url: downloadUrl };
    });

    if (!result?.url) throw new Error("❌ Failed to extract download link.");

    return result;
  } finally {
    await browser.close();
  }
}

cmd(
  {
    pattern: "mediafire",
    alias: ["mf"],
    react: "📁",
    desc: "Download file from MediaFire (stealth bypass with correct file)",
    category: "download",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    try {
      if (!q || !q.includes("mediafire.com"))
        return reply("🔗 *Please provide a valid MediaFire URL!*");

      reply("⏳ *Bypassing Cloudflare and preparing download...*");

      // Get actual download URL and file info
      const file = await mediafireDlStealth(q);

      // Prepare temp directory for download
      const tempDir = path.join(__dirname, "..", "temp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      // Ensure filename has an extension
      let fileName = file.name || "DANUWA-MD mediafire-downloader❤️";
      if (!path.extname(fileName)) {
        // Try to guess extension from download URL
        const extMatch = file.url.match(/\.(\w{2,5})(?:$|\?)/);
        const ext = extMatch ? extMatch[0] : ".bin";
        fileName += ext;
      }

      const filePath = path.join(tempDir, `${Date.now()}_${fileName}`);

      // Download file with axios stream
      const response = await axios({
        method: "GET",
        url: file.url,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Get MIME type from file extension
      const mimetype = mime.lookup(fileName) || "application/octet-stream";

      // Send downloaded file to WhatsApp
      await robin.sendMessage(
        from,
        {
          document: fs.readFileSync(filePath),
          fileName,
          mimetype,
          caption: `📁 *MediaFire Download*\n\n📌 *File Name:* ${fileName}\n📦 *Size:* ${file.size}\n🔗 *Source:* ${q}`,
        },
        { quoted: mek }
      );

      // Clean up temp file
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("❌ MediaFire Error:", err);
      reply(`❌ *Failed:* ${err.message}`);
    }
  }
);
