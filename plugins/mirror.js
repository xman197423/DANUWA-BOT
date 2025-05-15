const { cmd } = require("../command");
const { getRandom } = require("../lib/functions");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs").promises;
const sharp = require("sharp");
const path = require("path");

cmd({
  pattern: "mirror",
  react: "🪞",
  desc: "Mirror an image (flip horizontally)",
  category: "utilities",
  filename: __filename,
}, async (robin, mek, m, { from, sender, quoted, reply }) => {
  try {
    const isQuotedImage = quoted && quoted.type === "imageMessage";
    const isImage = m.type === "imageMessage";
    const imageMessage = isQuotedImage ? quoted : isImage ? m : null;

    if (!imageMessage) {
      return reply("🖼️ *Reply to an image or send an image with `.mirror`*");
    }

    const buffer = await downloadMediaMessage(imageMessage, "buffer", {}, robin);
    if (!buffer) return reply("❌ *Failed to download image.*");

    const tempFolder = path.join(__dirname, "temp");
    await fs.mkdir(tempFolder, { recursive: true });

    const input = path.join(tempFolder, getRandom(".jpg"));
    const output = path.join(tempFolder, getRandom(".jpg"));

    await fs.writeFile(input, buffer);

    // Apply mirror effect (flip horizontally)
    await sharp(input)
      .flop() // Flop to mirror
      .toFile(output);

    await robin.sendMessage(from, {
      image: { url: output },
      caption: `✅ *Mirror effect applied!*\n──────────────────────\n⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*`,
    }, { quoted: mek });

    await fs.unlink(input);
    await fs.unlink(output);
  } catch (err) {
    console.error("[Mirror Plugin Error]", err); // Log error to console instead of sending to user
  }
});
