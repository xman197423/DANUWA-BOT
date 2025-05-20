const { cmd } = require("../command");
const sharp = require("sharp");

cmd(
  {
    pattern: "imgconvert",
    alias: ["imgconv"],
    desc: "Convert image to another format (png, jpg, webp)",
    category: "convert",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply, q }) => {
    try {
      if (!quoted || !quoted.download) {
        return reply("❗️ Please reply to an image to convert.");
      }
      if (!q) {
        return reply("❗️ Please specify the target format (png, jpg, webp).");
      }

      const targetFormat = q.trim().toLowerCase();
      if (!["png", "jpg", "jpeg", "webp"].includes(targetFormat)) {
        return reply("❗️ Supported formats: png, jpg, jpeg, webp");
      }

      const inputBuffer = await quoted.download();

      let convertedBuffer;
      const image = sharp(inputBuffer);

      if (targetFormat === "jpg" || targetFormat === "jpeg") {
        convertedBuffer = await image.jpeg().toBuffer();
      } else if (targetFormat === "png") {
        convertedBuffer = await image.png().toBuffer();
      } else if (targetFormat === "webp") {
        convertedBuffer = await image.webp().toBuffer();
      }

      await robin.sendMessage(
        from,
        {
          image: convertedBuffer,
          mimetype: `image/${targetFormat === "jpg" ? "jpeg" : targetFormat}`,
          caption: `Image converted to ${targetFormat}`,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply("❌ Failed to convert image.");
    }
  }
);
