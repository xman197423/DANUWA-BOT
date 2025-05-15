const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "shorturl",
    alias: ["shorten"],
    react: "🔗",
    desc: "Shorten a URL",
    category: "utilities",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    if (!q) return reply("📝 *Please provide a URL to shorten.*");
    if (!q.startsWith("http")) return reply("❌ *Please provide a valid URL starting with http or https.*");

    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`);
      const shortUrl = response.data;

      await reply(`🔗 Shortened URL:\n${shortUrl}`);
    } catch (err) {
      console.error(err);
      reply("❌ *Failed to shorten the URL.*");
    }
  }
);
