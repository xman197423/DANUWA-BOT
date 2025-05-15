const { cmd } = require("../command");
const axios = require("axios");
const FormData = require("form-data");
const { getRandom } = require("../lib/functions");
const fs = require("fs").promises;

cmd(
  {
    pattern: "removebg",
    alias: ["bgremove"],
    react: "🎯",
    desc: "Remove background from an image",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { from, quoted, reply }) => {
    try {
      const isQuotedImage =
        quoted &&
        (quoted.type === "imageMessage" ||
          (quoted.type === "viewOnceMessage" &&
            quoted.msg &&
            quoted.msg.type === "imageMessage"));

      const isImage = m.type === "imageMessage";
      const imageSource = isQuotedImage ? quoted : isImage ? m : null;

      if (!imageSource) {
        return reply("📷 *Reply to an image to remove its background!*");
      }

      const inputFile = getRandom(".jpg");
      const buffer = await imageSource.download();
      await fs.writeFile(inputFile, buffer);

      const form = new FormData();
      form.append("image_file", buffer, inputFile);
      form.append("size", "auto");

      const apiKey = "8mAPatDV6GSUkFFZ6y96YNF7"; // Replace with your Remove.bg API key
      const { data } = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer",
      });

      const outputFile = getRandom(".png");
      await fs.writeFile(outputFile, data);

      const caption = `
✅ *Background removed successfully!*
──────────────────────

✅ *Status*: Success
📤 *Output*: Transparent PNG

──────────────────────
⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*
`.trim();

      await robin.sendMessage(
        from,
        {
          image: { url: outputFile },
          caption,
        },
        { quoted: mek }
      );

      await fs.unlink(inputFile);
      await fs.unlink(outputFile);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to remove background. Make sure your API key is valid or try again later.*");
    }
  }
);
