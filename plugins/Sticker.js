const { cmd } = require("../command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { getRandom } = require("../lib/functions");
const fs = require("fs").promises;

cmd(
  {
    pattern: "sticker",
    alias: ["s", "stic"],
    react: "🖼️",
    desc: "Convert image to sticker",
    category: "convert",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply, q, pushname }) => {
    try {
      const isQuotedImage =
        quoted &&
        (quoted.type === "imageMessage" ||
          (quoted.type === "viewOnceMessage" &&
            quoted.msg &&
            quoted.msg.type === "imageMessage"));

      const isImage = m.type === "imageMessage";
      const imageSource = isQuotedImage
        ? quoted
        : isImage
        ? m
        : null;

      if (!imageSource) {
        return reply("📷 *Reply to an image to convert it into a sticker!*");
      }

      const fileName = getRandom(".jpg");
      const buffer = await imageSource.download();
      await fs.writeFile(fileName, buffer);

      const isCrop = (q || "").toLowerCase().includes("--crop") || (q || "").includes("-c");

      const sticker = new Sticker(fileName, {
        pack: pushname || "DANUWA-MD",
        author: "🔥 ＤＡＮＵＷＡ－ＭＤ 🔥",
        type: isCrop ? StickerTypes.CROPPED : StickerTypes.FULL,
        categories: ["🤖", "🔥"],
        id: "danuwa-md-sticker",
        quality: 75,
        background: "transparent",
      });

      const stickerBuffer = await sticker.toBuffer();
      await robin.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

      // Clean up
      await fs.unlink(fileName);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to create sticker. Please try again.*");
    }
  }
);
