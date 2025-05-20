const { cmd } = require("../command");
const Jimp = require("jimp");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const fs = require("fs").promises;

// 1. Circle sticker from image or sticker (must reply to image/sticker)
cmd(
  {
    pattern: "circlesticker",
    alias: ["csticker", "cstic"],
    react: "🟠",
    desc: "Reply to an image or sticker to convert it into a circle cropped sticker",
    category: "convert",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (
        !quoted ||
        !(
          quoted.type === "imageMessage" ||
          quoted.type === "stickerMessage" ||
          (quoted.type === "viewOnceMessage" &&
            quoted.msg &&
            (quoted.msg.type === "imageMessage" || quoted.msg.type === "stickerMessage"))
        )
      ) {
        return reply("🖼️ *Please reply to an image or sticker message with this command.*");
      }

      // Download buffer from quoted
      const buffer = await quoted.download();

      // Process image with Jimp
      const image = await Jimp.read(buffer);
      const size = Math.min(image.bitmap.width, image.bitmap.height);
      image.resize(size, size);

      // Create circular mask
      const mask = await new Jimp(size, size, 0x00000000);
      mask.scan(0, 0, size, size, (x, y, idx) => {
        const radius = size / 2;
        const centerX = radius;
        const centerY = radius;
        const dx = x - centerX;
        const dy = y - centerY;
        if (dx * dx + dy * dy <= radius * radius) {
          mask.bitmap.data[idx + 3] = 255;
        }
      });
      image.mask(mask, 0, 0);

      const fileName = `temp_${Date.now()}.png`;
      await image.writeAsync(fileName);

      // Create sticker
      const sticker = new Sticker(fileName, {
        pack: pushname || "DANUWA-MD",
        author: "DANUWA-MD❤️",
        type: StickerTypes.CROPPED,
        quality: 75,
        id: "danuwa-md-circle-sticker",
      });

      const stickerBuffer = await sticker.toBuffer();
      await robin.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

      await fs.unlink(fileName);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to create circle sticker. Please try again.*");
    }
  }
);

// 2. Video to animated sticker (must reply to video message <= 10s)
cmd(
  {
    pattern: "sticvid",
    alias: ["sv"],
    react: "🎥",
    desc: "Reply to a short video (max 10s) to convert it into a sticker",
    category: "convert",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (
        !quoted ||
        !(
          quoted.type === "videoMessage" ||
          (quoted.type === "viewOnceMessage" &&
            quoted.msg &&
            quoted.msg.type === "videoMessage")
        )
      ) {
        return reply("🎥 *Please reply to a video message (max 10 seconds) with this command.*");
      }

      const videoMsg = quoted.msg || quoted;
      if (videoMsg.seconds > 10) {
        return reply("⏱️ *Video duration must be 10 seconds or less.*");
      }

      const buffer = await quoted.download();
      const fileName = `temp_${Date.now()}.mp4`;
      await fs.writeFile(fileName, buffer);

      const sticker = new Sticker(fileName, {
        pack: pushname || "DANUWA-MD",
        author: "DANUWA-MD❤️",
        type: StickerTypes.ANIMATED,
        quality: 75,
        id: "danuwa-md-sticker-video",
      });

      const stickerBuffer = await sticker.toBuffer();
      await robin.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

      await fs.unlink(fileName);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to create video sticker. Please try again.*");
    }
  }
);

// 3. Resize sticker or image to 512x512 (must reply to image or sticker)
cmd(
  {
    pattern: "resizestic",
    alias: ["rsstic"],
    react: "🔍",
    desc: "Reply to an image or sticker to resize it to 512x512 px sticker",
    category: "convert",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (
        !quoted ||
        !(
          quoted.type === "imageMessage" ||
          quoted.type === "stickerMessage" ||
          (quoted.type === "viewOnceMessage" &&
            quoted.msg &&
            (quoted.msg.type === "imageMessage" || quoted.msg.type === "stickerMessage"))
        )
      ) {
        return reply("📎 *Please reply to an image or sticker message with this command.*");
      }

      const buffer = await quoted.download();
      const fileName = `temp_${Date.now()}.png`;

      const image = await Jimp.read(buffer);
      image.resize(512, 512);
      await image.writeAsync(fileName);

      const sticker = new Sticker(fileName, {
        pack: pushname || "DANUWA-MD",
        author: "DANUWA-MD❤️",
        type: StickerTypes.FULL,
        quality: 75,
        id: "danuwa-md-resize-sticker",
      });

      const stickerBuffer = await sticker.toBuffer();
      await robin.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

      await fs.unlink(fileName);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to resize sticker. Please try again.*");
    }
  }
);
