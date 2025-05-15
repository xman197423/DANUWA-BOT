const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "qr",
    alias: ["qrcode"],
    react: "🔲",
    desc: "Create a QR code from text or reply",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply, quoted, from }) => {
    const text = q || (quoted && quoted.text);
    if (!text) return reply("📝 *Please provide text or reply to a message to convert to QR.*");

    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=300x300`;

      const caption = `
🧾 *QR Code Generated!*

🔤 Text: _${text}_
📏 Size: 300x300

─────────────────────────
⚙️ Made with ❤️ by *DANUKA DISANAYAKA💫*
`.trim();

      await robin.sendMessage(
        from,
        { image: { url: apiUrl }, caption },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to generate QR code.*");
    }
  }
);
