const { cmd } = require("../command");
const tesseract = require("tesseract.js");

cmd(
  {
    pattern: "img2text",
    alias: ["ocr"],
    react: "🔍",
    desc: "Extract text from image",
    category: "tools",
    filename: __filename,
  },
  async (robin, mek, m, { quoted, reply }) => {
    const isImage = quoted && quoted.type === "imageMessage";
    if (!isImage) return reply("🖼️ *Reply to an image to extract text from it!*");

    const buffer = await quoted.download();
    const { data: { text } } = await tesseract.recognize(buffer, "eng");
    reply("📝 *Extracted Text:*\n\n" + text.trim());
  }
);
