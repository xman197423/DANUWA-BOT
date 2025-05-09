const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "waifu",
    alias: ["waifu", "animegirl"],
    react: "💖",
    desc: "Sends a random waifu",
    category: "anime",
    filename: __filename,
  },
  async (robin, mek, m, { from, reply }) => {
    try {
      const res = await axios.get("https://api.waifu.pics/sfw/waifu");
      const image = res.data.url;

      const caption = `
         🌟 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 🌟    
══════════════════════     
🔮Ｄ  Ａ  Ｎ  Ｕ  Ｗ  Ａ－Ｍ  Ｄ🔮  
             💘 *_WＡＩＦＵ_* 💘  
══════════════════════   

💖 Here's a cute waifu for you!
✨ Click the image to admire.

─────────────────────
🛠️ Made with ❤️ By *DANUKA DISANAYAKA💫*
      `;

      await robin.sendMessage(
        from,
        {
          image: { url: image },
          caption,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error(err);
      reply("*Failed to fetch waifu.* ❌");
    }
  }
);
