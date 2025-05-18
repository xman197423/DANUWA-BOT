const { cmd } = require("../command");
const fs = require("fs").promises;
const { createCanvas } = require("canvas");
const { getRandom } = require("../lib/functions");

cmd(
  {
    pattern: "text2img",
    alias: ["txt2img"],
    react: "🖼️",
    desc: "Convert text to PNG image",
    category: "tools",
    filename: __filename,
  },
  async (robin, mek, m, { reply, q }) => {
    if (!q) return reply("🔤 *Please provide some text!*");

    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "28px Arial";
    ctx.fillText(q, 50, 100);

    const buffer = canvas.toBuffer("image/png");
    const fileName = getRandom(".png");
    await fs.writeFile(fileName, buffer);
    await robin.sendMessage(m.chat, { image: buffer, caption: "🖼️ Text to Image\n──────────────────────\n⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*" }, { quoted: mek });
    await fs.unlink(fileName);
  }
);
