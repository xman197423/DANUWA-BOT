const { cmd } = require("../command");
const googlethis = require("googlethis");

cmd(
  {
    pattern: "google",
    alias: ["gsearch", "search"],
    react: "🌐",
    desc: "Google search plugin",
    category: "search",
    filename: __filename,
  },
  async (robin, mek, m, { q, from, reply }) => {
    if (!q) return reply("*Please provide a search query!* 🔍");

    try {
      reply("🔍 Searching Google for you...");

      const options = {
        page: 0,
        safe: false,
        additional_params: { hl: "en" },
      };

      const res = await googlethis.search(q, options);

      if (!res.results || res.results.length === 0) {
        return reply("*No results found.* ❌");
      }

      const topResults = res.results.slice(0, 5);
      const output = topResults
        .map((r, i) => `🔹 *${i + 1}. ${r.title}*\n📄 ${r.description}\n🔗 ${r.url}`)
        .join("\n\n");

      const caption = `
🌐 𝗚𝗢𝗢𝗚𝗟𝗘 𝗦𝗘𝗔𝗥𝗖𝗛 🌐
════════════════════════
🔍 *Query:* ${q}
─────────────────────────
${output}
─────────────────────────
⚙️ Made with 💗 By *DANUKA DISANAYAKA*
      `;

      await robin.sendMessage(from, { text: caption }, { quoted: mek });
    } catch (err) {
      console.error(err);
      reply("*An error occurred during Google search.* ❌");
    }
  }
);
