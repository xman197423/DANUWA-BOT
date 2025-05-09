const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "anime",
    alias: ["anime", "anisearch"],
    react: "🎌",
    desc: "Search anime information",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, q, reply }) => {
    if (!q) return reply("*Please provide an anime title!* 🎌");

    reply("*Searching for anime...* ⏳");

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
      const anime = res.data.data[0];

      if (!anime) return reply("*No results found.* ❌");

      const caption = `
         🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
════════════════════════     
🔮  Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ  －  Ｍ  Ｄ  🔮  
       🎌 *_ANIME INFORMATION_* 🎌  
════════════════════════   

🔎 *Title*: ${anime.title}
🈷️ *Japanese*: ${anime.title_japanese || "N/A"}
🎥 *Episodes*: ${anime.episodes}
⭐ *Score*: ${anime.score}
📅 *Aired*: ${anime.aired.string}
📖 *Synopsis*: ${anime.synopsis.slice(0, 400)}...

🔗 *URL*: ${anime.url}

─────────────────────────
🛠️ Made with ❤️ By *DANUKA DISANAYAKA💫*
      `;

      await robin.sendMessage(
        from,
        {
          image: { url: anime.images.jpg.large_image_url },
          caption,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply("*An error occurred while searching anime.* ❌");
    }
  }
);
